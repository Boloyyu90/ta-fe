// src/app/(admin)/admin/sessions/[id]/proctoring/page.tsx

/**
 * Admin Session Proctoring Events Page
 *
 * ✅ FIXED:
 * - Only use valid ProctoringEventType: FACE_DETECTED, NO_FACE_DETECTED, MULTIPLE_FACES, LOOKING_AWAY
 * - Only use valid Severity: LOW, MEDIUM, HIGH
 */

'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useAdminProctoringEvents } from '@/features/proctoring/hooks';
import type { ProctoringEventType, Severity } from '@/shared/types/enum.types';
import type { ProctoringEvent } from '@/features/proctoring/types/proctoring.types';

// UI Components
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/shared/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog';
import {
    ArrowLeft,
    RefreshCw,
    Eye,
    AlertTriangle,
    User,
    Users,
    EyeOff,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Camera,
} from 'lucide-react';

interface PageProps {
    params: Promise<{ id: string }>;
}

// ✅ FIX: Only use valid ProctoringEventType values
const eventTypeConfig: Record<ProctoringEventType, {
    label: string;
    icon: typeof AlertTriangle;
    color: string;
}> = {
    FACE_DETECTED: {
        label: 'Wajah Terdeteksi',
        icon: CheckCircle,
        color: 'text-green-500',
    },
    NO_FACE_DETECTED: {
        label: 'Tidak Ada Wajah',
        icon: EyeOff,
        color: 'text-red-500',
    },
    MULTIPLE_FACES: {
        label: 'Banyak Wajah',
        icon: Users,
        color: 'text-red-500',
    },
    LOOKING_AWAY: {
        label: 'Melihat ke Samping',
        icon: Eye,
        color: 'text-yellow-500',
    },
};

// ✅ FIX: Only use valid Severity values
const severityConfig: Record<Severity, {
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
}> = {
    LOW: { label: 'Rendah', variant: 'outline' },
    MEDIUM: { label: 'Sedang', variant: 'secondary' },
    HIGH: { label: 'Tinggi', variant: 'destructive' },
};

