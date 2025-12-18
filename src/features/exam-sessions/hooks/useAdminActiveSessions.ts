/**
 * Hook to fetch active (IN_PROGRESS) exam sessions for admin dashboard
 *
 * Backend: GET /api/v1/admin/exam-sessions?status=IN_PROGRESS
 *
 * This is a specialized wrapper around useAdminSessions with:
 * - status filter set to IN_PROGRESS
 * - Auto-refresh every 60 seconds
 * - Shorter stale time (30s) for real-time feel
 */

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
    adminSessionsApi,
    AdminSessionsQueryParams,
    AdminSessionsListResponse,
} from '../api/admin-sessions.api';

export interface UseAdminActiveSessionsOptions {
    limit?: number;
    enabled?: boolean;
}

export function useAdminActiveSessions(options: UseAdminActiveSessionsOptions = {}) {
    const { limit = 5, enabled = true } = options;

    const params: AdminSessionsQueryParams = {
        status: 'IN_PROGRESS',
        page: 1,
        limit,
    };

    return useQuery<AdminSessionsListResponse, Error>({
        queryKey: ['admin-active-sessions', { limit }],
        queryFn: () => adminSessionsApi.getAdminSessions(params),
        enabled,
        staleTime: 30 * 1000, // 30 seconds - active sessions change frequently
        refetchInterval: 60 * 1000, // Auto-refresh every minute
        placeholderData: keepPreviousData,
    });
}

export default useAdminActiveSessions;
