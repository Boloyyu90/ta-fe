// src/app/(participant)/exams/page.tsx

/**
 * Exams List Page
 *
 * ✅ AUDIT FIX v4: ExamCard now accepts Exam type (with optional _count)
 */

'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { examsApi } from '@/features/exams/api/exams.api';
import { ExamCard } from '@/features/exams/components/ExamCard';
import { ExamsPagination } from '@/features/exams/components/ExamsPagination';
import type { ExamsResponse, ExamsQueryParams } from '@/features/exams/types/exams.types';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Search, FileText } from 'lucide-react';

export default function ExamsPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const params: ExamsQueryParams = {
        page,
        limit: itemsPerPage,
        search: search || undefined,
        status: 'active',
    };

    const { data, isLoading, error } = useQuery<ExamsResponse>({
        queryKey: ['exams', params],
        queryFn: () => examsApi.getExams(params),
    });

    const exams = data?.data ?? [];
    const pagination = data?.pagination;

    return (
        <div className="container mx-auto py-8 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">Daftar Ujian</h1>
                <p className="text-muted-foreground">
                    Pilih ujian yang tersedia untuk memulai
                </p>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Cari ujian..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1); // Reset to first page on search
                    }}
                    className="pl-10"
                />
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="h-64" />
                    ))}
                </div>
            )}

            {/* Error State */}
            {error && (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-destructive">
                            Gagal memuat daftar ujian. Silakan coba lagi.
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Exams Grid */}
            {!isLoading && exams.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {exams.map((exam) => (
                        // ✅ FIX: ExamCard now accepts Exam type
                        <ExamCard key={exam.id} exam={exam} />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <ExamsPagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.total}
                    itemsPerPage={pagination.limit}
                    onPageChange={setPage}
                    onItemsPerPageChange={setItemsPerPage}
                />
            )}

            {/* Empty State */}
            {!isLoading && exams.length === 0 && (
                <Card>
                    <CardContent className="py-12 text-center">
                        <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground text-lg">
                            {search
                                ? `Tidak ada ujian yang cocok dengan "${search}"`
                                : 'Belum ada ujian yang tersedia'}
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}