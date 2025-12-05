// src/features/exam-sessions/hooks/useMyResults.ts

/**
 * Hook to fetch my exam results
 *
 * ✅ Returns correct payload structure
 */

import { useQuery } from '@tanstack/react-query';
import { examSessionsApi } from '../api/exam-sessions.api';
import type { GetUserExamsParams } from '../types/exam-sessions.types';

export function useMyResults(params?: GetUserExamsParams) {
    return useQuery({
        queryKey: ['my-results', params],
        queryFn: () => examSessionsApi.getMyResults(params),
        staleTime: 1000 * 60, // 1 minute
    });
}