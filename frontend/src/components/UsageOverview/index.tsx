import { useMemo } from "react";
import type { IUsageResponse } from "../../hooks/useUsage";
import type { IconType } from "react-icons";
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

// ============================================================================
// Types
// ============================================================================

interface DailyUsage {
	date: string;
	credits_used: number;
}

interface StatCardProps {
	title: string;
	value: number;
	subtext?: string;
	icon: IconType;
	iconColor: string;
	iconBg: string;
}

interface UsageOverviewProps {
	usage: IUsageResponse;
}

// ============================================================================
// Helper Components
// ============================================================================

function StatCard({
	title,
	value,
	subtext,
	icon,
	iconColor,
	iconBg,
}: StatCardProps) {
	return (
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
					<Text fontSize="sm" color="gray.500" fontWeight="medium" mb={1}>
						{title}
					</Text>
					<Heading size="2xl" mb={1} mt={2} color="#111827">
						{typeof value === "number" && !Number.isInteger(value)
							? value.toFixed(2)
							: value}
					</Heading>
					{subtext && (
						<Text fontSize="xs" color="gray.400" mt={1}>
							{subtext}
						</Text>
					)}
				</Box>
				<Flex
					align="center"
					justify="center"
					w={12}
					h={12}
					borderRadius="xl"
					bg={iconBg}
					color={iconColor}
				>
					<Icon as={icon} boxSize={6} />
				</Flex>
			</Flex>
		</Box>
	);
}

// ============================================================================
// Utilities
// ============================================================================

function formatDate(dateStr: string): string {
	const [year, month, day] = dateStr.split("-");
	if (!year || !month || !day) return dateStr;
	return `${day}-${month}`;
}

function aggregateUsageByDate(usage: IUsageResponse): DailyUsage[] {
	if (usage.usage.length === 0) return [];

	const aggregated: Record<string, number> = {};
	let minDate: string | undefined;
	let maxDate: string | undefined;

	usage.usage.forEach((item) => {
		const date = item.timestamp.split("T")[0];
		aggregated[date] = (aggregated[date] || 0) + item.credits_used;
		minDate = minDate ? (date < minDate ? date : minDate) : date;
		maxDate = maxDate ? (date > maxDate ? date : maxDate) : date;
	});

	if (!minDate || !maxDate) return [];

	const start = new Date(`${minDate}T00:00:00Z`);
	const end = new Date(`${maxDate}T00:00:00Z`);
	if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
		return Object.entries(aggregated)
			.map(([date, credits_used]) => ({ date, credits_used }))
			.sort((a, b) => a.date.localeCompare(b.date));
	}

	const daily: DailyUsage[] = [];
	for (
		const current = new Date(start);
		current <= end;
		current.setUTCDate(current.getUTCDate() + 1)
	) {
		const date = current.toISOString().slice(0, 10);
		daily.push({ date, credits_used: aggregated[date] || 0 });
	}

	return daily;
}

// ============================================================================
// Main Component
// ============================================================================

export default function UsageOverview({ usage }: UsageOverviewProps) {
	const dailyData = useMemo(() => aggregateUsageByDate(usage), [usage]);

	const totalCredits = usage.usage.reduce(
		(sum, item) => sum + item.credits_used,
		0
	);
	const totalMessages = usage.usage.length;
	const uniqueReports = new Set(
		usage.usage.map((item) => item.report_name).filter(Boolean)
	).size;

	return (
		<Box mb={8}>
			{/* Header */}
			<Box mb={8} textAlign="left">
				<Heading size="lg" mb={2} color="#4338ca">
					Overview
				</Heading>
				<Text color="gray.500">
					Track your AI credit consumption and activity metrics.
				</Text>
			</Box>

			{/* Summary Cards */}
			<Box mb={8}>
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

			{/* Usage Chart */}
			<Box
				p={6}
				borderRadius="xl"
				borderWidth="1px"
				borderColor="blue.100"
				bg="white"
				boxShadow="sm"
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
						bg="#1f2937"
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
							margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
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
												position="relative"
												zIndex={100}
											>
												<Text
													fontSize="xs"
													color="gray.500"
													mb={1}
												>
													{typeof label === "string"
														? formatDate(label)
														: ""}
												</Text>
												<Text
													fontWeight="bold"
													fontSize="lg"
													color="#111827"
												>
													{typeof payload[0].value ===
													"number"
														? payload[0].value.toFixed(
																2
														  )
														: payload[0].value}{" "}
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
