/**
 * Status Configuration Utilities
 */

import {
    Clock,
    PlayCircle,
    CheckCircle,
    XCircle,
    Timer,
    type LucideIcon,
} from 'lucide-react';
import type { ExamStatus } from '@/shared/types/enum.types';

export interface StatusConfig {
    label: string;
    labelId: string;        // Indonesian label
    color: string;
    bgColor: string;
    icon: LucideIcon;
    canContinue: boolean;   // Whether user can continue this exam
}

/**
 * Status configuration map
 */
export const STATUS_CONFIG: Record<ExamStatus, StatusConfig> = {
    IN_PROGRESS: {
        label: 'In Progress',
        labelId: 'Sedang Berlangsung',
        color: 'text-primary',
        bgColor: 'bg-primary/10 border-primary/30',
        icon: PlayCircle,
        canContinue: true,
    },
    FINISHED: {
        label: 'Finished',
        labelId: 'Selesai',
        color: 'text-success',
        bgColor: 'bg-success/10 border-success/30',
        icon: CheckCircle,
        canContinue: false,
    },
    TIMEOUT: {
        label: 'Timeout',
        labelId: 'Waktu Habis',
        color: 'text-warning',
        bgColor: 'bg-warning/10 border-warning/30',
        icon: Timer,
        canContinue: false,
    },
    CANCELLED: {
        label: 'Cancelled',
        labelId: 'Dibatalkan',
        color: 'text-destructive',
        bgColor: 'bg-destructive/10 border-destructive/30',
        icon: XCircle,
        canContinue: false,
    },
};

/**
 * Get status configuration for ExamStatus
 * Returns label, color class, and icon component
 *
 * @param status - ExamStatus value from backend
 * @returns StatusConfig object
 */
export function getStatusConfig(status: ExamStatus): StatusConfig {
    return STATUS_CONFIG[status] ?? STATUS_CONFIG.IN_PROGRESS;
}

/**
 * Check if a status allows continuing the exam
 */
export function canContinueExam(status: ExamStatus): boolean {
    return STATUS_CONFIG[status]?.canContinue ?? false;
}

/**
 * Check if a status represents a completed exam (show results)
 */
export function isExamCompleted(status: ExamStatus): boolean {
    return status === 'FINISHED' || status === 'TIMEOUT' || status === 'CANCELLED';
}

/**
 * Get badge variant for status
 */
export function getStatusBadgeVariant(status: ExamStatus): 'default' | 'secondary' | 'destructive' | 'outline' {
    switch (status) {
        case 'IN_PROGRESS':
            return 'default';
        case 'FINISHED':
            return 'secondary';
        case 'TIMEOUT':
        case 'CANCELLED':
            return 'destructive';
        default:
            return 'outline';
    }
}