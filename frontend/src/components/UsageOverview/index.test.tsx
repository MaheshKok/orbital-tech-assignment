import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../../test/setup";
import UsageOverview from "./index";
import type { IUsageResponse } from "../../hooks/useUsage";

// Mock recharts to avoid canvas issues in jsdom
vi.mock("recharts", () => ({
	ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="responsive-container">{children}</div>
	),
	BarChart: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="bar-chart">{children}</div>
	),
	Bar: () => <div data-testid="bar" />,
	XAxis: () => <div data-testid="x-axis" />,
	YAxis: () => <div data-testid="y-axis" />,
	CartesianGrid: () => <div data-testid="cartesian-grid" />,
	Tooltip: () => <div data-testid="tooltip" />,
}));

const mockUsageData: IUsageResponse = {
	usage: [
		{
			message_id: 1001,
			timestamp: "2024-04-29T10:00:00Z",
			report_name: "Test Report",
			credits_used: 100.5,
		},
		{
			message_id: 1002,
			timestamp: "2024-04-29T11:00:00Z",
			report_name: "Another Report",
			credits_used: 50.25,
		},
		{
			message_id: 1003,
			timestamp: "2024-04-30T09:00:00Z",
			credits_used: 25,
		},
	],
};

describe("UsageOverview", () => {
	it("renders the Overview heading", () => {
		render(<UsageOverview usage={mockUsageData} />);
		expect(screen.getByText("Overview")).toBeInTheDocument();
	});

	it("renders the description text", () => {
		render(<UsageOverview usage={mockUsageData} />);
		expect(
			screen.getByText(
				"Track your AI credit consumption and activity metrics."
			)
		).toBeInTheDocument();
	});

	it("displays Total Credits Used stat card", () => {
		render(<UsageOverview usage={mockUsageData} />);
		expect(screen.getByText("Total Credits Used")).toBeInTheDocument();
		// Total: 100.5 + 50.25 + 25 = 175.75
		expect(screen.getByText("175.75")).toBeInTheDocument();
	});

	it("displays Messages Processed stat card", () => {
		render(<UsageOverview usage={mockUsageData} />);
		expect(screen.getByText("Messages Processed")).toBeInTheDocument();
		expect(screen.getByText("3")).toBeInTheDocument();
	});

	it("displays Reports Generated stat card", () => {
		render(<UsageOverview usage={mockUsageData} />);
		expect(screen.getByText("Reports Generated")).toBeInTheDocument();
		// Unique reports: "Test Report", "Another Report" = 2
		expect(screen.getByText("2")).toBeInTheDocument();
	});

	it("renders Daily Usage Trends section", () => {
		render(<UsageOverview usage={mockUsageData} />);
		expect(screen.getByText("Daily Usage Trends")).toBeInTheDocument();
		expect(
			screen.getByText("Analysis of credit consumption over time")
		).toBeInTheDocument();
	});

	it("renders the Last 30 Days badge", () => {
		render(<UsageOverview usage={mockUsageData} />);
		expect(screen.getByText("Last 30 Days")).toBeInTheDocument();
	});

	it("renders the chart container", () => {
		render(<UsageOverview usage={mockUsageData} />);
		expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
	});
});
