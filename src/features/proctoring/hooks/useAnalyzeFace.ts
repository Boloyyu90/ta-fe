/**
 * Hook to analyze face via YOLO
 *
 * Backend: POST /api/v1/proctoring/exam-sessions/:id/analyze-face
 * Response: { analysis, eventLogged, eventType, usedFallback }
 *
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { proctoringApi } from '../api/proctoring.api';
import type {
    AnalyzeFaceRequest,
    AnalyzeFaceResponse,
} from '../types/proctoring.types';

export function useAnalyzeFace(sessionId: number) {
    const queryClient = useQueryClient();

    return useMutation<AnalyzeFaceResponse, Error, AnalyzeFaceRequest>({
        mutationFn: (data: AnalyzeFaceRequest) =>
            proctoringApi.analyzeFace(sessionId, data),

        onSuccess: (data: AnalyzeFaceResponse) => {
            if (data.eventLogged) {
                queryClient.invalidateQueries({
                    queryKey: ['proctoring-events', sessionId],
                });
            }
        },

        // Don't retry on errors (rate limiting consideration)
        retry: false,
    });
}

export default useAnalyzeFace;