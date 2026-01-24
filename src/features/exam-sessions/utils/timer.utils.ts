// src/features/exam-sessions/utils/timer.utils.ts

/**
 * Timer Utilities
 * Helper functions for exam timer management
 */

export interface TimeSegments {
    hours: string;
    minutes: string;
    seconds: string;
}

export const timerUtils = {
    /**
     * Format milliseconds to MM:SS display
     * @param ms - Milliseconds remaining
     * @returns Formatted time string (e.g., "45:30")
     */
    formatTime(ms: number): string {
        if (ms <= 0) return '00:00';

        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    },

    /**
     * Format milliseconds to separate hour/minute/second segments
     * @param ms - Milliseconds remaining
     * @returns Object with hours, minutes, seconds as zero-padded strings
     */
    formatTimeSegments(ms: number): TimeSegments {
        if (ms <= 0) return { hours: '00', minutes: '00', seconds: '00' };

        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return {
            hours: hours.toString().padStart(2, '0'),
            minutes: minutes.toString().padStart(2, '0'),
            seconds: seconds.toString().padStart(2, '0'),
        };
    },

    /**
     * Calculate remaining time from start time and duration
     * @param startedAt - ISO datetime string
     * @param durationMinutes - Exam duration in minutes
     * @returns Milliseconds remaining (can be negative if expired)
     */
    calculateRemainingTime(startedAt: string, durationMinutes: number): number {
        const startTime = new Date(startedAt).getTime();
        const endTime = startTime + durationMinutes * 60 * 1000;
        const now = Date.now();

        return endTime - now;
    },

    /**
     * Check if time is critically low (< 5 minutes)
     */
    isCriticalTime(ms: number): boolean {
        return ms > 0 && ms <= 5 * 60 * 1000; // 5 minutes
    },

    /**
     * Check if time has expired
     */
    isExpired(ms: number): boolean {
        return ms <= 0;
    },

    /**
     * Get time status color
     */
    getTimeColor(ms: number): string {
        if (this.isExpired(ms)) return 'text-destructive';
        if (this.isCriticalTime(ms)) return 'text-warning';
        return 'text-foreground';
    },
};