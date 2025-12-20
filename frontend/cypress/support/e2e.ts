/**
 * Cypress E2E support file.
 * This file runs before every single spec file.
 */

// Import custom commands
import "./commands";

// Prevent TypeScript errors
declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Cypress {
		interface Chainable {
			/**
			 * Intercepts the usage API and returns mock data.
			 */
			mockUsageApi(): Chainable<void>;
		}
	}
}
