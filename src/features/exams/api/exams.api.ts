// src/features/exams/api/exams.api.ts
import { apiClient } from '@/shared/lib/api';
import type {
    ExamsResponse,
    ExamsQueryParams,
    ExamDetailResponse,
    StartExamResponse,
} from '../types/exams.types';

export const examsApi = {
    // Get all exams (paginated)
    getExams: async (params: ExamsQueryParams = {}): Promise<ExamsResponse> => {
        const { page = 1, limit = 10, search, isActive } = params;

        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        if (search) {
            queryParams.append('search', search);
        }

        if (isActive !== undefined) {
            queryParams.append('isActive', isActive.toString());
        }

        const response = await apiClient.get(`/exams?${queryParams.toString()}`);
        return response.data;
    },

    // Get single exam details
    getExam: async (examId: number): Promise<ExamDetailResponse> => {
        const response = await apiClient.get(`/exams/${examId}`);
        return response.data;
    },

    // Start exam (creates user exam session)
    startExam: async (examId: number): Promise<StartExamResponse> => {
        const response = await apiClient.post(`/exams/${examId}/start`);
        return response.data;
    },
};