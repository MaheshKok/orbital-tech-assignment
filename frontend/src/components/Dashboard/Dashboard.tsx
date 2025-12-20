/**
 * Dashboard Component.
 * Main container for the credit usage dashboard.
 */

import { useMemo } from "react";
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
		return (
			<div className="min-h-screen flex items-center justify-center">
				<LoadingSpinner size="lg" message="Loading usage data..." />
			</div>
		);
	}

	if (isError) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<ErrorMessage
					title="Failed to load usage data"
					message={
						error?.message || "An unexpected error occurred. Please try again."
					}
					onRetry={refetch}
				/>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
			{/* Header */}
			<header className="bg-white shadow-sm border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-2xl font-bold text-gray-900">
								Credit Usage Dashboard
							</h1>
							<p className="mt-1 text-sm text-gray-500">
								Orbital Copilot - Current Billing Period
							</p>
						</div>
						<div className="flex items-center space-x-2">
							<div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
								<svg
									className="w-6 h-6 text-white"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
									/>
								</svg>
							</div>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					<div className="card p-6">
						<div className="flex items-center">
							<div className="flex-shrink-0 p-3 rounded-lg bg-blue-100">
								<svg
									className="h-6 w-6 text-blue-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-500">
									Total Credits
								</p>
								<p className="text-2xl font-bold text-gray-900">
									{stats.total.toFixed(2)}
								</p>
							</div>
						</div>
					</div>

					<div className="card p-6">
						<div className="flex items-center">
							<div className="flex-shrink-0 p-3 rounded-lg bg-green-100">
								<svg
									className="h-6 w-6 text-green-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
									/>
								</svg>
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-500">
									Total Messages
								</p>
								<p className="text-2xl font-bold text-gray-900">
									{stats.count}
								</p>
							</div>
						</div>
					</div>

					<div className="card p-6">
						<div className="flex items-center">
							<div className="flex-shrink-0 p-3 rounded-lg bg-purple-100">
								<svg
									className="h-6 w-6 text-purple-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									/>
								</svg>
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-500">
									Reports Generated
								</p>
								<p className="text-2xl font-bold text-gray-900">
									{stats.reportCount}
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Chart Section */}
				<div className="card p-6 mb-8">
					<div className="flex items-center justify-between mb-6">
						<div>
							<h2 className="text-lg font-semibold text-gray-900">
								Daily Credit Usage
							</h2>
							<p className="text-sm text-gray-500">
								Credits consumed per day in the billing period
							</p>
						</div>
					</div>
					<UsageChart data={chartData} />
				</div>

				{/* Table Section */}
				<div className="card p-6">
					<div className="mb-6">
						<h2 className="text-lg font-semibold text-gray-900">
							Usage Details
						</h2>
						<p className="text-sm text-gray-500">
							Click on column headers to sort. Click three times to reset to
							original order.
						</p>
					</div>
					<UsageTable data={data?.usage || []} />
				</div>
			</main>

			{/* Footer */}
			<footer className="bg-white border-t border-gray-200 mt-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<p className="text-center text-sm text-gray-500">
						Orbital Witness Credit Usage Dashboard
					</p>
				</div>
			</footer>
		</div>
	);
}
