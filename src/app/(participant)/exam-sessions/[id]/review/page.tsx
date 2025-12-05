'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { examSessionsApi } from '@/features/exam-sessions/api/exam-sessions.api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import type { QuestionType, ExamAnswer } from '@/features/exam-sessions/types/exam-sessions.types';

type FilterType = 'ALL' | QuestionType;

export default function ReviewAnswersPage() {
    const params = useParams();
    const userExamId = Number(params.id);
    const [filterType, setFilterType] = useState<FilterType>('ALL');

    const { data, isLoading, error } = useQuery({
        queryKey: ['exam-session', userExamId],
        queryFn: () => examSessionsApi.getExamSession(userExamId),
    });

    if (isLoading) {
        return (
            <div className="container py-8">
                <Skeleton className="h-8 w-64 mb-6" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="container py-8">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>Failed to load exam review</AlertDescription>
                </Alert>
            </div>
        );
    }

    const { userExam, answers } = data.data;

    // Filter answers based on selected type
    const filteredAnswers = answers.filter((answer) => {
        if (filterType !== 'ALL' && answer.question.questionType !== filterType) return false;
        return true;
    });

    // Calculate statistics by question type
    const stats = answers.reduce((acc, answer) => {
        const qType = answer.question.questionType;
        if (!acc[qType]) {
            acc[qType] = { correct: 0, total: 0, score: 0 };
        }
        acc[qType].total++;
        if (answer.isCorrect) {
            acc[qType].correct++;
            acc[qType].score += answer.score ?? 0;
        }
        return acc;
    }, {} as Record<QuestionType, { correct: number; total: number; score: number }>);

    const typeColors: Record<QuestionType, string> = {
        TIU: 'bg-blue-100 text-blue-800',
        TWK: 'bg-green-100 text-green-800',
        TKP: 'bg-purple-100 text-purple-800',
    };

    return (
        <div className="container py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/results/${userExamId}`}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Results
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Review Answers</h1>
                </div>
            </div>

            {/* Summary Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {(['TIU', 'TWK', 'TKP'] as QuestionType[]).map((type) => {
                    const typeStat = stats[type] || { correct: 0, total: 0, score: 0 };
                    const accuracy =
                        typeStat.total > 0
                            ? ((typeStat.correct / typeStat.total) * 100).toFixed(1)
                            : '0.0';

                    return (
                        <Card key={type}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">{type}</CardTitle>
                                    <Badge className={typeColors[type]}>{type}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Correct:</span>
                                        <span className="font-medium">
                      {typeStat.correct}/{typeStat.total}
                    </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Accuracy:</span>
                                        <span className="font-medium">{accuracy}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Score:</span>
                                        <span className="font-medium">{typeStat.score}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Filter Tabs */}
            <Tabs value={filterType} onValueChange={(v) => setFilterType(v as FilterType)} className="mb-6">
                <TabsList>
                    <TabsTrigger value="ALL">All ({answers.length})</TabsTrigger>
                    {(['TIU', 'TWK', 'TKP'] as QuestionType[]).map((type) => {
                        const count = answers.filter((a) => a.question.questionType === type).length;
                        return (
                            <TabsTrigger key={type} value={type}>
                                {type} ({count})
                            </TabsTrigger>
                        );
                    })}
                </TabsList>
            </Tabs>

            {/* Answers List */}
            <div className="space-y-4">
                {filteredAnswers.map((answer, index) => {
                    const question = answer.question;
                    const optionLabels = ['A', 'B', 'C', 'D', 'E'];
                    const options = [
                        question.optionA,
                        question.optionB,
                        question.optionC,
                        question.optionD,
                        question.optionE,
                    ];

                    return (
                        <Card key={answer.questionId} className={answer.isCorrect ? 'border-green-500' : 'border-red-500'}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-muted-foreground">
                      #{index + 1}
                    </span>
                                        <Badge className={typeColors[question.questionType]}>
                                            {question.questionType}
                                        </Badge>
                                        {answer.isCorrect ? (
                                            <Badge variant="outline" className="bg-green-100 text-green-800">
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                Correct
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="bg-red-100 text-red-800">
                                                <XCircle className="w-3 h-3 mr-1" />
                                                Incorrect
                                            </Badge>
                                        )}
                                    </div>
                                    <Badge variant="outline">{answer.score ?? 0} pts</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Question Content */}
                                <div>
                                    <p className="font-medium mb-3">{question.content}</p>
                                </div>

                                {/* Options */}
                                <div className="space-y-2">
                                    {options.map((option, idx) => {
                                        const isSelected = answer.selectedOption === optionLabels[idx];
                                        const isCorrect = question.correctAnswer === optionLabels[idx];

                                        return (
                                            <div
                                                key={optionLabels[idx]}
                                                className={`flex items-start gap-3 p-3 border rounded-lg ${
                                                    isCorrect
                                                        ? 'bg-green-50 border-green-500'
                                                        : isSelected
                                                            ? 'bg-red-50 border-red-500'
                                                            : ''
                                                }`}
                                            >
                                                <div
                                                    className={`flex items-center justify-center w-6 h-6 rounded-full border font-medium text-sm ${
                                                        isCorrect
                                                            ? 'bg-green-500 text-white border-green-500'
                                                            : isSelected
                                                                ? 'bg-red-500 text-white border-red-500'
                                                                : 'bg-white'
                                                    }`}
                                                >
                                                    {optionLabels[idx]}
                                                </div>
                                                <p className="flex-1">{option}</p>
                                                {isCorrect && (
                                                    <Badge variant="outline" className="bg-green-100 text-green-800">
                                                        Correct Answer
                                                    </Badge>
                                                )}
                                                {isSelected && !isCorrect && (
                                                    <Badge variant="outline" className="bg-red-100 text-red-800">
                                                        Your Answer
                                                    </Badge>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {filteredAnswers.length === 0 && (
                <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                        No answers found for this filter
                    </CardContent>
                </Card>
            )}
        </div>
    );
}