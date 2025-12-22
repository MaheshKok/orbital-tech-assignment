/**
 * Usage API hooks using TanStack Query.
 * Provides data fetching with caching, loading states, and error handling.
 */

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { apiClient } from "./client";
import { UsageResponseSchema } from "../schemas/usage";
import { apiConfig } from "../config/env";
import type { UsageResponse } from "../types/usage";

/** Query key for usage data */
export const USAGE_QUERY_KEY = ["usage"] as const;
export type UsageQueryKey = typeof USAGE_QUERY_KEY;
export type UsageQueryData = UsageResponse;

/**
 * Fetch usage data from the backend API.
 * Validates response using Zod schema.
 */
async function fetchUsageData(): Promise<UsageQueryData> {
	const response = await apiClient.get<unknown>("/usage");
	// Validate response data with Zod
	return UsageResponseSchema.parse(response.data);
}

/**
 * Custom hook for fetching usage data.
 * Uses TanStack Query for caching and automatic refetching.
 * Note: retry is configured globally in QueryClient, not per-query.
 */
export function useUsageData(): UseQueryResult<UsageQueryData> {
	return useQuery({
		queryKey: USAGE_QUERY_KEY,
		queryFn: fetchUsageData,
		staleTime: apiConfig.staleTime,
		gcTime: apiConfig.cacheTime,
	});
}
