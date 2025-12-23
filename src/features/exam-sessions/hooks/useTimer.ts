// src/features/exam-sessions/hooks/useTimer.ts
import { useState, useEffect, useRef } from 'react';
import { timerUtils } from '../utils/timer.utils';

interface UseTimerOptions {
    startedAt: string;
    durationMinutes: number;
    onExpire?: () => void;
    onCritical?: () => void; // Called when < 5 minutes
}

export function useTimer({ startedAt, durationMinutes, onExpire, onCritical }: UseTimerOptions) {
    // Check if we have valid duration data (treat ≤ 0 as "loading")
    const isLoading = !durationMinutes || durationMinutes <= 0;

    const [remainingMs, setRemainingMs] = useState(() => {
        if (isLoading) return Infinity; // Return infinity while loading
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
            isCritical: false,
            isExpired: false,
            timeColor: 'text-muted-foreground',
            isLoading: true,
        };
    }

    return {
        remainingMs,
        formattedTime: timerUtils.formatTime(remainingMs),
        isCritical: timerUtils.isCriticalTime(remainingMs),
        isExpired: timerUtils.isExpired(remainingMs),
        timeColor: timerUtils.getTimeColor(remainingMs),
        isLoading: false,
    };
}