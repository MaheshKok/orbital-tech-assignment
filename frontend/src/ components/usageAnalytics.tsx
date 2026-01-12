import { useMemo } from "react";
import type { IUsageResponse } from "../hooks/useUsage";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { Box, Heading, Text, SimpleGrid, Flex, Icon } from "@chakra-ui/react";
import { FiCreditCard, FiMessageSquare, FiFileText } from "react-icons/fi";

// Interface for aggregated data by date
interface DailyUsage {
	date: string;
	credits_used: number;
}

export default function UsageAnalytics({ usage }: { usage: IUsageResponse }) {
	// Aggregate credits by date (strip time from timestamp)
	const dailyData = useMemo(() => {
		const aggregated: Record<string, number> = {};

		usage.usage.forEach((item) => {
			// Extract date only (YYYY-MM-DD) from timestamp
			const date = item.timestamp.split("T")[0];

			if (aggregated[date]) {
				aggregated[date] += item.credits_used;
			} else {
				aggregated[date] = item.credits_used;
			}
		});

		// Convert to array and sort by date
		const result: DailyUsage[] = Object.entries(aggregated)
			.map(([date, credits_used]) => ({
				date,
				credits_used,
			}))
			.sort((a, b) => a.date.localeCompare(b.date));

		return result;
	}, [usage]);

	// Calculate totals
	const totalCredits = usage.usage.reduce(
		(sum, item) => sum + item.credits_used,
		0
	);
	const totalMessages = usage.usage.length;
	// Count unique reports (if report_name exists)
	const uniqueReports = new Set(
		usage.usage.map((item) => item.report_name).filter(Boolean)
	).size;

	// Format date for display
	const formatDate = (dateStr: string) => {
		const date = new Date(dateStr);
		// Returns "29-04" format as seen in image
		const day = date.getDate().toString().padStart(2, "0");
		const month = (date.getMonth() + 1).toString().padStart(2, "0");
		return `${day}-${month}`;
	};

	const StatCard = ({
		title,
		value,
		subtext,
		icon,
		iconColor,
		iconBg,
	}: any) => (
		<Box
			p={6}
			bg="white"
			borderRadius="xl"
			borderWidth="1px"
			borderColor="gray.100"
			boxShadow="sm"
		>
			<Flex justify="space-between" align="start">
				<Box>
					<Text fontSize="sm" color="gray.500" mb={1}>
						{title}
					</Text>
					<Heading size="xl" mb={1}>
						{typeof value === "number" && !Number.isInteger(value)
							? value.toFixed(2)
							: value}
					</Heading>
					{subtext && (
						<Text fontSize="xs" color="gray.400">
							{subtext}
						</Text>
					)}
				</Box>
				<Flex
					align="center"
					justify="center"
					w={10}
					h={10}
					borderRadius="lg"
					bg={iconBg}
					color={iconColor}
				>
					<Icon as={icon} boxSize={5} />
				</Flex>
			</Flex>
		</Box>
	);

	return (
		<Box mb={8}>
			{/* Overview Section */}
			<Box mb={8}>
				<Heading size="lg" mb={2} color="#4338ca">
					Overview
				</Heading>
				<Text color="gray.500" mb={6}>
					Track your AI credit consumption and activity metrics.
				</Text>

				<SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
					<StatCard
						title="Total Credits Used"
						value={totalCredits}
						icon={FiCreditCard}
						iconColor="#4338ca"
						iconBg="#e0e7ff"
					/>
					<StatCard
						title="Messages Processed"
						value={totalMessages}
						subtext="Active interactions"
						icon={FiMessageSquare}
						iconColor="#4338ca"
						iconBg="#e0e7ff"
					/>
					<StatCard
						title="Reports Generated"
						value={uniqueReports}
						subtext="Document analysis"
						icon={FiFileText}
						iconColor="#4338ca"
						iconBg="#e0e7ff"
					/>
				</SimpleGrid>
			</Box>

			{/* Daily Usage Trends Section */}
			<Box
				p={6}
				borderRadius="xl"
				borderWidth="1px"
				borderColor="gray.200"
				bg="white"
				className="usage-chart-container"
			>
				<Flex justify="space-between" align="center" mb={6}>
					<Box>
						<Heading size="md" mb={1}>
							Daily Usage Trends
						</Heading>
						<Text fontSize="sm" color="gray.500">
							Analysis of credit consumption over time
						</Text>
					</Box>
					<Box
						bg="#374151"
						color="white"
						px={3}
						py={1}
						borderRadius="md"
						fontSize="xs"
						fontWeight="medium"
					>
						Last 30 Days
					</Box>
				</Flex>

				<Box height="300px" width="100%">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart
							data={dailyData}
							margin={{
								top: 20,
								right: 0,
								left: -20,
								bottom: 0,
							}}
							barSize={32}
						>
							<CartesianGrid
								vertical={false}
								strokeDasharray="3 3"
								stroke="#f3f4f6"
							/>
							<XAxis
								dataKey="date"
								tickFormatter={formatDate}
								stroke="#9ca3af"
								axisLine={false}
								tickLine={false}
								tick={{ fill: "#6b7280", fontSize: 12 }}
								dy={10}
							/>
							<YAxis
								stroke="#9ca3af"
								axisLine={false}
								tickLine={false}
								tick={{ fill: "#6b7280", fontSize: 12 }}
							/>
							<Tooltip
								cursor={{ fill: "transparent" }}
								content={({ active, payload, label }) => {
									if (active && payload && payload.length) {
										return (
											<Box
												bg="white"
												p={3}
												borderRadius="lg"
												boxShadow="lg"
												border="1px solid"
												borderColor="gray.100"
											>
												<Text fontSize="xs" color="gray.500" mb={1}>
													{formatDate(label)}
												</Text>
												<Text fontWeight="bold" fontSize="lg" color="#111827">
													{payload[0].value}{" "}
													<Text
														as="span"
														fontSize="xs"
														fontWeight="normal"
														color="gray.500"
													>
														credits
													</Text>
												</Text>
											</Box>
										);
									}
									return null;
								}}
							/>
							<Bar
								dataKey="credits_used"
								fill="#6366f1"
								radius={[4, 4, 4, 4]}
							/>
						</BarChart>
					</ResponsiveContainer>
				</Box>
			</Box>
		</Box>
	);
}
