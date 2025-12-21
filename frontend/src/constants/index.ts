/**
 * Application Constants.
 * Centralizes magic strings and configuration values.
 */

// API Configuration
export const API_CONFIG = {
	TIMEOUT: 30000,
	RETRY_COUNT: 3,
	STALE_TIME: 5 * 60 * 1000, // 5 minutes
	CACHE_TIME: 30 * 60 * 1000, // 30 minutes
} as const;

// Query Keys
export const QUERY_KEYS = {
	USAGE: ["usage"] as const,
} as const;

// UI Text
export const UI_TEXT = {
	APP_NAME: "Orbital Copilot",
	DASHBOARD_TITLE: "Usage Dashboard",
	LOADING: "Loading...",
	ERROR_TITLE: "Something went wrong",
	ERROR_RETRY: "Retry",
	NO_DATA: "N/A",
	CREDITS_UNIT: "Credits",
} as const;

// Table Configuration
export const TABLE_CONFIG = {
	DEFAULT_SORT_COLUMN: "credits_used" as const,
	DEFAULT_SORT_DIRECTION: "desc" as const,
} as const;

// Chart Configuration
export const CHART_CONFIG = {
	HEIGHT: 300,
	COLORS: {
		PRIMARY: "#6366F1",
		GRID: "#E2E8F0",
		TEXT: "#718096",
	},
	MARGINS: {
		TOP: 20,
		RIGHT: 30,
		LEFT: 20,
		BOTTOM: 5,
	},
} as const;

// Date Formats
export const DATE_FORMATS = {
	DISPLAY: "DD-MM-YYYY",
	CHART_LABEL: "DD-MM",
	ISO: "YYYY-MM-DDTHH:mm:ss",
} as const;

// Credits Configuration
export const CREDITS_CONFIG = {
	DECIMAL_PLACES: 2,
	MIN_CREDITS: 1.0,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
	NETWORK_ERROR:
		"Unable to connect to the server. Please check your internet connection.",
	TIMEOUT_ERROR: "The request timed out. Please try again.",
	SERVER_ERROR: "The server encountered an error. Please try again later.",
	VALIDATION_ERROR: "The data received from the server is invalid.",
	UNKNOWN_ERROR: "An unexpected error occurred. Please try again.",
} as const;
