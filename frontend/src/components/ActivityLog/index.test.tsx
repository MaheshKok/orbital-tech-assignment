import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../../test/setup";
import ActivityLog from "./index";
import type { IUsageResponse } from "../../hooks/useUsage";

// Mock Chakra UI Table components for testing
vi.mock("@chakra-ui/react/table", () => ({
	Table: {
		Root: ({
			children,
			...props
		}: React.HTMLAttributes<HTMLTableElement>) => (
			<table {...props}>{children}</table>
		),
		Header: ({
			children,
			...props
		}: React.HTMLAttributes<HTMLTableSectionElement>) => (
			<thead {...props}>{children}</thead>
		),
		Body: ({
			children,
			...props
		}: React.HTMLAttributes<HTMLTableSectionElement>) => (
			<tbody {...props}>{children}</tbody>
		),
		Row: ({
			children,
			...props
		}: React.HTMLAttributes<HTMLTableRowElement>) => (
			<tr {...props}>{children}</tr>
		),
		ColumnHeader: ({
			children,
			...props
		}: React.HTMLAttributes<HTMLTableCellElement>) => (
			<th {...props}>{children}</th>
		),
		Cell: ({
			children,
			...props
		}: React.HTMLAttributes<HTMLTableCellElement>) => (
			<td {...props}>{children}</td>
		),
	},
}));

const mockUsageData: IUsageResponse = {
	usage: [
		{
			message_id: 1001,
			timestamp: "2024-04-29T10:30:00Z",
			report_name: "Tenant Obligations Report",
			credits_used: 79.0,
		},
		{
			message_id: 1002,
			timestamp: "2024-04-30T14:15:00Z",
			report_name: "Landlord Responsibilities Report",
			credits_used: 44.0,
		},
		{
			message_id: 1003,
			timestamp: "2024-05-01T09:00:00Z",
			credits_used: 25.5,
		},
	],
};

const emptyUsageData: IUsageResponse = {
	usage: [],
};

describe("ActivityLog", () => {
	it("renders the Detailed Activity Log heading", () => {
		render(<ActivityLog usage={mockUsageData} />);
		expect(screen.getByText("Detailed Activity Log")).toBeInTheDocument();
	});

	it("renders table headers", () => {
		render(<ActivityLog usage={mockUsageData} />);
		expect(screen.getByText("MESSAGE ID")).toBeInTheDocument();
		expect(screen.getByText("TIMESTAMP")).toBeInTheDocument();
	});

	it("renders sortable column headers", () => {
		render(<ActivityLog usage={mockUsageData} />);
		expect(screen.getByText("REPORT NAME")).toBeInTheDocument();
		expect(screen.getByText("CREDITS USED")).toBeInTheDocument();
	});

	it("renders message IDs with hash prefix", () => {
		render(<ActivityLog usage={mockUsageData} />);
		expect(screen.getByText("#1001")).toBeInTheDocument();
		expect(screen.getByText("#1002")).toBeInTheDocument();
		expect(screen.getByText("#1003")).toBeInTheDocument();
	});

	it("renders report names as badges", () => {
		render(<ActivityLog usage={mockUsageData} />);
		expect(
			screen.getByText("Tenant Obligations Report")
		).toBeInTheDocument();
		expect(
			screen.getByText("Landlord Responsibilities Report")
		).toBeInTheDocument();
	});

	it("renders N/A for missing report names", () => {
		render(<ActivityLog usage={mockUsageData} />);
		expect(screen.getByText("N/A")).toBeInTheDocument();
	});

	it("renders credits with 2 decimal places", () => {
		render(<ActivityLog usage={mockUsageData} />);
		expect(screen.getByText(/79\.00/)).toBeInTheDocument();
		expect(screen.getByText(/44\.00/)).toBeInTheDocument();
		expect(screen.getByText(/25\.50/)).toBeInTheDocument();
	});

	it("shows empty state when no data", () => {
		render(<ActivityLog usage={emptyUsageData} />);
		expect(screen.getByText("No usage data available")).toBeInTheDocument();
	});

	it("renders correct number of data rows", () => {
		render(<ActivityLog usage={mockUsageData} />);
		// 3 data rows + 1 header row
		const rows = screen.getAllByRole("row");
		expect(rows).toHaveLength(4);
	});
});
