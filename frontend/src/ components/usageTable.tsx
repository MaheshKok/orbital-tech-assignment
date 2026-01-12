import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { type IUsageResponse } from "../hooks/useUsage";
import {
	useReactTable,
	getCoreRowModel,
	getSortedRowModel,
	flexRender,
	type ColumnDef,
	type SortingState,
	type Updater,
} from "@tanstack/react-table";
import {
	Box,
	Heading,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Badge,
	Text,
	Flex,
	Icon,
} from "@chakra-ui/react";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

// Define the shape of each usage item
interface UsageItem {
	message_id: number;
	timestamp: string;
	report_name?: string;
	credits_used: number;
}

// Custom sort icon component matching the design
function SortIcon({
	sortState,
	index,
}: {
	sortState: false | "asc" | "desc";
	index: number;
}) {
	return (
		<Flex
			as="span"
			ml={2}
			align="center"
			color="blue.500"
			fontSize="xs"
			fontWeight="bold"
		>
			{sortState === "asc" && <Icon as={FaSortUp} mr={1} />}
			{sortState === "desc" && <Icon as={FaSortDown} mr={1} />}
			{sortState && index}
			{!sortState && <Icon as={FaSort} color="gray.300" />}
		</Flex>
	);
}

// Parse sorting from URL search params
function parseSortingFromParams(searchParams: URLSearchParams): SortingState {
	const sortParam = searchParams.get("sort");
	if (!sortParam) {
		return [];
	}

	try {
		// Format: "report_name:asc,credits_used:desc"
		return sortParam.split(",").map((item) => {
			const [id, direction] = item.split(":");
			return { id, desc: direction === "desc" };
		});
	} catch {
		return [];
	}
}

// Serialize sorting state to URL string
function serializeSortingToParams(sorting: SortingState): string {
	if (sorting.length === 0) return "";
	return sorting.map((s) => `${s.id}:${s.desc ? "desc" : "asc"}`).join(",");
}

export default function UsageTable({ usage }: { usage: IUsageResponse }) {
	const [searchParams, setSearchParams] = useSearchParams();

	// Get current sorting from URL (empty if no sort param)
	const sorting = useMemo((): SortingState => {
		return parseSortingFromParams(searchParams);
	}, [searchParams]);

	// Handle sorting change and update URL
	const handleSortingChange = (updaterOrValue: Updater<SortingState>) => {
		const newSorting =
			typeof updaterOrValue === "function"
				? updaterOrValue(sorting)
				: updaterOrValue;

		// Update URL with new sorting
		const sortString = serializeSortingToParams(newSorting);
		setSearchParams((prev) => {
			const newParams = new URLSearchParams(prev);
			if (sortString) {
				newParams.set("sort", sortString);
			} else {
				newParams.delete("sort");
			}
			return newParams;
		});
	};

	const columns = useMemo<ColumnDef<UsageItem>[]>(
		() => [
			{
				accessorKey: "message_id",
				header: "MESSAGE ID",
				enableSorting: false,
				cell: (info) => (
					<Badge
						bg="gray.50"
						color="gray.500"
						px={2}
						py={1}
						borderRadius="md"
						textTransform="none"
						fontSize="sm"
						fontWeight="normal"
					>
						#{info.getValue<number>()}
					</Badge>
				),
			},
			{
				accessorKey: "timestamp",
				header: "TIMESTAMP",
				enableSorting: false,
				cell: (info) => {
					const date = new Date(info.getValue<string>());
					const day = date.getDate().toString().padStart(2, "0");
					const month = (date.getMonth() + 1)
						.toString()
						.padStart(2, "0");
					const year = date.getFullYear();
					const hours = date.getHours().toString().padStart(2, "0");
					const minutes = date
						.getMinutes()
						.toString()
						.padStart(2, "0");

					return (
						<Text color="#111827" fontWeight="medium" fontSize="sm">
							{`${day}-${month}-${year} ${hours}:${minutes}`}
						</Text>
					);
				},
			},
			{
				accessorKey: "report_name",
				header: ({ column }) => {
					const sortIndex =
						sorting.findIndex((s) => s.id === column.id) + 1;
					return (
						<Flex
							align="center"
							cursor="pointer"
							onClick={column.getToggleSortingHandler()}
						>
							REPORT NAME
							<SortIcon
								sortState={column.getIsSorted()}
								index={sortIndex}
							/>
						</Flex>
					);
				},
				enableSorting: true,
				cell: (info) => (
					<Badge
						bg="#eff0ff"
						color="#4338ca"
						px={3}
						py={1}
						borderRadius="full"
						textTransform="none"
						fontSize="xs"
						fontWeight="medium"
					>
						{info.getValue<string>() || "N/A"}
					</Badge>
				),
			},
			{
				accessorKey: "credits_used",
				header: ({ column }) => {
					const sortIndex =
						sorting.findIndex((s) => s.id === column.id) + 1;
					return (
						<Flex
							align="center"
							cursor="pointer"
							onClick={column.getToggleSortingHandler()}
						>
							CREDITS USED
							<SortIcon
								sortState={column.getIsSorted()}
								index={sortIndex}
							/>
						</Flex>
					);
				},
				enableSorting: true,
				cell: (info) => (
					<Text color="#3730a3" fontWeight="bold" fontSize="sm">
						{info.getValue<number>().toFixed(2)}{" "}
						<Text
							as="span"
							fontWeight="normal"
							color="gray.500"
							fontSize="xs"
						>
							credits
						</Text>
					</Text>
				),
			},
		],
		[sorting]
	);

	const table = useReactTable({
		data: usage.usage,
		columns,
		state: {
			sorting,
		},
		onSortingChange: handleSortingChange,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		enableMultiSort: true,
		isMultiSortEvent: () => true,
	});

	return (
		<Box
			bg="white"
			borderRadius="xl"
			borderWidth="1px"
			borderColor="gray.100"
			boxShadow="sm"
			overflow="hidden"
			p={6}
		>
			<Heading size="md" mb={6} color="#111827">
				Detailed Activity Log
			</Heading>

			<Box overflowX="auto">
				<Table variant="simple" size="md">
					<Thead>
						{table.getHeaderGroups().map((headerGroup) => (
							<Tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<Th
										key={header.id}
										borderBottomWidth="1px"
										borderColor="gray.100"
										color="gray.400"
										fontSize="xs"
										fontWeight="bold"
										letterSpacing="wider"
										py={4}
									>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef
														.header,
													header.getContext()
												)}
									</Th>
								))}
							</Tr>
						))}
					</Thead>
					<Tbody>
						{table.getRowModel().rows.length === 0 ? (
							<Tr>
								<Td
									colSpan={columns.length}
									textAlign="center"
									color="gray.500"
									py={10}
								>
									No usage data available
								</Td>
							</Tr>
						) : (
							table.getRowModel().rows.map((row) => (
								<Tr key={row.id} _hover={{ bg: "gray.50" }}>
									{row.getVisibleCells().map((cell) => (
										<Td
											key={cell.id}
											borderBottomWidth="1px"
											borderColor="gray.50"
											py={4}
										>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</Td>
									))}
								</Tr>
							))
						)}
					</Tbody>
				</Table>
			</Box>
		</Box>
	);
}
