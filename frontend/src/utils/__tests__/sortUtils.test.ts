/**
 * Unit tests for sorting utilities.
 */

import { sortUsageData } from "../sortUtils";
import { SortDirectionEnum } from "../../types/usage";
import type { UsageItem, SortEntry } from "../../types/usage";

describe("sortUsageData", () => {
	const mockData: UsageItem[] = [
		{
			message_id: 1,
			timestamp: "2024-04-29T02:08:29Z",
			report_name: "Report B",
			credits_used: 50,
		},
		{
			message_id: 2,
			timestamp: "2024-04-29T03:00:00Z",
			report_name: "Report A",
			credits_used: 30,
		},
		{ message_id: 3, timestamp: "2024-04-29T04:00:00Z", credits_used: 10 },
		{
			message_id: 4,
			timestamp: "2024-04-29T05:00:00Z",
			report_name: "Report C",
			credits_used: 20,
		},
		{ message_id: 5, timestamp: "2024-04-29T06:00:00Z", credits_used: 40 },
	];

	const originalIndices = new Map<number, number>([
		[1, 0],
		[2, 1],
		[3, 2],
		[4, 3],
		[5, 4],
	]);

	describe("with no sort applied", () => {
		it("should return data in original order", () => {
			const result = sortUsageData(mockData, [], originalIndices);
			expect(result.map((d) => d.message_id)).toEqual([1, 2, 3, 4, 5]);
		});
	});

	describe("sorting by credits_used", () => {
		it("should sort ascending", () => {
			const sortOrder: SortEntry[] = [
				{ column: "credits_used", direction: SortDirectionEnum.ASC },
			];
			const result = sortUsageData(mockData, sortOrder, originalIndices);
			expect(result.map((d) => d.credits_used)).toEqual([10, 20, 30, 40, 50]);
		});

		it("should sort descending", () => {
			const sortOrder: SortEntry[] = [
				{ column: "credits_used", direction: SortDirectionEnum.DESC },
			];
			const result = sortUsageData(mockData, sortOrder, originalIndices);
			expect(result.map((d) => d.credits_used)).toEqual([50, 40, 30, 20, 10]);
		});
	});

	describe("sorting by report_name", () => {
		it("should sort ascending with empty names at the end", () => {
			const sortOrder: SortEntry[] = [
				{ column: "report_name", direction: SortDirectionEnum.ASC },
			];
			const result = sortUsageData(mockData, sortOrder, originalIndices);
			// Report A, Report B, Report C, then empty names
			expect(result.map((d) => d.report_name || "EMPTY")).toEqual([
				"Report A",
				"Report B",
				"Report C",
				"EMPTY",
				"EMPTY",
			]);
		});

		it("should sort descending with empty names at the end", () => {
			const sortOrder: SortEntry[] = [
				{ column: "report_name", direction: SortDirectionEnum.DESC },
			];
			const result = sortUsageData(mockData, sortOrder, originalIndices);
			// Report C, Report B, Report A, then empty names
			expect(result.map((d) => d.report_name || "EMPTY")).toEqual([
				"Report C",
				"Report B",
				"Report A",
				"EMPTY",
				"EMPTY",
			]);
		});
	});

	describe("multi-column sorting", () => {
		it("should sort by primary then secondary column", () => {
			// Data with some equal values
			const dataWithDuplicates: UsageItem[] = [
				{
					message_id: 1,
					timestamp: "2024-04-29T01:00:00Z",
					report_name: "Report A",
					credits_used: 50,
				},
				{
					message_id: 2,
					timestamp: "2024-04-29T02:00:00Z",
					report_name: "Report A",
					credits_used: 30,
				},
				{
					message_id: 3,
					timestamp: "2024-04-29T03:00:00Z",
					report_name: "Report B",
					credits_used: 50,
				},
				{
					message_id: 4,
					timestamp: "2024-04-29T04:00:00Z",
					report_name: "Report B",
					credits_used: 30,
				},
			];

			const indices = new Map<number, number>([
				[1, 0],
				[2, 1],
				[3, 2],
				[4, 3],
			]);

			// Sort by report_name asc, then credits_used asc
			const sortOrder: SortEntry[] = [
				{ column: "report_name", direction: SortDirectionEnum.ASC },
				{ column: "credits_used", direction: SortDirectionEnum.ASC },
			];

			const result = sortUsageData(dataWithDuplicates, sortOrder, indices);
			expect(result.map((d) => d.message_id)).toEqual([2, 1, 4, 3]);
			// Report A: 30 (id:2), 50 (id:1)
			// Report B: 30 (id:4), 50 (id:3)
		});

		it("should respect sort order precedence", () => {
			const dataWithDuplicates: UsageItem[] = [
				{
					message_id: 1,
					timestamp: "2024-04-29T01:00:00Z",
					report_name: "Report A",
					credits_used: 50,
				},
				{
					message_id: 2,
					timestamp: "2024-04-29T02:00:00Z",
					report_name: "Report A",
					credits_used: 30,
				},
				{
					message_id: 3,
					timestamp: "2024-04-29T03:00:00Z",
					report_name: "Report B",
					credits_used: 50,
				},
				{
					message_id: 4,
					timestamp: "2024-04-29T04:00:00Z",
					report_name: "Report B",
					credits_used: 30,
				},
			];

			const indices = new Map<number, number>([
				[1, 0],
				[2, 1],
				[3, 2],
				[4, 3],
			]);

			// Sort by credits_used asc first, then report_name asc
			const sortOrder: SortEntry[] = [
				{ column: "credits_used", direction: SortDirectionEnum.ASC },
				{ column: "report_name", direction: SortDirectionEnum.ASC },
			];

			const result = sortUsageData(dataWithDuplicates, sortOrder, indices);
			expect(result.map((d) => d.message_id)).toEqual([2, 4, 1, 3]);
			// 30 credits: Report A (id:2), Report B (id:4)
			// 50 credits: Report A (id:1), Report B (id:3)
		});
	});

	describe("stable sorting", () => {
		it("should maintain original order when sort criteria are equal", () => {
			const dataWithEqualCredits: UsageItem[] = [
				{ message_id: 1, timestamp: "2024-04-29T01:00:00Z", credits_used: 50 },
				{ message_id: 2, timestamp: "2024-04-29T02:00:00Z", credits_used: 50 },
				{ message_id: 3, timestamp: "2024-04-29T03:00:00Z", credits_used: 50 },
			];

			const indices = new Map<number, number>([
				[1, 0],
				[2, 1],
				[3, 2],
			]);

			const sortOrder: SortEntry[] = [
				{ column: "credits_used", direction: SortDirectionEnum.ASC },
			];
			const result = sortUsageData(dataWithEqualCredits, sortOrder, indices);

			// Should maintain original order since all credits are equal
			expect(result.map((d) => d.message_id)).toEqual([1, 2, 3]);
		});
	});
});
