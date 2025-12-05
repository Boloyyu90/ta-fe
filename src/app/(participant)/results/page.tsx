// src/app/(participant)/results/page.tsx
'use client';

import { useState } from 'react';
import { useMyResults } from '@/features/exam-sessions/hooks/useMyResults';
import { ResultCard } from '@/features/exam-sessions/components/ResultCard';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Search, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import type { UserExam } from '@/features/exam-sessions/types/exam-sessions.types';

export default function ResultsPage() {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    const { data, isLoading } = useMyResults({
        page,
        limit: 12,
        status: 'FINISHED', // Only show finished exams
    });

    // ✅ FIXED: Properly unwrap the response data
    const results = data?.data || [];
    const pagination = data?.pagination;

    // Filter results by search
    const filteredResults = results.filter((result: UserExam) =>
        // ✅ FIXED: Add null check for result.exam
        result.exam?.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container mx-auto py-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">My Results</h1>
                <p className="text-muted-foreground">
                    View your completed exam results and performance.
                </p>
            </div>

            {/* Search */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search exams..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Results Grid */}
            {isLoading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="h-64 w-full" />
                    ))}
                </div>
            ) : filteredResults.length === 0 ? (
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        {search
                            ? 'No results found matching your search.'
                            : 'No completed exams yet. Start taking exams to see your results here!'}
                    </AlertDescription>
                </Alert>
            ) : (
                <>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredResults.map((result: UserExam) => (
                            <ResultCard key={result.id} result={result} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                Previous
                            </Button>

                            <span className="text-sm text-muted-foreground">
                                Page {page} of {pagination.totalPages}
                            </span>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                                disabled={page === pagination.totalPages}
                            >
                                Next
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}