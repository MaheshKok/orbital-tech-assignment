import { useMemo, useState } from "react";
import { type IUsageResponse } from "../hooks/useUsage";
import {
	useReactTable,
	getCoreRowModel,
	getSortedRowModel,
	flexRender,
	type ColumnDef,
	type SortingState,
} from "@tanstack/react-table";
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Badge, Text, Flex, Icon } from "@chakra-ui/react";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

// Define the shape of each usage item
interface UsageItem {
	message_id: number;
	timestamp: string;
	report_name?: string;
	credits_used: number;
}


// Custom sort icon component matching the design
function SortIcon({ sortState, index }: { sortState: false | "asc" | "desc", index: number }) {
    return (
        <Flex as="span" ml={2} align="center" color="blue.500" fontSize="xs" fontWeight="bold">
            {sortState === "asc" && <Icon as={FaSortUp} mr={1} />}
            {sortState === "desc" && <Icon as={FaSortDown} mr={1} />}
            {sortState && index}
             {/* If not sorted, we don't show anything based on the image, or a faint icon if desired. 
                 The image shows active sorts with number. Unsorted cols have nothing or specific default. */}
             {!sortState && <Icon as={FaSort} color="gray.300" />}
        </Flex>
    );
}

export default function UsageTable({ usage }: { usage: IUsageResponse }) {
	const [sorting, setSorting] = useState<SortingState>([
        { id: 'report_name', desc: false }, // Default sort to match image example 1
        { id: 'credits_used', desc: false } // Default sort to match image example 2
    ]);

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
                    // Format: 29-04-2024 20:55
                    const day = date.getDate().toString().padStart(2, '0');
                    const month = (date.getMonth() + 1).toString().padStart(2, '0');
                    const year = date.getFullYear();
                    const hours = date.getHours().toString().padStart(2, '0');
                    const minutes = date.getMinutes().toString().padStart(2, '0');
                    
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
                    const sortIndex = sorting.findIndex(s => s.id === column.id) + 1;
                    return (
                        <Flex 
                            align="center" 
                            cursor="pointer" 
                            onClick={column.getToggleSortingHandler()}
                        >
                            REPORT NAME
                            <SortIcon sortState={column.getIsSorted()} index={sortIndex} />
                        </Flex>
                    )
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
                    const sortIndex = sorting.findIndex(s => s.id === column.id) + 1;
                    return (
                        <Flex 
                            align="center" 
                            cursor="pointer" 
                            onClick={column.getToggleSortingHandler()}
                        >
                            CREDITS USED
                            <SortIcon sortState={column.getIsSorted()} index={sortIndex} />
                        </Flex>
                    )
                },
				enableSorting: true,
				cell: (info) => (
                    <Text color="#3730a3" fontWeight="bold" fontSize="sm">
                        {info.getValue<number>().toFixed(2)} <Text as="span" fontWeight="normal" color="gray.500" fontSize="xs">credits</Text>
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
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		enableMultiSort: true,
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
								<Tr
									key={row.id}
                                    _hover={{ bg: "gray.50" }}
								>
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
