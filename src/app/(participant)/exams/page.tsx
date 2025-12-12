/**
 * Exams List Page
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Skeleton } from '@/shared/components/ui/skeleton';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';
import { ChevronLeft, ChevronRight, BookOpen, Search } from 'lucide-react';
import { useExams } from '@/features/exams/hooks';
import { ExamCard } from '@/features/exams/components/ExamCard';
import type { ExamsQueryParams } from '@/features/exams/types/exams.types';

export default function ExamsPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState<ExamsQueryParams['sortBy']>('createdAt');
    const [sortOrder, setSortOrder] = useState<ExamsQueryParams['sortOrder']>('desc');
    const limit = 12;

    const { data, pagination, isLoading, isError } = useExams({
        page,
        limit,
        search: search || undefined,
        sortBy,
        sortOrder,
    });

    const handleSearch = (value: string) => {
        setSearch(value);
        setPage(1); // Reset to first page on search
    };

    if (isError) {
        return (
            <div className="container mx-auto py-8">
                <Card>
                    <CardContent className="py-8 text-center">
                        <p className="text-muted-foreground">
                            Gagal memuat daftar ujian. Silakan coba lagi.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const exams = data ?? [];

    return (
        <div className="container mx-auto py-8 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-primary" />
                <div>
                    <h1 className="text-2xl font-bold">Daftar Ujian</h1>
                    <p className="text-muted-foreground">
                        Pilih ujian yang ingin Anda kerjakan
                    </p>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="py-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari ujian..."
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Sort By */}
                        <Select
                            value={sortBy}
                            onValueChange={(v) => setSortBy(v as ExamsQueryParams['sortBy'])}
                        >
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Urutkan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="createdAt">Tanggal</SelectItem>
                                <SelectItem value="title">Judul</SelectItem>
                                <SelectItem value="durationMinutes">Durasi</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Sort Order */}
                        <Select
                            value={sortOrder}
                            onValueChange={(v) => setSortOrder(v as ExamsQueryParams['sortOrder'])}
                        >
                            <SelectTrigger className="w-full md:w-[140px]">
                                <SelectValue placeholder="Urutan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="desc">Terbaru</SelectItem>
                                <SelectItem value="asc">Terlama</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Exams Grid */}
            {isLoading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="h-64" />
                    ))}
                </div>
            ) : exams.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">
                            {search
                                ? `Tidak ditemukan ujian dengan kata kunci "${search}"`
                                : 'Tidak ada ujian tersedia saat ini'}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {exams.map((exam) => (
                        <ExamCard key={exam.id} exam={exam} />
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