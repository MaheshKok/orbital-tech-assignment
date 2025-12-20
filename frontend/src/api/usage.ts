/**
 * Usage API hooks using TanStack Query.
 * Provides data fetching with caching, loading states, and error handling.
 */

import { useQuery } from '@tanstack/react-query';
import { apiClient } from './client';
import type { UsageResponse } from '../types/usage';

const USAGE_QUERY_KEY = ['usage'] as const;

/**
 * Fetch usage data from the backend API.
 */
async function fetchUsageData(): Promise<UsageResponse> {
  const response = await apiClient.get<UsageResponse>('/usage');
  return response.data;
}

/**
 * Custom hook for fetching usage data.
 * Uses TanStack Query for caching and automatic refetching.
 */
export function useUsageData() {
  return useQuery({
    queryKey: USAGE_QUERY_KEY,
    queryFn: fetchUsageData,
    staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Cache for 30 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
