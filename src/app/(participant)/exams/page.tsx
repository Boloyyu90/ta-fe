// src/app/(participant)/exams/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Loader2, BookOpen, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { useExams } from '@/features/exams/hooks/useExams';
import {
    ExamCard,
    ExamFilters,
    ExamsPagination,
} from '@/features/exams/components';

export default function ExamsPage() {
    // Pagination state
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(12);

    // Filter state
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setPage(1); // Reset to first page on search
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Build query params - following backend API structure
    const isActive = statusFilter === 'ALL' ? undefined : statusFilter === 'ACTIVE';

    const { data, isLoading, error } = useExams({
        page,
        limit,
        search: debouncedSearch || undefined,
        isActive,
    });

    const exams = data?.exams || [];
    const pagination = data?.pagination;

    // Handlers
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleItemsPerPageChange = (newLimit: number) => {
        setLimit(newLimit);
        setPage(1); // Reset to first page
    };

    const handleStatusFilterChange = (value: 'ALL' | 'ACTIVE' | 'INACTIVE') => {
        setStatusFilter(value);
        setPage(1); // Reset to first page
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setDebouncedSearch('');
        setStatusFilter('ALL');
        setPage(1);
    };

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Header */}
            <div className="bg-background border-b border-border">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center gap-3 mb-2">
                        <BookOpen className="h-8 w-8 text-primary" />
                        <h1 className="text-3xl font-bold text-foreground">Browse Exams</h1>
                    </div>
                    <p className="text-muted-foreground">
                        Explore available exams and start testing your knowledge
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-background border-b border-border">
                <div className="container mx-auto px-4 py-6">
                    <ExamFilters
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        statusFilter={statusFilter}
                        onStatusFilterChange={handleStatusFilterChange}
                        onClearFilters={handleClearFilters}
                        resultsCount={pagination?.totalItems || 0}
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">Loading exams...</p>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <Card className="border-destructive">
                        <CardContent className="py-12 text-center">
                            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                                Failed to Load Exams
                            </h3>
                            <p className="text-muted-foreground mb-6">
                                There was an error loading the exams. Please try again.
                            </p>
                            <Button onClick={() => window.location.reload()}>Retry</Button>
                        </CardContent>
                    </Card>
                )}

                {/* Empty State */}
                {!isLoading && !error && exams.length === 0 && (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                                No Exams Found
                            </h3>
                            <p className="text-muted-foreground mb-6">
                                {debouncedSearch || statusFilter !== 'ALL'
                                    ? 'Try adjusting your search or filters'
                                    : 'There are no exams available at the moment'}
                            </p>
                            {(debouncedSearch || statusFilter !== 'ALL') && (
                                <Button variant="outline" onClick={handleClearFilters}>
                                    Clear Filters
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Exams Grid */}
                {!isLoading && !error && exams.length > 0 && (
                    <>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {exams.map((exam) => (
                                <ExamCard key={exam.id} exam={exam} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination && pagination.totalPages > 1 && (
                            <ExamsPagination
                                currentPage={pagination.currentPage}
                                totalPages={pagination.totalPages}
                                totalItems={pagination.totalItems}
                                itemsPerPage={pagination.itemsPerPage}
                                onPageChange={handlePageChange}
                                onItemsPerPageChange={handleItemsPerPageChange}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}