// src/features/exam-sessions/utils/status-config.ts
import {
    Clock,
    PlayCircle,
    CheckCircle,
    XCircle,
    Timer,
    Ban,
    type LucideIcon,
} from 'lucide-react';
import type { UserExamStatus } from '@/features/exam-sessions/types/exam-sessions.types';

export interface StatusConfig {
    label: string;
    color: string;
    icon: LucideIcon;
}

/**
 * Get status configuration for UserExamStatus
 * Returns label, color class, and icon component
 */
export function getStatusConfig(status: UserExamStatus): StatusConfig {
    const configs: Record<UserExamStatus, StatusConfig> = {
        NOT_STARTED: {
            label: 'Not Started',
            color: 'bg-gray-100 text-gray-700 border-gray-300',
            icon: Clock,
        },
        IN_PROGRESS: {
            label: 'In Progress',
            color: 'bg-blue-100 text-blue-700 border-blue-300',
            icon: PlayCircle,
        },
        FINISHED: {
            label: 'Finished',
            color: 'bg-green-100 text-green-700 border-green-300',
            icon: CheckCircle,
        },
        TIMEOUT: {
            label: 'Timeout',
            color: 'bg-orange-100 text-orange-700 border-orange-300',
            icon: Timer,
        },
        CANCELLED: {
            label: 'Cancelled',
            color: 'bg-red-100 text-red-700 border-red-300',
            icon: XCircle,
        },
        COMPLETED: {
            label: 'Completed',
            color: 'bg-purple-100 text-purple-700 border-purple-300',
            icon: CheckCircle,
        },
    };

    return configs[status];
}