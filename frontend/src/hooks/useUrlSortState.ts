/**
 * URL-synced sort state hook.
 * Manages sorting state through URL search params for shareability.
 */

import { useSearchParams } from "react-router-dom";
import { useCallback, useMemo } from "react";
import { USAGE_SORTABLE_COLUMNS } from "../types/usage";
import type { SortableColumn, SortEntry, SortDirection } from "../types/usage";

/**
 * Parse and validate sort column from URL.
 */
function isValidColumn(value: string): value is SortableColumn {
	return (
		value === USAGE_SORTABLE_COLUMNS.REPORT_NAME ||
		value === USAGE_SORTABLE_COLUMNS.CREDITS_USED
	);
}

/**
 * Parse and validate sort direction from URL.
 */
function isValidDirection(value: string): value is "asc" | "desc" {
	return value === "asc" || value === "desc";
}

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
