// src/features/questions/hooks/useQuestion.ts

/**
 * Hook to fetch single question detail
 *
 * ✅ AUDIT FIX v3:
 * - id is number, not string
 * - Returns QuestionDetailResponse which has { question: QuestionWithUsage }
 *
 * Backend: GET /api/v1/admin/questions/:id
 */

import { useQuery } from '@tanstack/react-query';
import { questionsApi } from '../api/questions.api';
import type { QuestionDetailResponse } from '../types/questions.types';

export const useQuestion = (id: number | undefined) => {
    return useQuery<QuestionDetailResponse, Error>({
        queryKey: ['question', id],
        queryFn: () => questionsApi.getQuestion(id!),
        enabled: id !== undefined && id > 0,
    });
};

export default useQuestion;