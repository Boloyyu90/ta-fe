// src/features/questions/hooks/useQuestions.ts
import { useQuery } from '@tanstack/react-query';
import { questionsApi } from '../api/questions.api';
import type { QuestionsListResponse, QuestionsQueryParams } from '../types/questions.types';

export function useQuestions(params: QuestionsQueryParams = {}) {
    const { page = 1, limit = 10, type, search, sortBy = 'createdAt', sortOrder = 'desc' } = params;

    return useQuery<QuestionsListResponse>({
        queryKey: ['questions', { page, limit, type, search, sortBy, sortOrder }],
        queryFn: () => questionsApi.getQuestions({ page, limit, type, search, sortBy, sortOrder }),
        staleTime: 1000 * 60, // 1 minute
        placeholderData: (previousData) => previousData,
    });
}