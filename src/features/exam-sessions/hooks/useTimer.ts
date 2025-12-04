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
    const [remainingMs, setRemainingMs] = useState(() =>
        timerUtils.calculateRemainingTime(startedAt, durationMinutes)
    );

    const criticalWarningShown = useRef(false);
    const expiredCallbackFired = useRef(false);

    useEffect(() => {
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
    }, [startedAt, durationMinutes, onExpire, onCritical]);

    return {
        remainingMs,
        formattedTime: timerUtils.formatTime(remainingMs),
        isCritical: timerUtils.isCriticalTime(remainingMs),
        isExpired: timerUtils.isExpired(remainingMs),
        timeColor: timerUtils.getTimeColor(remainingMs),
    };
}