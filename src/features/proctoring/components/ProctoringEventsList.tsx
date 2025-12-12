/**
 * Proctoring Events List Component
 */

'use client';

import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/shared/components/ui/table';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import {
    Eye,
    EyeOff,
    Users,
    AlertTriangle,
} from 'lucide-react';
import type { ProctoringEvent } from '../types/proctoring.types';
import type { Severity, ProctoringEventType } from '@/shared/types/enum.types';

// ============================================================================
// PROPS
// ============================================================================

interface ProctoringEventsListProps {
    events: ProctoringEvent[];
    showUserInfo?: boolean;
}

// ============================================================================
// CONFIG
// ============================================================================

const severityConfig: Record<Severity, {
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    color: string;
}> = {
    LOW: {
        label: 'Rendah',
        variant: 'outline',
        color: 'text-green-600 bg-green-50',
    },
    MEDIUM: {
        label: 'Sedang',
        variant: 'secondary',
        color: 'text-yellow-600 bg-yellow-50',
    },
    HIGH: {
        label: 'Tinggi',
        variant: 'destructive',
        color: 'text-red-600 bg-red-50',
    },
};

const eventTypeConfig: Record<ProctoringEventType, {
    label: string;
    icon: typeof Eye;
    description: string;
}> = {
    FACE_DETECTED: {
        label: 'Wajah Terdeteksi',
        icon: Eye,
        description: 'Wajah pengguna terdeteksi dengan jelas',
    },
    NO_FACE_DETECTED: {
        label: 'Tidak Ada Wajah',
        icon: EyeOff,
        description: 'Wajah tidak terdeteksi di frame',
    },
    MULTIPLE_FACES: {
        label: 'Banyak Wajah',
        icon: Users,
        description: 'Lebih dari satu wajah terdeteksi',
    },
    LOOKING_AWAY: {
        label: 'Melihat Ke Samping',
        icon: AlertTriangle,
        description: 'Pengguna tidak melihat ke layar',
    },
};

// ============================================================================
// COMPONENT
// ============================================================================

export function ProctoringEventsList({
                                         events,
                                         showUserInfo = false,
                                     }: ProctoringEventsListProps) {
    if (events.length === 0) {
        return (
            <Card>
                <CardContent className="py-8">
                    <p className="text-center text-muted-foreground">
                        Tidak ada event proctoring
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">
                    Riwayat Proctoring ({events.length} event)
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Waktu</TableHead>
                                <TableHead>Tipe Event</TableHead>
                                <TableHead>Severity</TableHead>
                                <TableHead>Confidence</TableHead>
                                {showUserInfo && <TableHead>User</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {events.map((event) => {
                                const eventInfo = eventTypeConfig[event.eventType];
                                const severity = (event.severity as Severity) || 'LOW';
                                const severityInfo = severityConfig[severity];
                                const EventIcon = eventInfo?.icon ?? AlertTriangle;

                                const metadata = event.metadata as Record<string, unknown> | null;
                                const confidence = metadata?.confidence as number | undefined;

                                return (
                                    <TableRow key={event.id}>
                                        <TableCell className="whitespace-nowrap">
                                            {format(
                                                new Date(event.timestamp),
                                                'HH:mm:ss',
                                                { locale: localeId }
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <EventIcon className="h-4 w-4 text-muted-foreground" />
                                                <span>{eventInfo?.label ?? event.eventType}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={severityInfo.variant}
                                                className={severityInfo.color}
                                            >
                                                {severityInfo.label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {/* ✅ PHASE 3 FIX: Use metadata.confidence */}
                                            {confidence !== undefined && confidence !== null ? (
                                                <span className="font-mono text-sm">
                                                    {(confidence * 100).toFixed(1)}%
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground">-</span>
                                            )}
                                        </TableCell>
                                        {showUserInfo && (
                                            <TableCell>
                                                {event.userExam?.user?.name ?? '-'}
                                            </TableCell>
                                        )}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}

export default ProctoringEventsList;