// src/app/(participant)/results/page.tsx
'use client';

import { useState } from 'react';
import { useMyResults } from '@/features/exam-sessions/hooks/useMyResults';
import { ResultCard } from '@/features/exam-sessions/components/ResultCard';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Input } from '@/shared/components/ui/input';
import { AlertCircle, Search } from 'lucide-react';
import type { UserExam } from '@/features/exam-sessions/types/exam-sessions.types';

export default function ResultsPage() {
    const [search, setSearch] = useState('');
    const [page] = useState(1);

    const { data, isLoading, error } = useMyResults({ page, limit: 20 });

    if (error) {
        return (
            <div className="container mx-auto py-8">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Failed to load results. Please try again later.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    const results = data?.data || [];

    // Filter results by search
    const filteredResults = results.filter((result: UserExam) =>
        result.exam.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container mx-auto py-8 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">My Results</h1>
                <p className="text-muted-foreground mt-2">
                    View your exam results and performance history
                </p>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search exams..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-64" />
                    ))}
                </div>
            )}

            {/* Results Grid */}
            {!isLoading && filteredResults.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredResults.map((result: UserExam) => (
                        <ResultCard key={result.id} result={result} />
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredResults.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">
                        {search
                            ? `No results found matching "${search}"`
                            : 'No exam results yet. Take an exam to see your results here.'}
                    </p>
                </div>
            )}
        </div>
    );
}