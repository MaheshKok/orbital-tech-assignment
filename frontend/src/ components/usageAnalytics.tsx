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
	Legend,
} from "recharts";
import { Box, Heading, Text } from "@chakra-ui/react";


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

	// Format date for display (e.g., "Jan 12" instead of "2026-01-12")
	const formatDate = (dateStr: string) => {
		const date = new Date(dateStr);
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
		});
	};

	return (
		<Box
			p={6}
			borderRadius="lg"
			border="1px solid"
			borderColor="gray.700"
			bg="gray.900"
			mb={6}
		>
			<Heading size="lg" mb={2} color="white">
				📊 Usage Analytics
			</Heading>
			<Text color="gray.400" mb={6}>
				Credits used per day
            </Text>
            
            {/* Summary Stats */}
			<Box
				display="flex"
				gap={6}
				mt={6}
				flexWrap="wrap"
				justifyContent="center"
			>
				<Box textAlign="center" p={4} bg="gray.800" borderRadius="md">
					<Text color="gray.400" fontSize="sm">
						Total Credits
					</Text>
					<Text color="purple.400" fontSize="2xl" fontWeight="bold">
						{dailyData.reduce((sum, d) => sum + d.credits_used, 0)}
					</Text>
				</Box>
				<Box textAlign="center" p={4} bg="gray.800" borderRadius="md">
					<Text color="gray.400" fontSize="sm">
						Days Tracked
					</Text>
					<Text color="blue.400" fontSize="2xl" fontWeight="bold">
						{dailyData.length}
					</Text>
				</Box>
				<Box textAlign="center" p={4} bg="gray.800" borderRadius="md">
					<Text color="gray.400" fontSize="sm">
						Avg Credits/Day
					</Text>
					<Text color="green.400" fontSize="2xl" fontWeight="bold">
						{dailyData.length > 0
							? Math.round(
									dailyData.reduce(
										(sum, d) => sum + d.credits_used,
										0
									) / dailyData.length
								)
							: 0}
					</Text>
				</Box>
			</Box>

			{dailyData.length === 0 ? (
				<Text color="gray.500" textAlign="center" py={10}>
					No usage data available
				</Text>
			) : (
				<Box height="400px" width="100%">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart
							data={dailyData}
							margin={{
								top: 20,
								right: 30,
								left: 20,
								bottom: 60,
							}}
						>
							<CartesianGrid
								strokeDasharray="3 3"
								stroke="#374151"
							/>
							<XAxis
								dataKey="date"
								tickFormatter={formatDate}
								stroke="#9CA3AF"
								angle={-45}
								textAnchor="end"
								height={60}
								tick={{ fill: "#9CA3AF", fontSize: 12 }}
							/>
							<YAxis
								stroke="#9CA3AF"
								tick={{ fill: "#9CA3AF", fontSize: 12 }}
								label={{
									value: "Credits Used",
									angle: -90,
									position: "insideLeft",
									fill: "#9CA3AF",
								}}
							/>
							<Tooltip
								contentStyle={{
									backgroundColor: "#1F2937",
									border: "1px solid #374151",
									borderRadius: "8px",
									color: "#F9FAFB",
								}}
								labelFormatter={formatDate}
								formatter={(value: number) => [
									`${value} credits`,
									"Usage",
								]}
							/>
							<Legend
								wrapperStyle={{ color: "#9CA3AF" }}
								formatter={() => "Credits Used"}
							/>
							<Bar
								dataKey="credits_used"
								fill="#8B5CF6"
								radius={[4, 4, 0, 0]}
								name="Credits"
							/>
						</BarChart>
					</ResponsiveContainer>
				</Box>
			)}

			
		</Box>
	);
}