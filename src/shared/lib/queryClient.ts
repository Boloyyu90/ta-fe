/**
 * REACT QUERY CLIENT CONFIGURATION
 *
 * Centralized React Query configuration with smart retry logic
 *
 * Features:
 * - Never retry 429 (rate limit) - would just hit rate limit again
 * - Never retry 401/403 (auth errors) - auth interceptor handles this
 * - Never retry 404 (not found) - resource doesn't exist
 * - Retry network/server errors (5xx) up to 2 times for queries
 */

import { QueryClient } from "@tanstack/react-query";
import type { ApiError } from '@/shared/types/api.types';

/**
 * Smart retry function for queries
 * Returns false for errors that won't benefit from retry
 */
const shouldRetryQuery = (failureCount: number, error: unknown): boolean => {
    const apiError = error as ApiError;
    const status = apiError?.status;

    // Never retry these status codes
    if (status === 429 || status === 401 || status === 403 || status === 404) {
        return false;
    }

    // Retry network errors and server errors (5xx) up to 2 times
    return failureCount < 2;
};

/**
 * Smart retry function for mutations
 * More conservative - only retry once for network/server errors
 */
const shouldRetryMutation = (failureCount: number, error: unknown): boolean => {
    const apiError = error as ApiError;
    const status = apiError?.status;

    // Never retry these status codes
    if (status === 429 || status === 401 || status === 403 || status === 404) {
        return false;
    }

    // Retry network errors and server errors once
    return failureCount < 1;
};

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: shouldRetryQuery,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
            refetchOnWindowFocus: false,
        },
        mutations: {
            retry: shouldRetryMutation,
            retryDelay: 500,
        },
    },
});