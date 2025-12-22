/**
 * Sorting utility functions.
 * Implements multi-column, precedence-aware sorting with stable fallback.
 */

import { SortDirectionEnum, USAGE_SORTABLE_COLUMNS } from "../types/usage";
import type { UsageItem, SortEntry } from "../types/usage";

/**
 * Sort usage data respecting the ORDER of sort entries.
 * First entry in sortOrder is the primary sort, subsequent entries are tiebreakers.
 *
 * @param data - The usage items to sort
 * @param sortOrder - Ordered array of sort entries (first = primary)
 * @param originalIndices - Map of message_id to original position (for stable sort)
 */
export function sortUsageData(
	data: UsageItem[],
	sortOrder: SortEntry[],
	originalIndices: Map<number, number>
): UsageItem[] {
	// If no sorts applied, return original order
	if (sortOrder.length === 0) {
		return data;
	}

	return [...data].sort((a, b) => {
		// Apply each sort in order (first is primary, rest are tiebreakers)
		for (const { column, direction } of sortOrder) {
			let comparison = 0;
			let forceEnd = false;

			if (column === USAGE_SORTABLE_COLUMNS.REPORT_NAME) {
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
			} else if (column === USAGE_SORTABLE_COLUMNS.CREDITS_USED) {
				comparison = a.credits_used - b.credits_used;
			}

			// If not equal, apply direction and return
			if (comparison !== 0) {
				if (forceEnd) {
					// Empty report names always go to end, regardless of direction
					return comparison;
				}
				return direction === SortDirectionEnum.ASC ? comparison : -comparison;
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
