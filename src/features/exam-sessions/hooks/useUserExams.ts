// src/features/exam-sessions/hooks/useUserExams.ts
import { useQuery } from '@tanstack/react-query';
import { examSessionsApi } from '../api/exam-sessions.api';
import type { GetUserExamsParams } from '../types/exam-sessions.types';

/**
 * Hook to fetch user exam sessions
 * GET /api/v1/exam-sessions
 */
export function useUserExams(params?: GetUserExamsParams) {
    return useQuery({
        queryKey: ['user-exams', params],
        queryFn: () => examSessionsApi.getUserExams(params),
    });
}