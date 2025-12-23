// src/features/exam-sessions/hooks/useExamSessionData.ts

/**
 * Hook to get cached exam session data from startExam response
 *
 * ✅ P1 FIX: Provides access to answers when resuming an exam
 *
 * This hook reads the cached data stored by use StartExam when a user
 * starts or resumes an exam. It includes the questions and existing answers.
 *
 * Backend: POST /api/v1/exams/:id/start (cached)
 */

import { useQuery } from '@tanstack/react-query';
import type { StartExamResponse } from '@/features/exams/types/exams.types';

export function useExamSessionData(sessionId: number | undefined) {
    return useQuery<StartExamResponse | undefined>({
        queryKey: ['exam-session-data', sessionId],
        queryFn: async () => {
            // This data is set by useStartExam, not fetched
            // If it doesn't exist, return undefined
            return undefined;
        },
        // Keep data available throughout the exam
        staleTime: Infinity,
        gcTime: Infinity, // Previously called cacheTime
        // Don't refetch - this is manually populated data
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        enabled: sessionId !== undefined && sessionId > 0,
    });
}

export default useExamSessionData;
