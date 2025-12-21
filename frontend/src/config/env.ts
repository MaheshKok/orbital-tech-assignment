/**
 * Environment Configuration.
 * Zod-validated environment variables with type safety.
 *
 * Safe for Jest/Node/SSR contexts where import.meta.env may not exist.
 */

import { z } from "zod";

/**
 * Environment schema with validation and defaults.
 */
const envSchema = z.object({
	// API Configuration
	VITE_API_URL: z.string().default(""),

	// Runtime flags
	DEV: z.boolean().default(false),
	PROD: z.boolean().default(true),
	MODE: z.string().default("production"), // Allows custom modes like "staging"
});

/**
 * Safely access import.meta.env with fallbacks for non-Vite contexts.
 * This handles Jest, Node.js, and SSR environments.
 */
function getImportMetaEnv(): Record<string, unknown> {
	// Check if we're in a Vite context
	if (typeof import.meta !== "undefined" && import.meta.env) {
		return import.meta.env as Record<string, unknown>;
	}

	// Fallback for Jest/Node/SSR - use process.env if available
	const globalProcess = (globalThis as Record<string, unknown>).process as
		| {
				env?: Record<string, string | undefined>;
		  }
		| undefined;
	if (globalProcess?.env) {
		const nodeEnv = globalProcess.env.NODE_ENV;
		return {
			VITE_API_URL: globalProcess.env.VITE_API_URL ?? "",
			DEV: nodeEnv === "development",
			PROD: nodeEnv === "production",
			MODE: nodeEnv ?? "test",
		};
	}

	// Ultimate fallback - safe defaults
	return {
		VITE_API_URL: "",
		DEV: false,
		PROD: false,
		MODE: "test",
	};
}

/**
 * Parse and validate environment variables.
 */
function parseEnv() {
	const metaEnv = getImportMetaEnv();

	const rawEnv = {
		VITE_API_URL: metaEnv.VITE_API_URL ?? "",
		DEV: metaEnv.DEV ?? false,
		PROD: metaEnv.PROD ?? true,
		MODE: metaEnv.MODE ?? "production",
	};

	const result = envSchema.safeParse(rawEnv);

	if (!result.success) {
		// In test environment, just use defaults
		if (rawEnv.MODE === "test") {
			return envSchema.parse({});
		}
		console.error("Invalid environment configuration:", result.error.format());
		throw new Error("Invalid environment configuration");
	}

	return result.data;
}

/**
 * Validated environment configuration.
 */
export const env = parseEnv();

/**
 * API Configuration derived from environment.
 */
export const apiConfig = {
	baseUrl: env.VITE_API_URL,
	timeout: 30000,
	retryCount: 3,
	staleTime: 5 * 60 * 1000, // 5 minutes
	cacheTime: 30 * 60 * 1000, // 30 minutes
} as const;

/**
 * Check if running in development mode.
 */
export const isDev = env.DEV;

/**
 * Check if running in production mode.
 */
export const isProd = env.PROD;
