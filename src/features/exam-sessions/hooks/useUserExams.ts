import { useQuery } from '@tanstack/react-query';
import { examSessionsApi } from '../api/exam-sessions.api';

/**
 * Hook to fetch user's exam sessions
 *
 * Uses GET /api/v1/exam-sessions (NOT /exam-sessions/my-exams)
 * Backend automatically filters sessions by authenticated user
 */
export function useUserExams(params?: { page?: number; limit?: number; status?: string }) {
    return useQuery({
        queryKey: ['user-exams', params],
        queryFn: async () => {
            // The /exam-sessions endpoint automatically filters by authenticated user
            const response = await examSessionsApi.getUserExams(params);
            return response;
        },
        staleTime: 1000 * 30, // 30 seconds
    });
}