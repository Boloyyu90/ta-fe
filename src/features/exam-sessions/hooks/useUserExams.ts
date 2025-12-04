// src/features/exam-sessions/hooks/useUserExams.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/lib/api';
import type { UserExam } from '../types/exam-sessions.types';

interface UserExamsResponse {
    userExams: UserExam[];
}

export function useUserExams() {
    return useQuery<UserExamsResponse>({
        queryKey: ['user-exams'],
        queryFn: async () => {
            const response = await apiClient.get('/exam-sessions/my-exams');
            return response.data;
        },
        staleTime: 1000 * 30, // 30 seconds
    });
}