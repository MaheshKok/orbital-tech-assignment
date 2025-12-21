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
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						handleHeaderClick(column);
					}
				}}
				tabIndex={0}
				role="columnheader button"
				userSelect="none"
				aria-sort={
					direction === "asc"
						? "ascending"
						: direction === "desc"
						  ? "descending"
						  : "none"
				}
				aria-label={`Sort by ${label}, currently ${
					direction === "asc"
						? "ascending"
						: direction === "desc"
						  ? "descending"
						  : "unsorted"
				}`}
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
		<Box
			bg="white"
			rounded="xl"
			shadow="sm"
			borderWidth="1px"
			borderColor="gray.200"
			overflow="hidden"
		>
			<TableContainer>
				<Table variant="elegant" aria-label="Usage activity log">
					<Thead>
						<Tr>
							<Th w="100px" scope="col">
								Message ID
							</Th>
							<Th scope="col">Timestamp</Th>
							{renderSortableHeader("report_name", "Report Name")}
							{renderSortableHeader("credits_used", "Credits Used")}
						</Tr>
					</Thead>
					<Tbody>
						{sortedData.map((item) => (
							<Tr key={item.message_id}>
								<Td>
									<Text
										fontFamily="mono"
										fontSize="xs"
										color="gray.500"
										bg="gray.100"
										px={2}
										py={1}
										rounded="md"
										display="inline-block"
									>
										#{item.message_id}
									</Text>
								</Td>
								<Td>
									<Text color="gray.900" fontWeight="medium">
										{formatTimestamp(item.timestamp)}
									</Text>
								</Td>
								<Td>
									{item.report_name ? (
										<Badge
											colorScheme="brand"
											variant="subtle"
											px={2}
											py={1}
											rounded="md"
											letterSpacing="wide"
											textTransform="capitalize"
										>
											{item.report_name}
										</Badge>
									) : (
										<Text color="gray.400" fontSize="sm">
											N/A
										</Text>
									)}
								</Td>
								<Td>
									<Flex align="center" gap={2}>
										<Text
											fontWeight="bold"
											color={item.credits_used > 1 ? "brand.600" : "gray.700"}
										>
											{item.credits_used.toFixed(2)}
										</Text>
										<Text fontSize="xs" color="gray.500">
											credits
										</Text>
									</Flex>
								</Td>
							</Tr>
						))}
					</Tbody>
				</Table>
			</TableContainer>
			<Box
				bg="gray.50/50"
				px={6}
				py={4}
				borderTopWidth="1px"
				borderColor="gray.100"
			>
				<Flex justify="space-between" align="center">
					<Text fontSize="xs" color="gray.500" fontWeight="medium">
						Showing {sortedData.length} records
					</Text>
					{/* Placeholder for pagination if needed later */}
				</Flex>
			</Box>
		</Box>
	);
}
