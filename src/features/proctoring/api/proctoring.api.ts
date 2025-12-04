// src/features/proctoring/api/proctoring.api.ts
import { apiClient } from '@/shared/lib/api';
import type {
    AnalyzeFaceRequest,
    AnalyzeFaceResponse,
    ProctoringEventsResponse,
    ProctoringEventsParams,
} from '../types/proctoring.types';

export const proctoringApi = {
    // Analyze face image
    analyzeFace: async (
        sessionId: number,
        data: AnalyzeFaceRequest
    ): Promise<AnalyzeFaceResponse> => {
        const response = await apiClient.post(
            `/proctoring/exam-sessions/${sessionId}/analyze-face`,
            data
        );
        return response.data;
    },

    // Get proctoring events (participant view)
    getEvents: async (
        sessionId: number,
        params: ProctoringEventsParams = {}
    ): Promise<ProctoringEventsResponse> => {
        const { page = 1, limit = 50, eventType, severity } = params;

        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        if (eventType) {
            queryParams.append('eventType', eventType);
        }

        if (severity) {
            queryParams.append('severity', severity);
        }

        const response = await apiClient.get(
            `/proctoring/exam-sessions/${sessionId}/events?${queryParams.toString()}`
        );
        return response.data;
    },

    // Get proctoring events (admin view)
    getEventsAdmin: async (
        sessionId: number,
        params: ProctoringEventsParams = {}
    ): Promise<ProctoringEventsResponse> => {
        const { page = 1, limit = 50, eventType, severity } = params;

        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        if (eventType) {
            queryParams.append('eventType', eventType);
        }

        if (severity) {
            queryParams.append('severity', severity);
        }

        const response = await apiClient.get(
            `/admin/proctoring/exam-sessions/${sessionId}/events?${queryParams.toString()}`
        );
        return response.data;
    },
};