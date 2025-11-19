// src/features/exam-sessions/hooks/useUserExams.ts
import { useQuery } from '@tanstack/react-query';
import { examSessionsApi } from '../api/exam-sessions.api';
import type { PaginationParams } from '@/shared/types/api.types';
import type { UserExamsListResponse } from '../types/exam-sessions.types';

interface UseUserExamsParams extends PaginationParams {}

export function useUserExams(params: UseUserExamsParams = { page: 1, limit: 10 }) {
    return useQuery<UserExamsListResponse>({
        queryKey: ['user-exams', params],
        queryFn: () => examSessionsApi.getUserExams(params),
        staleTime: 1000 * 60 * 2, // 2 minutes (more frequent refresh for sessions)
    });
}