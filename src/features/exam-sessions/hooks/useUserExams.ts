// src/features/exam-sessions/hooks/useUserExams.ts

/**
 * Hook to fetch user's exam sessions
 *
 * ✅ Uses correct API endpoint
 * ✅ Proper type handling
 * ✅ Backend automatically filters by authenticated user
 */

import { useQuery } from '@tanstack/react-query';
import { examSessionsApi } from '../api/exam-sessions.api';
import type { GetUserExamsParams, UserExamsPayload } from '../types/exam-sessions.types';

export function useUserExams(params?: GetUserExamsParams) {
    return useQuery<UserExamsPayload>({
        queryKey: ['user-exams', params],
        queryFn: () => examSessionsApi.getUserExams(params),
        staleTime: 1000 * 30, // 30 seconds
    });
}