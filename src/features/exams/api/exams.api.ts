// src/features/exams/api/exams.api.ts

/**
 * EXAMS API CLIENT - BACKEND-ALIGNED
 *
 * ✅ UPDATED: All types match new exams.types.ts
 * ✅ Proper ApiResponse unwrapping
 * ✅ Correct return types for all endpoints
 */

import { apiClient } from '@/shared/lib/api';
import type { ApiResponse } from '@/shared/types/api.types';
import type {
    ExamsListResponse,
    AdminExamsListResponse,
    ExamDetailResponse,
    AdminExamDetailResponse,
    CreateExamRequest,
    CreateExamResponse,
    UpdateExamRequest,
    UpdateExamResponse,
    DeleteExamResponse,
    StartExamResponse,
    AttachQuestionsRequest,
    AttachQuestionsResponse,
    DetachQuestionsRequest,
    DetachQuestionsResponse,
    ExamsQueryParams,
    AdminExamsQueryParams,
} from '../types/exams.types';

export const examsApi = {
    // ============================================================================
    // PARTICIPANT ENDPOINTS
    // ============================================================================

    /**
     * Get available exams (participant view)
     * GET /exams?page=1&limit=10&search=CPNS
     *
     * Returns: ApiResponse<{ data: Exam[], pagination: PaginationMeta }>
     * After unwrap: { data: Exam[], pagination: {...} }
     */
    getExams: async (params: ExamsQueryParams = {}): Promise<ExamsListResponse> => {
        const response = await apiClient.get<ApiResponse<ExamsListResponse>>(
            '/exams',
            { params }
        );
        return response.data; // Unwrap: { data: [...], pagination: {...} }
    },

    /**
     * Get single exam detail (participant view)
     * GET /exams/:id
     *
     * Returns: ApiResponse<{ exam: Exam }>
     * After unwrap: { exam: Exam }
     */
    getExam: async (id: number): Promise<ExamDetailResponse> => {
        const response = await apiClient.get<ApiResponse<ExamDetailResponse>>(
            `/exams/${id}`
        );
        return response.data; // Unwrap: { exam: {...} }
    },

    /**
     * Start exam (create UserExam session)
     * POST /exams/:id/start
     *
     * Returns: ApiResponse<{ userExam: UserExam, questions: [...], answers: [...] }>
     * After unwrap: { userExam: {...}, questions: [...], answers: [...] }
     */
    startExam: async (id: number): Promise<StartExamResponse> => {
        const response = await apiClient.post<ApiResponse<StartExamResponse>>(
            `/exams/${id}/start`
        );
        return response.data; // Unwrap: { userExam: {...}, questions: [...], answers: [...] }
    },

    // ============================================================================
    // ADMIN ENDPOINTS
    // ============================================================================

    /**
     * Get all exams (admin view)
     * GET /admin/exams?page=1&limit=10&search=CPNS
     *
     * Returns: ApiResponse<{ data: Exam[], pagination: PaginationMeta }>
     * After unwrap: { data: Exam[], pagination: {...} }
     */
    getAdminExams: async (params: AdminExamsQueryParams = {}): Promise<AdminExamsListResponse> => {
        const response = await apiClient.get<ApiResponse<AdminExamsListResponse>>(
            '/admin/exams',
            { params }
        );
        return response.data; // Unwrap: { data: [...], pagination: {...} }
    },

    /**
     * Get single exam detail (admin view)
     * GET /admin/exams/:id
     *
     * Returns: ApiResponse<{ exam: Exam }>
     * After unwrap: { exam: Exam }
     */
    getAdminExam: async (id: number): Promise<AdminExamDetailResponse> => {
        const response = await apiClient.get<ApiResponse<AdminExamDetailResponse>>(
            `/admin/exams/${id}`
        );
        return response.data; // Unwrap: { exam: {...} }
    },

    /**
     * Create new exam (admin only)
     * POST /admin/exams
     *
     * Returns: ApiResponse<{ exam: Exam }>
     * After unwrap: { exam: Exam }
     */
    createExam: async (data: CreateExamRequest): Promise<CreateExamResponse> => {
        const response = await apiClient.post<ApiResponse<CreateExamResponse>>(
            '/admin/exams',
            data
        );
        return response.data; // Unwrap: { exam: {...} }
    },

    /**
     * Update exam (admin only)
     * PATCH /admin/exams/:id
     *
     * Returns: ApiResponse<{ exam: Exam }>
     * After unwrap: { exam: Exam }
     */
    updateExam: async (id: number, data: UpdateExamRequest): Promise<UpdateExamResponse> => {
        const response = await apiClient.patch<ApiResponse<UpdateExamResponse>>(
            `/admin/exams/${id}`,
            data
        );
        return response.data; // Unwrap: { exam: {...} }
    },

    /**
     * Delete exam (admin only)
     * DELETE /admin/exams/:id
     *
     * Returns: ApiResponse<{ success: boolean }>
     * After unwrap: { success: true }
     */
    deleteExam: async (id: number): Promise<DeleteExamResponse> => {
        const response = await apiClient.delete<ApiResponse<DeleteExamResponse>>(
            `/admin/exams/${id}`
        );
        return response.data; // Unwrap: { success: true }
    },

    /**
     * Attach questions to exam (admin only)
     * POST /admin/exams/:id/questions
     *
     * Returns: ApiResponse<{ message: string, attached: number }>
     * After unwrap: { message: "...", attached: N }
     */
    attachQuestions: async (
        id: number,
        data: AttachQuestionsRequest
    ): Promise<AttachQuestionsResponse> => {
        const response = await apiClient.post<ApiResponse<AttachQuestionsResponse>>(
            `/admin/exams/${id}/questions`,
            data
        );
        return response.data; // Unwrap: { message: "...", attached: N }
    },

    /**
     * Detach questions from exam (admin only)
     * DELETE /admin/exams/:id/questions
     *
     * Returns: ApiResponse<{ message: string, detached: number }>
     * After unwrap: { message: "...", detached: N }
     */
    detachQuestions: async (
        id: number,
        data: DetachQuestionsRequest
    ): Promise<DetachQuestionsResponse> => {
        const response = await apiClient.delete<ApiResponse<DetachQuestionsResponse>>(
            `/admin/exams/${id}/questions`,
            { data } // DELETE with body requires data in config
        );
        return response.data; // Unwrap: { message: "...", detached: N }
    },

    /**
     * Get exam questions with correct answers (admin only)
     * GET /admin/exams/:id/questions
     *
     * Returns: ApiResponse<{ questions: Question[] }>
     * After unwrap: { questions: Question[] }
     */
    getExamQuestions: async (id: number): Promise<{ questions: any[] }> => {
        const response = await apiClient.get<ApiResponse<{ questions: any[] }>>(
            `/admin/exams/${id}/questions`
        );
        return response.data; // Unwrap: { questions: [...] }
    },
};