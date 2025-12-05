'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, AlertCircle, Edit, BookOpen } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { useQuestion } from '@/features/questions/hooks';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function QuestionDetailPage({ params }: PageProps) {
    const { id } = use(params);
    const { data, isLoading, error } = useQuestion(id);

    const question = data?.data;

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Loading question...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !question) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
                    <h2 className="text-2xl font-bold text-foreground">Question Not Found</h2>
                    <p className="text-muted-foreground">
                        The question you're looking for doesn't exist or has been deleted.
                    </p>
                    <Link href="/admin/questions">
                        <Button>Back to Questions</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Header */}
            <div className="bg-background border-b border-border">
                <div className="container mx-auto px-4 py-6">
                    <Link href="/admin/questions">
                        <Button variant="ghost" className="mb-4">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Questions
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Question Header */}
                <Card className="mb-6">
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline">{question.questionType}</Badge>
                                    <Badge variant="secondary">{question.defaultScore} points</Badge>
                                </div>
                                <CardTitle className="text-2xl">Question Details</CardTitle>
                                <CardDescription>
                                    Review question information and answer options
                                </CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Link href={`/admin/questions/${id}/edit`}>
                                    <Button variant="outline" size="sm">
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Question Content */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-lg">Question</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-foreground whitespace-pre-wrap">{question.content}</p>
                    </CardContent>
                </Card>

                {/* Answer Options */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-lg">Answer Options</CardTitle>
                        <CardDescription>
                            Correct answer: <strong className="text-green-600">Option {question.correctAnswer}</strong>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {/* Option A */}
                            <div
                                className={`p-4 rounded-lg border ${
                                    question.correctAnswer === 'A'
                                        ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                                        : 'border-border'
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div
                                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                                            question.correctAnswer === 'A'
                                                ? 'bg-green-500 text-white'
                                                : 'bg-muted text-muted-foreground'
                                        }`}
                                    >
                                        A
                                    </div>
                                    <p className="flex-1 text-sm">{question.options.A}</p>
                                </div>
                            </div>

                            {/* Option B */}
                            <div
                                className={`p-4 rounded-lg border ${
                                    question.correctAnswer === 'B'
                                        ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                                        : 'border-border'
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div
                                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                                            question.correctAnswer === 'B'
                                                ? 'bg-green-500 text-white'
                                                : 'bg-muted text-muted-foreground'
                                        }`}
                                    >
                                        B
                                    </div>
                                    <p className="flex-1 text-sm">{question.options.B}</p>
                                </div>
                            </div>

                            {/* Option C */}
                            <div
                                className={`p-4 rounded-lg border ${
                                    question.correctAnswer === 'C'
                                        ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                                        : 'border-border'
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div
                                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                                            question.correctAnswer === 'C'
                                                ? 'bg-green-500 text-white'
                                                : 'bg-muted text-muted-foreground'
                                        }`}
                                    >
                                        C
                                    </div>
                                    <p className="flex-1 text-sm">{question.options.C}</p>
                                </div>
                            </div>

                            {/* Option D */}
                            <div
                                className={`p-4 rounded-lg border ${
                                    question.correctAnswer === 'D'
                                        ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                                        : 'border-border'
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div
                                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                                            question.correctAnswer === 'D'
                                                ? 'bg-green-500 text-white'
                                                : 'bg-muted text-muted-foreground'
                                        }`}
                                    >
                                        D
                                    </div>
                                    <p className="flex-1 text-sm">{question.options.D}</p>
                                </div>
                            </div>

                            {/* Option E */}
                            <div
                                className={`p-4 rounded-lg border ${
                                    question.correctAnswer === 'E'
                                        ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                                        : 'border-border'
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div
                                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                                            question.correctAnswer === 'E'
                                                ? 'bg-green-500 text-white'
                                                : 'bg-muted text-muted-foreground'
                                        }`}
                                    >
                                        E
                                    </div>
                                    <p className="flex-1 text-sm">{question.options.E}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Usage Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <BookOpen className="h-5 w-5" />
                            Usage Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Question ID:</span>
                                <span className="font-mono">{question.id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Question Type:</span>
                                <Badge variant="outline">{question.questionType}</Badge>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Default Score:</span>
                                <span className="font-semibold">{question.defaultScore} points</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Used in Exams:</span>
                                <span className="font-semibold">
                                    {question._count?.examQuestions || 0} exam(s)
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Created:</span>
                                <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Last Updated:</span>
                                <span>{new Date(question.updatedAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}