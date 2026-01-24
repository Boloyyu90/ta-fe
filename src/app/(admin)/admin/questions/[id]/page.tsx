// src/app/(admin)/admin/questions/[id]/page.tsx

/**
 * Question Detail Page (Admin)
 *
 * ✅ AUDIT FIX v3:
 * - Parse id from string to number
 * - Access question from data.question (not data.data)
 */

'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useQuestion, useDeleteQuestion } from '@/features/questions/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/shared/components/ui/alert-dialog';
import { ArrowLeft, Edit, Trash2, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function QuestionDetailPage({ params }: PageProps) {
    const router = useRouter();
    const resolvedParams = use(params);

    // ✅ FIX: Parse id from string to number
    const id = parseInt(resolvedParams.id, 10);

    const { data, isLoading, error } = useQuestion(id);
    const deleteMutation = useDeleteQuestion();

    // ✅ FIX: Access question from data.question (not data.data)
    const question = data?.question;

    const handleDelete = async () => {
        try {
            await deleteMutation.mutateAsync(id);
            router.push('/admin/questions');
        } catch (error) {
            console.error('Failed to delete question:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto py-8 space-y-6">
                <Skeleton className="h-8 w-64" />
                <Card>
                    <CardContent className="p-6 space-y-4">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-32 w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error || !question) {
        return (
            <div className="container mx-auto py-8">
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-destructive">
                            {error?.message || 'Pertanyaan tidak ditemukan'}
                        </p>
                        <Link href="/admin/questions">
                            <Button variant="outline" className="mt-4">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const questionTypeLabels = {
        TIU: 'Tes Intelegensia Umum',
        TWK: 'Tes Wawasan Kebangsaan',
        TKP: 'Tes Karakteristik Pribadi',
    };

    return (
        <div className="container mx-auto py-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/questions">
                        <Button variant="ghost" size="icon" aria-label="Kembali">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Detail Pertanyaan</h1>
                        <p className="text-muted-foreground">ID: {question.id}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link href={`/admin/questions/${question.id}/edit`}>
                        <Button variant="outline">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Button>
                    </Link>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Hapus
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Hapus Pertanyaan?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Tindakan ini tidak dapat dibatalkan. Pertanyaan akan dihapus secara permanen.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    className="bg-destructive text-destructive-foreground"
                                >
                                    Hapus
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            {/* Content */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Badge>{question.questionType}</Badge>
                        <Badge variant="outline">{question.defaultScore} poin</Badge>
                        <span className="text-sm text-muted-foreground">
                            {questionTypeLabels[question.questionType]}
                        </span>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Question Content */}
                    <div>
                        <h3 className="font-medium mb-2">Pertanyaan</h3>
                        <p className="p-4 bg-muted rounded-lg">{question.content}</p>
                    </div>

                    {/* Options */}
                    <div>
                        <h3 className="font-medium mb-2">Pilihan Jawaban</h3>
                        <div className="space-y-2">
                            {Object.entries(question.options).map(([key, value]) => (
                                <div
                                    key={key}
                                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                                        key === question.correctAnswer
                                            ? 'bg-success/10 border-success/20 dark:bg-success/10 dark:border-success/30'
                                            : 'bg-background'
                                    }`}
                                >
                                    <span className="font-medium w-8">{key}.</span>
                                    <span className="flex-1">{value}</span>
                                    {key === question.correctAnswer && (
                                        <CheckCircle className="h-5 w-5 text-success" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Correct Answer */}
                    <div>
                        <h3 className="font-medium mb-2">Jawaban Benar</h3>
                        <Badge variant="default" className="text-lg px-4 py-2">
                            {question.correctAnswer}
                        </Badge>
                    </div>

                    {/* Usage Info */}
                    {question._count && (
                        <div className="pt-4 border-t">
                            <p className="text-sm text-muted-foreground">
                                Digunakan di {question._count.examQuestions} ujian
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}