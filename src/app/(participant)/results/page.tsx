/**
 * Results List Page
 */

'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { ChevronLeft, ChevronRight, Trophy } from 'lucide-react';
import { useMyResults } from '@/features/exam-sessions/hooks/useMyResults';
import { ResultCard } from '@/features/exam-sessions/components/ResultCard';

export default function ResultsPage() {
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data, pagination, isLoading, isError } = useMyResults({ page, limit });

    if (isLoading) {
        return (
            <div className="container mx-auto py-8 space-y-6">
                <Skeleton className="h-10 w-48" />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="h-64" />
                    ))}
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="container mx-auto py-8">
                <Card>
                    <CardContent className="py-8 text-center">
                        <p className="text-muted-foreground">
                            Gagal memuat hasil ujian. Silakan coba lagi.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const results = data ?? [];

    return (
        <div className="container mx-auto py-8 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Trophy className="h-8 w-8 text-primary" />
                <div>
                    <h1 className="text-2xl font-bold">Hasil Ujian</h1>
                    <p className="text-muted-foreground">
                        Riwayat hasil ujian yang telah Anda selesaikan
                    </p>
                </div>
            </div>

            {/* Results Grid */}
            {results.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">
                            Belum ada hasil ujian. Selesaikan ujian untuk melihat hasil.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {results.map((result) => (
                        <ResultCard key={result.id} result={result} />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 pt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
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
                        onClick={() => setPage((p) => p + 1)}
                        disabled={!pagination.hasNext}
                    >
                        Selanjutnya
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            )}
        </div>
    );
}