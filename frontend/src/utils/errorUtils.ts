/**
 * Error Utilities.
 * Provides user-friendly error message handling.
 */

import { AxiosError } from "axios";
import { ZodError } from "zod";
import { ERROR_MESSAGES } from "../constants";

/**
 * Extracts a user-friendly message from various error types.
 */
export function getUserFriendlyErrorMessage(error: unknown): string {
	// Handle Axios errors
	if (error instanceof AxiosError) {
		if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
			return ERROR_MESSAGES.TIMEOUT_ERROR;
		}

		if (error.code === "ERR_NETWORK" || !error.response) {
			return ERROR_MESSAGES.NETWORK_ERROR;
		}

		const status = error.response?.status;
		if (status && status >= 500) {
			return ERROR_MESSAGES.SERVER_ERROR;
		}

		// Return server message if available
		const serverMessage =
			error.response?.data?.message || error.response?.data?.detail;
		if (typeof serverMessage === "string" && serverMessage.length > 0) {
			return serverMessage;
		}

		return ERROR_MESSAGES.SERVER_ERROR;
	}

	// Handle Zod validation errors
	if (error instanceof ZodError) {
		return ERROR_MESSAGES.VALIDATION_ERROR;
	}

	// Handle standard Error
	if (error instanceof Error) {
		// Don't expose technical error messages to users
		if (error.message.toLowerCase().includes("network")) {
			return ERROR_MESSAGES.NETWORK_ERROR;
		}
		if (error.message.toLowerCase().includes("timeout")) {
			return ERROR_MESSAGES.TIMEOUT_ERROR;
		}
		return ERROR_MESSAGES.UNKNOWN_ERROR;
	}

	return ERROR_MESSAGES.UNKNOWN_ERROR;
}

/**
 * Logs error details for debugging while returning user-friendly message.
 */
export function handleError(error: unknown, context?: string): string {
	const prefix = context ? `[${context}] ` : "";

	// Log full error details in development
	if (import.meta.env.DEV) {
		console.error(`${prefix}Error:`, error);
	}

	return getUserFriendlyErrorMessage(error);
}

/**
 * Type guard to check if a value is an Error.
 */
export function isError(value: unknown): value is Error {
	return value instanceof Error;
}
