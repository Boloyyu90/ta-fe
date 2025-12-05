'use client';

import { useState } from 'react';
import { useExams } from '@/features/exams/hooks/useExams';
import { ExamCard } from '@/features/exams/components/ExamCard';
import { ExamsPagination } from '@/features/exams/components/ExamsPagination';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { AlertCircle, Search } from 'lucide-react';
import type { Exam } from '@/features/exams/types/exams.types';

export default function ExamsPage() {
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(12);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<'active' | 'inactive' | 'all'>('all');

    const { data, isLoading, error } = useExams({
        page,
        limit: itemsPerPage,
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
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search exams..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={status} onValueChange={(v) => setStatus(v as 'active' | 'inactive' | 'all')}>
                    <SelectTrigger className="w-full md:w-[200px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Exams</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Results Count */}
            <div className="text-sm text-muted-foreground">
                Showing {exams.length} of {pagination?.total || 0} exams
            </div>

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
                            onItemsPerPageChange={setItemsPerPage}
                        />
                    )}
                </>
            )}

            {/* Empty State */}
            {!isLoading && exams.length === 0 && (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground text-lg">
                            {search
                                ? `No exams found matching "${search}"`
                                : 'No exams available at the moment'}
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}