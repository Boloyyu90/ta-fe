/**
 * Participant Available Exams Page
 *
 * Features:
 * - List available (published) exams
 * - Search by title
 * - Show exam metadata (duration, passing score, question count)
 * - Navigate to exam detail to start
 *
 * Backend endpoint:
 * - GET /api/v1/exams (returns only published exams with questions)
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useExams } from '@/features/exams/hooks';
import { formatDuration, getExamAvailabilityStatus } from '@/features/exams/types/exams.types';

// UI Components
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';
import {
    BookOpen,
    Search,
    Clock,
    Target,
    FileText,
    Calendar,
    ChevronLeft,
    ChevronRight,
    ArrowRight,
    CheckCircle2,
    AlertCircle,
} from 'lucide-react';

// Status badge configuration
const statusConfig = {
    available: { label: 'Tersedia', variant: 'default' as const, color: 'text-green-600' },
    upcoming: { label: 'Akan Datang', variant: 'secondary' as const, color: 'text-blue-600' },
    ended: { label: 'Berakhir', variant: 'outline' as const, color: 'text-gray-600' },
    'no-questions': { label: 'Belum Tersedia', variant: 'destructive' as const, color: 'text-red-600' },
};

export default function ExamsPage() {
    // State
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Debounce search
    useState(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 300);
        return () => clearTimeout(timer);
    });

    // Fetch exams
    const { data, isLoading, isError } = useExams({
        page,
        limit: 12,
        search: debouncedSearch || undefined,
    });

    // Extract data - handle both direct array and paginated response
    const exams = Array.isArray(data) ? data : (data?.data || []);
    const pagination = Array.isArray(data) ? null : data?.pagination;

    // Format date
    const formatDate = (dateString: string | null) => {
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <BookOpen className="h-8 w-8 text-primary" />
                        Daftar Ujian
                    </h1>
                    <p className="text-muted-foreground">
                        Pilih ujian yang ingin dikerjakan
                    </p>
                </div>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari ujian berdasarkan judul..."
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
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-20" />
                            </CardContent>
                            <CardFooter>
                                <Skeleton className="h-10 w-full" />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : isError ? (
                <Card>
                    <CardContent className="py-8 text-center">
                        <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
                        <p className="text-muted-foreground">
                            Gagal memuat daftar ujian. Silakan coba lagi.
                        </p>
                    </CardContent>
                </Card>
            ) : exams.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Tidak Ada Ujian</h3>
                        <p className="text-muted-foreground">
                            {search
                                ? 'Tidak ditemukan ujian dengan kata kunci tersebut'
                                : 'Belum ada ujian yang tersedia saat ini'}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {exams.map((exam) => {
                            const status = getExamAvailabilityStatus(exam);
                            const statusInfo = statusConfig[status];
                            const isAvailable = status === 'available';
                            const questionCount = exam._count?.examQuestions ?? 0;

                            return (
                                <Card
                                    key={exam.id}
                                    className={`transition-shadow hover:shadow-lg ${
                                        !isAvailable ? 'opacity-75' : ''
                                    }`}
                                >
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <CardTitle className="text-lg line-clamp-2">
                                                {exam.title}
                                            </CardTitle>
                                            <Badge variant={statusInfo.variant}>
                                                {statusInfo.label}
                                            </Badge>
                                        </div>
                                        {exam.description && (
                                            <CardDescription className="line-clamp-2">
                                                {exam.description}
                                            </CardDescription>
                                        )}
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Clock className="h-4 w-4" />
                                                <span>{formatDuration(exam.durationMinutes)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <FileText className="h-4 w-4" />
                                                <span>{questionCount} Soal</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Target className="h-4 w-4" />
                                                <span>Passing: {exam.passingScore}</span>
                                            </div>
                                            {exam.startTime && (
                                                <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                                                    <Calendar className="h-4 w-4" />
                                                    <span className="text-xs">
                                                        {formatDate(exam.startTime)}
                                                        {exam.endTime && ` - ${formatDate(exam.endTime)}`}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        {isAvailable ? (
                                            <Link href={`/exams/${exam.id}`} className="w-full">
                                                <Button className="w-full">
                                                    Lihat Detail
                                                    <ArrowRight className="h-4 w-4 ml-2" />
                                                </Button>
                                            </Link>
                                        ) : (
                                            <Button className="w-full" disabled variant="secondary">
                                                {statusInfo.label}
                                            </Button>
                                        )}
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-4 mt-8">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(page - 1)}
                                disabled={!pagination.hasPrev}
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                Sebelumnya
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                Halaman {pagination.page} dari {pagination.totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(page + 1)}
                                disabled={!pagination.hasNext}
                            >
                                Selanjutnya
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}