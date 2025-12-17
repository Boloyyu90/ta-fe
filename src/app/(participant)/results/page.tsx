/**
 * Participant Results List Page
 *
 * ✅ FIXED:
 * - useMyResults returns { data, pagination } directly from the hook
 * - Added proper types to avoid implicit any
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMyResults } from '@/features/exam-sessions/hooks';
import type { ExamResult, ExamStatus } from '@/features/exam-sessions/types/exam-sessions.types';

// UI Components
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Progress } from '@/shared/components/ui/progress';
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
    Eye,
    ChevronLeft,
    ChevronRight,
    BookOpen,
    TrendingUp,
    CheckCircle2,
    XCircle,
    Clock,
    AlertCircle,
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
    // State
    const [page, setPage] = useState(1);

    // ✅ FIX: useMyResults returns { data, pagination } directly
    const { data: results, pagination, isLoading, isError } = useMyResults({
        page,
        limit: 10,
    });

    // Calculate stats - ✅ FIX: Add proper types
    const totalExams = results?.length || 0;
    const avgScore = totalExams > 0
        ? Math.round(results!.reduce((sum: number, r: ExamResult) => sum + (r.totalScore || 0), 0) / totalExams)
        : 0;
    const passedCount = results?.filter((r: ExamResult) => r.totalScore && r.totalScore >= 70).length || 0;

    // Format date
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

    // Format duration
    const formatDuration = (startedAt: string | null, submittedAt: string | null): string => {
        if (!startedAt || !submittedAt) return '-';
        const start = new Date(startedAt);
        const end = new Date(submittedAt);
        const diffMs = end.getTime() - start.getTime();
        const minutes = Math.floor(diffMs / 60000);
        if (minutes < 60) return `${minutes} menit`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}j ${mins}m`;
    };

    return (
        <div className="container mx-auto py-8 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Trophy className="h-8 w-8 text-primary" />
                    Hasil Ujian
                </h1>
                <p className="text-muted-foreground">
                    Lihat riwayat dan hasil ujian Anda
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Ujian</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pagination?.total || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Rata-rata Skor</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{avgScore}</div>
                    </CardContent>
                </Card>
                <Card className="border-green-200">
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
                        {pagination ? `Total ${pagination.total} hasil` : 'Memuat...'}
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
                    ) : !results || results.length === 0 ? (
                        <div className="text-center py-12">
                            <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Belum Ada Hasil</h3>
                            <p className="text-muted-foreground mb-4">
                                Anda belum menyelesaikan ujian apapun
                            </p>
                            <Link href="/exams">
                                <Button>
                                    <BookOpen className="h-4 w-4 mr-2" />
                                    Lihat Ujian
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Ujian</TableHead>
                                            <TableHead className="w-[100px]">Status</TableHead>
                                            <TableHead className="w-[100px]">Skor</TableHead>
                                            <TableHead className="w-[120px]">Progress</TableHead>
                                            <TableHead className="w-[100px]">Durasi</TableHead>
                                            <TableHead className="w-[150px]">Waktu Submit</TableHead>
                                            <TableHead className="w-[80px]">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {/* ✅ FIX: Add proper type annotation */}
                                        {results.map((result: ExamResult) => {
                                            const StatusIcon = statusConfig[result.status]?.icon || AlertCircle;
                                            const isPassed = result.totalScore !== null && result.totalScore >= 70;

                                            return (
                                                <TableRow key={result.id}>
                                                    <TableCell>
                                                        <span className="font-medium max-w-[200px] truncate block">
                                                            {result.exam.title}
                                                        </span>
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
                                                            <Progress
                                                                value={result.totalQuestions > 0
                                                                    ? (result.answeredQuestions / result.totalQuestions) * 100
                                                                    : 0}
                                                                className="w-16 h-2"
                                                            />
                                                            <span className="text-xs text-muted-foreground">
                                                                {result.answeredQuestions}/{result.totalQuestions}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground text-sm">
                                                        {formatDuration(result.startedAt, result.submittedAt)}
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