// src/features/exams/hooks/useStartExam.ts

/**
 * Hook to start an exam session
 *
 * ✅ AUDIT FIX v3: Fixed mutation.data access (no nested .data)
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
            // ✅ FIX: Access userExam directly, not data.data
            const { userExam } = data;

            // Invalidate relevant queries
            queryClient.invalidateQueries({ queryKey: ['user-exams'] });
            queryClient.invalidateQueries({ queryKey: ['exams'] });

            // Navigate to the exam session
            router.push(`/exam-session/${userExam.id}`);
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