// src/features/exam-sessions/hooks/useExamSession.ts

/**
 * Hook to fetch exam session details
 *
 * ✅ Returns session with exam details
 * ✅ Proper type handling
 */

import { useQuery } from '@tanstack/react-query';
import { examSessionsApi } from '../api/exam-sessions.api';
import type { ExamSessionPayload } from '../types/exam-sessions.types';

export function useExamSession(sessionId: number, enabled = true) {
    return useQuery<ExamSessionPayload>({
        queryKey: ['exam-session', sessionId],
        queryFn: () => examSessionsApi.getExamSession(sessionId),
        enabled: enabled && sessionId > 0,
        staleTime: 1000 * 60, // 1 minute
    });
}