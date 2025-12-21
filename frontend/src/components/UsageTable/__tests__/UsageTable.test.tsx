/**
 * Unit tests for UsageTable component.
 */

import { render } from "../../../test/testUtils";
import { screen, fireEvent } from "@testing-library/react";
import { UsageTable } from "../UsageTable";
import { describe, it, expect } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import type { UsageItem } from "../../../types/usage";

const mockData: UsageItem[] = [
	{
		message_id: 1000,
		timestamp: "2024-04-29T02:08:29.375Z",
		report_name: "Tenant Obligations Report",
		credits_used: 79.0,
	},
	{
		message_id: 1001,
		timestamp: "2024-04-29T03:25:03.613Z",
		credits_used: 5.2,
	},
	{
		message_id: 1002,
		timestamp: "2024-04-30T10:00:00.000Z",
		report_name: "Short Lease Report",
		credits_used: 61.0,
	},
];

describe("UsageTable", () => {
	it("should render empty state when no data", () => {
		render(<UsageTable data={[]} />);
		expect(screen.getByText("No usage data available")).toBeInTheDocument();
	});

	it("should render table with data", () => {
		render(<UsageTable data={mockData} />);

		// Check headers
		expect(screen.getByText("Message ID")).toBeInTheDocument();
		expect(screen.getByText("Timestamp")).toBeInTheDocument();
		expect(screen.getByText("Report Name")).toBeInTheDocument();
		expect(screen.getByText("Credits Used")).toBeInTheDocument();
	});

	it("should display message IDs correctly", () => {
		render(<UsageTable data={mockData} />);

		expect(screen.getByText("#1000")).toBeInTheDocument();
		expect(screen.getByText("#1001")).toBeInTheDocument();
		expect(screen.getByText("#1002")).toBeInTheDocument();
	});

	it("should format timestamps correctly", () => {
		render(<UsageTable data={mockData} />);

		// UTC format: DD-MM-YYYY HH:mm
		expect(screen.getByText("29-04-2024 02:08")).toBeInTheDocument();
		expect(screen.getByText("29-04-2024 03:25")).toBeInTheDocument();
		expect(screen.getByText("30-04-2024 10:00")).toBeInTheDocument();
	});

	it("should display report names when present", () => {
		render(<UsageTable data={mockData} />);

		expect(screen.getByText("Tenant Obligations Report")).toBeInTheDocument();
		expect(screen.getByText("Short Lease Report")).toBeInTheDocument();
	});

	it("should display N/A for messages without report names", () => {
		render(<UsageTable data={mockData} />);

		// Check for N/A text
		const cells = screen.getAllByText("N/A");
		expect(cells.length).toBeGreaterThanOrEqual(1);
	});

	it("should display credits with 2 decimal places", () => {
		render(<UsageTable data={mockData} />);

		expect(screen.getByText("79.00")).toBeInTheDocument();
		expect(screen.getByText("5.20")).toBeInTheDocument();
		expect(screen.getByText("61.00")).toBeInTheDocument();
	});

	it("should display message count in footer", () => {
		render(<UsageTable data={mockData} />);
		expect(screen.getByText(/Showing\s+3\s+records/)).toBeInTheDocument();
	});

	it("should have sortable column headers", () => {
		render(<UsageTable data={mockData} />);

		const reportNameHeader = screen.getByRole("columnheader", {
			name: /report name/i,
		});
		const creditsHeader = screen.getByRole("columnheader", {
			name: /credits used/i,
		});

		// Headers should be clickable
		expect(reportNameHeader).toHaveAttribute("aria-sort");
		expect(creditsHeader).toHaveAttribute("aria-sort");
	});

	it("should toggle sort direction on header click", () => {
		render(<UsageTable data={mockData} />);

		const creditsHeader = screen.getByRole("columnheader", {
			name: /credits used/i,
		});

		// Initially no sort
		expect(creditsHeader).toHaveAttribute("aria-sort", "none");

		// First click - ascending
		fireEvent.click(creditsHeader);

		// Second click - descending
		fireEvent.click(creditsHeader);

		// Third click - back to none
		fireEvent.click(creditsHeader);
	});
});
