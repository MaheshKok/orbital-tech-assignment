/**
 * API client configuration.
 * Uses axios for HTTP requests with base configuration.
 *
 * In development: Vite proxy handles /usage -> localhost:8000
 * In production (Docker): Nginx proxy handles /usage -> backend:8000
 * For direct API access: Set VITE_API_URL environment variable
 */

import axios from "axios";

// Use empty string for relative URLs (works with proxies)
// or VITE_API_URL for direct API access
const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export const apiClient = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
	timeout: 30000,
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		console.error("API Error:", error);
		return Promise.reject(error);
	}
);
