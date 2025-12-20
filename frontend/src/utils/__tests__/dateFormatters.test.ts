/**
 * Unit tests for date formatting utilities.
 */

import {
	formatTimestamp,
	extractUTCDate,
	formatChartDate,
	formatChartTooltipDate,
} from "../dateFormatters";

describe("dateFormatters", () => {
	describe("formatTimestamp", () => {
		it("should format ISO timestamp to DD-MM-YYYY HH:mm format (UTC)", () => {
			const iso = "2024-04-29T02:08:29.375Z";
			expect(formatTimestamp(iso)).toBe("29-04-2024 02:08");
		});

		it("should handle timestamps with different times", () => {
			expect(formatTimestamp("2024-05-01T14:30:00.000Z")).toBe(
				"01-05-2024 14:30"
			);
			expect(formatTimestamp("2024-12-25T00:00:00.000Z")).toBe(
				"25-12-2024 00:00"
			);
			expect(formatTimestamp("2024-01-01T23:59:59.000Z")).toBe(
				"01-01-2024 23:59"
			);
		});

		it("should pad single-digit days and months", () => {
			expect(formatTimestamp("2024-01-05T09:05:00.000Z")).toBe(
				"05-01-2024 09:05"
			);
		});
	});

	describe("extractUTCDate", () => {
		it("should extract YYYY-MM-DD from ISO timestamp", () => {
			expect(extractUTCDate("2024-04-29T02:08:29.375Z")).toBe("2024-04-29");
		});

		it("should handle different timestamps", () => {
			expect(extractUTCDate("2024-05-01T14:30:00.000Z")).toBe("2024-05-01");
			expect(extractUTCDate("2024-12-25T00:00:00.000Z")).toBe("2024-12-25");
		});
	});

	describe("formatChartDate", () => {
		it("should format date for chart X-axis (DD-MM)", () => {
			expect(formatChartDate("2024-04-29")).toBe("29-04");
		});

		it("should handle different dates", () => {
			expect(formatChartDate("2024-05-01")).toBe("01-05");
			expect(formatChartDate("2024-12-25")).toBe("25-12");
		});
	});

	describe("formatChartTooltipDate", () => {
		it("should format date for chart tooltip (DD-MM-YYYY)", () => {
			expect(formatChartTooltipDate("2024-04-29")).toBe("29-04-2024");
		});

		it("should handle different dates", () => {
			expect(formatChartTooltipDate("2024-05-01")).toBe("01-05-2024");
			expect(formatChartTooltipDate("2024-12-25")).toBe("25-12-2024");
		});
	});
});
