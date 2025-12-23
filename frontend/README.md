# Orbital Copilot - Frontend

A React + TypeScript dashboard for visualizing AI credit usage data with interactive charts, sortable tables, and URL-persisted state.

## Tech Stack

| Category      | Technology             | Version | Purpose                                 |
| ------------- | ---------------------- | ------- | --------------------------------------- |
| Framework     | React                  | 19.x    | UI library                              |
| Language      | TypeScript             | 5.x     | Type safety                             |
| Build Tool    | Vite                   | 7.x     | Fast dev server, HMR, bundling          |
| UI Library    | Chakra UI              | 2.x     | Component library with theming          |
| Data Fetching | TanStack Query         | 5.x     | Caching, loading states, error handling |
| Charts        | Recharts               | 3.x     | Declarative bar charts                  |
| Routing       | React Router           | 7.x     | URL state management                    |
| HTTP Client   | Axios                  | 1.x     | API requests                            |
| Unit Testing  | Jest + Testing Library | 30.x    | Component testing                       |
| E2E Testing   | Cypress                | 15.x    | End-to-end testing                      |

## Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   ├── client.ts           # Axios instance configuration
│   │   └── usage.ts            # TanStack Query hooks for usage data
│   ├── components/
│   │   ├── Dashboard/
│   │   │   └── Dashboard.tsx   # Main dashboard container with stats cards
│   │   ├── UsageChart/
│   │   │   └── UsageChart.tsx  # Recharts bar chart with custom tooltip
│   │   ├── UsageTable/
│   │   │   ├── UsageTable.tsx  # Sortable data table
│   │   │   └── SortIndicator.tsx # Column sort direction indicator
│   │   └── ui/
│   │       ├── components.tsx      # Centralized UI components
│   │       └── index.ts            # Re-exports
│   ├── hooks/
│   │   └── useUrlSortState.ts  # URL-synced multi-column sorting
│   ├── types/
│   │   └── usage.ts            # TypeScript interfaces
│   ├── utils/
│   │   ├── dateFormatters.ts   # UTC date formatting (DD-MM-YYYY HH:mm)
│   │   ├── sortUtils.ts        # Multi-column sorting logic
│   │   └── chartDataTransform.ts # Usage data to chart data transformation
│   ├── test/
│   │   ├── setupTests.ts       # Jest setup
│   │   └── testUtils.tsx       # Test utilities with providers
│   ├── App.tsx                 # Root component with routing
│   ├── main.tsx                # Entry point with providers
│   ├── config/
│   │   └── env.ts              # Zod-validated environment config
│   ├── schemas/
│   │   └── usage.ts            # Zod schemas for API validation
│   ├── theme/
│   │   ├── index.ts            # Chakra UI custom theme
│   │   └── tokens.ts           # Design tokens (colors, typography)
│   └── index.css               # Global styles
├── cypress/
│   ├── e2e/
│   │   └── dashboard.cy.ts     # E2E tests
│   └── support/
│       └── commands.ts         # Custom Cypress commands
├── package.json
├── vite.config.ts
├── tsconfig.json
└── jest.config.js
```

## Features

### Dashboard Overview

- **Stats Cards**: Total credits used, messages processed, reports generated
- **Bar Chart**: Daily credit usage trends with custom tooltips
- **Data Table**: Sortable usage records with formatted timestamps

### Multi-Column Sorting

- **Tri-state toggle**: Click column header cycles through `none → asc → desc → none`
- **Precedence tracking**: Order of clicks determines primary vs secondary sort
- **URL persistence**: Sort state stored in URL (`?sort=credits_used:asc,report_name:desc`)
- **Empty values handling**: Empty report names always sort to the end

### URL State Management

Sort state is persisted in URL search params for shareability:

```
/?sort=report_name:asc              # Single column sort
/?sort=credits_used:desc,report_name:asc  # Multi-column (credits primary, name secondary)
```

### Date Handling

All dates are processed in **UTC** for consistency:

- Table timestamps: `DD-MM-YYYY HH:mm` (UTC)
- Chart bucketing: Grouped by UTC date
- Avoids timezone mismatches between table and chart views

## Key Implementation Details

### 1. Type Definitions (Zod-Inferred)

Types are inferred from Zod schemas for runtime validation and type safety:

```typescript
// schemas/usage.ts - Single source of truth
import { z } from "zod";

export const UsageItemSchema = z.object({
	message_id: z.number(),
	timestamp: z.string(),
	report_name: z.string().optional(),
	credits_used: z.number(),
});

export const UsageResponseSchema = z.object({
	usage: z.array(UsageItemSchema),
});

// Inferred types
export type UsageItem = z.infer<typeof UsageItemSchema>;
export type UsageResponse = z.infer<typeof UsageResponseSchema>;

