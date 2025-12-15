import { useQuery } from '@tanstack/react-query';
import { examsApi } from '../api/exams.api';
import type { ExamQuestionsListResponse } from '../types/exams.types';
import type { QuestionType } from '@/shared/types/enum.types';

export interface UseExamQuestionsOptions {
    /** Optional filter by question type (TIU/TKP/TWK) */
    type?: QuestionType;
    /** Whether the query should run; useful for conditional fetching */
    enabled?: boolean;
}

export function useExamQuestions(
    examId: number | undefined,
    options: UseExamQuestionsOptions = {}
) {
    const { type, enabled = true } = options;

    return useQuery<ExamQuestionsListResponse, Error>({
        queryKey: ['exam-questions', examId, { type }],
        queryFn: async () => {
            if (!examId) throw new Error('Exam ID is required');
            return examsApi.getExamQuestions(examId, { type });
        },
        enabled: enabled && !!examId,
        staleTime: 60 * 1000, // 1 minute
    });
}

export default useExamQuestions;
