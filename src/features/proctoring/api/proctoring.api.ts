/**
 * PROCTORING API CLIENT
 *
 * Query params for events endpoints:
 * - page?: number
 * - limit?: number
 * - eventType?: ProctoringEventType
 * - startDate?: string (ISO datetime)
 * - endDate?: string (ISO datetime)
 * - sortOrder?: 'asc' | 'desc'
 *
 * Backend endpoints:
 * - POST /api/v1/proctoring/exam-sessions/:id/analyze-face (ML integration)
 * - GET /api/v1/proctoring/exam-sessions/:id/events
 * - POST /api/v1/proctoring/events
 * - GET /api/v1/admin/proctoring/events
 * - GET /api/v1/admin/proctoring/exam-sessions/:id/events
 */

import { apiClient } from '@/shared/lib/api';
import type {
    // Request types
    AnalyzeFaceRequest,
    LogEventRequest,
    ProctoringEventsQueryParams,
    AdminProctoringEventsQueryParams,
    // Response types
    AnalyzeFaceResponse,
    ProctoringEventsResponse,
    AdminProctoringEventsResponse,
    LogEventResponse,
} from '../types/proctoring.types';

export const proctoringApi = {
    // =========================================================================
    // PARTICIPANT ENDPOINTS
    // =========================================================================

    /**
     * Analyze face image via YOLO ML service
     * POST /api/v1/proctoring/exam-sessions/:sessionId/analyze-face
     *
     * ⚠️ THIS IS THE CORE ML INTEGRATION FOR THESIS DEMONSTRATION
     *
     * @returns AnalyzeFaceResponse = { analysis, eventLogged, eventType, usedFallback }
     */
    analyzeFace: async (
        sessionId: number,
        data: AnalyzeFaceRequest
    ): Promise<AnalyzeFaceResponse> => {
        const response = await apiClient.post<AnalyzeFaceResponse>(
            `/proctoring/exam-sessions/${sessionId}/analyze-face`,
            data
        );
        return response.data;
    },

    /**
     * Get proctoring events for a session (participant view)
     * GET /api/v1/proctoring/exam-sessions/:sessionId/events
     *
     * @returns ProctoringEventsResponse = { data: ProctoringEvent[], pagination: PaginationMeta }
     */
    getEvents: async (
        sessionId: number,
        params: ProctoringEventsQueryParams = {}
    ): Promise<ProctoringEventsResponse> => {
        const queryParams = new URLSearchParams();

        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.eventType) queryParams.append('eventType', params.eventType);
        if (params.startDate) queryParams.append('startDate', params.startDate);
        if (params.endDate) queryParams.append('endDate', params.endDate);
        if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

        const queryString = queryParams.toString();
        const url = queryString
            ? `/proctoring/exam-sessions/${sessionId}/events?${queryString}`
            : `/proctoring/exam-sessions/${sessionId}/events`;

        const response = await apiClient.get<ProctoringEventsResponse>(url);
        return response.data;
    },

    /**
     * Log proctoring event manually
     * POST /api/v1/proctoring/events
     *
     * @returns LogEventResponse = { event: ProctoringEvent }
     */
    logEvent: async (data: LogEventRequest): Promise<LogEventResponse> => {
        const response = await apiClient.post<LogEventResponse>('/proctoring/events', data);
        return response.data;
    },

    // =========================================================================
    // ADMIN ENDPOINTS
    // =========================================================================

    /**
     * Get all proctoring events (admin view)
     * GET /api/v1/admin/proctoring/events
     *
     * @returns AdminProctoringEventsResponse = { data: ProctoringEvent[], pagination: PaginationMeta }
     */
    getAdminEvents: async (
        params: AdminProctoringEventsQueryParams = {}
    ): Promise<AdminProctoringEventsResponse> => {
        const queryParams = new URLSearchParams();

        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.eventType) queryParams.append('eventType', params.eventType);
        if (params.userExamId) queryParams.append('userExamId', params.userExamId.toString());
        if (params.startDate) queryParams.append('startDate', params.startDate);
        if (params.endDate) queryParams.append('endDate', params.endDate);
        if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

        const queryString = queryParams.toString();
        const url = queryString ? `/admin/proctoring/events?${queryString}` : '/admin/proctoring/events';

        const response = await apiClient.get<AdminProctoringEventsResponse>(url);
        return response.data;
    },

    /**
     * Get proctoring events for specific session (admin view)
     * GET /api/v1/admin/proctoring/exam-sessions/:userExamId/events
     *
     * @returns ProctoringEventsResponse = { data: ProctoringEvent[], pagination: PaginationMeta }
     */
    getAdminSessionEvents: async (
        userExamId: number,
        params: ProctoringEventsQueryParams = {}
    ): Promise<ProctoringEventsResponse> => {
        const queryParams = new URLSearchParams();

        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.eventType) queryParams.append('eventType', params.eventType);
        if (params.startDate) queryParams.append('startDate', params.startDate);
        if (params.endDate) queryParams.append('endDate', params.endDate);
        if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

        const queryString = queryParams.toString();
        const url = queryString
            ? `/admin/proctoring/exam-sessions/${userExamId}/events?${queryString}`
            : `/admin/proctoring/exam-sessions/${userExamId}/events`;

        const response = await apiClient.get<ProctoringEventsResponse>(url);
        return response.data;
    },
};