// types/usage.ts - Re-exports from schemas
export type { UsageItem, UsageResponse } from "../schemas/usage";

// Additional types
export type SortDirection = "asc" | "desc" | null;
export type SortableColumn = "report_name" | "credits_used";

export interface SortEntry {
	column: SortableColumn;
	direction: "asc" | "desc";
}

export interface ChartDataPoint {
	date: string; // X-axis label: DD-MM
	fullDate: string; // Tooltip: DD-MM-YYYY
	credits: number; // Y-axis value
}
```

### 2. URL-Synced Sort State Hook

The hook manages sorting state through URL search params for shareability. Key insight: we track not just _what_ is sorted, but the _order_ in which sorts were applied.

```typescript
// hooks/useUrlSortState.ts
/**
 * URL format: ?sort=report_name:asc,credits_used:desc
 *
 * This preserves BOTH direction AND precedence (order matters!)
 * The first entry is the primary sort, second is secondary tiebreaker.
 */
export function useUrlSortState() {
	const [searchParams, setSearchParams] = useSearchParams();

	// Parse the URL param into an ordered array of sort entries
	const sortOrder: SortEntry[] = useMemo(() => {
		const sortParam = searchParams.get("sort");
		if (!sortParam) return [];

		return sortParam
			.split(",")
			.map((entry) => {
				const [column, direction] = entry.split(":");
				if (isValidColumn(column) && isValidDirection(direction)) {
					return { column, direction } as SortEntry;
				}
				return null;
			})
			.filter((entry): entry is SortEntry => entry !== null);
	}, [searchParams]);

	// Get the current direction for a specific column (for UI indicators)
	const getDirection = useCallback(
		(column: SortableColumn): SortDirection => {
			const entry = sortOrder.find((e) => e.column === column);
			return entry?.direction ?? null;
		},
		[sortOrder]
	);

	// Get the sort priority (1 = primary, 2 = secondary)
	const getSortPriority = useCallback(
		(column: SortableColumn): number | null => {
			const index = sortOrder.findIndex((e) => e.column === column);
			return index >= 0 ? index + 1 : null;
		},
		[sortOrder]
	);

	// Toggle sort: null → asc → desc → null (removes from sort order)
	const toggleSort = useCallback(
		(column: SortableColumn) => {
			setSearchParams((prev) => {
				const params = new URLSearchParams(prev);
				const currentEntry = sortOrder.find((e) => e.column === column);

				let newSortOrder: SortEntry[];

				if (!currentEntry) {
					// Not sorted → add as ascending (becomes lowest priority)
					newSortOrder = [...sortOrder, { column, direction: "asc" }];
				} else if (currentEntry.direction === "asc") {
					// Ascending → change to descending (maintain position in order)
					newSortOrder = sortOrder.map((e) =>
						e.column === column ? { ...e, direction: "desc" as const } : e
					);
				} else {
					// Descending → remove from sort order entirely
					newSortOrder = sortOrder.filter((e) => e.column !== column);
				}

				// Update URL param
				if (newSortOrder.length === 0) {
					params.delete("sort");
				} else {
					params.set(
						"sort",
						newSortOrder.map((e) => `${e.column}:${e.direction}`).join(",")
					);
				}

				return params;
			});
		},
		[sortOrder, setSearchParams]
	);

	return { sortOrder, getDirection, getSortPriority, toggleSort };
}
```

**Why this design:**

- **Ordered array, not object:** Preserves which sort was applied first (primary) vs second (tiebreaker)
- **URL is single source of truth:** Sharing `?sort=credits_used:desc,report_name:asc` gives identical results
- **Tri-state toggle:** `null → asc → desc → null`, with removal from sort order on third click

### 3. Multi-Column Sorting Logic

```typescript
// utils/sortUtils.ts
/**
 * Sort usage data respecting the ORDER of sort entries.
 * First entry in sortOrder is the primary sort, subsequent entries are tiebreakers.
 */
