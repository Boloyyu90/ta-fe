// src/features/questions/api/questions.api.ts
import { apiClient } from '@/shared/lib/api';
import type { ApiResponse } from '@/shared/types/api.types';
import type {
    QuestionsListResponse,
    QuestionDetailResponse,
    CreateQuestionRequest,
    UpdateQuestionRequest,
    QuestionsQueryParams,
} from '../types/questions.types';

export const questionsApi = {
    /**
     * Get list of questions with pagination and filters
     * GET /api/v1/admin/questions
     */
    getQuestions: async (params: QuestionsQueryParams = {}) => {
        const { page = 1, limit = 10, type, search, sortBy = 'createdAt', sortOrder = 'desc' } = params;

        const queryParams = new URLSearchParams({
            page: String(page),
            limit: String(limit),
            sortBy,
            sortOrder,
        });

        if (type) queryParams.append('type', type);
        if (search) queryParams.append('search', search);

        const response = await apiClient.get<ApiResponse<QuestionsListResponse>>(
            `/admin/questions?${queryParams.toString()}`
        );
        return response.data;
    },

    /**
     * Get single question detail
     * GET /api/v1/admin/questions/:id
     */
    getQuestion: async (id: string) => {
        const response = await apiClient.get<ApiResponse<QuestionDetailResponse>>(`/admin/questions/${id}`);
        return response.data;
    },

    /**
     * Create new question
     * POST /api/v1/admin/questions
     */
    createQuestion: async (data: CreateQuestionRequest) => {
        const response = await apiClient.post<ApiResponse<QuestionDetailResponse>>('/admin/questions', data);
        return response.data;
    },

    /**
     * Update existing question
     * PATCH /api/v1/admin/questions/:id
     */
    updateQuestion: async (id: string, data: UpdateQuestionRequest) => {
        const response = await apiClient.patch<ApiResponse<QuestionDetailResponse>>(`/admin/questions/${id}`, data);
        return response.data;
    },

    /**
     * Delete question
     * DELETE /api/v1/admin/questions/:id
     */
    deleteQuestion: async (id: string) => {
        const response = await apiClient.delete<ApiResponse<{ success: boolean }>>(`/admin/questions/${id}`);
        return response.data;
    },
};