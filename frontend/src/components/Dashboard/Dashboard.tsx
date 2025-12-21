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
	Card,
	CardHeader,
	CardBody,
	HStack,
	Badge,
	VStack,
} from "@chakra-ui/react";
import {
	FiCreditCard,
	FiMessageSquare,
	FiFileText,
	FiActivity,
	FiClock,
} from "react-icons/fi";
import { useUsageData } from "../../api/usage";
import { UsageChart } from "../UsageChart";
import { UsageTable } from "../UsageTable";
import { LoadingState, ErrorState } from "../ui";
import {
	transformToChartData,
	calculateTotalCredits,
} from "../../utils/chartDataTransform";
import { getUserFriendlyErrorMessage } from "../../utils/errorUtils";

export function Dashboard() {
	const { data, isLoading, isError, error, refetch } = useUsageData();

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
		return <LoadingState size="xl" message="Loading usage data..." />;
	}

	if (isError) {
		return (
			<ErrorState
				title="Failed to load usage data"
				message={getUserFriendlyErrorMessage(error)}
				onRetry={refetch}
			/>
		);
	}

	return (
		<Box minH="100vh" bgGradient="linear(to-b, gray.50, white)">
			{/* Top Bar with Glassmorphism */}
			<Box
				as="header"
				role="banner"
				bg="whiteAlpha.900"
				backdropFilter="blur(12px)"
				borderBottomWidth="1px"
				borderColor="gray.200"
				position="sticky"
				top="0"
				zIndex="sticky"
			>
				<Container maxW="7xl" py={4}>
					<Flex justify="space-between" align="center">
						<HStack spacing={3}>
							<Flex
								w={10}
								h={10}
								bgGradient="linear(to-br, brand.600, brand.400)"
								rounded="xl"
								align="center"
								justify="center"
								shadow="lg"
							>
								<Icon as={FiActivity} w={6} h={6} color="white.50" />
							</Flex>
							<Box>
								<Heading size="md" color="gray.900" letterSpacing="tight">
									Orbital Copilot
								</Heading>
								<Text fontSize="xs" color="gray.500" fontWeight="medium">
									Usage Dashboard
								</Text>
							</Box>
						</HStack>
						<HStack>
							<Badge
								colorScheme="brand"
								variant="subtle"
								rounded="full"
								px={3}
								py={1}
							>
								Pro Plan
							</Badge>
							<Box w="1px" h="24px" bg="gray.200" mx={2} />
							<Flex align="center" gap={2}>
								<Icon as={FiClock} color="gray.400" />
								<Text fontSize="sm" color="gray.600">
									Current Billing Period
								</Text>
							</Flex>
						</HStack>
					</Flex>
				</Container>
			</Box>

			{/* Main Content */}
			<Container
				as="main"
				role="main"
				maxW="7xl"
				py={12}
				aria-label="Usage Dashboard"
			>
				<VStack spacing={10} align="stretch">
					{/* Welcome Section */}
					<Box>
						<Heading
							size="lg"
							mb={2}
							bgGradient="linear(to-r, brand.700, brand.500)"
							bgClip="text"
						>
							Overview
						</Heading>
						<Text color="gray.600" fontSize="lg">
							Track your AI credit consumption and activity metrics.
						</Text>
					</Box>

					{/* Stats Cards */}
					<SimpleGrid
						columns={{ base: 1, md: 3 }}
						spacing={8}
						role="region"
						aria-label="Usage Statistics"
					>
						{/* Total Credits */}
						<Card variant="elevated">
							<CardBody>
								<Flex justify="space-between" align="flex-start">
									<Box>
										<Stat>
											<StatLabel color="gray.500" fontSize="sm" mb={1}>
												Total Credits Used
											</StatLabel>
											<StatNumber
												fontSize="4xl"
												fontWeight="800"
												color="gray.900"
											>
												{stats.total.toFixed(2)}
											</StatNumber>
										</Stat>
									</Box>
									<Flex p={3} bg="brand.50" rounded="2xl" color="brand.600">
										<Icon as={FiCreditCard} w={6} h={6} />
									</Flex>
								</Flex>
							</CardBody>
						</Card>

						{/* Total Messages */}
						<Card variant="elevated">
							<CardBody>
								<Flex justify="space-between" align="flex-start">
									<Box>
										<Stat>
											<StatLabel color="gray.500" fontSize="sm" mb={1}>
												Messages Processed
											</StatLabel>
											<StatNumber
												fontSize="4xl"
												fontWeight="800"
												color="gray.900"
											>
												{stats.count}
											</StatNumber>
										</Stat>
										<Text fontSize="sm" color="gray.400" mt={2}>
											Active interactions
										</Text>
									</Box>
									<Flex p={3} bg="brand.100" rounded="2xl" color="brand.500">
										<Icon as={FiMessageSquare} w={6} h={6} />
									</Flex>
								</Flex>
							</CardBody>
						</Card>

						{/* Reports Generated */}
						<Card variant="elevated">
							<CardBody>
								<Flex justify="space-between" align="flex-start">
									<Box>
										<Stat>
											<StatLabel color="gray.500" fontSize="sm" mb={1}>
												Reports Generated
											</StatLabel>
											<StatNumber
												fontSize="4xl"
												fontWeight="800"
												color="gray.900"
											>
												{stats.reportCount}
											</StatNumber>
										</Stat>
										<Text fontSize="sm" color="gray.400" mt={2}>
											Document analysis
										</Text>
									</Box>
									<Flex p={3} bg="brand.200" rounded="2xl" color="brand.700">
										<Icon as={FiFileText} w={6} h={6} />
									</Flex>
								</Flex>
							</CardBody>
						</Card>
					</SimpleGrid>

					{/* Charts Section */}
					<Card minH="400px">
						<CardHeader borderBottomWidth="0" pb={0}>
							<Flex justify="space-between" align="center">
								<Box>
									<Heading size="md" color="gray.900">
										Daily Usage Trends
									</Heading>
									<Text fontSize="sm" color="gray.500" mt={1}>
										Analysis of credit consumption over time
									</Text>
								</Box>
								<Badge colorScheme="gray" variant="solid" rounded="full" px={3}>
									Last 30 Days
								</Badge>
							</Flex>
						</CardHeader>
						<CardBody>
							<Box h="350px" mt={4}>
								<UsageChart data={chartData} />
							</Box>
						</CardBody>
					</Card>

					{/* Tables Section */}
					<Box>
						<Heading size="md" mb={6} color="gray.900">
							Detailed Activity Log
						</Heading>
						<UsageTable data={data?.usage || []} />
					</Box>
				</VStack>
			</Container>

			{/* Detailed Footer */}
			<Box
				as="footer"
				role="contentinfo"
				borderTopWidth="1px"
				borderColor="gray.200"
				bg="white"
				mt="auto"
			>
				<Container maxW="7xl" py={8}>
					<Flex
						justify="space-between"
						align="center"
						direction={{ base: "column", md: "row" }}
						gap={4}
					>
						<Text fontSize="sm" color="gray.500">
							&copy; {new Date().getFullYear()} Orbital Witness. All rights
							reserved.
						</Text>
						<HStack spacing={6}>
							<Text
								fontSize="sm"
								color="gray.400"
								cursor="pointer"
								_hover={{ color: "brand.600" }}
							>
								Privacy Policy
							</Text>
							<Text
								fontSize="sm"
								color="gray.400"
								cursor="pointer"
								_hover={{ color: "brand.600" }}
							>
								Terms of Service
							</Text>
							<Text
								fontSize="sm"
								color="gray.400"
								cursor="pointer"
								_hover={{ color: "brand.600" }}
							>
								Support
							</Text>
						</HStack>
					</Flex>
				</Container>
			</Box>
		</Box>
	);
}
