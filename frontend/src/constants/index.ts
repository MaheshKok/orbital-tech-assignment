/**
 * Application Constants.
 * Centralizes magic strings for error messages.
 *
 * Note: API config is in src/config/env.ts (Zod-validated)
 */

// Error Messages used by errorUtils.ts
export const ERROR_MESSAGES = {
	NETWORK_ERROR:
		"Unable to connect to the server. Please check your internet connection.",
	TIMEOUT_ERROR: "The request timed out. Please try again.",
	SERVER_ERROR: "The server encountered an error. Please try again later.",
	VALIDATION_ERROR: "The data received from the server is invalid.",
	UNKNOWN_ERROR: "An unexpected error occurred. Please try again.",
} as const;
