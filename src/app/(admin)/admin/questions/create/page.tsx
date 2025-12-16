/**
 * Admin Create Question Page
 *
 * Features:
 * - Create new question with form validation
 * - Set type (TIU, TWK, TKP), content, options, correct answer
 * - Optional image upload
 * - TKP scoring mode (weighted options)
 *
 * Backend endpoint:
 * - POST /api/v1/admin/questions
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { useCreateQuestion } from '@/features/questions/hooks';
import type { QuestionType, AnswerOption } from '@/shared/types/enum.types';

// UI Components
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';
import {
    ArrowLeft,
    Save,
    Loader2,
    HelpCircle,
    CheckCircle2,
    Image,
} from 'lucide-react';

// Question options
const optionKeys: AnswerOption[] = ['A', 'B', 'C', 'D', 'E'];

// Type descriptions
const typeDescriptions: Record<QuestionType, string> = {
    TIU: 'Tes Intelegensia Umum - Mengukur kemampuan verbal, numerik, dan figural',
    TWK: 'Tes Wawasan Kebangsaan - Pengetahuan tentang nasionalisme dan pemerintahan',
    TKP: 'Tes Karakteristik Pribadi - Mengukur kepribadian dan sikap',
};

export default function CreateQuestionPage() {
    const router = useRouter();
    const createMutation = useCreateQuestion();

    // Form state
    const [formData, setFormData] = useState({
        type: 'TIU' as QuestionType,
        content: '',
        options: {
            A: '',
            B: '',
            C: '',
            D: '',
            E: '',
        } as Record<AnswerOption, string>,
        correctAnswer: 'A' as AnswerOption,
        explanation: '',
    });

    // TKP scoring (optional)
    const [tkpScoring, setTkpScoring] = useState<Record<AnswerOption, number>>({
        A: 5,
        B: 4,
        C: 3,
        D: 2,
        E: 1,
    });

    // Form validation
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.content.trim()) {
            newErrors.content = 'Isi soal wajib diisi';
        } else if (formData.content.length < 10) {
            newErrors.content = 'Isi soal minimal 10 karakter';
        }

        // Validate all options are filled
        optionKeys.forEach((key) => {
            if (!formData.options[key].trim()) {
                newErrors[`option_${key}`] = `Opsi ${key} wajib diisi`;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle changes
    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    const handleOptionChange = (key: AnswerOption, value: string) => {
        setFormData((prev) => ({
            ...prev,
            options: { ...prev.options, [key]: value },
        }));
        if (errors[`option_${key}`]) {
            setErrors((prev) => ({ ...prev, [`option_${key}`]: '' }));
        }
    };

    // Handle form submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Mohon lengkapi semua field yang diperlukan');
            return;
        }

        try {
            const payload = {
                type: formData.type,
                content: formData.content.trim(),
                optionA: formData.options.A.trim(),
                optionB: formData.options.B.trim(),
                optionC: formData.options.C.trim(),
                optionD: formData.options.D.trim(),
                optionE: formData.options.E.trim(),
                correctAnswer: formData.correctAnswer,
                explanation: formData.explanation?.trim() || undefined,
                // Include TKP scoring if applicable
                ...(formData.type === 'TKP' && {
                    scoreA: tkpScoring.A,
                    scoreB: tkpScoring.B,
                    scoreC: tkpScoring.C,
                    scoreD: tkpScoring.D,
                    scoreE: tkpScoring.E,
                }),
            };

            const response = await createMutation.mutateAsync(payload);
            toast.success('Soal berhasil dibuat');

            // Redirect to question detail or list
            if (response?.question?.id) {
                router.push(`/admin/questions/${response.question.id}`);
            } else {
                router.push('/admin/questions');
            }
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Gagal membuat soal';
            toast.error(message);
        }
    };

    return (
        <div className="container mx-auto py-8 max-w-3xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin/questions">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">Tambah Soal Baru</h1>
                    <p className="text-muted-foreground">
                        Buat soal untuk bank soal
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Question Type */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <HelpCircle className="h-5 w-5" />
                            Tipe Soal
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Select
                            value={formData.type}
                            onValueChange={(value: QuestionType) =>
                                handleChange('type', value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih tipe soal" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="TIU">TIU - Tes Intelegensia Umum</SelectItem>
                                <SelectItem value="TWK">TWK - Tes Wawasan Kebangsaan</SelectItem>
                                <SelectItem value="TKP">TKP - Tes Karakteristik Pribadi</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground">
                            {typeDescriptions[formData.type]}
                        </p>
                    </CardContent>
                </Card>

                {/* Question Content */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Isi Soal</CardTitle>
                        <CardDescription>
                            Tulis pertanyaan dengan jelas dan lengkap
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="content">
                                Pertanyaan <span className="text-destructive">*</span>
                            </Label>
                            <Textarea
                                id="content"
                                value={formData.content}
                                onChange={(e) => handleChange('content', e.target.value)}
                                placeholder="Tuliskan pertanyaan di sini..."
                                rows={4}
                                className={errors.content ? 'border-destructive' : ''}
                            />
                            {errors.content && (
                                <p className="text-sm text-destructive">{errors.content}</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Answer Options */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Pilihan Jawaban</CardTitle>
                        <CardDescription>
                            Isi semua opsi jawaban dan pilih jawaban yang benar
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {optionKeys.map((key) => (
                            <div key={key} className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Label htmlFor={`option-${key}`} className="w-8 font-bold">
                                        {key}.
                                    </Label>
                                    <Input
                                        id={`option-${key}`}
                                        value={formData.options[key]}
                                        onChange={(e) => handleOptionChange(key, e.target.value)}
                                        placeholder={`Opsi ${key}`}
                                        className={`flex-1 ${errors[`option_${key}`] ? 'border-destructive' : ''}`}
                                    />
                                    {formData.correctAnswer === key && (
                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    )}
                                </div>
                                {errors[`option_${key}`] && (
                                    <p className="text-sm text-destructive ml-10">
                                        {errors[`option_${key}`]}
                                    </p>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Correct Answer */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            Jawaban Benar
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup
                            value={formData.correctAnswer}
                            onValueChange={(value) => handleChange('correctAnswer', value)}
                            className="flex flex-wrap gap-4"
                        >
                            {optionKeys.map((key) => (
                                <div key={key} className="flex items-center space-x-2">
                                    <RadioGroupItem value={key} id={`answer-${key}`} />
                                    <Label htmlFor={`answer-${key}`} className="font-medium">
                                        {key}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </CardContent>
                </Card>

                {/* TKP Scoring (only for TKP type) */}
                {formData.type === 'TKP' && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Skor TKP</CardTitle>
                            <CardDescription>
                                TKP menggunakan sistem skor bertingkat (1-5)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-5 gap-4">
                                {optionKeys.map((key) => (
                                    <div key={key} className="space-y-2">
                                        <Label htmlFor={`score-${key}`} className="text-center block">
                                            {key}
                                        </Label>
                                        <Select
                                            value={tkpScoring[key].toString()}
                                            onValueChange={(value) =>
                                                setTkpScoring((prev) => ({
                                                    ...prev,
                                                    [key]: parseInt(value),
                                                }))
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[5, 4, 3, 2, 1].map((score) => (
                                                    <SelectItem key={score} value={score.toString()}>
                                                        {score}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                Skor 5 = Paling baik, Skor 1 = Paling kurang baik
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Explanation (Optional) */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Pembahasan (Opsional)</CardTitle>
                        <CardDescription>
                            Penjelasan mengapa jawaban tersebut benar
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            value={formData.explanation}
                            onChange={(e) => handleChange('explanation', e.target.value)}
                            placeholder="Tulis pembahasan soal..."
                            rows={3}
                        />
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex justify-end gap-4">
                    <Link href="/admin/questions">
                        <Button type="button" variant="outline">
                            Batal
                        </Button>
                    </Link>
                    <Button type="submit" disabled={createMutation.isPending}>
                        {createMutation.isPending ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4 mr-2" />
                        )}
                        Simpan Soal
                    </Button>
                </div>
            </form>
        </div>
    );
}