/**
 * Participant Exams List Page
 *
 * ✅ FIXED:
 * - useExams returns { data, pagination } directly from the hook
 * - No need to unwrap data.data or data.pagination
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useExams } from '@/features/exams/hooks';
import {
    getExamAvailabilityStatus,
    formatDuration,
} from '@/features/exams/types/exams.types';
import type { ExamPublic } from '@/features/exams/types/exams.types';

// UI Components
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';
import {
    Search,
    BookOpen,
    Clock,
    FileText,
    Target,
    ChevronLeft,
    ChevronRight,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Calendar,
} from 'lucide-react';

// Availability badge config
const availabilityConfig = {
    available: {
        label: 'Tersedia',
        variant: 'default' as const,
        icon: CheckCircle,
    },
    upcoming: {
        label: 'Akan Datang',
        variant: 'secondary' as const,
        icon: Clock,
    },
    ended: {
        label: 'Berakhir',
        variant: 'outline' as const,
        icon: XCircle,
    },
    'no-questions': {
        label: 'Belum Tersedia',
        variant: 'outline' as const,
        icon: AlertTriangle,
    },
};

export default function ExamsPage() {
    // State
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 300);
        return () => clearTimeout(timer);
    }, [search]);

    // ✅ FIX: useExams returns { data, pagination } directly
    const { data: exams, pagination, isLoading, isError, refetch } = useExams({
        page,
        limit: 12,
        search: debouncedSearch || undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc',
    });

    // Format datetime
    const formatDateTime = (dateString: string | null) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="container mx-auto py-8 space-y-6">
                {/* Header */}
                <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <BookOpen className="h-8 w-8 text-primary" />
                    Daftar Ujian
                </h1>
                <p className="text-muted-foreground">
                    Pilih ujian yang ingin Anda kerjakan
                </p>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari ujian..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Exams Grid */}
            {isLoading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="h-64" />
                    ))}
                </div>
            ) : isError ? (
                <Card>
                    <CardContent className="py-8 text-center">
                        <AlertTriangle className="h-12 w-12 mx-auto text-destructive mb-4" />
                        <p className="text-muted-foreground mb-4">
                            Gagal memuat data. Silakan coba lagi.
                        </p>
                        <Button onClick={() => refetch()} variant="outline">
                            Coba Lagi
                        </Button>
                    </CardContent>
                </Card>
            ) : !exams || exams.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Belum Ada Ujian</h3>
                        <p className="text-muted-foreground">
                            {debouncedSearch
                                ? `Tidak ada ujian dengan kata kunci "${debouncedSearch}"`
                                : 'Belum ada ujian yang tersedia saat ini'}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {exams.map((exam: ExamPublic) => {
                            const availability = getExamAvailabilityStatus(exam);
                            const availConfig = availabilityConfig[availability];
                            const AvailIcon = availConfig.icon;
                            const questionCount = exam._count?.examQuestions ?? 0;
                            const canStart = availability === 'available';

                            return (
                                <Card
                                    key={exam.id}
                                    className={`transition-all hover:shadow-md ${
                                        !canStart ? 'opacity-75' : ''
                                    }`}
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1 flex-1">
                                                <Badge variant={availConfig.variant} className="mb-2">
                                                    <AvailIcon className="h-3 w-3 mr-1" />
                                                    {availConfig.label}
                                                </Badge>
                                                <CardTitle className="text-lg line-clamp-2">
                                                    {exam.title}
                                                </CardTitle>
                                            </div>
                                        </div>
                                        {exam.description && (
                                            <CardDescription className="line-clamp-2">
                                                {exam.description}
                                            </CardDescription>
                                        )}
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* Stats */}
                                        <div className="grid grid-cols-3 gap-2 text-sm">
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <Clock className="h-4 w-4" />
                                                <span>{formatDuration(exam.durationMinutes)}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <FileText className="h-4 w-4" />
                                                <span>{questionCount} soal</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <Target className="h-4 w-4" />
                                                <span>{exam.passingScore}</span>
                                            </div>
                                        </div>

                                        {/* Schedule */}
                                        {(exam.startTime || exam.endTime) && (
                                            <div className="text-xs text-muted-foreground space-y-1 border-t pt-3">
                                                {exam.startTime && (
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        <span>Mulai: {formatDateTime(exam.startTime)}</span>
                                                    </div>
                                                )}
                                                {exam.endTime && (
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        <span>Berakhir: {formatDateTime(exam.endTime)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Action */}
                                        <Link href={`/exams/${exam.id}`}>
                                            <Button
                                                className="w-full"
                                                variant={canStart ? 'default' : 'outline'}
                                                disabled={!canStart}
                                            >
                                                {canStart ? 'Lihat Detail' : availConfig.label}
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between">
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
        </div>
    );
}