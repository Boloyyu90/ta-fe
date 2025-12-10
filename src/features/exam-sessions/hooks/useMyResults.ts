// src/features/exam-sessions/hooks/useMyResults.ts

/**
 * Hook to fetch user's completed exam results
 *
 * ✅ AUDIT FIX v2:
 * - Returns MyResultsResponse (with correct PaginationMeta)
 * - Uses correct endpoint via examSessionsApi.getMyResults
 *
 * Backend: GET /api/v1/results
 */

import { useQuery } from '@tanstack/react-query';
import { examSessionsApi } from '../api/exam-sessions.api';
import type { MyResultsResponse, GetMyResultsParams } from '../types/exam-sessions.types';

export const useMyResults = (params?: GetMyResultsParams) => {
    return useQuery<MyResultsResponse, Error>({
        queryKey: ['my-results', params],
        queryFn: () => examSessionsApi.getMyResults(params),
    });
};

// Default export for flexibility
export default useMyResults;