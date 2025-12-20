import { useMemo } from "react";
import {
	Box,
	Container,
	Flex,
	Heading,
	Text,
	SimpleGrid,
	Icon,
	Stat,
	StatLabel,
	StatNumber,
	useColorModeValue,
	Card,
	CardHeader,
	CardBody,
} from "@chakra-ui/react";
import { FiCreditCard, FiMessageSquare, FiFileText } from "react-icons/fi";
import { useUsageData } from "../../api/usage";
import { UsageChart } from "../UsageChart";
import { UsageTable } from "../UsageTable";
import { LoadingSpinner, ErrorMessage } from "../ui";
import {
	transformToChartData,
	calculateTotalCredits,
} from "../../utils/chartDataTransform";

export function Dashboard() {
	const { data, isLoading, isError, error, refetch } = useUsageData();
	const bgColor = useColorModeValue("gray.50", "gray.900");

	const usage = data?.usage;

	// Transform data for chart
	const chartData = useMemo(() => {
		if (!usage) return [];
		return transformToChartData(usage);
	}, [usage]);

	// Calculate summary stats
	const stats = useMemo(() => {
		if (!usage) return { total: 0, count: 0, reportCount: 0 };
		return {
			total: calculateTotalCredits(usage),
			count: usage.length,
			reportCount: usage.filter((u) => u.report_name).length,
		};
	}, [usage]);

	if (isLoading) {
		return <LoadingSpinner size="xl" message="Loading usage data..." />;
	}

	if (isError) {
		return (
			<ErrorMessage
				title="Failed to load usage data"
				message={
					error?.message || "An unexpected error occurred. Please try again."
				}
				onRetry={refetch}
			/>
		);
	}

	return (
		<Box minH="100vh" bg={bgColor}>
			{/* Header */}
			<Box bg="white" shadow="sm" borderBottomWidth="1px">
				<Container maxW="7xl" py={6}>
					<Flex justify="space-between" align="center">
						<Box>
							<Heading size="lg" color="gray.900">
								Credit Usage Dashboard
							</Heading>
							<Text mt={1} fontSize="sm" color="gray.500">
								Orbital Copilot - Current Billing Period
							</Text>
						</Box>
						<Flex
							w={10}
							h={10}
							bg="blue.600"
							rounded="lg"
							align="center"
							justify="center"
						>
							<Icon as={FiCreditCard} w={6} h={6} color="white" />
						</Flex>
					</Flex>
				</Container>
			</Box>

			{/* Main Content */}
			<Container maxW="7xl" py={8}>
				{/* Stats Cards */}
				<SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
					{/* Total Credits */}
					<Card variant="outline" bg="white" boxShadow="sm">
						<CardBody>
							<Flex align="center">
								<Flex
									shrink={0}
									p={3}
									bg="blue.50"
									rounded="lg"
									color="blue.600"
								>
									<Icon as={FiCreditCard} w={6} h={6} />
								</Flex>
								<Box ml={4}>
									<Stat>
										<StatLabel color="gray.500">Total Credits</StatLabel>
										<StatNumber fontSize="2xl" fontWeight="bold">
											{stats.total.toFixed(2)}
										</StatNumber>
									</Stat>
								</Box>
							</Flex>
						</CardBody>
					</Card>

					{/* Total Messages */}
					<Card variant="outline" bg="white" boxShadow="sm">
						<CardBody>
							<Flex align="center">
								<Flex
									shrink={0}
									p={3}
									bg="green.50"
									rounded="lg"
									color="green.600"
								>
									<Icon as={FiMessageSquare} w={6} h={6} />
								</Flex>
								<Box ml={4}>
									<Stat>
										<StatLabel color="gray.500">Total Messages</StatLabel>
										<StatNumber fontSize="2xl" fontWeight="bold">
											{stats.count}
										</StatNumber>
									</Stat>
								</Box>
							</Flex>
						</CardBody>
					</Card>

					{/* Reports Generated */}
					<Card variant="outline" bg="white" boxShadow="sm">
						<CardBody>
							<Flex align="center">
								<Flex
									shrink={0}
									p={3}
									bg="purple.50"
									rounded="lg"
									color="purple.600"
								>
									<Icon as={FiFileText} w={6} h={6} />
								</Flex>
								<Box ml={4}>
									<Stat>
										<StatLabel color="gray.500">Reports Generated</StatLabel>
										<StatNumber fontSize="2xl" fontWeight="bold">
											{stats.reportCount}
										</StatNumber>
									</Stat>
								</Box>
							</Flex>
						</CardBody>
					</Card>
				</SimpleGrid>

				{/* Chart Section */}
				<Card variant="outline" bg="white" boxShadow="sm" mb={8}>
					<CardBody>
						<Box mb={6}>
							<Heading size="md" mb={1} color="gray.900">
								Daily Credit Usage
							</Heading>
							<Text fontSize="sm" color="gray.500">
								Credits consumed per day in the billing period
							</Text>
						</Box>
						<UsageChart data={chartData} />
					</CardBody>
				</Card>

				{/* Table Section */}
				<Card variant="outline" bg="white" boxShadow="sm">
					<CardHeader pb={0}>
						<Heading size="md" mb={1} color="gray.900">
							Usage Details
						</Heading>
						<Text fontSize="sm" color="gray.500">
							Click on column headers to sort. Click three times to reset to
							original order.
						</Text>
					</CardHeader>
					<CardBody>
						<UsageTable data={data?.usage || []} />
					</CardBody>
				</Card>
			</Container>

			{/* Footer */}
			<Box bg="white" borderTopWidth="1px" mt={12}>
				<Container maxW="7xl" py={6}>
					<Text textAlign="center" fontSize="sm" color="gray.500">
						Orbital Witness Credit Usage Dashboard
					</Text>
				</Container>
			</Box>
		</Box>
	);
}
