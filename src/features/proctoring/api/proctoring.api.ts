// src/features/proctoring/api/proctoring.api.ts

/**
 * PROCTORING API CLIENT
 *
 * ✅ Correct response unwrapping
 * ✅ Matches backend API contract
 */

import { apiClient } from '@/shared/lib/api';
import type { ApiResponse } from '@/shared/types/api.types';
import type {
    AnalyzeFaceRequest,
    AnalyzeFaceResponse,
    ProctoringEventsResponse,
    ProctoringEventsParams,
    LogEventRequest,
    LogEventResponse,
} from '../types/proctoring.types';

export const proctoringApi = {
    /**
     * Analyze face image via YOLO
     * POST /api/v1/proctoring/exam-sessions/:sessionId/analyze-face
     */
    analyzeFace: async (sessionId: number, data: AnalyzeFaceRequest) => {
        const response = await apiClient.post<ApiResponse<AnalyzeFaceResponse>>(
            `/proctoring/exam-sessions/${sessionId}/analyze-face`,
            data
        );
        // Backend returns nested response
        return response.data.data;
    },

    /**
     * Get proctoring events for a session
     * GET /api/v1/proctoring/exam-sessions/:sessionId/events
     */
    getEvents: async (sessionId: number, params: ProctoringEventsParams = {}) => {
        const queryParams = new URLSearchParams();

        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.eventType) queryParams.append('eventType', params.eventType);
        if (params.severity) queryParams.append('severity', params.severity);

        const queryString = queryParams.toString();
        const url = queryString
            ? `/proctoring/exam-sessions/${sessionId}/events?${queryString}`
            : `/proctoring/exam-sessions/${sessionId}/events`;

        const response = await apiClient.get<ApiResponse<ProctoringEventsResponse>>(url);
        // Backend returns: { success: true, data: { data: [...], pagination: {...} } }
        return response.data.data;
    },

    /**
     * Log proctoring event manually
     * POST /api/v1/proctoring/events
     */
    logEvent: async (data: LogEventRequest) => {
        const response = await apiClient.post<ApiResponse<LogEventResponse>>(
            '/proctoring/events',
            data
        );
        return response.data.data;
    },
};