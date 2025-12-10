// src/features/proctoring/hooks/useAnalyzeFace.ts

/**
 * Hook to analyze face via YOLO
 *
 * ✅ AUDIT FIX v4: eventLogged is now properly typed in AnalyzeFaceResponse
 *
 * ✅ Rate limited: 30 requests/minute
 * ✅ Invalidates events cache on violation
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { proctoringApi } from '../api/proctoring.api';
import type { AnalyzeFaceRequest, AnalyzeFaceResponse } from '../types/proctoring.types';

export function useAnalyzeFace(sessionId: number) {
    const queryClient = useQueryClient();

    return useMutation<AnalyzeFaceResponse, Error, AnalyzeFaceRequest>({
        mutationFn: (data: AnalyzeFaceRequest) =>
            proctoringApi.analyzeFace(sessionId, data),

        onSuccess: (data: AnalyzeFaceResponse) => {
            // ✅ FIX: eventLogged is now properly typed
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