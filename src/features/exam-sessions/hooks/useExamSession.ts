// src/features/exam-sessions/hooks/useExamSession.ts
import { useQuery } from '@tanstack/react-query';
import { examSessionsApi } from '../api/exam-sessions.api';
import type { ExamSessionDetailResponse } from '../types/exam-sessions.types';

export function useExamSession(sessionId: number, enabled = true) {
    return useQuery<ExamSessionDetailResponse>({
        queryKey: ['exam-session', sessionId],
        queryFn: () => examSessionsApi.getExamSession(sessionId),
        enabled,
        refetchInterval: (query) => {
            // Refetch every 10 seconds if exam is IN_PROGRESS
            const data = query.state.data;
            return data?.userExam.status === 'IN_PROGRESS' ? 10000 : false;
        },
    });
}