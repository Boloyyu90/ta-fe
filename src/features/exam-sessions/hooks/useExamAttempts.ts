/**
 * Hook to fetch user's attempts for a specific exam
 *
 * Returns first and last attempts for display in exam detail page,
 * along with all attempts for the history page.
 */

'use client';

import { useMemo } from 'react';
import { useMyResults } from './useMyResults';
import type { ExamResult } from '../types/exam-sessions.types';

export interface UseExamAttemptsResult {
    attempts: ExamResult[];
    firstAttempt: ExamResult | null;
    lastAttempt: ExamResult | null;
    totalAttempts: number;
    hasAttempts: boolean;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    refetch: () => void;
}

export function useExamAttempts(examId: number | undefined): UseExamAttemptsResult {
    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
    } = useMyResults(
        examId
            ? { examId, limit: 100, enabled: true }
            : { enabled: false }
    );

    const attempts = data ?? [];

    const { firstAttempt, lastAttempt } = useMemo(() => {
        if (attempts.length === 0) {
            return { firstAttempt: null, lastAttempt: null };
        }

        // Sort by attemptNumber ascending
        const sorted = [...attempts].sort((a, b) => a.attemptNumber - b.attemptNumber);

        return {
            firstAttempt: sorted[0],
            lastAttempt: sorted[sorted.length - 1],
        };
    }, [attempts]);

    return {
        attempts,
        firstAttempt,
        lastAttempt,
        totalAttempts: attempts.length,
        hasAttempts: attempts.length > 0,
        isLoading,
        isError,
        error,
        refetch,
    };
}

export default useExamAttempts;
