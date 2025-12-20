/**
 * Usage Chart Component.
 * Displays credit usage as a bar chart over time.
 */

import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { Box, Text, Flex } from "@chakra-ui/react";
import type { ChartDataPoint } from "../../types/usage";

interface UsageChartProps {
	data: ChartDataPoint[];
}

interface CustomTooltipProps {
	active?: boolean;
	payload?: Array<{ payload: ChartDataPoint }>;
}

/**
 * Custom tooltip for the chart.
 */
function CustomTooltip({ active, payload }: CustomTooltipProps) {
	const bg = "white";
	const borderColor = "gray.200";

	if (active && payload && payload.length) {
		const data = payload[0].payload;
		return (
			<Box
				bg={bg}
				borderRadius="xl"
				boxShadow="xl"
				borderWidth="1px"
				borderColor={borderColor}
				p={4}
				minW="180px"
			>
				<Text
					fontSize="xs"
					fontWeight="semibold"
					color="gray.400"
					mb={1}
					textTransform="uppercase"
					letterSpacing="wide"
				>
					{data.fullDate}
				</Text>
				<Flex align="baseline" gap={1}>
					<Text
						fontSize="2xl"
						fontWeight="bold"
						color="gray.900"
						lineHeight="1"
					>
						{data.credits.toFixed(2)}
					</Text>
					<Text fontSize="xs" color="gray.500" fontWeight="medium">
						credits
					</Text>
				</Flex>
			</Box>
		);
	}
	return null;
}

export function UsageChart({ data }: UsageChartProps) {
	if (data.length === 0) {
		return (
			<Box
				h="256px"
				display="flex"
				alignItems="center"
				justifyContent="center"
				color="gray.500"
				bg="gray.50"
				rounded="xl"
				borderWidth="1px"
				borderColor="gray.200"
				borderStyle="dashed"
			>
				No usage data available
			</Box>
		);
	}

	return (
		<Box h="100%" w="full">
			<ResponsiveContainer width="100%" height="100%">
				<BarChart
					data={data}
					margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
					barSize={40}
				>
					<defs>
						<linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stopColor="#6366F1" stopOpacity={1} />
							<stop offset="100%" stopColor="#818CF8" stopOpacity={0.8} />
						</linearGradient>
					</defs>
					<CartesianGrid
						strokeDasharray="3 3"
						vertical={false}
						stroke="#E2E8F0"
					/>
					<XAxis
						dataKey="date"
						tick={{ fill: "#64748B", fontSize: 11, fontWeight: 500 }}
						tickLine={false}
						axisLine={{ stroke: "#E2E8F0" }}
						dy={10}
					/>
					<YAxis
						tick={{ fill: "#64748B", fontSize: 11, fontWeight: 500 }}
						tickLine={false}
						axisLine={false}
						tickFormatter={(value) => `${value}`}
						dx={-10}
					/>
					<Tooltip
						content={<CustomTooltip />}
						cursor={{ fill: "#F1F5F9", opacity: 0.6 }}
					/>
					<Bar
						dataKey="credits"
						fill="url(#barGradient)"
						radius={[6, 6, 0, 0]}
						animationDuration={1500}
					/>
				</BarChart>
			</ResponsiveContainer>
		</Box>
	);
}