export default function SessionProctoringPage({ params }: PageProps) {
    const resolvedParams = use(params);
    const sessionId = parseInt(resolvedParams.id, 10);

    // State
    const [page, setPage] = useState(1);
    const [eventTypeFilter, setEventTypeFilter] = useState<ProctoringEventType | 'ALL'>('ALL');
    const [selectedEvent, setSelectedEvent] = useState<ProctoringEvent | null>(null);

    // Query
    const { data, isLoading, isError, refetch, isRefetching } = useAdminProctoringEvents({
        userExamId: sessionId,
        eventType: eventTypeFilter === 'ALL' ? undefined : eventTypeFilter,
        page,
        limit: 20,
    });

    // Extract data
    const events = data?.data || [];
    const pagination = data?.pagination;

    // Stats
    const stats = {
        total: pagination?.total || 0,
        noFace: events.filter((e: ProctoringEvent) => e.eventType === 'NO_FACE_DETECTED').length,
        multiple: events.filter((e: ProctoringEvent) => e.eventType === 'MULTIPLE_FACES').length,
        lookingAway: events.filter((e: ProctoringEvent) => e.eventType === 'LOOKING_AWAY').length,
    };

    // Format timestamp
    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleString('id-ID', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    return (
        <div className="container mx-auto py-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href={`/admin/sessions/${sessionId}`}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Camera className="h-6 w-6 text-primary" />
                            Proctoring Events
                        </h1>
                        <p className="text-muted-foreground">
                            Session #{sessionId}
                        </p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    onClick={() => refetch()}
                    disabled={isRefetching}
                >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                        <Camera className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                    </CardContent>
                </Card>
                <Card className="border-red-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-red-600">No Face</CardTitle>
                        <EyeOff className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{stats.noFace}</div>
                    </CardContent>
                </Card>
                <Card className="border-red-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-red-600">Multiple Faces</CardTitle>
                        <Users className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{stats.multiple}</div>
                    </CardContent>
                </Card>
                <Card className="border-yellow-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-yellow-600">Looking Away</CardTitle>
                        <Eye className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{stats.lookingAway}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filter */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex gap-4">
                        <Select
                            value={eventTypeFilter}
                            onValueChange={(value) => {
                                setEventTypeFilter(value as ProctoringEventType | 'ALL');
                                setPage(1);
                            }}
                        >
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Filter event type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Semua Event</SelectItem>
                                <SelectItem value="FACE_DETECTED">Wajah Terdeteksi</SelectItem>
                                <SelectItem value="NO_FACE_DETECTED">Tidak Ada Wajah</SelectItem>
                                <SelectItem value="MULTIPLE_FACES">Banyak Wajah</SelectItem>
                                <SelectItem value="LOOKING_AWAY">Melihat ke Samping</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Events Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Event</CardTitle>
                    <CardDescription>
                        {pagination ? `Total ${pagination.total} events` : 'Memuat...'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Skeleton key={i} className="h-12 w-full" />
                            ))}
                        </div>
                    ) : isError ? (
                        <div className="text-center py-8 text-muted-foreground">
                            Gagal memuat data. Silakan coba lagi.
                        </div>
                    ) : events.length === 0 ? (
                        <div className="text-center py-12">
                            <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Belum Ada Event</h3>
                            <p className="text-muted-foreground">
                                Belum ada proctoring event tercatat untuk sesi ini.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[180px]">Waktu</TableHead>
                                            <TableHead>Event Type</TableHead>
                                            <TableHead className="w-[100px]">Severity</TableHead>
                                            <TableHead className="w-[80px]">Detail</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {events.map((event: ProctoringEvent) => {
                                            const config = eventTypeConfig[event.eventType];
                                            const Icon = config?.icon || AlertTriangle;
                                            const sevConfig = severityConfig[event.severity];

                                            return (
                                                <TableRow key={event.id}>
                                                    <TableCell className="font-mono text-xs">
                                                        {formatTime(event.timestamp)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Icon className={`h-4 w-4 ${config?.color || 'text-gray-500'}`} />
                                                            <span>{config?.label || event.eventType}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={sevConfig?.variant || 'outline'}>
                                                            {sevConfig?.label || event.severity}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => setSelectedEvent(event)}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            {pagination && pagination.totalPages > 1 && (
                                <div className="flex items-center justify-between mt-4">
                                    <p className="text-sm text-muted-foreground">
                                        Halaman {pagination.page} dari {pagination.totalPages}
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage(page - 1)}
                                            disabled={!pagination.hasPrev}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage(page + 1)}
                                            disabled={!pagination.hasNext}
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Event Detail Dialog */}
            <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {selectedEvent && eventTypeConfig[selectedEvent.eventType] && (
                                <>
                                    {(() => {
                                        const Icon = eventTypeConfig[selectedEvent.eventType].icon;
                                        return <Icon className={`h-5 w-5 ${eventTypeConfig[selectedEvent.eventType].color}`} />;
                                    })()}
                                    {eventTypeConfig[selectedEvent.eventType].label}
                                </>
                            )}
                        </DialogTitle>
                        <DialogDescription>
                            Detail proctoring event
                        </DialogDescription>
                    </DialogHeader>

                    {selectedEvent && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Event ID</p>
                                    <p className="font-mono">#{selectedEvent.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Severity</p>
                                    <Badge variant={severityConfig[selectedEvent.severity]?.variant || 'outline'}>
                                        {severityConfig[selectedEvent.severity]?.label || selectedEvent.severity}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Timestamp</p>
                                    <p className="font-mono text-sm">{formatTime(selectedEvent.timestamp)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Session ID</p>
                                    <p className="font-mono">#{selectedEvent.userExamId}</p>
                                </div>
                            </div>

                            {selectedEvent.metadata && (
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">Metadata</p>
                                    <pre className="bg-muted p-3 rounded text-xs overflow-auto max-h-48">
                                        {JSON.stringify(selectedEvent.metadata, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}