// src/features/questions/api/questions.api.ts

/**
 * QUESTIONS API CLIENT
 *
 * ============================================================================
 * PHASE 2 FIX v2: Aligned with Phase 1 QuestionsQueryParams
 * ============================================================================
 *
 * Phase 1 QuestionsQueryParams has:
 * - questionType (not 'type')
 *
 * Backend query string expects:
 * - type (lowercase)
 *
 * So we destructure as `questionType` and send as `type`
 *
 * Backend: /api/v1/admin/questions/*
 */

import { apiClient } from '@/shared/lib/api';
import type {
    // Query params
    QuestionsQueryParams,
    // Request types
    CreateQuestionRequest,
    UpdateQuestionRequest,
    // Response types (Phase 1 aligned)
    QuestionsListResponse,
    QuestionDetailResponse,
    CreateQuestionResponse,
    UpdateQuestionResponse,
    DeleteQuestionResponse,
} from '../types/questions.types';

/**
 * Get list of questions with pagination and filters
 * GET /api/v1/admin/questions
 *
 * @returns QuestionsListResponse = { data: QuestionWithUsage[], pagination: PaginationMeta }
 */
export const getQuestions = async (
    params: QuestionsQueryParams = {}
): Promise<QuestionsListResponse> => {
    const {
        page = 1,
        limit = 10,
        questionType,  // ✅ FIXED: Use questionType (Phase 1 name)
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

    // ✅ FIXED: Send as 'type' to backend (backend expects 'type' in query)
    if (questionType) queryParams.append('type', questionType);
    if (search) queryParams.append('search', search);

    const response = await apiClient.get<QuestionsListResponse>(
        `/admin/questions?${queryParams.toString()}`
    );
    return response.data;
};

/**
 * Get single question detail
 * GET /api/v1/admin/questions/:id
 *
 * @returns QuestionDetailResponse = { question: QuestionWithUsage }
 */
export const getQuestion = async (id: number): Promise<QuestionDetailResponse> => {
    const response = await apiClient.get<QuestionDetailResponse>(`/admin/questions/${id}`);
    return response.data;
};

/**
 * Create new question
 * POST /api/v1/admin/questions
 *
 * @returns CreateQuestionResponse = { question: Question }
 */
export const createQuestion = async (
    data: CreateQuestionRequest
): Promise<CreateQuestionResponse> => {
    const response = await apiClient.post<CreateQuestionResponse>('/admin/questions', data);
    return response.data;
};

/**
 * Update question
 * PATCH /api/v1/admin/questions/:id
 *
 * @returns UpdateQuestionResponse = { question: Question }
 */
export const updateQuestion = async (
    id: number,
    data: UpdateQuestionRequest
): Promise<UpdateQuestionResponse> => {
    const response = await apiClient.patch<UpdateQuestionResponse>(
        `/admin/questions/${id}`,
        data
    );
    return response.data;
};

/**
 * Delete question
 * DELETE /api/v1/admin/questions/:id
 *
 * @returns DeleteQuestionResponse = { success: boolean, message: string }
 */
export const deleteQuestion = async (id: number): Promise<DeleteQuestionResponse> => {
    const response = await apiClient.delete<DeleteQuestionResponse>(`/admin/questions/${id}`);
    return response.data;
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