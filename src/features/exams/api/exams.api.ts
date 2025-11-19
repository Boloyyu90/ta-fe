// src/features/exams/api/exams.api.ts
import { apiClient } from '@/shared/lib/api';
import type {
    ExamsListResponse,
    ExamDetailResponse,
    CreateExamRequest,
    CreateExamResponse,
    UpdateExamRequest,
    UpdateExamResponse,
    DeleteExamResponse,
    AttachQuestionsRequest,
    AttachQuestionsResponse,
    DetachQuestionsRequest,
    DetachQuestionsResponse,
    ExamQuestionsResponse,
    ExamsQueryParams,
    ExamQuestionsQueryParams,
} from '../types/exams.types';

/**
 * Exams API Client
 * Implements all 8 exam-related endpoints from backend
 *
 * NOTE: apiClient.get() returns the unwrapped response body via interceptor
 * Backend response: { success: true, data: {...}, message: string, timestamp: string }
 * Interceptor unwraps to: { success: true, data: {...}, message: string, timestamp: string }
 * We access .data to get the actual payload
 */
export const examsApi = {
    // ============================================================================
    // PARTICIPANT ENDPOINTS (3)
    // ============================================================================

    /**
     * Get available exams (participant view)
     * GET /exams
     */
    async getExams(params?: ExamsQueryParams): Promise<ExamsListResponse> {
        const response = await apiClient.get<{ success: boolean; data: ExamsListResponse }>('/exams', { params });
        return response.data; // Unwrap { success, data, message, timestamp } → data
    },

    /**
     * Get exam detail
     * GET /exams/:id
     */
    async getExam(examId: number): Promise<ExamDetailResponse> {
        const response = await apiClient.get<{ success: boolean; data: ExamDetailResponse }>(`/exams/${examId}`);
        return response.data;
    },

    /**
     * Start exam session
     * POST /exams/:id/start
     */
    async startExam(examId: number) {
        const response = await apiClient.post<{ success: boolean; data: any }>(`/exams/${examId}/start`);
        return response.data;
    },

    // ============================================================================
    // ADMIN ENDPOINTS (8 total - 5 more below)
    // ============================================================================

    /**
     * Create new exam (admin only)
     * POST /admin/exams
     */
    async createExam(data: CreateExamRequest): Promise<CreateExamResponse> {
        const response = await apiClient.post<{ success: boolean; data: CreateExamResponse }>('/admin/exams', data);
        return response.data;
    },

    /**
     * Get all exams (admin view, includes drafts)
     * GET /admin/exams
     */
    async getAllExams(params?: ExamsQueryParams): Promise<ExamsListResponse> {
        const response = await apiClient.get<{ success: boolean; data: ExamsListResponse }>('/admin/exams', { params });
        return response.data;
    },

    /**
     * Get exam by ID (admin view, includes correct answers)
     * GET /admin/exams/:id
     */
    async getExamAdmin(examId: number): Promise<ExamDetailResponse> {
        const response = await apiClient.get<{ success: boolean; data: ExamDetailResponse }>(`/admin/exams/${examId}`);
        return response.data;
    },

    /**
     * Update exam
     * PATCH /admin/exams/:id
     */
    async updateExam(examId: number, data: UpdateExamRequest): Promise<UpdateExamResponse> {
        const response = await apiClient.patch<{ success: boolean; data: UpdateExamResponse }>(`/admin/exams/${examId}`, data);
        return response.data;
    },

    /**
     * Delete exam
     * DELETE /admin/exams/:id
     */
    async deleteExam(examId: number): Promise<DeleteExamResponse> {
        const response = await apiClient.delete<{ success: boolean; data: DeleteExamResponse }>(`/admin/exams/${examId}`);
        return response.data;
    },

    /**
     * Attach questions to exam
     * POST /admin/exams/:id/questions
     */
    async attachQuestions(
        examId: number,
        data: AttachQuestionsRequest
    ): Promise<AttachQuestionsResponse> {
        const response = await apiClient.post<{ success: boolean; data: AttachQuestionsResponse }>(
            `/admin/exams/${examId}/questions`,
            data
        );
        return response.data;
    },

    /**
     * Detach questions from exam
     * DELETE /admin/exams/:id/questions
     */
    async detachQuestions(
        examId: number,
        data: DetachQuestionsRequest
    ): Promise<DetachQuestionsResponse> {
        const response = await apiClient.delete<{ success: boolean; data: DetachQuestionsResponse }>(
            `/admin/exams/${examId}/questions`,
            { data }
        );
        return response.data;
    },

    /**
     * Get exam questions (admin view)
     * GET /admin/exams/:id/questions
     */
    async getExamQuestions(
        examId: number,
        params?: ExamQuestionsQueryParams
    ): Promise<ExamQuestionsResponse> {
        const response = await apiClient.get<{ success: boolean; data: ExamQuestionsResponse }>(
            `/admin/exams/${examId}/questions`,
            { params }
        );
        return response.data;
    },
};