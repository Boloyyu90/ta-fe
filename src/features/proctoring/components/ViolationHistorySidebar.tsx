// src/features/proctoring/components/ViolationHistorySidebar.tsx

/**
 * Violation History Sidebar Component
 *
 * A collapsible sidebar that displays the history of proctoring violations
 * with severity-based color coding and real-time updates.
 *
 * Features:
 * - Color-coded violation cards by severity
 * - Relative time formatting ("2 menit lalu")
 * - Empty state with success indicator
 * - Scrollable list for many violations
 * - Collapsible on mobile
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import {
    AlertTriangle,
    AlertCircle,
    Info,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    Shield,
    Eye,
    EyeOff,
    Users,
} from 'lucide-react';
import type { Violation, Severity, ProctoringEventType } from '../types/proctoring.types';
import { useProctoringStore } from '../store/proctoring.store';
import { cn } from '@/shared/lib/utils';

// ============================================================================
// COMPONENT PROPS
// ============================================================================

export interface ViolationHistorySidebarProps {
    /** Optional custom class name */
    className?: string;
    /** Maximum height (default: 400px) */
    maxHeight?: string;
    /** Collapsible on mobile */
    collapsible?: boolean;
}

// ============================================================================
// SEVERITY CONFIG
// ============================================================================

const severityConfig: Record<Severity, {
    bgColor: string;
    borderColor: string;
    textColor: string;
    Icon: typeof AlertTriangle;
}> = {
    HIGH: {
        bgColor: 'bg-destructive/10 dark:bg-destructive/20',
        borderColor: 'border-l-severity-high',
        textColor: 'text-severity-high',
        Icon: AlertTriangle,
    },
    MEDIUM: {
        bgColor: 'bg-warning/10 dark:bg-warning/20',
        borderColor: 'border-l-severity-medium',
        textColor: 'text-severity-medium',
        Icon: AlertCircle,
    },
    LOW: {
        bgColor: 'bg-muted dark:bg-muted',
        borderColor: 'border-l-severity-low',
        textColor: 'text-severity-low',
        Icon: Info,
    },
};

// ============================================================================
// EVENT TYPE CONFIG
// ============================================================================

const eventTypeConfig: Record<ProctoringEventType, {
    label: string;
    Icon: typeof Eye;
}> = {
    FACE_DETECTED: {
        label: 'Wajah Terdeteksi',
        Icon: Eye,
    },
    NO_FACE_DETECTED: {
        label: 'Wajah Tidak Terdeteksi',
        Icon: EyeOff,
    },
    MULTIPLE_FACES: {
        label: 'Banyak Wajah',
        Icon: Users,
    },
    LOOKING_AWAY: {
        label: 'Tidak Fokus',
        Icon: AlertTriangle,
    },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatRelativeTime(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);

    if (diffSec < 5) return 'Baru saja';
    if (diffSec < 60) return `${diffSec} detik lalu`;
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} menit lalu`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} jam lalu`;
    return date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
    });
}

function getSeverityLabel(severity: Severity): string {
    const labels: Record<Severity, string> = {
        HIGH: 'Tinggi',
        MEDIUM: 'Sedang',
        LOW: 'Rendah',
    };
    return labels[severity];
}

// ============================================================================
// COMPONENT
// ============================================================================

