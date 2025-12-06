// src/lib/utils/formatters.ts

/**
 * UTILITY FORMATTERS
 *
 * Common formatting functions for dates, durations, etc.
 */

/**
 * Format ISO date string to readable format
 * @param dateString - ISO date string (e.g., "2025-01-15T10:30:00.000Z")
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string (e.g., "Jan 15, 2025")
 */
export function formatDate(
    dateString: string | null | undefined,
    options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }
): string {
    if (!dateString) return '-';

    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '-';

        return new Intl.DateTimeFormat('en-US', options).format(date);
    } catch (error) {
        console.error('Error formatting date:', error);
        return '-';
    }
}

/**
 * Format duration in minutes to human-readable format
 * @param minutes - Duration in minutes
 * @returns Formatted string (e.g., "2h 30m" or "45m")
 */
export function formatDuration(minutes: number | null | undefined): string {
    if (minutes === null || minutes === undefined || minutes === 0) return '-';

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours === 0) {
        return `${remainingMinutes}m`;
    }

    if (remainingMinutes === 0) {
        return `${hours}h`;
    }

    return `${hours}h ${remainingMinutes}m`;
}

/**
 * Format ISO datetime string to time only
 * @param dateString - ISO date string
 * @returns Time string (e.g., "10:30 AM")
 */
export function formatTime(dateString: string | null | undefined): string {
    if (!dateString) return '-';

    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '-';

        return new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        }).format(date);
    } catch (error) {
        console.error('Error formatting time:', error);
        return '-';
    }
}

/**
 * Format ISO datetime string to full datetime
 * @param dateString - ISO date string
 * @returns Formatted datetime (e.g., "Jan 15, 2025 at 10:30 AM")
 */
export function formatDateTime(dateString: string | null | undefined): string {
    if (!dateString) return '-';

    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '-';

        const dateStr = formatDate(dateString);
        const timeStr = formatTime(dateString);

        return `${dateStr} at ${timeStr}`;
    } catch (error) {
        console.error('Error formatting datetime:', error);
        return '-';
    }
}

/**
 * Format score with optional precision
 * @param score - Score value
 * @param precision - Decimal places (default: 0)
 * @returns Formatted score string
 */
export function formatScore(
    score: number | null | undefined,
    precision: number = 0
): string {
    if (score === null || score === undefined) return '-';
    return score.toFixed(precision);
}

/**
 * Format percentage
 * @param value - Percentage value (0-100)
 * @param precision - Decimal places (default: 0)
 * @returns Formatted percentage (e.g., "85%")
 */
export function formatPercentage(
    value: number | null | undefined,
    precision: number = 0
): string {
    if (value === null || value === undefined) return '-';
    return `${value.toFixed(precision)}%`;
}