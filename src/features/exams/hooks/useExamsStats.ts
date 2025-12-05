
// src/features/exams/hooks/useExamsStats.ts
import { useQuery } from '@tanstack/react-query';
import { examsApi } from '../api/exams.api';

/**
 * Hook to fetch exam statistics
 * This is a placeholder - implement based on your actual exams API
 */
export function useExamsStats() {
    return useQuery({
        queryKey: ['exams-stats'],
        queryFn: async () => {
            // Return mock stats for now or implement actual API call
            const exams = await examsApi.getExams({ status: 'PUBLISHED' });
            return {
                availableExams: exams.data?.length || 0,
            };
        },
    });
}