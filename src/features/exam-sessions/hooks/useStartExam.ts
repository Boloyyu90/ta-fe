// src/features/exam-sessions/hooks/useStartExam.ts

/**
 * Hook to start an exam session
 *
 * ✅ AUDIT FIX v3: Fixed mutation.data access (no nested .data)
 * ✅ P1 FIX: Cache answers for restoration on resume
 *
 * Backend: POST /api/v1/exams/:id/start
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { examsApi } from '@/features/exams/api/exams.api';
import type { StartExamResponse } from '@/features/exams/types/exams.types';

export const useStartExam = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const mutation = useMutation<StartExamResponse, Error, number>({
        mutationFn: (examId: number) => examsApi.startExam(examId),
        onSuccess: (data) => {
            // data is StartExamResponse = { userExam, questions, answers }
            // ✅ FIX: Access userExam directly, not data.data
            const { userExam, questions, answers } = data;

            // ✅ P1 FIX: Cache the full response including answers
            // This allows the take page to restore answers when resuming
            queryClient.setQueryData(
                ['exam-session-data', userExam.id],
                data
            );

            // Invalidate relevant queries
            queryClient.invalidateQueries({ queryKey: ['user-exams'] });
            queryClient.invalidateQueries({ queryKey: ['exams'] });

            // Navigate to the exam session take page
            router.push(`/exam-sessions/${userExam.id}/take`);
        },
    });

    return {
        startExam: mutation.mutate,
        startExamAsync: mutation.mutateAsync,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
    };
};

export default useStartExam;