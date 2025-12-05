// src/features/proctoring/components/ProctoringEventsList.tsx
'use client';

import { AlertCircle, Eye, Users, TrendingUp, CheckCircle } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent } from '@/shared/components/ui/card';
import type { ProctoringEvent, ViolationSeverity } from '../types/proctoring.types';

interface ProctoringEventsListProps {
    events: ProctoringEvent[];
}

type EventType = 'PROCTORING_STARTED' | 'FACE_DETECTED' | 'NO_FACE_DETECTED' | 'MULTIPLE_FACES' | 'LOOKING_AWAY' | 'EXAM_AUTO_CANCELLED';

export function ProctoringEventsList({ events }: ProctoringEventsListProps) {
    const eventConfig: Record<EventType, {
        icon: typeof CheckCircle;
        label: string;
        color: string;
        bgColor: string;
    }> = {
        PROCTORING_STARTED: {
            icon: CheckCircle,
            label: 'Proctoring Started',
            color: 'text-green-600',
            bgColor: 'bg-green-50 dark:bg-green-950/30',
        },
        FACE_DETECTED: {
            icon: CheckCircle,
            label: 'Face Detected',
            color: 'text-green-600',
            bgColor: 'bg-green-50 dark:bg-green-950/30',
        },
        NO_FACE_DETECTED: {
            icon: AlertCircle,
            label: 'No Face Detected',
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
        },
        MULTIPLE_FACES: {
            icon: Users,
            label: 'Multiple Faces',
            color: 'text-red-600',
            bgColor: 'bg-red-50 dark:bg-red-950/30',
        },
        LOOKING_AWAY: {
            icon: Eye,
            label: 'Looking Away',
            color: 'text-orange-600',
            bgColor: 'bg-orange-50 dark:bg-orange-950/30',
        },
        EXAM_AUTO_CANCELLED: {
            icon: AlertCircle,
            label: 'Exam Auto-Cancelled',
            color: 'text-red-600',
            bgColor: 'bg-red-50 dark:bg-red-950/30',
        },
    };

    const severityConfig: Record<ViolationSeverity, { label: string; color: string }> = {
        INFO: { label: 'Info', color: 'bg-blue-100 text-blue-700' },
        LOW: { label: 'Low', color: 'bg-yellow-100 text-yellow-700' },
        MEDIUM: { label: 'Medium', color: 'bg-orange-100 text-orange-700' },
        HIGH: { label: 'High', color: 'bg-red-100 text-red-700' },
    };

    if (events.length === 0) {
        return (
            <Card>
                <CardContent className="py-12 text-center">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <p className="text-muted-foreground">No proctoring events recorded</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-3">
            {events.map((event) => {
                const config = eventConfig[event.eventType as EventType] || eventConfig.FACE_DETECTED;
                const EventIcon = config.icon;
                const severityStyle = severityConfig[event.severity];

                return (
                    <Card key={event.id} className={config.bgColor}>
                        <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                                <div className={`p-2 rounded-lg ${config.bgColor}`}>
                                    <EventIcon className={`h-5 w-5 ${config.color}`} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <div>
                                            <h4 className="font-semibold text-foreground">{config.label}</h4>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {new Date(event.timestamp).toLocaleString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    second: '2-digit',
                                                })}
                                            </p>
                                        </div>
                                        <Badge className={severityStyle.color}>
                                            {severityStyle.label}
                                        </Badge>
                                    </div>

                                    {event.details && (
                                        <p className="text-sm text-muted-foreground">{event.details}</p>
                                    )}

                                    {event.mlConfidence !== null && event.mlConfidence !== undefined && (
                                        <div className="mt-2 flex items-center gap-2">
                                            <span className="text-xs text-muted-foreground">
                                                ML Confidence:
                                            </span>
                                            <span className="text-xs font-semibold">
                                                {(event.mlConfidence * 100).toFixed(1)}%
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}