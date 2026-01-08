// src/features/exam-sessions/hooks/useTimer.ts
import { useState, useEffect, useRef } from 'react';
import { timerUtils, type TimeSegments } from '../utils/timer.utils';

interface UseTimerOptions {
    startedAt: string;
    durationMinutes: number;
    /**
     * Initial remaining time from server (milliseconds).
     * If provided, uses this for first render to avoid clock drift.
     * Falls back to client calculation if not provided.
     * Source: openapi-spec.yaml notes timer should use server-provided remainingTimeMs
     */
    initialRemainingMs?: number;
    onExpire?: () => void;
    onCritical?: () => void; // Called when < 5 minutes
}

export function useTimer({ startedAt, durationMinutes, initialRemainingMs, onExpire, onCritical }: UseTimerOptions) {
    // Check if we have valid duration data (treat ≤ 0 as "loading")
    const isLoading = !durationMinutes || durationMinutes <= 0;

    const [remainingMs, setRemainingMs] = useState(() => {
        if (isLoading) return Infinity; // Return infinity while loading
        // ✅ FIX: Use server-provided value if available, else calculate locally
        if (initialRemainingMs !== undefined && initialRemainingMs > 0) {
            return initialRemainingMs;
        }
        return timerUtils.calculateRemainingTime(startedAt, durationMinutes);
    });

    const criticalWarningShown = useRef(false);
    const expiredCallbackFired = useRef(false);

    useEffect(() => {
        // Don't start the timer if we're still loading session data
        if (isLoading) {
            setRemainingMs(Infinity);
            return;
        }

        const interval = setInterval(() => {
            const remaining = timerUtils.calculateRemainingTime(startedAt, durationMinutes);
            setRemainingMs(remaining);

            // Fire critical warning once
            if (timerUtils.isCriticalTime(remaining) && !criticalWarningShown.current) {
                criticalWarningShown.current = true;
                if (onCritical) onCritical();
            }

            // Fire expire callback once
            if (timerUtils.isExpired(remaining) && !expiredCallbackFired.current) {
                expiredCallbackFired.current = true;
                if (onExpire) onExpire();
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [startedAt, durationMinutes, onExpire, onCritical, isLoading]);

    // If loading, return safe loading state
    if (isLoading) {
        return {
            remainingMs: Infinity,
            formattedTime: '--:--',
            timeSegments: { hours: '--', minutes: '--', seconds: '--' } as TimeSegments,
            isCritical: false,
            isExpired: false,
            timeColor: 'text-muted-foreground',
            isLoading: true,
        };
    }

    return {
        remainingMs,
        formattedTime: timerUtils.formatTime(remainingMs),
        timeSegments: timerUtils.formatTimeSegments(remainingMs),
        isCritical: timerUtils.isCriticalTime(remainingMs),
        isExpired: timerUtils.isExpired(remainingMs),
        timeColor: timerUtils.getTimeColor(remainingMs),
        isLoading: false,
    };
}