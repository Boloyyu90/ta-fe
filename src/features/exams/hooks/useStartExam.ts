// src/features/exams/hooks/useStartExam.ts

/**
 * Hook to start an exam session
 *
 * ✅ AUDIT FIX v4:
 * - Returns both startExam/isLoading AND mutate/isPending for compatibility
 *
 * Backend: POST /api/v1/exams/:id/start
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { examsApi } from '../api/exams.api';
import type { StartExamResponse } from '../types/exams.types';

export const useStartExam = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const mutation = useMutation<StartExamResponse, Error, number>({
        mutationFn: (examId: number) => examsApi.startExam(examId),
        onSuccess: (data) => {
            // data is StartExamResponse = { userExam: UserExam }
            const { userExam } = data;

            // Invalidate relevant queries
            queryClient.invalidateQueries({ queryKey: ['user-exams'] });
            queryClient.invalidateQueries({ queryKey: ['exams'] });

            // Navigate to the exam session
            router.push(`/exam-session/${userExam.id}`);
        },
    });

    return {
        // Original naming (for backwards compatibility)
        startExam: mutation.mutate,
        startExamAsync: mutation.mutateAsync,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,

        // ✅ FIX: Also expose standard mutation properties
        mutate: mutation.mutate,
        mutateAsync: mutation.mutateAsync,
        isPending: mutation.isPending,

        // Full mutation object for advanced use
        mutation,
    };
};

export default useStartExam;