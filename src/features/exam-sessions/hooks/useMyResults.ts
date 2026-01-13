/**
 * Hook to fetch user's completed exam results
 *
 * Backend: GET /api/v1/results
 *
 * @param params.examId - Optional filter by exam ID
 */

import { useQuery } from '@tanstack/react-query';
import { examSessionsApi } from '../api/exam-sessions.api';
import type {
    ExamResult,
    GetMyResultsParams,
    MyResultsResponseNormalized,
} from '../types/exam-sessions.types';
import type { PaginationMeta } from '@/shared/types/api.types';

export interface UseMyResultsOptions extends GetMyResultsParams {
    enabled?: boolean;
}

export interface UseMyResultsResult {
    data: ExamResult[] | undefined;
    pagination: PaginationMeta | undefined;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    refetch: () => void;
}

export function useMyResults(params: UseMyResultsOptions = {}): UseMyResultsResult {
    const { page = 1, limit = 10, examId, enabled = true } = params;

    const query = useQuery<MyResultsResponseNormalized, Error>({
        queryKey: ['my-results', { page, limit, examId }],
        queryFn: () => examSessionsApi.getMyResults({ page, limit, examId }),
        enabled,
        staleTime: 60 * 1000, // 1 minute
        refetchOnMount: 'always', // Always refetch when page is visited to ensure fresh data
    });

    // Only show FINISHED exams (exclude TIMEOUT and CANCELLED)
    const filteredData = query.data?.data.filter((result) => result.status === 'FINISHED');

    // Adjust pagination to reflect filtered count
    const filteredPagination = query.data?.pagination
        ? {
            ...query.data.pagination,
            total: filteredData?.length ?? 0,
        }
        : undefined;

    return {
        data: filteredData,
        pagination: filteredPagination,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}

export default useMyResults;