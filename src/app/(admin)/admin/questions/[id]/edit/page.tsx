// src/app/(admin)/admin/questions/[id]/edit/page.tsx

/**
 * Edit Question Page (Admin)
 *
 * ✅ AUDIT FIX v3:
 * - Parse id from string to number
 * - useUpdateQuestion() takes no arguments
 * - mutateAsync takes { id, data } object
 * - Access question from data.question (not data.data)
 */

'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuestion, useUpdateQuestion } from '@/features/questions/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import type { QuestionType, UpdateQuestionRequest } from '@/features/questions/types/questions.types';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function EditQuestionPage({ params }: PageProps) {
    const router = useRouter();
    const resolvedParams = use(params);

    // ✅ FIX: Parse id from string to number
    const questionId = parseInt(resolvedParams.id, 10);

    // ✅ FIX: useQuestion expects number
    const { data: questionData, isLoading, isError } = useQuestion(questionId);

    // ✅ FIX: useUpdateQuestion takes no arguments
    const updateMutation = useUpdateQuestion();

    // Form state
    const [formData, setFormData] = useState({
        content: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        optionE: '',
        correctAnswer: 'A' as 'A' | 'B' | 'C' | 'D' | 'E',
        questionType: 'TIU' as QuestionType,
        defaultScore: 5,
    });

    // ✅ FIX: Access question from questionData.question (not questionData.data)
    const question = questionData?.question;

    // Populate form when question data loads
    useEffect(() => {
        if (question) {
            setFormData({
                content: question.content,
                optionA: question.options.A,
                optionB: question.options.B,
                optionC: question.options.C,
                optionD: question.options.D,
                optionE: question.options.E,
                correctAnswer: question.correctAnswer,
                questionType: question.questionType,
                defaultScore: question.defaultScore,
            });
        }
    }, [question]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const updateData: UpdateQuestionRequest = {
            content: formData.content,
            options: {
                A: formData.optionA,
                B: formData.optionB,
                C: formData.optionC,
                D: formData.optionD,
                E: formData.optionE,
            },
            correctAnswer: formData.correctAnswer,
            questionType: formData.questionType,
            defaultScore: formData.defaultScore,
        };

        try {
            // ✅ FIX: mutateAsync takes { id, data } object
            await updateMutation.mutateAsync({
                id: questionId,
                data: updateData,
            });
            router.push(`/admin/questions/${questionId}`);
        } catch (error) {
            console.error('Failed to update question:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto py-8 space-y-6">
                <Skeleton className="h-8 w-64" />
                <Card>
                    <CardContent className="p-6 space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (isError || !question) {
        return (
            <div className="container mx-auto py-8">
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-destructive">Pertanyaan tidak ditemukan</p>
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

    return (
        <div className="container mx-auto py-8 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href={`/admin/questions/${questionId}`}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">Edit Pertanyaan</h1>
                    <p className="text-muted-foreground">ID: {questionId}</p>
                </div>
            </div>

            {/* Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Detail Pertanyaan</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Question Type & Score */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="questionType">Tipe Pertanyaan</Label>
                                <Select
                                    value={formData.questionType}
                                    onValueChange={(value: QuestionType) =>
                                        setFormData({ ...formData, questionType: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="TIU">TIU - Tes Intelegensia Umum</SelectItem>
                                        <SelectItem value="TWK">TWK - Tes Wawasan Kebangsaan</SelectItem>
                                        <SelectItem value="TKP">TKP - Tes Karakteristik Pribadi</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="defaultScore">Skor Default</Label>
                                <Input
                                    id="defaultScore"
                                    type="number"
                                    min={1}
                                    value={formData.defaultScore}
                                    onChange={(e) =>
                                        setFormData({ ...formData, defaultScore: parseInt(e.target.value) || 1 })
                                    }
                                />
                            </div>
                        </div>

                        {/* Question Content */}
                        <div className="space-y-2">
                            <Label htmlFor="content">Pertanyaan</Label>
                            <Textarea
                                id="content"
                                rows={4}
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                placeholder="Masukkan pertanyaan..."
                                required
                            />
                        </div>

                        {/* Options */}
                        <div className="space-y-4">
                            <Label>Pilihan Jawaban</Label>
                            {(['A', 'B', 'C', 'D', 'E'] as const).map((option) => (
                                <div key={option} className="flex items-center gap-3">
                                    <span className="font-medium w-8">{option}.</span>
                                    <Input
                                        value={formData[`option${option}` as keyof typeof formData] as string}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                [`option${option}`]: e.target.value,
                                            })
                                        }
                                        placeholder={`Pilihan ${option}`}
                                        required
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Correct Answer */}
                        <div className="space-y-2">
                            <Label htmlFor="correctAnswer">Jawaban Benar</Label>
                            <Select
                                value={formData.correctAnswer}
                                onValueChange={(value: 'A' | 'B' | 'C' | 'D' | 'E') =>
                                    setFormData({ ...formData, correctAnswer: value })
                                }
                            >
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="A">A</SelectItem>
                                    <SelectItem value="B">B</SelectItem>
                                    <SelectItem value="C">C</SelectItem>
                                    <SelectItem value="D">D</SelectItem>
                                    <SelectItem value="E">E</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Submit */}
                        <div className="flex justify-end gap-3">
                            <Link href={`/admin/questions/${questionId}`}>
                                <Button type="button" variant="outline">
                                    Batal
                                </Button>
                            </Link>
                            <Button type="submit" disabled={updateMutation.isPending}>
                                {updateMutation.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Simpan
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}