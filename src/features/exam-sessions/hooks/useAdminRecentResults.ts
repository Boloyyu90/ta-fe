/**
 * Hook to fetch recent exam results for admin dashboard
 *
 * Backend: GET /api/v1/admin/results
 *
 * This hook fetches the most recent exam results (completed exams).
 * Results are returned in descending order by submission date (most recent first).
 */

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
    adminSessionsApi,
    AdminSessionsQueryParams,
    AdminSessionsListResponse,
} from '../api/admin-sessions.api';

export interface UseAdminRecentResultsOptions {
    limit?: number;
    enabled?: boolean;
}

export function useAdminRecentResults(options: UseAdminRecentResultsOptions = {}) {
    const { limit = 5, enabled = true } = options;

    const params: AdminSessionsQueryParams = {
        page: 1,
        limit,
        // Results endpoint returns completed exams sorted by submission date (desc)
    };

    return useQuery<AdminSessionsListResponse, Error>({
        queryKey: ['admin-recent-results', { limit }],
        queryFn: () => adminSessionsApi.getAdminResults(params),
        enabled,
        staleTime: 60 * 1000, // 1 minute
        placeholderData: keepPreviousData,
    });
}

export default useAdminRecentResults;
