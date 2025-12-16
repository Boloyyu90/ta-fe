/**
 * Hook to log proctoring events manually
 *
 * Backend: POST /api/v1/proctoring/events
 * Response: LogEventResponse = { event: ProctoringEvent }
 *
 * Use cases:
 * - Tab switch detection
 * - Browser resize
 * - Copy/paste attempts
 * - Right-click detection
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { proctoringApi } from '../api/proctoring.api';
import type { LogEventRequest, LogEventResponse } from '../types/proctoring.types';

export function useLogEvent() {
    const queryClient = useQueryClient();

    return useMutation<LogEventResponse, Error, LogEventRequest>({
        mutationFn: (data: LogEventRequest) => proctoringApi.logEvent(data),

        onSuccess: (_, variables) => {
            // Invalidate events for the session
            queryClient.invalidateQueries({
                queryKey: ['proctoring-events', variables.userExamId],
            });
        },
    });
}

export default useLogEvent;