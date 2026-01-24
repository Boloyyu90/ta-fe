'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMyResults } from '@/features/exam-sessions/hooks';
import { useMyStats } from '@/features/users/hooks';
import { ResultCard } from '@/features/exam-sessions/components/ResultCard';
import type { ExamResult } from '@/features/exam-sessions/types/exam-sessions.types';

// UI Components
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { PageHeaderTitle } from '@/shared/components/PageHeaderTitle';
import {
    Trophy,
    ChevronLeft,
    ChevronRight,
    BookOpen,
    TrendingUp,
    CheckCircle2,
    Target,
} from 'lucide-react';

export default function ResultsPage() {
    // State
    const [page, setPage] = useState(1);

    // Use backend stats endpoint for accurate stats
    const { data: statsData, isLoading: statsLoading } = useMyStats();
    const stats = statsData?.stats ?? {
        completedExams: 0,
        averageScore: null,
        totalTimeMinutes: 0,
        activeExams: 0,
    };

    const { data: results, pagination, isLoading, isError } = useMyResults({
        page,
        limit: 10,
    });

    // Compute passed count using actual passingScore from each exam
    const passedCount = results?.filter((r: ExamResult) => {
        return r.status === 'FINISHED' &&
               r.totalScore !== null &&
               r.totalScore >= r.exam.passingScore;
    }).length || 0;

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

    return (
        <div className="container mx-auto py-8 space-y-6">
            {/* Header */}
            <PageHeaderTitle title="Hasil Ujian" />

            {/* Stats Cards - Using backend /me/stats endpoint */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-l-4 border-l-primary">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ujian Selesai</CardTitle>
                        <div className="h-10 w-10 rounded-full flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        {statsLoading ? (
                            <Skeleton className="h-10 w-20" />
                        ) : (
                            <div className="text-3xl font-bold">{stats.completedExams}</div>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                            Total ujian yang telah diselesaikan
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-secondary">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Rata-rata Skor</CardTitle>
                        <div className="h-10 w-10 rounded-full flex items-center justify-center">
                            <TrendingUp className="h-5 w-5 text-secondary" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        {statsLoading ? (
                            <Skeleton className="h-10 w-20" />
                        ) : (
                            <div className="text-3xl font-bold">
                                {stats.averageScore !== null ? stats.averageScore.toFixed(1) : '-'}
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                            Dari semua ujian selesai
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-success">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-success">Lulus</CardTitle>
                        <div className="h-10 w-10 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="h-5 w-5 text-success" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-10 w-20" />
                        ) : (
                            <div className="text-3xl font-bold text-success">{passedCount}</div>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                            Dari {results?.length || 0} hasil di halaman ini
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Results Section */}
            <Card className="py-5">
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex flex-col md:flex-row gap-4">
                                    <Skeleton className="h-48 md:h-40 md:w-56" />
                                    <div className="flex-1 space-y-4">
                                        <Skeleton className="h-6 w-3/4" />
                                        <Skeleton className="h-24 w-full" />
                                        <Skeleton className="h-10 w-32" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : isError ? (
                        <div className="text-center py-12">
                            <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                                <Target className="h-8 w-8 text-destructive" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Gagal Memuat Data</h3>
                            <p className="text-muted-foreground mb-4">
                                Terjadi kesalahan saat memuat hasil ujian.
                            </p>
                            <Button onClick={() => window.location.reload()}>
                                Coba Lagi
                            </Button>
                        </div>
                    ) : !results || results.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                                <Trophy className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Belum Ada Hasil</h3>
                            <p className="text-muted-foreground mb-4">
                                Anda belum menyelesaikan ujian apapun. Mulai ujian pertama Anda sekarang!
                            </p>
                            <Link href="/exams">
                                <Button>
                                    <BookOpen className="h-4 w-4 mr-2" />
                                    Lihat Daftar Ujian
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Results Cards */}
                            <div className="space-y-4">
                                {results.map((result: ExamResult) => (
                                    <ResultCard
                                        key={result.id}
                                        result={result}
                                        formatDate={formatDate}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            {pagination && pagination.totalPages > 1 && (
                                <div className="flex items-center justify-between mt-6 pt-6 border-t">
                                    <p className="text-sm text-muted-foreground">
                                        Halaman <span className="font-medium">{pagination.page}</span> dari{' '}
                                        <span className="font-medium">{pagination.totalPages}</span>
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage(page - 1)}
                                            disabled={!pagination.hasPrev}
                                        >
                                            <ChevronLeft className="h-4 w-4 mr-1" />
                                            Sebelumnya
                                        </Button>
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
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
