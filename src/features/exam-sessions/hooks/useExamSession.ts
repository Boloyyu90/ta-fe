/**
 * Hook to fetch a single exam session
 */

import { useQuery } from '@tanstack/react-query';
import { examSessionsApi } from '../api/exam-sessions.api';
import type { UserExam } from '../types/exam-sessions.types';

export interface UseExamSessionOptions {
    enabled?: boolean;
}

export function useExamSession(
    sessionId: number | undefined,
    options: UseExamSessionOptions = {}
) {
    const { enabled = true } = options;

    return useQuery({
        queryKey: ['exam-session', sessionId],
        queryFn: async (): Promise<UserExam> => {
            if (!sessionId) throw new Error('Session ID is required');
            const response = await examSessionsApi.getUserExam(sessionId);
            return response.userExam;
        },
        enabled: enabled && sessionId !== undefined && sessionId > 0,
        staleTime: 30 * 1000, // 30 seconds
    });
}

export default useExamSession;