/**
 * EXAMS API CLIENT
 *
 * Backend endpoints:
 * - Participant: /api/v1/exams/*
 * - Admin: /api/v1/admin/exams/*
 */

import { apiClient } from '@/shared/lib/api';
import type {
    // Query params
    ExamsQueryParams,
    AdminExamsQueryParams,
    // Request types
    CreateExamRequest,
    UpdateExamRequest,
    AttachQuestionsRequest,
    DetachQuestionsRequest,
    // Response types (Phase 1 aligned)
    ExamsListResponse,
    ExamDetailResponse,
    StartExamResponse,
    AdminExamsListResponse,
    AdminExamDetailResponse,
    CreateExamResponse,
    UpdateExamResponse,
    DeleteExamResponse,
    AttachQuestionsResponse,
    DetachQuestionsResponse,
    ExamQuestionsListResponse,
} from '../types/exams.types';
import type { QuestionType } from '@/shared/types/enum.types';

// ============================================================================
// PARTICIPANT ENDPOINTS
// ============================================================================

/**
 * Get available exams (participant view)
 * GET /api/v1/exams
 *
 * @returns ExamsListResponse = { data: ExamPublic[], pagination: PaginationMeta }
 */
export const getExams = async (params: ExamsQueryParams = {}): Promise<ExamsListResponse> => {
    const { page = 1, limit = 10, search, sortBy, sortOrder } = params;

    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });

    if (search) queryParams.append('search', search);
    if (sortBy) queryParams.append('sortBy', sortBy);
    if (sortOrder) queryParams.append('sortOrder', sortOrder);

    const response = await apiClient.get<ExamsListResponse>(`/exams?${queryParams.toString()}`);
    return response.data;
};

/**
 * Get exam by ID (participant view)
 * GET /api/v1/exams/:id
 *
 * @returns ExamDetailResponse = { exam: Exam }
 */
export const getExam = async (examId: number): Promise<ExamDetailResponse> => {
    const response = await apiClient.get<ExamDetailResponse>(`/exams/${examId}`);
    return response.data;
};

/**
 * Start an exam (creates user_exam session)
 * POST /api/v1/exams/:id/start
 *
 * @returns StartExamResponse = { userExam, questions, answers }
 */
export const startExam = async (examId: number): Promise<StartExamResponse> => {
    const response = await apiClient.post<StartExamResponse>(`/exams/${examId}/start`);
    return response.data;
};

// ============================================================================
// ADMIN ENDPOINTS
// ============================================================================

/**
 * Get all exams (admin view)
 * GET /api/v1/admin/exams
 *
 * @returns AdminExamsListResponse = { data: Exam[], pagination: PaginationMeta }
 */
export const getAdminExams = async (
    params: AdminExamsQueryParams = {}
): Promise<AdminExamsListResponse> => {
    const { page = 1, limit = 10, search, sortBy, sortOrder, createdBy } = params;

    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });

    if (search) queryParams.append('search', search);
    if (sortBy) queryParams.append('sortBy', sortBy);
    if (sortOrder) queryParams.append('sortOrder', sortOrder);
    if (createdBy) queryParams.append('createdBy', createdBy.toString());

    const response = await apiClient.get<AdminExamsListResponse>(
        `/admin/exams?${queryParams.toString()}`
    );
    return response.data;
};

/**
 * Get exam by ID (admin view)
 * GET /api/v1/admin/exams/:id
 *
 * @returns AdminExamDetailResponse = { exam: Exam }
 */
export const getAdminExam = async (examId: number): Promise<AdminExamDetailResponse> => {
    const response = await apiClient.get<AdminExamDetailResponse>(`/admin/exams/${examId}`);
    return response.data;
};

/**
 * Create a new exam
 * POST /api/v1/admin/exams
 *
 * @returns CreateExamResponse = { exam: Exam }
 */
export const createExam = async (data: CreateExamRequest): Promise<CreateExamResponse> => {
    const response = await apiClient.post<CreateExamResponse>('/admin/exams', data);
    return response.data;
};

/**
 * Update an existing exam
 * PATCH /api/v1/admin/exams/:id
 *
 * @returns UpdateExamResponse = { exam: Exam }
 */
export const updateExam = async (
    examId: number,
    data: UpdateExamRequest
): Promise<UpdateExamResponse> => {
    const response = await apiClient.patch<UpdateExamResponse>(`/admin/exams/${examId}`, data);
    return response.data;
};

/**
 * Delete an exam
 * DELETE /api/v1/admin/exams/:id
 *
 * @returns DeleteExamResponse = { message: string }
 */
export const deleteExam = async (examId: number): Promise<DeleteExamResponse> => {
    const response = await apiClient.delete<DeleteExamResponse>(`/admin/exams/${examId}`);
    return response.data;
};

/**
 * Attach questions to an exam
 * POST /api/v1/admin/exams/:id/questions
 *
 * @returns AttachQuestionsResponse = { message, attached, alreadyAttached? }
 */
export const attachQuestions = async (
    examId: number,
    data: AttachQuestionsRequest
): Promise<AttachQuestionsResponse> => {
    const response = await apiClient.post<AttachQuestionsResponse>(
        `/admin/exams/${examId}/questions`,
        data
    );
    return response.data;
};

/**
 * Detach questions from an exam
 * DELETE /api/v1/admin/exams/:id/questions
 *
 * @returns DetachQuestionsResponse = { message, detached }
 */
export const detachQuestions = async (
    examId: number,
    data: DetachQuestionsRequest
): Promise<DetachQuestionsResponse> => {
    const response = await apiClient.delete<DetachQuestionsResponse>(
        `/admin/exams/${examId}/questions`,
        { data }
    );
    return response.data;
};

/**
 * Get questions attached to an exam
 * GET /api/v1/admin/exams/:id/questions
 *
 * @returns ExamQuestionsListResponse = { data: ExamQuestion[], pagination }
 */
export const getExamQuestions = async (
    examId: number,
    params: { type?: QuestionType } = {}
): Promise<ExamQuestionsListResponse> => {
    const queryParams = new URLSearchParams();
    if (params.type) {
        queryParams.append('type', params.type);
    }
    const qs = queryParams.toString();
    const response = await apiClient.get<ExamQuestionsListResponse>(
        `/admin/exams/${examId}/questions${qs ? '?' + qs : ''}`
    );
    return response.data; // { questions, total }
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
    createExam,
    updateExam,
    deleteExam,
    attachQuestions,
    detachQuestions,
    getExamQuestions,
};