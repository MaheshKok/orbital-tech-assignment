/**
 * Usage Table Component.
 * Displays usage data with sortable columns.
 */

import { useMemo, useEffect, useState } from "react";
import type { UsageItem, SortableColumn } from "../../types/usage";
import { formatTimestamp } from "../../utils/dateFormatters";
import { sortUsageData } from "../../utils/sortUtils";
import { useUrlSortState } from "../../hooks/useUrlSortState";
import { SortIndicator } from "./SortIndicator";

interface UsageTableProps {
	data: UsageItem[];
}

export function UsageTable({ data }: UsageTableProps) {
	const { sortOrder, getDirection, getSortPriority, toggleSort } =
		useUrlSortState();

	// Store original indices for stable sorting
	const [originalIndices] = useState<Map<number, number>>(() => {
		return new Map(data.map((item, idx) => [item.message_id, idx]));
	});

	// Update original indices when data changes (e.g., refetch)
	useEffect(() => {
		// Only update if data has actually changed
		const currentIds = Array.from(originalIndices.keys());
		const dataIds = data.map((item) => item.message_id);
		const hasChanged =
			currentIds.length !== dataIds.length ||
			currentIds.some((id, idx) => id !== dataIds[idx]);

		if (hasChanged) {
			originalIndices.clear();
			data.forEach((item, idx) => {
				originalIndices.set(item.message_id, idx);
			});
		}
	}, [data, originalIndices]);

	// Sort data based on current sort state
	const sortedData = useMemo(() => {
		return sortUsageData(data, sortOrder, originalIndices);
	}, [data, sortOrder, originalIndices]);

	const handleHeaderClick = (column: SortableColumn) => {
		toggleSort(column);
	};

	const renderSortableHeader = (column: SortableColumn, label: string) => {
		const direction = getDirection(column);
		const priority = getSortPriority(column);

		return (
			<th
				className="px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors select-none"
				onClick={() => handleHeaderClick(column)}
				role="columnheader"
				aria-sort={
					direction === "asc"
						? "ascending"
						: direction === "desc"
						  ? "descending"
						  : "none"
				}
			>
				<div className="flex items-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
					{label}
					<SortIndicator direction={direction} priority={priority} />
				</div>
			</th>
		);
	};

	if (data.length === 0) {
		return (
			<div className="text-center py-12 text-gray-500">
				No usage data available
			</div>
		);
	}

	return (
		<div className="overflow-hidden rounded-lg border border-gray-200">
			<div className="overflow-x-auto">
				<table className="min-w-full divide-y divide-gray-200" role="grid">
					<thead className="bg-gray-50">
						<tr>
							<th
								className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
								role="columnheader"
							>
								Message ID
							</th>
							<th
								className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
								role="columnheader"
							>
								Timestamp
							</th>
							{renderSortableHeader("report_name", "Report Name")}
							{renderSortableHeader("credits_used", "Credits Used")}
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{sortedData.map((item) => (
							<tr
								key={item.message_id}
								className="hover:bg-gray-50 transition-colors"
								role="row"
							>
								<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
									{item.message_id}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
									{formatTimestamp(item.timestamp)}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
									{item.report_name ? (
										<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
											{item.report_name}
										</span>
									) : (
										<span className="text-gray-400">—</span>
									)}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
									{item.credits_used.toFixed(2)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
				<p className="text-sm text-gray-600">
					Showing <span className="font-medium">{sortedData.length}</span>{" "}
					messages
				</p>
			</div>
		</div>
	);
}
