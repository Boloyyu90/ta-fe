// src/features/exams/api/exams.api.ts
import { apiClient } from '@/shared/lib/api';
import type { ApiResponse } from '@/shared/types/api.types';
import type {
    ExamsQueryParams,
    ExamsResponse,
    ExamDetailResponse,
    StartExamResponse,
} from '../types/exams.types';

export const examsApi = {
    /**
     * Get all exams (with filters)
     * GET /api/v1/exams
     */
    getExams: async (params: ExamsQueryParams = {}): Promise<ExamsResponse> => {
        const { page = 1, limit = 10, search, status, sortBy, sortOrder } = params;

        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        if (search) queryParams.append('search', search);
        if (status && status !== 'all') queryParams.append('status', status);
        if (sortBy) queryParams.append('sortBy', sortBy);
        if (sortOrder) queryParams.append('sortOrder', sortOrder);

        const response = await apiClient.get<ApiResponse<ExamsResponse>>(
            `/exams?${queryParams.toString()}`
        );
        return response.data;
    },

    /**
     * Get exam by ID
     * GET /api/v1/exams/:id
     */
    getExam: async (examId: number): Promise<ExamDetailResponse> => {
        const response = await apiClient.get<ApiResponse<ExamDetailResponse>>(`/exams/${examId}`);
        return response.data;
    },

    /**
     * Start an exam (creates user_exam)
     * POST /api/v1/exams/:id/start
     */
    startExam: async (examId: number): Promise<StartExamResponse> => {
        const response = await apiClient.post<ApiResponse<StartExamResponse>>(
            `/exams/${examId}/start`
        );
        return response.data;
    },
};