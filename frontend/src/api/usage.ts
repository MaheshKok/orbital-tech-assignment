/**
 * Usage API hooks using TanStack Query.
 * Provides data fetching with caching, loading states, and error handling.
 */

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./client";
import { UsageResponseSchema } from "../schemas/usage";
import { API_CONFIG, QUERY_KEYS } from "../constants";
import type { UsageResponse } from "../types/usage";

/**
 * Fetch usage data from the backend API.
 * Validates response using Zod schema.
 */
async function fetchUsageData(): Promise<UsageResponse> {
	const response = await apiClient.get("/usage");
	// Validate response data with Zod
	const validated = UsageResponseSchema.parse(response.data);
	return validated;
}

/**
 * Custom hook for fetching usage data.
 * Uses TanStack Query for caching and automatic refetching.
 */
export function useUsageData() {
	return useQuery({
		queryKey: QUERY_KEYS.USAGE,
		queryFn: fetchUsageData,
		staleTime: API_CONFIG.STALE_TIME,
		gcTime: API_CONFIG.CACHE_TIME,
		retry: API_CONFIG.RETRY_COUNT,
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
	});
}
