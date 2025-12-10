// src/features/proctoring/components/ProctoringEventsList.tsx

/**
 * Proctoring Events List Component
 *
 * ✅ AUDIT FIX v3:
 * - Import ViolationSeverity from proctoring types (re-exported)
 * - Use details and mlConfidence from ProctoringEvent
 */

'use client';

import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import {
    AlertTriangle,
    Eye,
    EyeOff,
    Users,
    AlertCircle,
    CheckCircle,
} from 'lucide-react';
import type { ProctoringEvent, ViolationSeverity, ProctoringEventType } from '../types/proctoring.types';

export interface ProctoringEventsListProps {
    events: ProctoringEvent[];
    isLoading?: boolean;
    maxHeight?: string;
}

const eventTypeConfig: Record<ProctoringEventType, {
    label: string;
    icon: typeof AlertTriangle;
    color: string;
}> = {
    FACE_DETECTED: {
        label: 'Wajah Terdeteksi',
        icon: CheckCircle,
        color: 'text-green-600',
    },
    NO_FACE_DETECTED: {
        label: 'Wajah Tidak Terdeteksi',
        icon: EyeOff,
        color: 'text-red-600',
    },
    MULTIPLE_FACES: {
        label: 'Multiple Faces',
        icon: Users,
        color: 'text-orange-600',
    },
    LOOKING_AWAY: {
        label: 'Tidak Melihat Layar',
        icon: Eye,
        color: 'text-yellow-600',
    },
};

const severityConfig: Record<ViolationSeverity, {
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    label: string;
}> = {
    LOW: { variant: 'outline', label: 'Rendah' },
    MEDIUM: { variant: 'secondary', label: 'Sedang' },
    HIGH: { variant: 'destructive', label: 'Tinggi' },
};

export function ProctoringEventsList({
                                         events,
                                         isLoading,
                                         maxHeight = '400px',
                                     }: ProctoringEventsListProps) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Riwayat Proctoring</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        Memuat data...
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (events.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Riwayat Proctoring</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>Belum ada event proctoring</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                    <span>Riwayat Proctoring</span>
                    <Badge variant="outline">{events.length} events</Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea style={{ maxHeight }} className="pr-4">
                    <div className="space-y-3">
                        {events.map((event) => {
                            const typeConfig = eventTypeConfig[event.eventType];
                            const severity = severityConfig[event.severity];
                            const Icon = typeConfig?.icon || AlertTriangle;

                            return (
                                <div
                                    key={event.id}
                                    className="flex items-start gap-3 p-3 rounded-lg border bg-card"
                                >
                                    <div className={`mt-0.5 ${typeConfig?.color || 'text-gray-600'}`}>
                                        <Icon className="h-5 w-5" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-sm">
                                                {typeConfig?.label || event.eventType}
                                            </span>
                                            <Badge variant={severity?.variant || 'outline'} className="text-xs">
                                                {severity?.label || event.severity}
                                            </Badge>
                                        </div>

                                        {/* ✅ FIX: details field is now on ProctoringEvent */}
                                        {event.details && (
                                            <p className="text-sm text-muted-foreground">
                                                {event.details}
                                            </p>
                                        )}

                                        {/* ✅ FIX: mlConfidence field is now on ProctoringEvent */}
                                        {event.mlConfidence !== null && event.mlConfidence !== undefined && (
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                                <span>Confidence:</span>
                                                <span className="font-medium">
                                                    {(event.mlConfidence * 100).toFixed(1)}%
                                                </span>
                                            </div>
                                        )}

                                        <p className="text-xs text-muted-foreground mt-1">
                                            {format(new Date(event.timestamp), 'PPp', { locale: localeId })}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}

export default ProctoringEventsList;