/**
 * E2E tests for the Dashboard page.
 */

describe("Dashboard Page", () => {
	beforeEach(() => {
		cy.mockUsageApi();
		cy.visit("/");
		cy.wait("@getUsage");
	});

	describe("Page Structure", () => {
		it("should display the dashboard header", () => {
			cy.get("header").contains("Orbital Copilot").should("be.visible");
			cy.get("header").contains("Usage Dashboard").should("be.visible");
		});

		it("should display stats cards", () => {
			cy.contains("Total Credits Used").should("be.visible");
			cy.contains("Messages Processed").should("be.visible");
			cy.contains("Reports Generated").should("be.visible");
		});

		it("should display the chart section", () => {
			cy.contains("Daily Usage Trends").should("be.visible");
		});

		it("should display the table section", () => {
			cy.contains("Detailed Activity Log")
				.scrollIntoView()
				.should("be.visible");
			cy.contains("th", "Message ID").scrollIntoView().should("be.visible");
			cy.contains("th", "Timestamp").should("be.visible");
			cy.contains("th", "Report Name").should("be.visible");
			cy.contains("th", "Credits Used").should("be.visible");
		});
	});

	describe("Stats Cards", () => {
		it("should show correct total credits", () => {
			// 79 + 5.2 + 61 + 45 + 10.5 = 200.7
			cy.contains("200.70").should("be.visible");
		});

		it("should show correct message count", () => {
			cy.contains("5").should("be.visible");
		});

		it("should show correct report count", () => {
			cy.contains("3").should("be.visible");
		});
	});

	describe("Usage Table", () => {
		it("should display all messages", () => {
			cy.contains("1000").should("be.visible");
			cy.contains("1001").should("be.visible");
			cy.contains("1002").should("be.visible");
			cy.contains("1003").should("be.visible");
			cy.contains("1004").should("be.visible");
		});

		it("should display formatted timestamps", () => {
			cy.contains("29-04-2024 02:08").should("be.visible");
			cy.contains("30-04-2024 10:00").should("be.visible");
		});

		it("should display report names with badges", () => {
			cy.contains("Tenant Obligations Report").should("be.visible");
			cy.contains("Short Lease Report").should("be.visible");
			cy.contains("Maintenance Responsibilities Report").should("be.visible");
		});

		it("should display credits with 2 decimal places", () => {
			cy.contains("79.00").should("be.visible");
			cy.contains("5.20").should("be.visible");
			cy.contains("61.00").should("be.visible");
		});
	});
});

describe("Table Sorting", () => {
	beforeEach(() => {
		cy.mockUsageApi();
		cy.visit("/");
		cy.wait("@getUsage");
	});

	describe("Credits Column Sorting", () => {
		it("should sort by credits ascending on first click", () => {
			cy.contains("th", "Credits Used").find("button").click();

			// URL should be updated (URL-encoded colon is %3A)
			cy.url().should("include", "sort=credits_used%3Aasc");

			// First row should have lowest credits (5.20)
			cy.get("tbody tr").first().should("contain", "5.20");
		});

		it("should sort by credits descending on second click", () => {
			cy.contains("th", "Credits Used").find("button").click();
			cy.contains("th", "Credits Used").find("button").click();

			cy.url().should("include", "sort=credits_used%3Adesc");

			// First row should have highest credits (79.00)
			cy.get("tbody tr").first().should("contain", "79.00");
		});

		it("should return to original order on third click", () => {
			cy.contains("th", "Credits Used").find("button").click();
			cy.contains("th", "Credits Used").find("button").click();
			cy.contains("th", "Credits Used").find("button").click();

			// URL should not have sort param
			cy.url().should("not.include", "sort=");
		});
	});

	describe("Report Name Column Sorting", () => {
		it("should sort by report name ascending with empty names at end", () => {
			cy.contains("th", "Report Name").find("button").click();

			cy.url().should("include", "sort=report_name%3Aasc");

			// First row should have alphabetically first report
			cy.get("tbody tr").first().should("contain", "Maintenance");
		});

		it("should sort by report name descending with empty names at end", () => {
			cy.contains("th", "Report Name").find("button").click();
			cy.contains("th", "Report Name").find("button").click();

			cy.url().should("include", "sort=report_name%3Adesc");

			// First row should have alphabetically last report
			cy.get("tbody tr").first().should("contain", "Tenant");
		});
	});

	describe("Multi-Column Sorting", () => {
		it("should support sorting by multiple columns", () => {
			cy.contains("th", "Credits Used").find("button").click();
			cy.contains("th", "Report Name").find("button").click();

			// URL-encoded: colon is %3A, comma is %2C
			cy.url().should("include", "sort=credits_used%3Aasc%2Creport_name%3Aasc");
		});
	});
});

describe("URL State", () => {
	beforeEach(() => {
		cy.mockUsageApi();
	});

	it("should restore sort state from URL", () => {
		cy.visit("/?sort=credits_used:desc");
		cy.wait("@getUsage");

		// First row should have highest credits
		cy.get("tbody tr").first().should("contain", "79.00");
	});

	it("should restore multi-column sort from URL", () => {
		cy.visit("/?sort=report_name:asc,credits_used:desc");
		cy.wait("@getUsage");

		// Should be sorted by report name first
		cy.get("tbody tr").first().should("contain", "Maintenance");
	});
});

describe("Loading State", () => {
	it("should show loading spinner while fetching data", () => {
		cy.intercept("GET", "**/usage", (req) => {
			req.on("response", (res) => {
				res.setDelay(2000);
			});
		}).as("slowUsage");

		cy.visit("/");
		cy.contains("Loading usage data...").should("be.visible");
	});
});

describe("Error State", () => {
	it("should show error message when API fails", () => {
		cy.intercept("GET", "**/usage", {
			statusCode: 500,
			body: { error: "Internal Server Error" },
		}).as("failedUsage");

		cy.visit("/");
		cy.wait("@failedUsage");

		cy.contains("Failed to load usage data").should("be.visible");
		cy.contains("Try Again").should("be.visible");
	});

	it("should retry when clicking Try Again", () => {
		// First intercept: always fail to ensure error state is shown
		cy.intercept("GET", "**/usage", {
			statusCode: 500,
			body: { error: "Server Error" },
		}).as("failedUsage");

		cy.visit("/");
		cy.wait("@failedUsage");

		// Wait for error message to appear
		cy.contains("Failed to load usage data").should("be.visible");
		cy.contains("button", "Try Again").should("be.visible");

		// Now change intercept to succeed on retry
		cy.intercept("GET", "**/usage", {
			statusCode: 200,
			body: {
				usage: [
					{
						message_id: 1,
						timestamp: "2024-04-29T02:00:00Z",
						credits_used: 10,
					},
				],
			},
		}).as("successUsage");

		cy.contains("button", "Try Again").click();
		cy.wait("@successUsage");

		cy.get("header").contains("Orbital Copilot").should("be.visible");
	});
});
