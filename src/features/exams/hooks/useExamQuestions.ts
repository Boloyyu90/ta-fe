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

/**
 * Fetches all questions for an exam.
 *
 * Note: Backend returns complete question list without pagination.
 * This is acceptable for typical CPNS exams (100-150 questions).
 *
 * If pagination is needed for larger question sets in the future:
 * 1. Add pagination params to backend GET /exams/:id/questions
 * 2. Update this hook to accept { page, limit } options
 * 3. Implement pagination UI in the consuming components
 *
 * @see Backend endpoint: GET /api/v1/exams/:examId/questions
 */
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
