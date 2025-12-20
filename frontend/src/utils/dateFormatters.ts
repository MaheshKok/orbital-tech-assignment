/**
 * Date formatting utilities.
 * Uses UTC for consistency between table and chart.
 */

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
 */
export function extractUTCDate(iso: string): string {
	return iso.split("T")[0];
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
