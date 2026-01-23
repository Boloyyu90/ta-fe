/**
 * useCheckExamAccess Hook
 *
 * CRITICAL: This hook is used in exam detail page to determine
 * whether user can start exam or needs to pay first.
 *
 * Pattern: Same as useExamWithAttempts in exams/hooks
 */

import { useQuery } from '@tanstack/react-query';
import { transactionsApi } from '../api/transactions.api';
import type { ExamAccessResponse } from '../types/transactions.types';

export function useCheckExamAccess(examId: number, options?: { enabled?: boolean }) {
    return useQuery<ExamAccessResponse, Error>({
        queryKey: ['exam-access', examId],
        queryFn: () => transactionsApi.checkExamAccess(examId),
        enabled: options?.enabled ?? !!examId,
        staleTime: 1000 * 60 * 5, // 5 minutes - payment status doesn't change frequently
    });
}

export default useCheckExamAccess;
