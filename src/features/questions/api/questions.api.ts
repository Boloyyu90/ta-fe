// src/features/questions/api/questions.api.ts

/**
 * Questions API Client
 *
 * ✅ AUDIT FIX v2:
 * - Consistent response unwrapping (returns inner data, not ApiResponse)
 * - Fixed id parameter type from string to number
 * - All functions return the unwrapped data for React Query hooks
 *
 * Backend: /api/v1/admin/questions/*
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

/**
 * Get list of questions with pagination and filters
 * GET /api/v1/admin/questions
 */
export const getQuestions = async (
    params: QuestionsQueryParams = {}
): Promise<QuestionsListResponse> => {
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

    // Unwrap ApiResponse to get inner data
    return response.data.data;
};

/**
 * Get single question detail
 * GET /api/v1/admin/questions/:id
 *
 * ✅ AUDIT FIX: id is number, not string
 */
export const getQuestion = async (id: number): Promise<QuestionDetailResponse> => {
    const response = await apiClient.get<ApiResponse<QuestionDetailResponse>>(
        `/admin/questions/${id}`
    );
    return response.data.data;
};

/**
 * Create new question
 * POST /api/v1/admin/questions
 */
export const createQuestion = async (
    data: CreateQuestionRequest
): Promise<CreateQuestionResponse> => {
    const response = await apiClient.post<ApiResponse<CreateQuestionResponse>>(
        '/admin/questions',
        data
    );
    return response.data.data;
};

/**
 * Update existing question
 * PATCH /api/v1/admin/questions/:id
 *
 * ✅ AUDIT FIX: id is number, not string
 */
export const updateQuestion = async (
    id: number,
    data: UpdateQuestionRequest
): Promise<UpdateQuestionResponse> => {
    const response = await apiClient.patch<ApiResponse<UpdateQuestionResponse>>(
        `/admin/questions/${id}`,
        data
    );
    return response.data.data;
};

/**
 * Delete question
 * DELETE /api/v1/admin/questions/:id
 *
 * ✅ AUDIT FIX: id is number, not string
 */
export const deleteQuestion = async (id: number): Promise<DeleteQuestionResponse> => {
    const response = await apiClient.delete<ApiResponse<DeleteQuestionResponse>>(
        `/admin/questions/${id}`
    );
    return response.data.data;
};

// ============================================================================
// NAMED EXPORT OBJECT
// ============================================================================

export const questionsApi = {
    getQuestions,
    getQuestion,
    createQuestion,
    updateQuestion,
    deleteQuestion,
};