// src/app/(admin)/admin/sessions/page.tsx

/**
 * Admin Exam Sessions Monitoring Page
 *
 * Features:
 * - List all exam sessions with pagination
 * - Filter by exam, user, status
 * - View session details
 * - View session answers
 *
 * Backend endpoints:
 * - GET /api/v1/admin/exam-sessions
 * - GET /api/v1/admin/exam-sessions/:id
 * - GET /api/v1/admin/exam-sessions/:id/answers
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAdminSessions } from '@/features/exam-sessions/hooks/useAdminSessions';
import type { ExamStatus } from '@/shared/types/enum.types';

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
    ClipboardList,
    Search,
    Eye,
    ChevronLeft,
    ChevronRight,
    Clock,
    User,
    FileText,
    CheckCircle2,
    XCircle,
    PlayCircle,
    AlertCircle,
} from 'lucide-react';

// Status badge configuration
const statusConfig: Record<ExamStatus, {
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    icon: typeof CheckCircle2;
}> = {
    IN_PROGRESS: { label: 'Berlangsung', variant: 'default', icon: PlayCircle },
    FINISHED: { label: 'Selesai', variant: 'secondary', icon: CheckCircle2 },
    TIMEOUT: { label: 'Timeout', variant: 'destructive', icon: AlertCircle },
    CANCELLED: { label: 'Dibatalkan', variant: 'outline', icon: XCircle },
};

export default function AdminSessionsPage() {
    // State
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<ExamStatus | 'ALL'>('ALL');

    // Query
    const { data, isLoading, isError } = useAdminSessions({
        page,
        limit: 15,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
    });

    // Extract data
    const sessions = data?.data || [];
    const pagination = data?.pagination;

    // Format helpers
    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatDuration = (seconds: number | null) => {
        if (!seconds) return '-';
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}m ${secs}s`;
    };

    return (
        <div className="container mx-auto py-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Sesi Ujian</h1>
                    <p className="text-muted-foreground">
                        Monitor semua sesi ujian peserta
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Sesi</CardTitle>
                        <ClipboardList className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pagination?.total || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Berlangsung</CardTitle>
                        <PlayCircle className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                            {sessions.filter((s) => s.status === 'IN_PROGRESS').length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Selesai</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {sessions.filter((s) => s.status === 'FINISHED').length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Timeout/Batal</CardTitle>
                        <XCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            {sessions.filter((s) => s.status === 'TIMEOUT' || s.status === 'CANCELLED').length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Select
                            value={statusFilter}
                            onValueChange={(value: ExamStatus | 'ALL') => {
                                setStatusFilter(value);
                                setPage(1);
                            }}
                        >
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Filter status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Semua Status</SelectItem>
                                <SelectItem value="IN_PROGRESS">Berlangsung</SelectItem>
                                <SelectItem value="FINISHED">Selesai</SelectItem>
                                <SelectItem value="TIMEOUT">Timeout</SelectItem>
                                <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Sessions Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ClipboardList className="h-5 w-5" />
                        Daftar Sesi Ujian
                    </CardTitle>
                    <CardDescription>
                        {pagination ? `Total ${pagination.total} sesi` : 'Memuat...'}
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
                    ) : sessions.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            Tidak ada sesi ujian ditemukan
                        </div>
                    ) : (
                        <>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Peserta</TableHead>
                                            <TableHead>Ujian</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Skor</TableHead>
                                            <TableHead>Progress</TableHead>
                                            <TableHead>Durasi</TableHead>
                                            <TableHead>Waktu Mulai</TableHead>
                                            <TableHead className="w-[80px]">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sessions.map((session) => {
                                            const StatusIcon = statusConfig[session.status]?.icon || AlertCircle;
                                            return (
                                                <TableRow key={session.id}>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <User className="h-4 w-4 text-muted-foreground" />
                                                            <div>
                                                                <p className="font-medium">{session.user.name}</p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {session.user.email}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                                            <div>
                                                                <span className="max-w-[200px] truncate block">
                                                                    {session.exam.title}
                                                                </span>
                                                                {/* HIGH-006 FIX: Show attempt number */}
                                                                <Badge variant="outline" className="text-xs mt-1">
                                                                    Percobaan #{session.attemptNumber ?? 1}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={statusConfig[session.status]?.variant || 'outline'}
                                                            className="flex items-center gap-1 w-fit"
                                                        >
                                                            <StatusIcon className="h-3 w-3" />
                                                            {statusConfig[session.status]?.label || session.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className={`font-bold ${
                                                            session.totalScore !== null && session.totalScore >= 70
                                                                ? 'text-green-600'
                                                                : session.totalScore !== null && session.totalScore >= 50
                                                                    ? 'text-yellow-600'
                                                                    : 'text-red-600'
                                                        }`}>
                                                            {session.totalScore !== null ? session.totalScore : '-'}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex-1 bg-muted rounded-full h-2 w-20">
                                                                <div
                                                                    className="bg-primary h-2 rounded-full transition-all"
                                                                    style={{
                                                                        width: `${session.totalQuestions > 0
                                                                            ? (session.answeredQuestions / session.totalQuestions) * 100
                                                                            : 0}%`
                                                                    }}
                                                                />
                                                            </div>
                                                            <span className="text-xs text-muted-foreground">
                                                                {session.answeredQuestions}/{session.totalQuestions}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1 text-muted-foreground">
                                                            <Clock className="h-4 w-4" />
                                                            {formatDuration(session.duration)}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground text-sm">
                                                        {formatDate(session.startedAt)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Link href={`/admin/sessions/${session.id}`}>
                                                            <Button variant="ghost" size="icon" aria-label="Lihat detail">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
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
        </div>
    );
}