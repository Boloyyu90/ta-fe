// src/features/proctoring/hooks/useAnalyzeFace.ts
import { useMutation } from '@tanstack/react-query';
import { proctoringApi } from '../api/proctoring.api';
import { useProctoringStore } from '../store/proctoring.store';
import type { AnalyzeFaceRequest } from '../types/proctoring.types';
import { toast } from 'sonner';
import { useEffect } from 'react';

interface UseAnalyzeFaceParams {
    sessionId: number;
    onViolation?: (severity: string) => void;
    onCancel?: () => void;
}

export function useAnalyzeFace({ sessionId, onViolation, onCancel }: UseAnalyzeFaceParams) {
    const { addViolation } = useProctoringStore();

    const mutation = useMutation({
        mutationFn: (data: AnalyzeFaceRequest) => proctoringApi.analyzeFace(sessionId, data),
    });

    // Handle success
    useEffect(() => {
        if (mutation.isSuccess && mutation.data) {
            const { analysis, eventLogged } = mutation.data.data;

            // Check for violations
            const hasViolations = analysis.violations.some((v: string) => v !== 'FACE_DETECTED');

            if (hasViolations && eventLogged) {
                // Add to local store
                const violation = {
                    id: `${Date.now()}-${Math.random()}`,
                    type: analysis.violations[0],
                    severity: 'HIGH' as const,
                    timestamp: new Date().toISOString(),
                    message: analysis.message,
                };

                addViolation(violation);

                // Show warning
                toast.error('⚠️ Proctoring Warning', {
                    description: analysis.message,
                    duration: 5000,
                });

                if (onViolation) {
                    onViolation('HIGH');
                }
            }
        }
    }, [mutation.isSuccess, mutation.data, addViolation, onViolation]);

    // Handle errors (silent - don't block exam)
    useEffect(() => {
        if (mutation.isError) {
            console.error('Face analysis error:', mutation.error);
            // Don't show toast - fails silently
        }
    }, [mutation.isError, mutation.error]);

    return mutation;
}