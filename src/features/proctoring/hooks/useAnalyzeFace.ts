// src/features/proctoring/hooks/useAnalyzeFace.ts
import { useMutation } from '@tanstack/react-query';
import { proctoringApi } from '../api/proctoring.api';
import { useProctoringStore } from '../store/proctoring.store';
import type { AnalyzeFaceRequest } from '../types/proctoring.types';
import { toast } from 'sonner';
import { useEffect } from 'react';

interface UseAnalyzeFaceParams {
    sessionId: number;
    onViolation?: (warningLevel: number) => void;
    onCancel?: () => void;
}

export function useAnalyzeFace({ sessionId, onViolation, onCancel }: UseAnalyzeFaceParams) {
    const { addViolation, setWarningLevel } = useProctoringStore();

    const mutation = useMutation({
        mutationFn: (data: AnalyzeFaceRequest) => proctoringApi.analyzeFace(sessionId, data),
    });

    // Handle success
    useEffect(() => {
        if (mutation.isSuccess && mutation.data) {
            const { violations, warningLevel, shouldCancel, message } = mutation.data;

            // Log violations to store
            violations.forEach((violation) => addViolation(violation));

            // Update warning level
            if (warningLevel !== undefined) {
                setWarningLevel(warningLevel);
                if (onViolation) onViolation(warningLevel);
            }

            // Show warnings
            if (violations.length > 0) {
                const highViolations = violations.filter((v) => v.severity === 'HIGH');

                if (highViolations.length > 0) {
                    toast.error(`⚠️ Warning ${warningLevel}/3`, {
                        description: message || highViolations[0].message,
                        duration: 5000,
                    });
                }
            }

            // Handle auto-cancel
            if (shouldCancel && onCancel) {
                toast.error('Exam Cancelled', {
                    description: 'Your exam has been cancelled due to multiple violations.',
                    duration: 10000,
                });
                onCancel();
            }
        }
    }, [mutation.isSuccess, mutation.data, addViolation, setWarningLevel, onViolation, onCancel]);

    // Handle errors (silent - don't block exam)
    useEffect(() => {
        if (mutation.isError) {
            console.error('Face analysis error:', mutation.error);
            // Don't show toast - fails silently
        }
    }, [mutation.isError, mutation.error]);

    return mutation;
}