/**
 * Exam Sessions List Page
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { PageHeaderTitle } from '@/shared/components/PageHeaderTitle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { ChevronLeft, ChevronRight, BookOpen, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useUserExams } from '@/features/exam-sessions/hooks/useUserExams';
import { UserExamCard } from '@/features/exam-sessions/components/UserExamCard';
import type { ExamStatus, UserExam } from '@/features/exam-sessions/types/exam-sessions.types';

export default function ExamSessionsPage() {
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<ExamStatus | 'all'>('all');
    const limit = 10;

    const { data, isLoading, isError } = useUserExams({
        page,
        limit,
        status: statusFilter === 'all' ? undefined : statusFilter,
    });

    // Extract from wrapper response
    const pagination = data?.pagination;
    const sessions: UserExam[] = data?.data ?? [];

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
                            Gagal memuat sesi ujian. Silakan coba lagi.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30">


            <div className="container mx-auto py-8 space-y-6">
                {/* Header */}
                <PageHeaderTitle
                    title="Sesi Ujian Saya"
                />

            {/* Status Filter Tabs */}
            <Tabs
                value={statusFilter}
                onValueChange={(v) => {
                    setStatusFilter(v as ExamStatus | 'all');
                    setPage(1);
                }}
            >
                <TabsList>
                    <TabsTrigger value="all">Semua</TabsTrigger>
                    <TabsTrigger value="IN_PROGRESS">Berlangsung</TabsTrigger>
                    <TabsTrigger value="FINISHED">Selesai</TabsTrigger>
                    <TabsTrigger value="TIMEOUT">Timeout</TabsTrigger>
                    <TabsTrigger value="CANCELLED">Dibatalkan</TabsTrigger>
                </TabsList>

                <TabsContent value={statusFilter} className="mt-6">
                    {sessions.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <p className="text-muted-foreground">
                                    {statusFilter === 'all'
                                        ? 'Belum ada sesi ujian. Mulai ujian dari halaman Exams.'
                                        : `Tidak ada sesi ujian dengan status "${statusFilter}".`}
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {sessions.map((session: UserExam) => (
                                <UserExamCard key={session.id} userExam={session} />
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

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
        </div>
    );
}