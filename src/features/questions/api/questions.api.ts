// src/features/questions/api/questions.api.ts

/**
 * QUESTIONS API CLIENT - BACKEND-ALIGNED
 *
 * ✅ UPDATED: All types match new questions.types.ts
 * ✅ Proper ApiResponse unwrapping
 * ✅ Correct return types for all endpoints
 */

import { apiClient } from '@/shared/lib/api';
import type { ApiResponse } from '@/shared/types/api.types';
import type {
    QuestionsListResponse,
    QuestionDetailResponse,
    CreateQuestionRequest,
    CreateQuestionResponse,
    UpdateQuestionRequest,
    UpdateQuestionResponse,
    DeleteQuestionResponse,
    QuestionsQueryParams,
} from '../types/questions.types';

export const questionsApi = {
    /**
     * Get list of questions with pagination and filters
     * GET /admin/questions?page=1&limit=10&type=TIU&search=intelegensia
     *
     * Returns: ApiResponse<{ data: Question[], pagination: PaginationMeta }>
     * After unwrap: { data: Question[], pagination: {...} }
     */
    getQuestions: async (params: QuestionsQueryParams = {}): Promise<QuestionsListResponse> => {
        const {
            page = 1,
            limit = 10,
            type,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = params;

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
        return response.data; // Unwrap: { data: [...], pagination: {...} }
    },

    /**
     * Get single question detail
     * GET /admin/questions/:id
     *
     * Returns: ApiResponse<{ question: Question }>
     * After unwrap: { question: Question }
     */
    getQuestion: async (id: number): Promise<QuestionDetailResponse> => {
        const response = await apiClient.get<ApiResponse<QuestionDetailResponse>>(
            `/admin/questions/${id}`
        );
        return response.data; // Unwrap: { question: {...} }
    },

    /**
     * Create new question
     * POST /admin/questions
     *
     * Returns: ApiResponse<{ question: Question }>
     * After unwrap: { question: Question }
     */
    createQuestion: async (data: CreateQuestionRequest): Promise<CreateQuestionResponse> => {
        const response = await apiClient.post<ApiResponse<CreateQuestionResponse>>(
            '/admin/questions',
            data
        );
        return response.data; // Unwrap: { question: {...} }
    },

    /**
     * Update existing question
     * PATCH /admin/questions/:id
     *
     * Returns: ApiResponse<{ question: Question }>
     * After unwrap: { question: Question }
     */
    updateQuestion: async (
        id: number,
        data: UpdateQuestionRequest
    ): Promise<UpdateQuestionResponse> => {
        const response = await apiClient.patch<ApiResponse<UpdateQuestionResponse>>(
            `/admin/questions/${id}`,
            data
        );
        return response.data; // Unwrap: { question: {...} }
    },

    /**
     * Delete question
     * DELETE /admin/questions/:id
     *
     * Returns: ApiResponse<{ success: boolean }>
     * After unwrap: { success: true }
     */
    deleteQuestion: async (id: number): Promise<DeleteQuestionResponse> => {
        const response = await apiClient.delete<ApiResponse<DeleteQuestionResponse>>(
            `/admin/questions/${id}`
        );
        return response.data; // Unwrap: { success: true }
    },
};