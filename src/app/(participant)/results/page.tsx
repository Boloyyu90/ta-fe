/**
 * Participant Results List Page
 *
 * Features:
 * - List all completed exam results
 * - Show score, status, duration
 * - Navigate to result detail/review
 *
 * Backend endpoint:
 * - GET /api/v1/results
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMyResults } from '@/features/exam-sessions/hooks';
import type { ExamStatus } from '@/shared/types/enum.types';

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
    Trophy,
    Clock,
    Eye,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    XCircle,
    AlertCircle,
    FileText,
    Target,
} from 'lucide-react';

// Status configuration
const statusConfig: Record<ExamStatus, {
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    icon: typeof CheckCircle2;
}> = {
    IN_PROGRESS: { label: 'Berlangsung', variant: 'default', icon: Clock },
    FINISHED: { label: 'Selesai', variant: 'secondary', icon: CheckCircle2 },
    TIMEOUT: { label: 'Timeout', variant: 'destructive', icon: AlertCircle },
    CANCELLED: { label: 'Dibatalkan', variant: 'outline', icon: XCircle },
};

export default function ResultsPage() {
    const [page, setPage] = useState(1);

    // Fetch results
    const { data, isLoading, isError } = useMyResults({ page, limit: 10 });

    // Extract data - handle various response shapes
    const results = Array.isArray(data) ? data : (data?.data || []);
    const pagination = Array.isArray(data) ? null : data?.pagination;

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

    // Calculate stats
    const totalExams = results.length;
    const avgScore = totalExams > 0
        ? Math.round(results.reduce((sum, r) => sum + (r.totalScore || 0), 0) / totalExams)
        : 0;
    const passedCount = results.filter((r) => r.totalScore && r.totalScore >= 70).length;

    return (
        <div className="container mx-auto py-8 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Trophy className="h-8 w-8 text-primary" />
                    Hasil Ujian
                </h1>
                <p className="text-muted-foreground">
                    Riwayat dan hasil ujian yang telah dikerjakan
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Ujian</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pagination?.total || totalExams}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Rata-rata Skor</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{avgScore}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-green-600">Lulus</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{passedCount}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Results Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Riwayat Ujian</CardTitle>
                    <CardDescription>
                        {pagination ? `Total ${pagination.total} hasil` : `${totalExams} hasil`}
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
                    ) : results.length === 0 ? (
                        <div className="text-center py-12">
                            <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Belum Ada Hasil</h3>
                            <p className="text-muted-foreground mb-4">
                                Anda belum menyelesaikan ujian apapun
                            </p>
                            <Link href="/exams">
                                <Button>Lihat Daftar Ujian</Button>
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Ujian</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Skor</TableHead>
                                            <TableHead>Progress</TableHead>
                                            <TableHead>Durasi</TableHead>
                                            <TableHead>Tanggal</TableHead>
                                            <TableHead className="w-[80px]">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {results.map((result) => {
                                            const StatusIcon = statusConfig[result.status]?.icon || AlertCircle;
                                            const isPassed = result.totalScore !== null && result.totalScore >= 70;

                                            return (
                                                <TableRow key={result.id}>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                                            <span className="font-medium max-w-[200px] truncate">
                                                                {result.exam.title}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={statusConfig[result.status]?.variant || 'outline'}
                                                            className="flex items-center gap-1 w-fit"
                                                        >
                                                            <StatusIcon className="h-3 w-3" />
                                                            {statusConfig[result.status]?.label || result.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <span className={`font-bold text-lg ${
                                                                isPassed ? 'text-green-600' : 'text-red-600'
                                                            }`}>
                                                                {result.totalScore ?? '-'}
                                                            </span>
                                                            {result.totalScore !== null && (
                                                                isPassed ? (
                                                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                                ) : (
                                                                    <XCircle className="h-4 w-4 text-red-500" />
                                                                )
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex-1 bg-muted rounded-full h-2 w-16">
                                                                <div
                                                                    className="bg-primary h-2 rounded-full transition-all"
                                                                    style={{
                                                                        width: `${result.totalQuestions > 0
                                                                            ? (result.answeredQuestions / result.totalQuestions) * 100
                                                                            : 0}%`
                                                                    }}
                                                                />
                                                            </div>
                                                            <span className="text-xs text-muted-foreground">
                                                                {result.answeredQuestions}/{result.totalQuestions}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1 text-muted-foreground">
                                                            <Clock className="h-4 w-4" />
                                                            {formatDuration(result.duration)}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground text-sm">
                                                        {formatDate(result.submittedAt)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Link href={`/results/${result.id}`}>
                                                            <Button variant="ghost" size="icon">
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