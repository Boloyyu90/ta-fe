// src/features/exam-sessions/hooks/useResultDetail.ts
import { useQuery } from '@tanstack/react-query';
import { examSessionsApi } from '../api/exam-sessions.api';
import type { ExamSessionDetailResponse } from '../types/exam-sessions.types';

export function useResultDetail(sessionId: number, enabled = true) {
    return useQuery<ExamSessionDetailResponse>({
        queryKey: ['exam-session', sessionId],
        queryFn: () => examSessionsApi.getExamSession(sessionId),
        enabled,
        staleTime: 1000 * 60 * 5, // 5 minutes - results don't change frequently
    });
}