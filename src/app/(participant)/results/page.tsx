// src/app/(participant)/results/page.tsx
'use client';

import { useState } from 'react';
import { Loader2, Trophy, Search } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';
import { useMyResults } from '@/features/exam-sessions/hooks/useMyResults';
import { ResultCard } from '@/features/exam-sessions/components/ResultCard';

export default function ResultsPage() {
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState<'COMPLETED' | 'CANCELLED' | undefined>(undefined);
    const [searchQuery, setSearchQuery] = useState('');

    const limit = 10;
    const { data, isLoading } = useMyResults({ page, limit, status });

    const results = data?.userExams || [];
    const pagination = data?.pagination;

    // Filter by search query (client-side)
    const filteredResults = results.filter((result) =>
        result.exam.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Header */}
            <div className="bg-background border-b border-border">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Trophy className="h-8 w-8 text-primary" />
                        <h1 className="text-3xl font-bold text-foreground">My Results</h1>
                    </div>
                    <p className="text-muted-foreground">
                        View your exam history, scores, and performance analysis
                    </p>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-background border-b border-border">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search exam titles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Status Filter */}
                        <Select
                            value={status || 'ALL'}
                            onValueChange={(value) => {
                                setStatus(value === 'ALL' ? undefined : (value as any));
                                setPage(1);
                            }}
                        >
                            <SelectTrigger className="w-full md:w-[200px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Status</SelectItem>
                                <SelectItem value="COMPLETED">Completed</SelectItem>
                                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">Loading results...</p>
                        </div>
                    </div>
                ) : filteredResults.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                                No Results Found
                            </h3>
                            <p className="text-muted-foreground mb-6">
                                {searchQuery
                                    ? 'Try adjusting your search or filters'
                                    : 'You haven\'t completed any exams yet'}
                            </p>
                            <Button onClick={() => (window.location.href = '/exams')}>
                                Browse Exams
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {/* Results Grid */}
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            {filteredResults.map((result) => (
                                <ResultCard key={result.id} result={result} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    Previous
                                </Button>

                                <div className="flex items-center gap-2">
                                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
                                        (pageNum) => (
                                            <Button
                                                key={pageNum}
                                                variant={pageNum === page ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => setPage(pageNum)}
                                                className="w-10"
                                            >
                                                {pageNum}
                                            </Button>
                                        )
                                    )}
                                </div>

                                <Button
                                    variant="outline"
                                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                                    disabled={page === pagination.totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}