export function sortUsageData(
	data: UsageItem[],
	sortOrder: SortEntry[],
	originalIndices: Map<number, number>
): UsageItem[] {
	// If no sorts applied, return original order
	if (sortOrder.length === 0) {
		return [...data].sort(
			(a, b) =>
				(originalIndices.get(a.message_id) ?? 0) -
				(originalIndices.get(b.message_id) ?? 0)
		);
	}

	return [...data].sort((a, b) => {
		// Apply each sort in order (first is primary, rest are tiebreakers)
		for (const { column, direction } of sortOrder) {
			let comparison = 0;
			let forceEnd = false;

			if (column === "report_name") {
				// Empty/undefined report names sort to the end ALWAYS
				const aName = a.report_name ?? "";
				const bName = b.report_name ?? "";
				const aEmpty = aName === "";
				const bEmpty = bName === "";

				if (aEmpty && bEmpty) {
					comparison = 0;
				} else if (aEmpty) {
					comparison = 1;
					forceEnd = true;
				} else if (bEmpty) {
					comparison = -1;
					forceEnd = true;
				} else {
					comparison = aName.localeCompare(bName);
				}
			} else if (column === "credits_used") {
				comparison = a.credits_used - b.credits_used;
			}

			// If not equal, apply direction and return
			if (comparison !== 0) {
				if (forceEnd) {
					// Empty report names always go to end, regardless of direction
					return comparison;
				}
				return direction === "asc" ? comparison : -comparison;
			}
			// If equal, continue to next sort entry (tiebreaker)
		}

		// All sort criteria are equal: fall back to original order (stable sort)
		return (
			(originalIndices.get(a.message_id) ?? 0) -
			(originalIndices.get(b.message_id) ?? 0)
		);
	});
}
```

**Key features:**

- Uses the _ordered_ `sortOrder` array, not a hardcoded column precedence
- Falls back to original API order when sorts are tied (stable sorting)
- Empty report names always sort to end, regardless of sort direction

### 4. Chart Data Transformation

```typescript
// utils/chartDataTransform.ts
/**
 * Transform usage data into chart-friendly format.
 *
 * IMPORTANT: Uses UTC dates for consistency with table formatting.
 * Both table and chart bucket by the same date, avoiding timezone
 * mismatches where a message could appear on different dates in each view.
 */
export function transformToChartData(usage: UsageItem[]): ChartDataPoint[] {
	if (usage.length === 0) return [];

	// Group credits by UTC date
	const creditsByDate = new Map<string, number>();

	usage.forEach((item) => {
		const utcDate = extractUTCDate(item.timestamp);
		creditsByDate.set(
			utcDate,
			(creditsByDate.get(utcDate) || 0) + item.credits_used
		);
	});

	// Find date range
	const dates = Array.from(creditsByDate.keys()).sort();
	const startDate = new Date(dates[0] + "T00:00:00Z"); // Parse as UTC
	const endDate = new Date(dates[dates.length - 1] + "T00:00:00Z");

	// Generate all dates in range (including days with zero usage)
	const result: ChartDataPoint[] = [];
	const current = new Date(startDate);

	while (current <= endDate) {
		const dateStr = current.toISOString().split("T")[0]; // YYYY-MM-DD

		result.push({
			date: formatChartDate(dateStr), // DD-MM for X-axis
			fullDate: formatChartTooltipDate(dateStr), // DD-MM-YYYY for tooltip
			credits: Math.round((creditsByDate.get(dateStr) || 0) * 100) / 100,
		});

		current.setUTCDate(current.getUTCDate() + 1); // Use UTC to avoid DST issues
	}

	return result;
}
```

### 5. Date Formatters (UTC-Consistent)

```typescript
// utils/dateFormatters.ts
/**
 * Format ISO timestamp to DD-MM-YYYY HH:mm (UTC).
 * Using UTC for consistency with chart date bucketing.
 */
export function formatTimestamp(iso: string): string {
	const date = new Date(iso);

	const day = date.getUTCDate().toString().padStart(2, "0");
	const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
	const year = date.getUTCFullYear();
	const hours = date.getUTCHours().toString().padStart(2, "0");
	const minutes = date.getUTCMinutes().toString().padStart(2, "0");

	return `${day}-${month}-${year} ${hours}:${minutes}`;
}

/**
 * Extract UTC date (YYYY-MM-DD) from ISO timestamp.
 * Uses Date object for proper parsing.
 */
export function extractUTCDate(iso: string): string {
	return new Date(iso).toISOString().slice(0, 10);
}

/**
 * Format date for chart X-axis (DD-MM).
 */
export function formatChartDate(isoDate: string): string {
	const [, month, day] = isoDate.split("-");
	return `${day}-${month}`;
}

/**
 * Format date for chart tooltip (DD-MM-YYYY).
 */
export function formatChartTooltipDate(isoDate: string): string {
	const [year, month, day] = isoDate.split("-");
	return `${day}-${month}-${year}`;
}
```

**Timezone Decision:**

| Component       | Behavior                               |
| --------------- | -------------------------------------- |
| Table timestamp | Format ISO as UTC: `formatTimestamp()` |
| Chart buckets   | Group by UTC date from ISO string      |
| URL/sharing     | Inherently timezone-agnostic           |

**Trade-off:** Users see UTC times, not local times. For a B2B product used across timezones, UTC is preferable — it's unambiguous.

### 6. Preserving Original Order (Stable Sort)

```typescript
// In UsageTable component - memoized Map for original indices
const originalIndices = useMemo(() => {
	return new Map(data.map((item, idx) => [item.message_id, idx]));
}, [data]);

