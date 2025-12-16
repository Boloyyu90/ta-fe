/**
 * Hook to fetch exam session answers (admin view)
 *
 * Backend: GET /api/v1/admin/exam-sessions/:id/answers
 * Response: ExamAnswersResponse = { answers: AnswerWithQuestion[], total: number }
 */

import { useQuery } from '@tanstack/react-query';
import { adminSessionsApi } from '../api/admin-sessions.api';
import type { ExamAnswersResponse } from '../types/exam-sessions.types';

export interface UseAdminSessionAnswersOptions {
    enabled?: boolean;
}

export function useAdminSessionAnswers(
    sessionId: number | undefined,
    options: UseAdminSessionAnswersOptions = {}
) {
    const { enabled = true } = options;

    return useQuery<ExamAnswersResponse, Error>({
        queryKey: ['admin-session-answers', sessionId],
        queryFn: async () => {
            if (!sessionId) throw new Error('Session ID is required');
            return adminSessionsApi.getAdminSessionAnswers(sessionId);
        },
        enabled: enabled && sessionId !== undefined && sessionId > 0,
        staleTime: 60 * 1000, // 1 minute
    });
}

export default useAdminSessionAnswers;