'use client';

import { useState } from 'react';
import { useMyResults } from '@/features/exam-sessions/hooks/useMyResults';
import { ResultCard } from '@/features/exam-sessions/components/ResultCard';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Results List Page
 *
 * Shows all completed exam results with pagination
 */
export default function ResultsPage() {
    const [page, setPage] = useState(1);
    const limit = 12;

    // Fetch results with proper generics
    // Returns: { data: UserExam[], pagination: {...} }
    const { data, isLoading } = useMyResults({ page, limit });

    // Access the results array and pagination from the data wrapper
    // data is { data: UserExam[], pagination: {...} }
    const results = data?.data || [];
    const pagination = data?.pagination;

    return (
        <div className="container mx-auto py-8 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Hasil Ujian</h1>
                <p className="text-gray-600 mt-2">
                    Riwayat dan hasil ujian yang telah Anda selesaikan
                </p>
            </div>

            {/* Results Grid */}
            {isLoading ? (
                <div className="text-center py-12 text-gray-500">
                    Memuat data...
                </div>
            ) : results.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-12">
                        <p className="text-gray-600">
                            Belum ada ujian yang diselesaikan
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {results.map((result) => (
                            <ResultCard key={result.id} userExam={result} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-4 mt-8">
                            <Button
                                variant="outline"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                Sebelumnya
                            </Button>

                            <span className="text-sm text-gray-600">
                                Halaman {pagination.currentPage} dari {pagination.totalPages}
                            </span>

                            <Button
                                variant="outline"
                                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                                disabled={page === pagination.totalPages}
                            >
                                Selanjutnya
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}