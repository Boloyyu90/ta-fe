// src/app/admin/questions/[id]/page.tsx
'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Edit, Trash2, Loader2, AlertCircle, CheckCircle2, Calendar, Hash } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
import { Separator } from '@/shared/components/ui/separator';
import { useQuestion, useDeleteQuestion } from '@/features/questions/hooks';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function QuestionDetailPage({ params }: PageProps) {
    const { id } = use(params);
    const { data, isLoading, error } = useQuestion(id);
    const { mutate: deleteQuestion, isPending: isDeleting } = useDeleteQuestion();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const question = data?.data;

    const handleDeleteClick = () => {
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        deleteQuestion(id);
        setDeleteDialogOpen(false);
    };

    const typeColors = {
        TIU: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
        TWK: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
        TKP: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400',
    };

    const typeLabels = {
        TIU: 'Tes Intelegensia Umum',
        TWK: 'Tes Wawasan Kebangsaan',
        TKP: 'Tes Karakteristik Pribadi',
    };

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

                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Badge className={typeColors[question.questionType]}>
                                    {question.questionType} - {typeLabels[question.questionType]}
                                </Badge>
                            </div>
                            <h1 className="text-2xl font-bold text-foreground">Question Details</h1>
                        </div>

                        <div className="flex gap-2">
                            <Link href={`/admin/questions/${id}/edit`}>
                                <Button variant="outline">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </Button>
                            </Link>
                            <Button
                                variant="destructive"
                                onClick={handleDeleteClick}
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <Trash2 className="h-4 w-4 mr-2" />
                                )}
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Content - Question & Options */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Question Content */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Question</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-lg leading-relaxed whitespace-pre-wrap">
                                    {question.content}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Answer Options */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Answer Options</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {(['A', 'B', 'C', 'D', 'E'] as const).map((option) => {
                                    const isCorrect = question.correctAnswer === option;
                                    return (
                                        <div
                                            key={option}
                                            className={`p-4 rounded-lg border-2 transition-colors ${
                                                isCorrect
                                                    ? 'border-green-500 bg-green-50 dark:bg-green-950/30'
                                                    : 'border-border'
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted font-semibold flex-shrink-0">
                                                    {option}
                                                </div>
                                                <div className="flex-1 pt-1">
                                                    <p className="leading-relaxed">{question.options[option]}</p>
                                                </div>
                                                {isCorrect && (
                                                    <Badge className="bg-green-500 text-white">
                                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                                        Correct
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar - Metadata */}
                    <div className="space-y-6">
                        {/* Question Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Hash className="h-4 w-4 text-muted-foreground" />
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Question ID</p>
                                        <p className="text-sm font-mono">{question.id}</p>
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Default Score</p>
                                        <p className="text-lg font-semibold">{question.defaultScore} points</p>
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Created</p>
                                        <p className="text-sm">
                                            {new Date(question.createdAt).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Usage Statistics */}
                        {question._count && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Usage Statistics</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Used in exams</span>
                                        <Badge variant="outline" className="text-lg px-3 py-1">
                                            {question._count.examQuestions}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Question?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {question._count?.examQuestions > 0 ? (
                                <div className="space-y-2">
                                    <p className="font-semibold text-red-600">
                                        Warning: This question is used in {question._count.examQuestions} exam(s)!
                                    </p>
                                    <p>
                                        Deleting this question will remove it from all exams. This action cannot be
                                        undone.
                                    </p>
                                </div>
                            ) : (
                                <p>Are you sure you want to delete this question? This action cannot be undone.</p>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={isDeleting}
                        >
                            {isDeleting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}