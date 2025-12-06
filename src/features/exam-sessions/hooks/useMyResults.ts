import { useQuery } from '@tanstack/react-query';
import { examSessionsApi } from '../api/exam-sessions.api';
import type { MyResultsResponse } from '../types/exam-sessions.types';

/**
 * Hook to fetch user's completed exam results
 *
 * Returns: { data: UserExam[], pagination: PaginationMeta }
 */
export const useMyResults = (params?: { page?: number; limit?: number }) => {
    return useQuery<MyResultsResponse, Error>({
        queryKey: ['my-results', params],
        queryFn: () => examSessionsApi.getMyResults(params),
    });
};