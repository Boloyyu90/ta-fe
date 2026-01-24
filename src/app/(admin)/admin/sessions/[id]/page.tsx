// src/app/(admin)/admin/sessions/[id]/page.tsx

/**
 * Admin Session Detail Page
 *
 * Features:
 * - View session metadata
 * - View all answers with correct/incorrect indicators
 * - View proctoring events for this session
 *
 * Backend endpoints:
 * - GET /api/v1/admin/exam-sessions/:id
 * - GET /api/v1/admin/exam-sessions/:id/answers
 * - GET /api/v1/admin/proctoring/exam-sessions/:id/events
 */

'use client';

import { use } from 'react';
import Link from 'next/link';
import { useAdminSessionAnswers } from '@/features/exam-sessions/hooks/useAdminSessionAnswers';
import type { ExamStatus } from '@/shared/types/enum.types';

// UI Components
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Separator } from '@/shared/components/ui/separator';
import {
    ArrowLeft,
    User,
    FileText,
    Clock,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Eye,
} from 'lucide-react';

interface PageProps {
    params: Promise<{ id: string }>;
}

// Question type badge config
const questionTypeConfig = {
    TIU: { label: 'TIU', variant: 'default' as const },
    TWK: { label: 'TWK', variant: 'secondary' as const },
    TKP: { label: 'TKP', variant: 'outline' as const },
};

export default function AdminSessionDetailPage({ params }: PageProps) {
    const resolvedParams = use(params);
    const sessionId = parseInt(resolvedParams.id, 10);

    // Fetch session answers (includes question content and correctness)
    const { data: answersData, isLoading, isError } = useAdminSessionAnswers(sessionId);

    // Format helpers
    const formatOption = (option: string | null) => {
        if (!option) return '-';
        return option;
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="container mx-auto py-8 space-y-6">
                <Skeleton className="h-10 w-64" />
                <div className="grid gap-4 md:grid-cols-3">
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                </div>
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-48" />
                    ))}
                </div>
            </div>
        );
    }

    // Error state
    if (isError || !answersData) {
        return (
            <div className="container mx-auto py-8">
                <Card>
                    <CardContent className="py-8 text-center">
                        <AlertTriangle className="h-12 w-12 mx-auto text-warning mb-4" />
                        <p className="text-muted-foreground mb-4">
                            Gagal memuat detail sesi. Sesi mungkin belum selesai atau tidak ditemukan.
                        </p>
                        <Link href="/admin/sessions">
                            <Button variant="outline">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Kembali
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const { answers, total } = answersData;

    // Calculate stats
    const correctCount = answers.filter((a) => a.isCorrect === true).length;
    const incorrectCount = answers.filter((a) => a.isCorrect === false).length;
    const unansweredCount = answers.filter((a) => a.selectedOption === null).length;
    const totalScore = answers.reduce((sum, a) => sum + (a.score ?? 0), 0);

    return (
        <div className="container mx-auto py-8 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/sessions">
                    <Button variant="ghost" size="icon" aria-label="Kembali">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">Detail Sesi #{sessionId}</h1>
                    <p className="text-muted-foreground">Review jawaban peserta</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Soal
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{total}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-success">
                            Benar
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-success flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5" />
                            {correctCount}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-destructive">
                            Salah
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive flex items-center gap-2">
                            <XCircle className="h-5 w-5" />
                            {incorrectCount}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-primary">
                            Total Skor
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">{totalScore}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Accuracy Summary */}
            <Card>
                <CardHeader>
                    <CardTitle>Ringkasan</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <div className="flex-1 bg-muted rounded-full h-4">
                            <div
                                className="bg-success h-4 rounded-full transition-all"
                                style={{ width: `${total > 0 ? (correctCount / total) * 100 : 0}%` }}
                            />
                        </div>
                        <span className="text-sm font-medium">
                            {total > 0 ? Math.round((correctCount / total) * 100) : 0}% Benar
                        </span>
                    </div>
                    {unansweredCount > 0 && (
                        <p className="text-sm text-warning mt-2">
                            ⚠️ {unansweredCount} soal tidak dijawab
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Answers List */}
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Jawaban</CardTitle>
                    <CardDescription>
                        Review semua jawaban peserta
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {answers.map((answer, index) => (
                        <div
                            key={answer.examQuestionId}
                            className={`p-4 rounded-lg border ${
                                answer.isCorrect === true
                                    ? 'border-success/20 bg-success/10'
                                    : answer.isCorrect === false
                                        ? 'border-destructive/20 bg-destructive/10'
                                        : 'border-warning/20 bg-warning/10'
                            }`}
                        >
                            {/* Question Header */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-lg">#{index + 1}</span>
                                    <Badge variant={questionTypeConfig[answer.questionType]?.variant || 'outline'}>
                                        {answer.questionType}
                                    </Badge>
                                    <span className="text-sm text-muted-foreground">
                                        ({answer.score ?? 0} poin)
                                    </span>
                                </div>
                                {answer.isCorrect === true ? (
                                    <Badge variant="success">
                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                        Benar
                                    </Badge>
                                ) : answer.isCorrect === false ? (
                                    <Badge variant="destructive">
                                        <XCircle className="h-3 w-3 mr-1" />
                                        Salah
                                    </Badge>
                                ) : (
                                    <Badge variant="secondary">
                                        Tidak Dijawab
                                    </Badge>
                                )}
                            </div>

                            {/* Question Content */}
                            <p className="mb-4 text-sm">{answer.questionContent}</p>

                            {/* Options */}
                            <div className="grid gap-2">
                                {Object.entries(answer.options).map(([key, value]) => {
                                    const isSelected = answer.selectedOption === key;
                                    const isCorrect = answer.correctAnswer === key;

                                    return (
                                        <div
                                            key={key}
                                            className={`p-2 rounded border text-sm ${
                                                isCorrect
                                                    ? 'border-success bg-success/10'
                                                    : isSelected && !isCorrect
                                                        ? 'border-destructive bg-destructive/10'
                                                        : 'border-border bg-background'
                                            }`}
                                        >
                                            <span className="font-medium mr-2">{key}.</span>
                                            {value}
                                            {isCorrect && (
                                                <CheckCircle2 className="inline h-4 w-4 ml-2 text-success" />
                                            )}
                                            {isSelected && !isCorrect && (
                                                <XCircle className="inline h-4 w-4 ml-2 text-destructive" />
                                            )}
                                            {isSelected && (
                                                <span className="ml-2 text-xs text-muted-foreground">
                                                    (Jawaban Peserta)
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Back Button */}
            <div className="flex justify-center">
                <Link href="/admin/sessions">
                    <Button variant="outline">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Kembali ke Daftar Sesi
                    </Button>
                </Link>
            </div>
        </div>
    );
}