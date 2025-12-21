// src/app/(admin)/admin/results/page.tsx

/**
 * Admin Results Page
 *
 * Features:
 * - List all exam results from all users
 * - Filter by exam, user, status
 * - View detailed results
 * - Export functionality (future)
 *
 * Backend endpoint:
 * - GET /api/v1/admin/results
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAdminSessions } from '@/features/exam-sessions/hooks/useAdminSessions';
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';
import {
    Trophy,
    Eye,
    ChevronLeft,
    ChevronRight,
    User,
    FileText,
    CheckCircle2,
    XCircle,
    Clock,
    Target,
    TrendingUp,
    AlertCircle,
    ArrowLeft,
} from 'lucide-react';

// Status configuration
const statusConfig: Record<ExamStatus, {
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
}> = {
    IN_PROGRESS: { label: 'Berlangsung', variant: 'default' },
    FINISHED: { label: 'Selesai', variant: 'secondary' },
    TIMEOUT: { label: 'Timeout', variant: 'destructive' },
    CANCELLED: { label: 'Dibatalkan', variant: 'outline' },
};

export default function AdminResultsPage() {
    // State
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<ExamStatus | 'ALL'>('FINISHED');

    // Query - use admin sessions API which returns results data
    const { data, isLoading, isError } = useAdminSessions({
        page,
        limit: 15,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
    });

    // Extract data
    const results = data?.data || [];
    const pagination = data?.pagination;

    // Calculate stats from current page
    const totalOnPage = results.length;
    const avgScore = totalOnPage > 0
        ? Math.round(results.reduce((sum, r) => sum + (r.totalScore || 0), 0) / totalOnPage)
        : 0;
    const passedCount = results.filter((r) => r.totalScore && r.totalScore >= 70).length;
    const failedCount = results.filter((r) => r.totalScore !== null && r.totalScore < 70).length;

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

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Back Navigation */}
            <div className="bg-background border-b border-border">
                <div className="container mx-auto px-4 py-4">
                    <Link href="/admin/dashboard">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="container mx-auto py-8 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Trophy className="h-8 w-8 text-primary" />
                        Hasil Ujian
                    </h1>
                    <p className="text-muted-foreground">
                        Lihat semua hasil ujian peserta
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Hasil</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
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
                <Card className="border-red-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-red-600">Tidak Lulus</CardTitle>
                        <XCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{failedCount}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filter */}
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
                                <SelectItem value="FINISHED">Selesai</SelectItem>
                                <SelectItem value="IN_PROGRESS">Berlangsung</SelectItem>
                                <SelectItem value="TIMEOUT">Timeout</SelectItem>
                                <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Results Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Hasil</CardTitle>
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
                    ) : results.length === 0 ? (
                        <div className="text-center py-12">
                            <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Belum Ada Hasil</h3>
                            <p className="text-muted-foreground">
                                Belum ada peserta yang menyelesaikan ujian
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Peserta</TableHead>
                                            <TableHead>Ujian</TableHead>
                                            <TableHead>Skor</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Progress</TableHead>
                                            <TableHead>Waktu Submit</TableHead>
                                            <TableHead className="w-[80px]">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {results.map((result) => {
                                            const isPassed = result.totalScore !== null && result.totalScore >= 70;

                                            return (
                                                <TableRow key={result.id}>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <User className="h-4 w-4 text-muted-foreground" />
                                                            <div>
                                                                <p className="font-medium">{result.user.name}</p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {result.user.email}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="max-w-[200px] truncate block">
                                                            {result.exam.title}
                                                        </span>
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
                                                        <Badge variant={statusConfig[result.status]?.variant || 'outline'}>
                                                            {statusConfig[result.status]?.label || result.status}
                                                        </Badge>
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
                                                    <TableCell className="text-muted-foreground text-sm">
                                                        {formatDate(result.submittedAt)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Link href={`/admin/sessions/${result.id}`}>
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
        </div>
    );
}