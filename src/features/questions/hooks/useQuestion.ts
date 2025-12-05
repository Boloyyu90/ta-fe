// src/features/questions/hooks/useQuestion.ts
import { useQuery } from '@tanstack/react-query';
import { questionsApi } from '../api/questions.api';
import type { QuestionDetailResponse } from '../types/questions.types';

export function useQuestion(id: string, enabled = true) {
    return useQuery<QuestionDetailResponse>({
        queryKey: ['question', id],
        queryFn: () => questionsApi.getQuestion(id),
        enabled,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}