// src/features/proctoring/api/proctoring.api.ts

/**
 * Proctoring API Client
 *
 * ✅ AUDIT FIX v3:
 * - Fixed response unwrapping: use `response.data` (interceptor already unwraps AxiosResponse)
 *
 * Backend: /api/v1/proctoring/*
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
    analyzeFace: async (sessionId: number, data: AnalyzeFaceRequest): Promise<AnalyzeFaceResponse> => {
        const response = await apiClient.post<ApiResponse<AnalyzeFaceResponse>>(
            `/proctoring/exam-sessions/${sessionId}/analyze-face`,
            data
        );
        // response is ApiResponse<AnalyzeFaceResponse> (interceptor unwraps AxiosResponse)
        // response.data is AnalyzeFaceResponse
        return response.data;
    },

    /**
     * Get proctoring events for a session
     * GET /api/v1/proctoring/exam-sessions/:sessionId/events
     */
    getEvents: async (sessionId: number, params: ProctoringEventsParams = {}): Promise<ProctoringEventsResponse> => {
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
        return response.data;
    },

    /**
     * Log proctoring event manually
     * POST /api/v1/proctoring/events
     */
    logEvent: async (data: LogEventRequest): Promise<LogEventResponse> => {
        const response = await apiClient.post<ApiResponse<LogEventResponse>>(
            '/proctoring/events',
            data
        );
        return response.data;
    },
};