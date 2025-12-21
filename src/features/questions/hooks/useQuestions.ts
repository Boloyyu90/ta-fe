// src/features/questions/hooks/useQuestions.ts

/**
 * Hook to fetch paginated questions list
 *
 * Backend: GET /api/v1/admin/questions
 */

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { questionsApi } from '../api/questions.api';
import type { QuestionsListResponse, QuestionsQueryParams } from '../types/questions.types';

export const useQuestions = (params?: QuestionsQueryParams) => {
    return useQuery<QuestionsListResponse, Error>({
        queryKey: ['questions', params],
        queryFn: () => questionsApi.getQuestions(params),
        placeholderData: keepPreviousData,
    });
};

export default useQuestions;