// src/features/exam-sessions/hooks/useStartExam.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { examsApi } from '@/features/exams/api/exams.api';
import { toast } from 'sonner';
import { useEffect } from 'react';

export function useStartExam() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (examId: number) => examsApi.startExam(examId),
    });

    // Handle success
    useEffect(() => {
        if (mutation.isSuccess && mutation.data) {
            const { userExam } = mutation.data.data;

            toast.success('Exam Started!', {
                description: 'Your exam session has begun. Good luck!',
            });

            // Invalidate relevant queries
            queryClient.invalidateQueries({ queryKey: ['user-exams'] });

            // Redirect to exam taking page
            router.push(`/exam-sessions/${userExam.id}/take`);
        }
    }, [mutation.isSuccess, mutation.data, router, queryClient]);

    // Handle errors
    useEffect(() => {
        if (mutation.isError) {
            const error: any = mutation.error;
            const errorMessage =
                error.response?.data?.message || 'Failed to start exam. Please try again.';

            toast.error('Cannot Start Exam', {
                description: errorMessage,
            });
        }
    }, [mutation.isError, mutation.error]);

    return mutation;
}