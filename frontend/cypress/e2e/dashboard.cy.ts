/**
 * E2E tests for the Dashboard page.
 */

describe('Dashboard Page', () => {
  beforeEach(() => {
    cy.mockUsageApi();
    cy.visit('/');
    cy.wait('@getUsage');
  });

  describe('Page Structure', () => {
    it('should display the dashboard header', () => {
      cy.contains('Credit Usage Dashboard').should('be.visible');
      cy.contains('Orbital Copilot - Current Billing Period').should('be.visible');
    });

    it('should display stats cards', () => {
      cy.contains('Total Credits').should('be.visible');
      cy.contains('Total Messages').should('be.visible');
      cy.contains('Reports Generated').should('be.visible');
    });

    it('should display the chart section', () => {
      cy.contains('Daily Credit Usage').should('be.visible');
    });

    it('should display the table section', () => {
      cy.contains('Usage Details').should('be.visible');
      cy.contains('Message ID').should('be.visible');
      cy.contains('Timestamp').should('be.visible');
      cy.contains('Report Name').should('be.visible');
      cy.contains('Credits Used').should('be.visible');
    });
  });

  describe('Stats Cards', () => {
    it('should show correct total credits', () => {
      // 79 + 5.2 + 61 + 45 + 10.5 = 200.7
      cy.contains('200.70').should('be.visible');
    });

    it('should show correct message count', () => {
      cy.contains('5').should('be.visible');
    });

    it('should show correct report count', () => {
      cy.contains('3').should('be.visible');
    });
  });

  describe('Usage Table', () => {
    it('should display all messages', () => {
      cy.contains('1000').should('be.visible');
      cy.contains('1001').should('be.visible');
      cy.contains('1002').should('be.visible');
      cy.contains('1003').should('be.visible');
      cy.contains('1004').should('be.visible');
    });

    it('should display formatted timestamps', () => {
      cy.contains('29-04-2024 02:08').should('be.visible');
      cy.contains('30-04-2024 10:00').should('be.visible');
    });

    it('should display report names with badges', () => {
      cy.contains('Tenant Obligations Report').should('be.visible');
      cy.contains('Short Lease Report').should('be.visible');
      cy.contains('Maintenance Responsibilities Report').should('be.visible');
    });

    it('should display credits with 2 decimal places', () => {
      cy.contains('79.00').should('be.visible');
      cy.contains('5.20').should('be.visible');
      cy.contains('61.00').should('be.visible');
    });
  });
});

describe('Table Sorting', () => {
  beforeEach(() => {
    cy.mockUsageApi();
    cy.visit('/');
    cy.wait('@getUsage');
  });

  describe('Credits Column Sorting', () => {
    it('should sort by credits ascending on first click', () => {
      cy.contains('th', 'Credits Used').click();

      // URL should be updated
      cy.url().should('include', 'sort=credits_used:asc');

      // First row should have lowest credits (5.20)
      cy.get('tbody tr').first().should('contain', '5.20');
    });

    it('should sort by credits descending on second click', () => {
      cy.contains('th', 'Credits Used').click();
      cy.contains('th', 'Credits Used').click();

      cy.url().should('include', 'sort=credits_used:desc');

      // First row should have highest credits (79.00)
      cy.get('tbody tr').first().should('contain', '79.00');
    });

    it('should return to original order on third click', () => {
      cy.contains('th', 'Credits Used').click();
      cy.contains('th', 'Credits Used').click();
      cy.contains('th', 'Credits Used').click();

      // URL should not have sort param
      cy.url().should('not.include', 'sort=');
    });
  });

  describe('Report Name Column Sorting', () => {
    it('should sort by report name ascending with empty names at end', () => {
      cy.contains('th', 'Report Name').click();

      cy.url().should('include', 'sort=report_name:asc');

      // First row should have alphabetically first report
      cy.get('tbody tr').first().should('contain', 'Maintenance');
    });

    it('should sort by report name descending with empty names at end', () => {
      cy.contains('th', 'Report Name').click();
      cy.contains('th', 'Report Name').click();

      cy.url().should('include', 'sort=report_name:desc');

      // First row should have alphabetically last report
      cy.get('tbody tr').first().should('contain', 'Tenant');
    });
  });

  describe('Multi-Column Sorting', () => {
    it('should support sorting by multiple columns', () => {
      cy.contains('th', 'Credits Used').click();
      cy.contains('th', 'Report Name').click();

      cy.url().should('include', 'sort=credits_used:asc,report_name:asc');
    });
  });
});

describe('URL State', () => {
  beforeEach(() => {
    cy.mockUsageApi();
  });

  it('should restore sort state from URL', () => {
    cy.visit('/?sort=credits_used:desc');
    cy.wait('@getUsage');

    // First row should have highest credits
    cy.get('tbody tr').first().should('contain', '79.00');
  });

  it('should restore multi-column sort from URL', () => {
    cy.visit('/?sort=report_name:asc,credits_used:desc');
    cy.wait('@getUsage');

    // Should be sorted by report name first
    cy.get('tbody tr').first().should('contain', 'Maintenance');
  });
});

describe('Loading State', () => {
  it('should show loading spinner while fetching data', () => {
    cy.intercept('GET', '**/usage', (req) => {
      req.on('response', (res) => {
        res.setDelay(2000);
      });
    }).as('slowUsage');

    cy.visit('/');
    cy.contains('Loading usage data...').should('be.visible');
  });
});

describe('Error State', () => {
  it('should show error message when API fails', () => {
    cy.intercept('GET', '**/usage', {
      statusCode: 500,
      body: { error: 'Internal Server Error' },
    }).as('failedUsage');

    cy.visit('/');
    cy.wait('@failedUsage');

    cy.contains('Failed to load usage data').should('be.visible');
    cy.contains('Try Again').should('be.visible');
  });

  it('should retry when clicking Try Again', () => {
    let requestCount = 0;

    cy.intercept('GET', '**/usage', (req) => {
      requestCount++;
      if (requestCount === 1) {
        req.reply({ statusCode: 500 });
      } else {
        req.reply({
          statusCode: 200,
          body: {
            usage: [
              { message_id: 1, timestamp: '2024-04-29T02:00:00Z', credits_used: 10 },
            ],
          },
        });
      }
    }).as('retryUsage');

    cy.visit('/');
    cy.wait('@retryUsage');

    cy.contains('Try Again').click();
    cy.wait('@retryUsage');

    cy.contains('Credit Usage Dashboard').should('be.visible');
  });
});
