/**
 * Cypress custom commands.
 */

// Mock data for usage API
const mockUsageData = {
  usage: [
    {
      message_id: 1000,
      timestamp: '2024-04-29T02:08:29.375Z',
      report_name: 'Tenant Obligations Report',
      credits_used: 79.0,
    },
    {
      message_id: 1001,
      timestamp: '2024-04-29T03:25:03.613Z',
      credits_used: 5.2,
    },
    {
      message_id: 1002,
      timestamp: '2024-04-30T10:00:00.000Z',
      report_name: 'Short Lease Report',
      credits_used: 61.0,
    },
    {
      message_id: 1003,
      timestamp: '2024-05-01T14:30:00.000Z',
      report_name: 'Maintenance Responsibilities Report',
      credits_used: 45.0,
    },
    {
      message_id: 1004,
      timestamp: '2024-05-01T16:45:00.000Z',
      credits_used: 10.5,
    },
  ],
};

Cypress.Commands.add('mockUsageApi', () => {
  cy.intercept('GET', '**/usage', {
    statusCode: 200,
    body: mockUsageData,
    headers: {
      'Content-Type': 'application/json',
    },
  }).as('getUsage');
});
