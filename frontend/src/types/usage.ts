/**
 * TypeScript type definitions for usage data.
 *
 * API types are inferred from Zod schemas (single source of truth).
 * Additional UI-specific types are defined here.
 */

// Re-export API types from schemas (Zod-inferred = single source of truth)
export type {
	UsageItem,
	UsageResponse,
} from "../schemas/usage";

// UI-specific types (not from API)
export type SortDirection = "asc" | "desc" | null;

export const USAGE_SORTABLE_COLUMNS = {
	REPORT_NAME: "report_name",
	CREDITS_USED: "credits_used",
} as const;

export type SortableColumn =
	(typeof USAGE_SORTABLE_COLUMNS)[keyof typeof USAGE_SORTABLE_COLUMNS];

export interface SortEntry {
	column: SortableColumn;
	direction: Exclude<SortDirection, null>;
}

export interface ChartDataPoint {
	date: string; // X-axis label: DD-MM
	fullDate: string; // Tooltip: DD-MM-YYYY
	credits: number; // Y-axis value
}
