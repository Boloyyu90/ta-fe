/**
 * Hook to fetch all exam sessions (admin view)
 *
 * Backend: GET /api/v1/admin/exam-sessions
 * Response: AdminSessionsListResponse = { data: ExamResult[], pagination: PaginationMeta }
 */

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
    adminSessionsApi,
    AdminSessionsQueryParams,
    AdminSessionsListResponse,
} from '../api/admin-sessions.api';

export function useAdminSessions(params?: AdminSessionsQueryParams) {
    return useQuery<AdminSessionsListResponse, Error>({
        queryKey: ['admin-sessions', params],
        queryFn: () => adminSessionsApi.getAdminSessions(params),
        placeholderData: keepPreviousData,
        staleTime: 30 * 1000, // 30 seconds
    });
}

export default useAdminSessions;