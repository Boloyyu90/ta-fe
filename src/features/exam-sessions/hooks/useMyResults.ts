// src/features/exam-sessions/hooks/useMyResults.ts
import { useQuery } from '@tanstack/react-query';
import { examSessionsApi } from '../api/exam-sessions.api';
import type { MyResultsResponse, MyResultsParams } from '../types/exam-sessions.types';

/**
 * Hook to fetch user's results
 * GET /api/v1/results
 */
export function useMyResults(params?: MyResultsParams) {
    return useQuery<MyResultsResponse>({
        queryKey: ['my-results', params],
        queryFn: () => examSessionsApi.getMyResults(params),
    });
}