// src/features/proctoring/components/FullScreenViolationAlert.tsx

/**
 * Full-Screen Violation Alert Component
 *
 * A dramatic, attention-grabbing overlay that appears when a violation
 * is detected during the exam. Designed for maximum visual impact
 * during thesis defense demonstration.
 *
 * Features:
 * - Full-screen semi-transparent overlay
 * - Animated entrance/exit with framer-motion
 * - Severity-based color coding
 * - Auto-dismiss after 3 seconds
 * - Shake animation for critical alerts
 */

'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import {
    AlertTriangle,
    AlertCircle,
    Info,
    XCircle,
} from 'lucide-react';
import type { Violation, Severity, ProctoringEventType } from '../types/proctoring.types';
import { cn } from '@/shared/lib/utils';

// ============================================================================
// COMPONENT PROPS
// ============================================================================

export interface FullScreenViolationAlertProps {
    /** The violation to display */
    violation: Violation | null;
    /** Whether to show the alert */
    show: boolean;
    /** Callback when alert is dismissed */
    onDismiss: () => void;
    /** Total violation count for badge */
    violationCount: number;
    /** Auto-dismiss delay in milliseconds (default: 3000) */
    autoDismissDelay?: number;
}

// ============================================================================
// SEVERITY CONFIG
// ============================================================================

const severityConfig: Record<Severity, {
    bgColor: string;
    iconBgColor: string;
    iconColor: string;
    borderColor: string;
    Icon: typeof AlertTriangle;
    label: string;
    animation: string;
}> = {
    HIGH: {
        bgColor: 'bg-red-500/10',
        iconBgColor: 'bg-red-100 dark:bg-red-900/30',
        iconColor: 'text-severity-high',
        borderColor: 'border-severity-high/50',
        Icon: XCircle,
        label: 'Pelanggaran Serius',
        animation: 'animate-shake',
    },
    MEDIUM: {
        bgColor: 'bg-yellow-500/10',
        iconBgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
        iconColor: 'text-severity-medium',
        borderColor: 'border-severity-medium/50',
        Icon: AlertTriangle,
        label: 'Peringatan',
        animation: '',
    },
    LOW: {
        bgColor: 'bg-gray-500/10',
        iconBgColor: 'bg-gray-100 dark:bg-gray-900/30',
        iconColor: 'text-severity-low',
        borderColor: 'border-severity-low/50',
        Icon: Info,
        label: 'Informasi',
        animation: '',
    },
};

// ============================================================================
// VIOLATION MESSAGES
// ============================================================================

function getViolationMessage(eventType: ProctoringEventType): {
    title: string;
    description: string;
} {
    const messages: Record<ProctoringEventType, { title: string; description: string }> = {
        NO_FACE_DETECTED: {
            title: 'Wajah Tidak Terdeteksi',
            description: 'Wajah Anda tidak terdeteksi oleh kamera. Pastikan wajah Anda terlihat jelas dan pencahayaan cukup.',
        },
        MULTIPLE_FACES: {
            title: 'Terdeteksi Lebih Dari Satu Wajah',
            description: 'Sistem mendeteksi lebih dari satu wajah. Pastikan hanya Anda yang berada di depan kamera.',
        },
        LOOKING_AWAY: {
            title: 'Tidak Fokus ke Layar',
            description: 'Anda terlihat tidak fokus ke layar ujian. Tetap fokus pada soal untuk menghindari pelanggaran.',
        },
        FACE_DETECTED: {
            title: 'Wajah Terdeteksi',
            description: 'Wajah Anda terdeteksi dengan baik.',
        },
    };

    return messages[eventType] ?? {
        title: 'Pelanggaran Terdeteksi',
        description: 'Sistem mendeteksi aktivitas yang perlu diperhatikan.',
    };
}

// ============================================================================
// COMPONENT
// ============================================================================

export function FullScreenViolationAlert({
    violation,
    show,
    onDismiss,
    violationCount,
    autoDismissDelay = 3000,
}: FullScreenViolationAlertProps) {
    // Auto-dismiss effect
    useEffect(() => {
        if (show && autoDismissDelay > 0) {
            const timer = setTimeout(() => {
                onDismiss();
            }, autoDismissDelay);
            return () => clearTimeout(timer);
        }
    }, [show, autoDismissDelay, onDismiss]);

    if (!violation) return null;

    const config = severityConfig[violation.severity];
    const { Icon } = config;
    const message = getViolationMessage(violation.type);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                        "fixed inset-0 z-[100] flex items-center justify-center p-4",
                        config.bgColor,
                        "backdrop-blur-sm"
                    )}
                    onClick={onDismiss}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 25,
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Card className={cn(
                            "max-w-md shadow-2xl border-2",
                            config.borderColor,
                            config.animation
                        )}>
                            <CardContent className="p-6 text-center">
                                {/* Severity Icon */}
                                <div className={cn(
                                    "inline-flex items-center justify-center w-16 h-16 rounded-full mb-4",
                                    config.iconBgColor
                                )}>
                                    <Icon className={cn("h-10 w-10", config.iconColor)} />
                                </div>

                                {/* Alert Title */}
                                <h3 className="text-lg font-bold mb-2">
                                    {message.title}
                                </h3>

                                {/* Alert Description */}
                                <p className="text-sm text-muted-foreground mb-4">
                                    {message.description}
                                </p>

                                {/* Violation Count Badge */}
                                <Badge
                                    variant="destructive"
                                    className="text-xs mb-4"
                                >
                                    Pelanggaran #{violationCount}
                                </Badge>

                                {/* Severity Badge */}
                                <div className="mb-4">
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            "text-xs",
                                            violation.severity === 'HIGH' && "border-severity-high text-severity-high",
                                            violation.severity === 'MEDIUM' && "border-severity-medium text-severity-medium",
                                            violation.severity === 'LOW' && "border-severity-low text-severity-low"
                                        )}
                                    >
                                        {config.label}
                                    </Badge>
                                </div>

                                {/* Timestamp */}
                                <p className="text-xs text-muted-foreground mb-4">
                                    {new Date(violation.timestamp).toLocaleTimeString('id-ID', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                    })}
                                </p>

                                {/* Dismiss Hint */}
                                <p className="text-xs text-muted-foreground">
                                    Klik di mana saja atau tunggu {autoDismissDelay / 1000} detik untuk melanjutkan
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default FullScreenViolationAlert;
