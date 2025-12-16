/**
 * ADMIN EXAM SESSIONS API
 *
 * Backend endpoints:
 * - GET /api/v1/admin/exam-sessions (all sessions with filters)
 * - GET /api/v1/admin/exam-sessions/:id (session detail)
 * - GET /api/v1/admin/exam-sessions/:id/answers (session answers)
 * - GET /api/v1/admin/results (all results - same as sessions)
 */

import { apiClient } from '@/shared/lib/api';
import type { PaginationMeta } from '@/shared/types/api.types';
import type { ExamStatus } from '@/shared/types/enum.types';
import type { ExamResult, ExamAnswersResponse } from '../types/exam-sessions.types';

// ============================================================================
// QUERY PARAMS
// ============================================================================

export interface AdminSessionsQueryParams {
    page?: number;
    limit?: number;
    examId?: number;
    userId?: number;
    status?: ExamStatus;
}

// ============================================================================
// RESPONSE TYPES
// ============================================================================

export interface AdminSessionsListResponse {
    data: ExamResult[];
    pagination: PaginationMeta;
}

// Re-use ExamResult type for admin view (same structure)
export type AdminSessionDetailResponse = ExamResult;

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * Get all exam sessions (admin view)
 * GET /api/v1/admin/exam-sessions
 */
export const getAdminSessions = async (
    params: AdminSessionsQueryParams = {}
): Promise<AdminSessionsListResponse> => {
    const { page = 1, limit = 10, examId, userId, status } = params;

    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });

    if (examId) queryParams.append('examId', examId.toString());
    if (userId) queryParams.append('userId', userId.toString());
    if (status) queryParams.append('status', status);

    const response = await apiClient.get<AdminSessionsListResponse>(
        `/admin/exam-sessions?${queryParams.toString()}`
    );
    return response.data;
};

/**
 * Get single exam session detail (admin view)
 * GET /api/v1/admin/exam-sessions/:id
 */
export const getAdminSession = async (sessionId: number): Promise<AdminSessionDetailResponse> => {
    const response = await apiClient.get<AdminSessionDetailResponse>(
        `/admin/exam-sessions/${sessionId}`
    );
    return response.data;
};

/**
 * Get exam session answers (admin view)
 * GET /api/v1/admin/exam-sessions/:id/answers
 */
export const getAdminSessionAnswers = async (sessionId: number): Promise<ExamAnswersResponse> => {
    const response = await apiClient.get<ExamAnswersResponse>(
        `/admin/exam-sessions/${sessionId}/answers`
    );
    return response.data;
};

/**
 * Get all results (admin view) - alias for admin/exam-sessions
 * GET /api/v1/admin/results
 */
export const getAdminResults = async (
    params: AdminSessionsQueryParams = {}
): Promise<AdminSessionsListResponse> => {
    const { page = 1, limit = 10, examId, userId, status } = params;

    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });

    if (examId) queryParams.append('examId', examId.toString());
    if (userId) queryParams.append('userId', userId.toString());
    if (status) queryParams.append('status', status);

    const response = await apiClient.get<AdminSessionsListResponse>(
        `/admin/results?${queryParams.toString()}`
    );
    return response.data;
};

// Named export object
export const adminSessionsApi = {
    getAdminSessions,
    getAdminSession,
    getAdminSessionAnswers,
    getAdminResults,
};