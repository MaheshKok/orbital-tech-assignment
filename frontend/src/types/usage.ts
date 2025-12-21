/**
 * TypeScript type definitions for usage data.
 *
 * API types are inferred from Zod schemas (single source of truth).
 * Additional UI-specific types are defined here.
 */

// Re-export API types from schemas (Zod-inferred = single source of truth)
export type {
	UsageItemFromSchema as UsageItem,
	UsageResponseFromSchema as UsageResponse,
} from "../schemas/usage";

// UI-specific types (not from API)
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
