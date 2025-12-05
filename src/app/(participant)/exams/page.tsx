// src/app/(participant)/exams/page.tsx
'use client';

import { useState } from 'react';
import { useExams } from '@/features/exams/hooks/useExams';
import { ExamCard } from '@/features/exams/components/ExamCard';
import { ExamsFilters } from '@/features/exams/components/ExamsFilters';
import { ExamsPagination } from '@/features/exams/components/ExamsPagination';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import type { Exam } from '@/features/exams/types/exams.types';

export default function ExamsPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<'active' | 'inactive' | 'all'>('all');

    const { data, isLoading, error } = useExams({
        page,
        limit: 12,
        search: search || undefined,
        status,
    });

    if (error) {
        return (
            <div className="container mx-auto py-8">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Failed to load exams. Please try again later.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    const exams = data?.data || [];
    const pagination = data?.pagination;

    return (
        <div className="container mx-auto py-8 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">Available Exams</h1>
                <p className="text-muted-foreground mt-2">
                    Browse and register for upcoming exams
                </p>
            </div>

            {/* Filters */}
            <ExamsFilters
                search={search}
                onSearchChange={setSearch}
                status={status}
                onStatusChange={setStatus}
                resultsCount={pagination?.total || 0}
            />

            {/* Loading State */}
            {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-64" />
                    ))}
                </div>
            )}

            {/* Exams Grid */}
            {!isLoading && exams.length > 0 && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {exams.map((exam: Exam) => (
                            <ExamCard key={exam.id} exam={exam} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                        <ExamsPagination
                            currentPage={pagination.page}
                            totalPages={pagination.totalPages}
                            totalItems={pagination.total}
                            itemsPerPage={pagination.limit}
                            onPageChange={setPage}
                        />
                    )}
                </>
            )}

            {/* Empty State */}
            {!isLoading && exams.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">
                        {search
                            ? `No exams found matching "${search}"`
                            : 'No exams available at the moment'}
                    </p>
                </div>
            )}
        </div>
    );
}