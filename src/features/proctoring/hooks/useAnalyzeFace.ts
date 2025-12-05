// src/features/proctoring/hooks/useAnalyzeFace.ts

/**
 * Hook to analyze face via YOLO
 *
 * ✅ Rate limited: 30 requests/minute
 * ✅ Invalidates events cache on violation
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { proctoringApi } from '../api/proctoring.api';
import type { AnalyzeFaceRequest } from '../types/proctoring.types';

export function useAnalyzeFace(sessionId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: AnalyzeFaceRequest) =>
            proctoringApi.analyzeFace(sessionId, data),

        onSuccess: (data) => {
            // If violation was logged, refresh events
            if (data.eventLogged) {
                queryClient.invalidateQueries({
                    queryKey: ['proctoring-events', sessionId]
                });
            }
        },

        // Don't retry on errors (rate limiting)
        retry: false,
    });
}