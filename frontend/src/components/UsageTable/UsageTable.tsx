/**
 * Usage Table Component.
 * Displays usage data with sortable columns.
 */

import { useMemo, useEffect, useState } from "react";
import {
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	TableContainer,
	Box,
	Text,
	Badge,
	Flex,
} from "@chakra-ui/react";
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
			<Th
				cursor="pointer"
				_hover={{ bg: "gray.100" }}
				onClick={() => handleHeaderClick(column)}
				userSelect="none"
				aria-sort={
					direction === "asc"
						? "ascending"
						: direction === "desc"
						  ? "descending"
						  : "none"
				}
			>
				<Flex align="center">
					{label}
					<SortIndicator direction={direction} priority={priority} />
				</Flex>
			</Th>
		);
	};

	if (data.length === 0) {
		return (
			<Box textAlign="center" py={12} color="gray.500">
				No usage data available
			</Box>
		);
	}

	return (
		<Box borderWidth="1px" borderRadius="lg" overflow="hidden">
			<TableContainer>
				<Table variant="simple">
					<Thead bg="gray.50">
						<Tr>
							<Th>Message ID</Th>
							<Th>Timestamp</Th>
							{renderSortableHeader("report_name", "Report Name")}
							{renderSortableHeader("credits_used", "Credits Used")}
						</Tr>
					</Thead>
					<Tbody bg="white">
						{sortedData.map((item) => (
							<Tr key={item.message_id} _hover={{ bg: "gray.50" }}>
								<Td fontWeight="medium">{item.message_id}</Td>
								<Td color="gray.600">{formatTimestamp(item.timestamp)}</Td>
								<Td>
									{item.report_name ? (
										<Badge colorScheme="blue" borderRadius="full" px={2}>
											{item.report_name}
										</Badge>
									) : (
										<Text color="gray.400">—</Text>
									)}
								</Td>
								<Td fontWeight="semibold">{item.credits_used.toFixed(2)}</Td>
							</Tr>
						))}
					</Tbody>
				</Table>
			</TableContainer>
			<Box
				bg="gray.50"
				px={6}
				py={3}
				borderTopWidth="1px"
				borderColor="gray.200"
			>
				<Text fontSize="sm" color="gray.600">
					Showing{" "}
					<Text as="span" fontWeight="medium">
						{sortedData.length}
					</Text>{" "}
					messages
				</Text>
			</Box>
		</Box>
	);
}
