'use client';

import { use } from 'react';
import Link from 'next/link';
import { useExam } from '@/features/exams/hooks';
import { useExamAttempts } from '@/features/exam-sessions/hooks';
import { AttemptResultCard } from '@/features/exam-sessions/components';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { ArrowLeft, Search, Filter, FileX } from 'lucide-react';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function ExamHistoryPage({ params }: PageProps) {
    const resolvedParams = use(params);
    const examId = parseInt(resolvedParams.id, 10);

    const { data: exam, isLoading: examLoading } = useExam(examId);
    const { attempts, isLoading: attemptsLoading, hasAttempts } = useExamAttempts(examId);

    const isLoading = examLoading || attemptsLoading;

    return (
        <div className="container mx-auto py-8 max-w-4xl space-y-6">

            {/* Header Banner */}
            <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg p-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                        <FileX className="h-6 w-6" />
                    </div>
                    <h1 className="text-2xl font-bold">Detail Riwayat</h1>
                </div>
            </div>

            {/* Description */}
            {exam && (
                <p className="text-muted-foreground">
                    Hi User, Riwayat <strong className="text-foreground">{exam.title}</strong> ini berisi hasil perolehan
                    mu yang berdasarkan percobaan try out{' '}
                    <span className="text-primary font-medium">
                        (Aktif selama 1 tahun - Maksimal Attempt Sebanyak {exam.maxAttempts ?? 'Tidak Terbatas'} X selama masa aktif paket berlaku)
                    </span>
                </p>
            )}

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Temukan paket belajarmu..."
                        className="pl-10"
                    />
                </div>
                <Button className="bg-primary hover:bg-primary/90">
                    Cari
                </Button>
                <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                </Button>
            </div>

            {/* Attempts List */}
            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-48 w-full" />
                    ))}
                </div>
            ) : !hasAttempts ? (
                <div className="text-center py-12 text-muted-foreground">
                    Belum ada riwayat percobaan untuk paket ini.
                </div>
            ) : (
                <div className="space-y-4">
                    {attempts.map((attempt) => (
                        <AttemptResultCard
                            key={attempt.id}
                            title={`Perolehan Try Out - Percobaan ${attempt.attemptNumber}`}
                            result={attempt}
                            showReviewButton
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
