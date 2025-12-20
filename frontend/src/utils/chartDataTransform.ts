/**
 * Chart data transformation utilities.
 * Transforms usage data into chart-friendly format with proper date bucketing.
 */

import type { UsageItem, ChartDataPoint } from "../types/usage";
import {
	extractUTCDate,
	formatChartDate,
	formatChartTooltipDate,
} from "./dateFormatters";

/**
 * Transform usage data into chart-friendly format.
 *
 * IMPORTANT: Uses UTC dates for consistency with table formatting.
 * Both table and chart now bucket by the same date, avoiding timezone
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
			date: formatChartDate(dateStr),
			fullDate: formatChartTooltipDate(dateStr),
			credits: Math.round((creditsByDate.get(dateStr) || 0) * 100) / 100, // Round for display
		});

		current.setUTCDate(current.getUTCDate() + 1); // Use UTC to avoid DST issues
	}

	return result;
}

/**
 * Calculate total credits from usage data.
 */
export function calculateTotalCredits(usage: UsageItem[]): number {
	return (
		Math.round(usage.reduce((sum, item) => sum + item.credits_used, 0) * 100) /
		100
	);
}
