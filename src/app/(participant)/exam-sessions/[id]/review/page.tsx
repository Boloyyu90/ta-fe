// src/app/(participant)/exam-sessions/[id]/review/page.tsx
'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, Filter } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';
import { useExamSession } from '@/features/exam-sessions/hooks/useExamSession';
import { useExamAnswers } from '@/features/exam-sessions/hooks/useExamAnswers';
import { AnswerReviewCard } from '@/features/exam-sessions/components/AnswerReviewCard';
import type { QuestionType } from '@/features/exam-sessions/types/exam-sessions.types';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function ExamReviewPage({ params }: PageProps) {
    const resolvedParams = use(params);
    const sessionId = parseInt(resolvedParams.id);
    const router = useRouter();

    const [filterType, setFilterType] = useState<QuestionType | 'ALL'>('ALL');
    const [filterCorrect, setFilterCorrect] = useState<'ALL' | 'CORRECT' | 'INCORRECT'>('ALL');

    const { data: sessionData, isLoading: isLoadingSession } = useExamSession(sessionId);
    const { data: answersData, isLoading: isLoadingAnswers } = useExamAnswers(sessionId);

    const session = sessionData?.userExam;
    const answers = answersData?.answers || [];

    // Filter answers
    const filteredAnswers = answers.filter((answer) => {
        if (filterType !== 'ALL' && answer.questionType !== filterType) return false;
        if (filterCorrect === 'CORRECT' && !answer.isCorrect) return false;
        if (filterCorrect === 'INCORRECT' && answer.isCorrect) return false;
        return true;
    });

    // Calculate statistics
    const stats = {
        total: answers.length,
        correct: answers.filter((a) => a.isCorrect).length,
        incorrect: answers.filter((a) => a.isCorrect === false).length,
        unanswered: answers.filter((a) => !a.selectedOption).length,
    };

    const scoresByType = answers.reduce((acc, answer) => {
        if (!acc[answer.questionType]) {
            acc[answer.questionType] = { correct: 0, total: 0, score: 0 };
        }
        acc[answer.questionType].total++;
        if (answer.isCorrect) {
            acc[answer.questionType].correct++;
            acc[answer.questionType].score += answer.score;
        }
        return acc;
    }, {} as Record<QuestionType, { correct: number; total: number; score: number }>);

    // Loading state
    if (isLoadingSession || isLoadingAnswers) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Loading review...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (!session || !answersData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <p className="text-lg font-semibold text-foreground">Review Not Available</p>
                    <Button onClick={() => router.push('/exam-sessions')}>Back to Sessions</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Header */}
            <div className="bg-background border-b border-border sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4">
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/exam-sessions')}
                        className="mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Sessions
                    </Button>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">{session.exam.title}</h1>
                            <p className="text-sm text-muted-foreground mt-1">Answer Review & Explanation</p>
                        </div>

                        <div className="text-right">
                            <div className="text-3xl font-bold text-foreground">
                                {session.totalScore || 0}
                            </div>
                            <p className="text-sm text-muted-foreground">Final Score</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-4 gap-6">
                    {/* Left Column: Statistics */}
                    <div className="space-y-6">
                        {/* Overall Statistics */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Overall Statistics</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Total Questions</span>
                                    <span className="font-semibold">{stats.total}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-green-600">Correct</span>
                                    <span className="font-semibold text-green-600">{stats.correct}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-red-600">Incorrect</span>
                                    <span className="font-semibold text-red-600">{stats.incorrect}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Unanswered</span>
                                    <span className="font-semibold">{stats.unanswered}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Score by Type */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Score by Type</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {Object.entries(scoresByType).map(([type, data]) => (
                                    <div key={type} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Badge
                                                className={
                                                    type === 'TIU'
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : type === 'TWK'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-purple-100 text-purple-700'
                                                }
                                            >
                                                {type}
                                            </Badge>
                                            <span className="text-sm font-semibold">
                        {data.correct}/{data.total}
                      </span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span>Score</span>
                                            <span className="font-medium">{data.score} points</span>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Filters */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Filter className="h-4 w-4" />
                                    Filters
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Question Type</label>
                                    <Select value={filterType} onValueChange={(value) => setFilterType(value as any)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ALL">All Types</SelectItem>
                                            <SelectItem value="TIU">TIU Only</SelectItem>
                                            <SelectItem value="TWK">TWK Only</SelectItem>
                                            <SelectItem value="TKP">TKP Only</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Answer Status</label>
                                    <Select value={filterCorrect} onValueChange={(value) => setFilterCorrect(value as any)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ALL">All Answers</SelectItem>
                                            <SelectItem value="CORRECT">Correct Only</SelectItem>
                                            <SelectItem value="INCORRECT">Incorrect Only</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                    onClick={() => {
                                        setFilterType('ALL');
                                        setFilterCorrect('ALL');
                                    }}
                                >
                                    Reset Filters
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Answer Review */}
                    <div className="lg:col-span-3 space-y-6">
                        {filteredAnswers.length === 0 ? (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <p className="text-muted-foreground">No answers match your filters.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            filteredAnswers.map((answer, index) => (
                                <AnswerReviewCard
                                    key={answer.examQuestionId}
                                    answer={answer}
                                    questionNumber={index + 1}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}