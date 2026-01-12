/**
 * Exam Review Page
*/

'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { CheckCircle, XCircle, ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';
import { useExamAnswers } from '@/features/exam-sessions/hooks/useExamAnswers';
import { AnswerReviewCard } from '@/features/exam-sessions/components/AnswerReviewCard';
import { PageHeaderTitle } from '@/shared/components/PageHeaderTitle';

export default function ExamReviewPage() {
    const params = useParams();
    const sessionId = params.id ? Number(params.id) : undefined;

    const { data: answersData, isLoading, isError } = useExamAnswers(sessionId);

    if (isLoading) {
        return (
            <div className="container mx-auto py-8 space-y-6">
                <Skeleton className="h-10 w-64" />
                <div className="grid gap-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-48" />
                    ))}
                </div>
            </div>
        );
    }

    if (isError || !answersData) {
        return (
            <div className="container mx-auto py-8">
                <Card>
                    <CardContent className="py-8 text-center">
                        <p className="text-muted-foreground">
                            Gagal memuat data review. Silakan coba lagi.
                        </p>
                        <Button asChild className="mt-4">
                            <Link href="/dashboard">
                                <Home className="h-4 w-4 mr-2" />
                                Kembali ke Dashboard
                            </Link>
                        </Button>
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
            <div className="flex items-center justify-between">
                <div>
                    <PageHeaderTitle
                        title="Review Jawaban"
                        subtitle={`${total} Soal telah dikerjakan`}
                    />
                </div>
                <Button asChild variant="outline">
                    <Link href={`/results/${sessionId}`}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Lihat Hasil
                    </Link>
                </Button>
            </div>

            {/* Summary Stats */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Ringkasan</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <span className="text-2xl font-bold text-green-600">
                                    {correctCount}
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground">Benar</p>
                        </div>
                        <div className="text-center p-4 bg-red-50 rounded-lg">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <XCircle className="h-5 w-5 text-red-600" />
                                <span className="text-2xl font-bold text-red-600">
                                    {incorrectCount}
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground">Salah</p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <span className="text-2xl font-bold text-gray-600">
                                {unansweredCount}
                            </span>
                            <p className="text-sm text-muted-foreground">Tidak Dijawab</p>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <span className="text-2xl font-bold text-blue-600">
                                {totalScore}
                            </span>
                            <p className="text-sm text-muted-foreground">Total Skor</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Answer Cards */}
            <div className="space-y-4">
                {answers.map((answer, index) => (
                    <AnswerReviewCard
                        key={answer.examQuestionId}
                        answer={answer}
                        index={index}
                        showCorrectAnswer={true}
                    />
                ))}
            </div>

            {/* Bottom Navigation */}
            <div className="flex justify-center gap-4 pt-4">
                <Button asChild variant="outline">
                    <Link href="/dashboard">
                        <Home className="h-4 w-4 mr-2" />
                        Dashboard
                    </Link>
                </Button>
                <Button asChild>
                    <Link href={`/results/${sessionId}`}>
                        Lihat Hasil Lengkap
                    </Link>
                </Button>
            </div>
        </div>
    );
}