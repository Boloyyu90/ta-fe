// src/features/exams/api/exams.api.ts

/**
 * Exams API Client
 *
 * ✅ AUDIT FIX v2:
 * - Consistent response unwrapping pattern
 * - All functions return the unwrapped data
 * - Added admin endpoints
 *
 * Backend endpoints:
 * - Participant: /api/v1/exams/*
 * - Admin: /api/v1/admin/exams/*
 */

import { apiClient } from '@/shared/lib/api';
import type { ApiResponse } from '@/shared/types/api.types';
import type {
    ExamsQueryParams,
    AdminExamsQueryParams,
    ExamsResponse,
    ExamDetailResponse,
    StartExamResponse,
    AdminExamsResponse,
    AdminExamDetailResponse,
    ExamQuestionsResponse,
    CreateExamRequest,
    CreateExamResponse,
    UpdateExamRequest,
    UpdateExamResponse,
    DeleteExamResponse,
    AttachQuestionsRequest,
    AttachQuestionsResponse,
    DetachQuestionsRequest,
    DetachQuestionsResponse,
} from '../types/exams.types';

// ============================================================================
// PARTICIPANT ENDPOINTS
// ============================================================================

/**
 * Get available exams (participant view)
 * GET /api/v1/exams
 */
export const getExams = async (
    params: ExamsQueryParams = {}
): Promise<ExamsResponse> => {
    const { page = 1, limit = 10, search, status, sortBy, sortOrder } = params;

    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });

    if (search) queryParams.append('search', search);
    if (status && status !== 'all') {
        // Map UI status to isActive
        queryParams.append('isActive', status === 'active' ? 'true' : 'false');
    }
    if (sortBy) queryParams.append('sortBy', sortBy);
    if (sortOrder) queryParams.append('sortOrder', sortOrder);

    const response = await apiClient.get<ApiResponse<ExamsResponse>>(
        `/exams?${queryParams.toString()}`
    );
    return response.data.data;
};

/**
 * Get exam by ID (participant view)
 * GET /api/v1/exams/:id
 */
export const getExam = async (examId: number): Promise<ExamDetailResponse> => {
    const response = await apiClient.get<ApiResponse<ExamDetailResponse>>(
        `/exams/${examId}`
    );
    return response.data.data;
};

/**
 * Start an exam (creates user_exam session)
 * POST /api/v1/exams/:id/start
 */
export const startExam = async (examId: number): Promise<StartExamResponse> => {
    const response = await apiClient.post<ApiResponse<StartExamResponse>>(
        `/exams/${examId}/start`
    );
    return response.data.data;
};

// ============================================================================
// ADMIN ENDPOINTS
// ============================================================================

/**
 * Get all exams (admin view)
 * GET /api/v1/admin/exams
 */
export const getAdminExams = async (
    params: AdminExamsQueryParams = {}
): Promise<AdminExamsResponse> => {
    const { page = 1, limit = 10, search, status, sortBy, sortOrder, createdBy } = params;

    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });

    if (search) queryParams.append('search', search);
    if (status && status !== 'all') {
        queryParams.append('isActive', status === 'active' ? 'true' : 'false');
    }
    if (sortBy) queryParams.append('sortBy', sortBy);
    if (sortOrder) queryParams.append('sortOrder', sortOrder);
    if (createdBy) queryParams.append('createdBy', createdBy.toString());

    const response = await apiClient.get<ApiResponse<AdminExamsResponse>>(
        `/admin/exams?${queryParams.toString()}`
    );
    return response.data.data;
};

/**
 * Get exam by ID (admin view)
 * GET /api/v1/admin/exams/:id
 */
export const getAdminExam = async (examId: number): Promise<AdminExamDetailResponse> => {
    const response = await apiClient.get<ApiResponse<AdminExamDetailResponse>>(
        `/admin/exams/${examId}`
    );
    return response.data.data;
};

/**
 * Get exam questions (admin view, includes correct answers)
 * GET /api/v1/admin/exams/:id/questions
 */
export const getExamQuestions = async (
    examId: number,
    params?: { type?: 'TIU' | 'TWK' | 'TKP' }
): Promise<ExamQuestionsResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.append('type', params.type);

    const queryString = queryParams.toString();
    const url = queryString
        ? `/admin/exams/${examId}/questions?${queryString}`
        : `/admin/exams/${examId}/questions`;

    const response = await apiClient.get<ApiResponse<ExamQuestionsResponse>>(url);
    return response.data.data;
};

/**
 * Create new exam
 * POST /api/v1/admin/exams
 */
export const createExam = async (
    data: CreateExamRequest
): Promise<CreateExamResponse> => {
    const response = await apiClient.post<ApiResponse<CreateExamResponse>>(
        '/admin/exams',
        data
    );
    return response.data.data;
};

/**
 * Update exam
 * PATCH /api/v1/admin/exams/:id
 */
export const updateExam = async (
    examId: number,
    data: UpdateExamRequest
): Promise<UpdateExamResponse> => {
    const response = await apiClient.patch<ApiResponse<UpdateExamResponse>>(
        `/admin/exams/${examId}`,
        data
    );
    return response.data.data;
};

/**
 * Delete exam
 * DELETE /api/v1/admin/exams/:id
 */
export const deleteExam = async (examId: number): Promise<DeleteExamResponse> => {
    const response = await apiClient.delete<ApiResponse<DeleteExamResponse>>(
        `/admin/exams/${examId}`
    );
    return response.data.data;
};

/**
 * Attach questions to exam
 * POST /api/v1/admin/exams/:id/questions
 */
export const attachQuestions = async (
    examId: number,
    data: AttachQuestionsRequest
): Promise<AttachQuestionsResponse> => {
    const response = await apiClient.post<ApiResponse<AttachQuestionsResponse>>(
        `/admin/exams/${examId}/questions`,
        data
    );
    return response.data.data;
};

/**
 * Detach questions from exam
 * DELETE /api/v1/admin/exams/:id/questions
 */
export const detachQuestions = async (
    examId: number,
    data: DetachQuestionsRequest
): Promise<DetachQuestionsResponse> => {
    const response = await apiClient.delete<ApiResponse<DetachQuestionsResponse>>(
        `/admin/exams/${examId}/questions`,
        { data }
    );
    return response.data.data;
};

// ============================================================================
// NAMED EXPORT OBJECT
// ============================================================================

export const examsApi = {
    // Participant
    getExams,
    getExam,
    startExam,
    // Admin
    getAdminExams,
    getAdminExam,
    getExamQuestions,
    createExam,
    updateExam,
    deleteExam,
    attachQuestions,
    detachQuestions,
};