// src/app/(admin)/admin/proctoring/page.tsx

/**
 * Admin Proctoring Events Monitoring Page
 *
 * Features:
 * - List all proctoring events with pagination
 * - Filter by event type, session ID
 * - View event details with metadata
 * - Link to session details
 *
 * Backend endpoint:
 * - GET /api/v1/admin/proctoring/events
 *
 * This is the THESIS DEMONSTRATION page for ML proctoring!
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAdminProctoringEvents } from '@/features/proctoring/hooks';
import type { ProctoringEventType, Severity } from '@/shared/types/enum.types';

// UI Components
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
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
    Eye,
    AlertTriangle,
    Camera,
    Monitor,
    User,
    FileText,
    ChevronLeft,
    ChevronRight,
    Shield,
    Clock,
    Search,
    Loader2,
} from 'lucide-react';

// Event type configuration
const eventTypeConfig: Record<ProctoringEventType, {
    label: string;
    icon: typeof AlertTriangle;
    color: string;
}> = {
    NO_FACE_DETECTED: {
        label: 'Wajah Tidak Terdeteksi',
        icon: Camera,
        color: 'text-red-500',
    },
    MULTIPLE_FACES: {
        label: 'Multiple Wajah',
        icon: User,
        color: 'text-red-500',
    },
    TAB_SWITCH: {
        label: 'Tab Switch',
        icon: Monitor,
        color: 'text-yellow-500',
    },
    BROWSER_BLUR: {
        label: 'Browser Blur',
        icon: Monitor,
        color: 'text-yellow-500',
    },
    COPY_PASTE: {
        label: 'Copy/Paste',
        icon: FileText,
        color: 'text-yellow-500',
    },
    RIGHT_CLICK: {
        label: 'Right Click',
        icon: Monitor,
        color: 'text-yellow-500',
    },
    EXAM_STARTED: {
        label: 'Ujian Dimulai',
        icon: Shield,
        color: 'text-green-500',
    },
    EXAM_SUBMITTED: {
        label: 'Ujian Selesai',
        icon: Shield,
        color: 'text-green-500',
    },
    WARNING_ISSUED: {
        label: 'Peringatan',
        icon: AlertTriangle,
        color: 'text-orange-500',
    },
    EXAM_CANCELLED: {
        label: 'Ujian Dibatalkan',
        icon: AlertTriangle,
        color: 'text-red-500',
    },
};

// Severity configuration
const severityConfig: Record<Severity, {
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
}> = {
    INFO: { label: 'Info', variant: 'secondary' },
    LOW: { label: 'Rendah', variant: 'outline' },
    MEDIUM: { label: 'Sedang', variant: 'default' },
    HIGH: { label: 'Tinggi', variant: 'destructive' },
    CRITICAL: { label: 'Kritis', variant: 'destructive' },
};

export default function AdminProctoringPage() {
    // State
    const [page, setPage] = useState(1);
    const [eventTypeFilter, setEventTypeFilter] = useState<ProctoringEventType | 'ALL'>('ALL');
    const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

    // Query
    const { data, isLoading, isError, refetch } = useAdminProctoringEvents({
        page,
        limit: 20,
        eventType: eventTypeFilter === 'ALL' ? undefined : eventTypeFilter,
        sortOrder: 'desc',
    });

    // Extract data
    const events = data?.data || [];
    const pagination = data?.pagination;

    // Format helpers
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    // Count violations by type
    const violationCounts = events.reduce((acc, event) => {
        acc[event.eventType] = (acc[event.eventType] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="container mx-auto py-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Shield className="h-8 w-8 text-primary" />
                        Monitor Proctoring
                    </h1>
                    <p className="text-muted-foreground">
                        ⚡ Deteksi pelanggaran ujian berbasis YOLO ML (Thesis Demo)
                    </p>
                </div>
                <Button onClick={() => refetch()} variant="outline">
                    <Loader2 className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Event</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pagination?.total || 0}</div>
                    </CardContent>
                </Card>
                <Card className="border-red-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-red-600">
                            Wajah Tidak Terdeteksi
                        </CardTitle>
                        <Camera className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            {violationCounts['NO_FACE_DETECTED'] || 0}
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-red-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-red-600">
                            Multiple Wajah
                        </CardTitle>
                        <User className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            {violationCounts['MULTIPLE_FACES'] || 0}
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-yellow-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-yellow-600">
                            Tab Switch
                        </CardTitle>
                        <Monitor className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">
                            {violationCounts['TAB_SWITCH'] || 0}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filter */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Select
                            value={eventTypeFilter}
                            onValueChange={(value: ProctoringEventType | 'ALL') => {
                                setEventTypeFilter(value);
                                setPage(1);
                            }}
                        >
                            <SelectTrigger className="w-[250px]">
                                <SelectValue placeholder="Filter tipe event" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Semua Tipe</SelectItem>
                                <SelectItem value="NO_FACE_DETECTED">🔴 Wajah Tidak Terdeteksi</SelectItem>
                                <SelectItem value="MULTIPLE_FACES">🔴 Multiple Wajah</SelectItem>
                                <SelectItem value="TAB_SWITCH">🟡 Tab Switch</SelectItem>
                                <SelectItem value="BROWSER_BLUR">🟡 Browser Blur</SelectItem>
                                <SelectItem value="COPY_PASTE">🟡 Copy/Paste</SelectItem>
                                <SelectItem value="RIGHT_CLICK">🟡 Right Click</SelectItem>
                                <SelectItem value="WARNING_ISSUED">🟠 Peringatan</SelectItem>
                                <SelectItem value="EXAM_CANCELLED">🔴 Dibatalkan</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Events Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Log Proctoring Events
                    </CardTitle>
                    <CardDescription>
                        {pagination ? `Menampilkan ${events.length} dari ${pagination.total} event` : 'Memuat...'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Skeleton key={i} className="h-16 w-full" />
                            ))}
                        </div>
                    ) : isError ? (
                        <div className="text-center py-8 text-muted-foreground">
                            Gagal memuat data. Silakan coba lagi.
                        </div>
                    ) : events.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <Shield className="h-12 w-12 mx-auto text-green-500 mb-4" />
                            <p>Tidak ada event proctoring ditemukan</p>
                            <p className="text-sm">Semua ujian berjalan dengan baik! ✨</p>
                        </div>
                    ) : (
                        <>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Waktu</TableHead>
                                            <TableHead>Tipe Event</TableHead>
                                            <TableHead>Severity</TableHead>
                                            <TableHead>Peserta</TableHead>
                                            <TableHead>Ujian</TableHead>
                                            <TableHead className="w-[80px]">Detail</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {events.map((event) => {
                                            const config = eventTypeConfig[event.eventType];
                                            const EventIcon = config?.icon || AlertTriangle;

                                            return (
                                                <TableRow key={event.id}>
                                                    <TableCell className="text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            {formatDate(event.timestamp)}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className={`flex items-center gap-2 ${config?.color || ''}`}>
                                                            <EventIcon className="h-4 w-4" />
                                                            <span className="font-medium">
                                                                {config?.label || event.eventType}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={severityConfig[event.severity]?.variant || 'outline'}>
                                                            {severityConfig[event.severity]?.label || event.severity}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {event.userExam?.user ? (
                                                            <div>
                                                                <p className="font-medium text-sm">
                                                                    {event.userExam.user.name}
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {event.userExam.user.email}
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <span className="text-muted-foreground">-</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {event.userExam?.exam ? (
                                                            <span className="text-sm max-w-[150px] truncate block">
                                                                {event.userExam.exam.title}
                                                            </span>
                                                        ) : (
                                                            <span className="text-muted-foreground">-</span>
                                                        )}
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
                <DialogContent className="max-w-lg">
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
                            Detail event proctoring
                        </DialogDescription>
                    </DialogHeader>
                    {selectedEvent && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Event ID</p>
                                    <p className="font-medium">{selectedEvent.id}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Severity</p>
                                    <Badge variant={severityConfig[selectedEvent.severity]?.variant || 'outline'}>
                                        {severityConfig[selectedEvent.severity]?.label || selectedEvent.severity}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Waktu</p>
                                    <p className="font-medium">{formatDate(selectedEvent.timestamp)}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Session ID</p>
                                    <p className="font-medium">{selectedEvent.userExamId}</p>
                                </div>
                            </div>

                            {selectedEvent.userExam && (
                                <div className="p-3 bg-muted rounded-lg">
                                    <p className="text-sm text-muted-foreground mb-2">Peserta & Ujian</p>
                                    <p className="font-medium">{selectedEvent.userExam.user?.name}</p>
                                    <p className="text-sm text-muted-foreground">{selectedEvent.userExam.user?.email}</p>
                                    <p className="text-sm mt-2">{selectedEvent.userExam.exam?.title}</p>
                                </div>
                            )}

                            {selectedEvent.metadata && Object.keys(selectedEvent.metadata).length > 0 && (
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">Metadata</p>
                                    <pre className="p-3 bg-muted rounded-lg text-xs overflow-auto max-h-40">
                                        {JSON.stringify(selectedEvent.metadata, null, 2)}
                                    </pre>
                                </div>
                            )}

                            <div className="flex justify-end gap-2">
                                <Link href={`/admin/sessions/${selectedEvent.userExamId}`}>
                                    <Button variant="outline" size="sm">
                                        Lihat Sesi
                                    </Button>
                                </Link>
                                <Button variant="secondary" size="sm" onClick={() => setSelectedEvent(null)}>
                                    Tutup
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}