// Sort data based on current sort state
const sortedData = useMemo(() => {
	return sortUsageData(data, sortOrder, originalIndices);
}, [data, sortOrder, originalIndices]);
```

This ensures that when all sorts are cleared (third click), the table returns to the original API order.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running on `http://localhost:8000`

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Environment Variables

| Variable       | Default                 | Description                 |
| -------------- | ----------------------- | --------------------------- |
| `VITE_API_URL` | `""` (uses proxy)       | Backend API URL             |
| `BACKEND_URL`  | `http://localhost:8000` | Proxy target for dev server |

### Development Proxy

The Vite dev server proxies `/usage` requests to the backend:

```typescript
// vite.config.ts
proxy: {
  '/usage': {
    target: process.env.BACKEND_URL || 'http://localhost:8000',
    changeOrigin: true,
  },
}
```

## Available Scripts

| Script                  | Description                       |
| ----------------------- | --------------------------------- |
| `npm run dev`           | Start development server with HMR |
| `npm run build`         | Build for production              |
| `npm run preview`       | Preview production build          |
| `npm run lint`          | Run ESLint                        |
| `npm test`              | Run Jest unit tests               |
| `npm run test:watch`    | Run tests in watch mode           |
| `npm run test:coverage` | Run tests with coverage report    |
| `npm run cypress:open`  | Open Cypress Test Runner          |
| `npm run cypress:run`   | Run Cypress tests headlessly      |
| `npm run e2e`           | Alias for `cypress:run`           |

## Testing

### Unit Tests (Jest)

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

Test coverage includes:

- `UsageTable` component rendering and sorting
- `SortIndicator` visual states
- `LoadingState` and `ErrorState` components
- `sortUtils` multi-column sorting logic
- `dateFormatters` UTC formatting functions
- `chartDataTransform` data aggregation

### E2E Tests (Cypress)

```bash
# Interactive mode
npm run cypress:open

# Headless mode
npm run cypress:run
```

E2E tests cover:

- Dashboard page structure and content
- Stats cards displaying correct values
- Table sorting (ascending, descending, reset)
- Multi-column sorting
- URL state restoration
- Loading and error states
- Retry functionality

## Architecture Decisions

### Chakra UI over Tailwind CSS

Originally planned to use Tailwind CSS, but switched to **Chakra UI** for:

- Built-in component library with consistent design
- Theming support for custom brand colors
- Accessible components out of the box
- Better integration with React patterns

### TanStack Query for Data Fetching

- Automatic caching (5 min stale time, 30 min cache)
- Built-in loading and error states
- Automatic retries with exponential backoff
- Optimistic updates support

### URL-Based Sort State

- Shareable URLs with exact sort configuration
- Browser back/forward button support
- No external state management needed
- Clean separation of concerns

### UTC Date Handling

- Consistent date display across timezones
- Chart and table bucket by same dates
- No timezone conversion issues
- ISO 8601 timestamp parsing

## API Contract

The frontend expects this response from `GET /usage`, validated at runtime using Zod:

```typescript
// schemas/usage.ts
import { z } from "zod";

export const UsageItemSchema = z.object({
	message_id: z.number(),
	timestamp: z.string(), // ISO 8601 format
	report_name: z.string().optional(), // Optional - omitted when not a report
	credits_used: z.number(), // Always 2 decimal places
});

export const UsageResponseSchema = z.object({
	usage: z.array(UsageItemSchema),
});

// Types inferred from schemas
export type UsageItem = z.infer<typeof UsageItemSchema>;
export type UsageResponse = z.infer<typeof UsageResponseSchema>;
```

## Build Optimization

Vite is configured with code splitting:

```typescript
// vite.config.ts
manualChunks: {
  vendor: ['react', 'react-dom', 'react-router-dom'],
  charts: ['recharts'],
  query: ['@tanstack/react-query'],
}
```

## Docker Support

The frontend is containerized with a simple Dockerfile using Vite preview server.

### Building and Running

```bash
# Build the Docker image
docker build -t frontend .

# Run the container
docker run -p 5173:5173 -e BACKEND_URL=http://localhost:8000 frontend
```

### Using Docker Compose

```bash
# Start both frontend and backend
docker-compose up --build

# Frontend: http://localhost:5173
# Backend: http://localhost:8000
```

The Vite preview server handles both static file serving and API proxying to the backend.

## Theming

Custom Chakra UI theme in `src/theme/index.ts` with design tokens in `src/theme/tokens.ts`:

```typescript
const theme = extendTheme({
	colors: {
		brand: {
			500: "#6366F1", // Primary indigo
			600: "#4F46E5",
			// ... full color scale
		},
	},
	components: {
		Card: {
			/* Elevated cards with hover effects */
		},
		Table: {
			/* Elegant variant with sticky headers */
		},
		Badge: {
			/* Rounded badges */
		},
	},
});
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the existing code style
2. Write tests for new features
3. Update documentation as needed
4. Run `npm run lint` before committing
