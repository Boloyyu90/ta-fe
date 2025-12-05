// src/app/(participant)/exam-sessions/[id]/review/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useExamAnswers } from '@/features/exam-sessions/hooks/useExamAnswers';
import { useExamSession } from '@/features/exam-sessions/hooks/useExamSession';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { ArrowLeft, CheckCircle, XCircle, Circle } from 'lucide-react';
import { AnswerReviewCard } from '@/features/exam-sessions/components';
import Link from 'next/link';
import type { AnswerWithQuestion, QuestionType } from '@/features/exam-sessions/types/exam-sessions.types';

type FilterType = 'all' | 'correct' | 'incorrect' | 'unanswered';

export default function ReviewExamPage() {
    const params = useParams();
    const router = useRouter();
    const sessionId = parseInt(params.id as string);

    const [filterType, setFilterType] = useState<FilterType>('all');

    const { data: sessionData, isLoading: sessionLoading } = useExamSession(sessionId);
    const { data: answersData, isLoading: answersLoading } = useExamAnswers(sessionId);

    if (sessionLoading || answersLoading) {
        return (
            <div className="container mx-auto py-8 space-y-6">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-64" />
            </div>
        );
    }

    const session = sessionData?.data?.userExam;
    const answers = answersData?.data || [];

    if (!session) {
        return (
            <div className="container mx-auto py-8">
                <Alert variant="destructive">
                    <AlertDescription>Exam session not found.</AlertDescription>
                </Alert>
            </div>
        );
    }

    // Filter answers
    const filteredAnswers = answers.filter((answer: AnswerWithQuestion) => {
        if (filterType === 'all') return true;
        if (filterType === 'correct') return answer.isCorrect;
        if (filterType === 'incorrect') return !answer.isCorrect && answer.selectedOption;
        if (filterType === 'unanswered') return !answer.selectedOption;
        return true;
    });

    const stats = {
        total: answers.length,
        correct: answers.filter((a: AnswerWithQuestion) => a.isCorrect).length,
        incorrect: answers.filter((a: AnswerWithQuestion) => !a.isCorrect && a.selectedOption).length,
        unanswered: answers.filter((a: AnswerWithQuestion) => !a.selectedOption).length,
    };

    return (
        <div className="container mx-auto py-8 space-y-6">
            {/* Back Button */}
            <Button variant="ghost" asChild>
                <Link href="/results">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Results
                </Link>
            </Button>

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">{session.exam.title}</h1>
                <p className="text-muted-foreground mt-2">Review your answers</p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Total Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{session.totalScore || 0}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Correct
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.correct}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <XCircle className="h-4 w-4 text-red-600" />
                            Incorrect
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{stats.incorrect}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Circle className="h-4 w-4 text-muted-foreground" />
                            Unanswered
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-muted-foreground">
                            {stats.unanswered}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filter Tabs */}
            <Tabs value={filterType} onValueChange={(v) => setFilterType(v as FilterType)} className="mb-6">
                <TabsList>
                    <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
                    <TabsTrigger value="correct">Correct ({stats.correct})</TabsTrigger>
                    <TabsTrigger value="incorrect">Incorrect ({stats.incorrect})</TabsTrigger>
                    <TabsTrigger value="unanswered">Unanswered ({stats.unanswered})</TabsTrigger>
                </TabsList>

                <TabsContent value={filterType} className="space-y-6 mt-6">
                    {filteredAnswers.map((answer: AnswerWithQuestion, index: number) => (
                        <AnswerReviewCard
                            key={answer.id}
                            answer={answer}
                            questionNumber={answers.findIndex((a: AnswerWithQuestion) => a.id === answer.id) + 1}
                        />
                    ))}

                    {filteredAnswers.length === 0 && (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <p className="text-muted-foreground">No answers in this category</p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}