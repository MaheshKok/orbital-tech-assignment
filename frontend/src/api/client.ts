/**
 * API client configuration.
 * Uses axios for HTTP requests with base configuration.
 *
 * In development: Vite proxy handles /usage -> localhost:8000
 * In production (Docker): Nginx proxy handles /usage -> backend:8000
 * For direct API access: Set VITE_API_URL environment variable
 */

import axios from "axios";
import { apiConfig, isDev } from "../config/env";
import { logError } from "../utils/logger";

export const apiClient = axios.create({
	baseURL: apiConfig.baseUrl,
	headers: {
		"Content-Type": "application/json",
	},
	timeout: apiConfig.timeout,
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		// Only log in development - production should use observability
		if (isDev) {
			logError("API Error:", error);
		}
		return Promise.reject(error);
	}
);