export function ViolationHistorySidebar({
    className,
    maxHeight = '400px',
    collapsible = true,
}: ViolationHistorySidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Get violations from store
    const { violations, violationCount, highViolationCount } = useProctoringStore();

    // Filter out FACE_DETECTED events (those are not violations)
    const actualViolations = violations.filter(v => v.type !== 'FACE_DETECTED');

    return (
        <Card className={cn("transition-all", className)}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Riwayat Monitoring
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <Badge
                            variant={violationCount > 0 ? "destructive" : "secondary"}
                            className="text-xs"
                        >
                            {violationCount} pelanggaran
                        </Badge>
                        {collapsible && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 lg:hidden"
                                onClick={() => setIsCollapsed(!isCollapsed)}
                            >
                                {isCollapsed ? (
                                    <ChevronDown className="h-4 w-4" />
                                ) : (
                                    <ChevronUp className="h-4 w-4" />
                                )}
                            </Button>
                        )}
                    </div>
                </div>

                {/* High Severity Warning */}
                {highViolationCount >= 2 && (
                    <div className="mt-2 p-2 rounded-lg bg-destructive/10 dark:bg-destructive/20 border border-destructive/20 dark:border-destructive/30">
                        <p className="text-xs text-destructive flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            <span>
                                <strong>{highViolationCount}</strong> pelanggaran serius.
                                {highViolationCount < 3 && ' 1 lagi akan membatalkan ujian.'}
                            </span>
                        </p>
                    </div>
                )}
            </CardHeader>

            <CardContent className={cn(
                "p-3 transition-all",
                isCollapsed && collapsible && "hidden lg:block"
            )}>
                {actualViolations.length > 0 ? (
                    <ScrollArea style={{ maxHeight }} className="pr-3">
                        <div className="space-y-2">
                            {actualViolations.map((violation) => {
                                const config = severityConfig[violation.severity];
                                const eventConfig = eventTypeConfig[violation.type];
                                const { Icon: SeverityIcon } = config;
                                const { Icon: EventIcon, label: eventLabel } = eventConfig || {
                                    Icon: AlertCircle,
                                    label: violation.type.replace(/_/g, ' '),
                                };

                                return (
                                    <div
                                        key={violation.id}
                                        className={cn(
                                            "p-3 rounded-lg border-l-4 text-xs transition-all",
                                            "hover:shadow-sm",
                                            config.bgColor,
                                            config.borderColor
                                        )}
                                    >
                                        <div className="flex items-start gap-2">
                                            <SeverityIcon className={cn(
                                                "h-4 w-4 flex-shrink-0 mt-0.5",
                                                config.textColor
                                            )} />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5 mb-1">
                                                    <EventIcon className="h-3 w-3 text-muted-foreground" />
                                                    <p className="font-medium truncate">
                                                        {eventLabel}
                                                    </p>
                                                </div>
                                                <p className="text-muted-foreground line-clamp-2">
                                                    {violation.message}
                                                </p>
                                                <p className="text-muted-foreground mt-1 opacity-75">
                                                    {formatRelativeTime(violation.timestamp)}
                                                </p>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "text-xs flex-shrink-0 px-1.5",
                                                    violation.severity === 'HIGH' && "border-severity-high text-severity-high",
                                                    violation.severity === 'MEDIUM' && "border-severity-medium text-severity-medium",
                                                    violation.severity === 'LOW' && "border-severity-low text-severity-low"
                                                )}
                                            >
                                                {getSeverityLabel(violation.severity)}
                                            </Badge>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </ScrollArea>
                ) : (
                    <div className="text-center py-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-success/10 dark:bg-success/20 mb-3">
                            <CheckCircle className="h-6 w-6 text-success" />
                        </div>
                        <p className="text-sm font-medium text-success">
                            Tidak ada pelanggaran
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Sistem monitoring aktif
                        </p>
                        <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-muted-foreground">
                            <div className="h-2 w-2 bg-success rounded-full animate-pulse" />
                            <span>AI Monitoring</span>
                        </div>
                    </div>
                )}

                {/* Stats Footer */}
                {actualViolations.length > 0 && (
                    <div className="mt-3 pt-3 border-t grid grid-cols-2 gap-2">
                        <div className="text-center p-2 rounded-lg bg-muted">
                            <div className="text-lg font-bold">{violationCount}</div>
                            <div className="text-xs text-muted-foreground">Total</div>
                        </div>
                        <div className={cn(
                            "text-center p-2 rounded-lg",
                            highViolationCount > 0
                                ? "bg-destructive/10 dark:bg-destructive/20"
                                : "bg-muted"
                        )}>
                            <div className={cn(
                                "text-lg font-bold",
                                highViolationCount > 0 && "text-destructive"
                            )}>
                                {highViolationCount}
                            </div>
                            <div className="text-xs text-muted-foreground">Serius</div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default ViolationHistorySidebar;
