// src/app/(admin)/admin/questions/create/page.tsx

/**
 * Admin Create Question Page
 *
 * ✅ FIXED:
 * - Use `Exclude<AnswerOption, null>` for option keys (not raw AnswerOption)
 * - Use correct CreateQuestionRequest shape (options, questionType, defaultScore)
 * - Use ANSWER_OPTIONS constant for iteration
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { useCreateQuestion } from '@/features/questions/hooks';
import type { QuestionType, AnswerOption } from '@/shared/types/enum.types';
import { ANSWER_OPTIONS } from '@/shared/types/enum.types';
import type { CreateQuestionRequest, QuestionOptions } from '@/features/questions/types/questions.types';
import { QUESTION_ERRORS, getErrorMessage } from '@/shared/lib/errors';

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
} from 'lucide-react';

// ✅ FIX: Use non-null answer option type
type NonNullAnswerOption = Exclude<AnswerOption, null>;

// Type descriptions
const typeDescriptions: Record<QuestionType, string> = {
    TIU: 'Tes Intelegensia Umum - Mengukur kemampuan verbal, numerik, dan figural',
    TWK: 'Tes Wawasan Kebangsaan - Pengetahuan tentang nasionalisme dan pemerintahan',
    TKP: 'Tes Karakteristik Pribadi - Mengukur kepribadian dan sikap',
};

export default function CreateQuestionPage() {
    const router = useRouter();
    const createMutation = useCreateQuestion();

    // Form state - ✅ FIX: Use QuestionOptions type
    const [formData, setFormData] = useState({
        questionType: 'TIU' as QuestionType,
        content: '',
        options: {
            A: '',
            B: '',
            C: '',
            D: '',
            E: '',
        } as QuestionOptions,
        correctAnswer: 'A' as NonNullAnswerOption,
        defaultScore: 5,
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

        // ✅ FIX: Use ANSWER_OPTIONS constant for iteration
        ANSWER_OPTIONS.forEach((key) => {
            if (!formData.options[key].trim()) {
                newErrors[`option_${key}`] = `Opsi ${key} wajib diisi`;
            }
        });

        if (formData.defaultScore < 1 || formData.defaultScore > 10) {
            newErrors.defaultScore = 'Skor harus antara 1-10';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle changes
    const handleChange = (field: string, value: string | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    // ✅ FIX: Use NonNullAnswerOption for key type
    const handleOptionChange = (key: NonNullAnswerOption, value: string) => {
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
            // ✅ FIX: Use correct CreateQuestionRequest shape
            const payload: CreateQuestionRequest = {
                content: formData.content.trim(),
                options: formData.options,
                correctAnswer: formData.correctAnswer,
                questionType: formData.questionType,
                defaultScore: formData.defaultScore,
            };

            const response = await createMutation.mutateAsync(payload);
            toast.success('Soal berhasil dibuat');

            // Redirect to question detail or list
            if (response?.question?.id) {
                router.push(`/admin/questions/${response.question.id}`);
            } else {
                router.push('/admin/questions');
            }
        } catch (error: unknown) {
            const err = error as {
                response?: {
                    data?: {
                        errorCode?: string;
                        message?: string;
                        errors?: Array<{ field: string; message: string }>;
                    };
                };
            };

            const errorCode = err?.response?.data?.errorCode;
            const backendMessage = err?.response?.data?.message;
            const fieldErrors = err?.response?.data?.errors;

            // Handle specific error codes
            if (errorCode) {
                if (errorCode === QUESTION_ERRORS.QUESTION_INVALID_OPTIONS) {
                    toast.error(getErrorMessage(errorCode));
                    return;
                }
                if (errorCode === QUESTION_ERRORS.QUESTION_INVALID_ANSWER) {
                    toast.error(getErrorMessage(errorCode));
                    return;
                }
                // Try to get Indonesian message for error code
                const message = getErrorMessage(errorCode);
                if (message !== 'Terjadi kesalahan') {
                    toast.error(message);
                    return;
                }
            }

            // Handle validation errors with field-level messages
            if (fieldErrors && fieldErrors.length > 0) {
                const newErrors: Record<string, string> = {};
                fieldErrors.forEach((err) => {
                    newErrors[err.field] = err.message;
                });
                setErrors(newErrors);
                toast.error('Terdapat kesalahan validasi. Mohon periksa form Anda.');
                return;
            }

            // Fallback to generic error
            const message = backendMessage || 'Gagal membuat soal';
            toast.error(message);
        }
    };

    return (
        <div className="container mx-auto py-8 max-w-3xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin/questions">
                    <Button variant="ghost" size="icon" aria-label="Kembali">
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
                            value={formData.questionType}
                            onValueChange={(value: QuestionType) =>
                                handleChange('questionType', value)
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
                            {typeDescriptions[formData.questionType]}
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

                {/* Answer Options - ✅ FIX: Use ANSWER_OPTIONS constant */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Pilihan Jawaban</CardTitle>
                        <CardDescription>
                            Isi semua opsi jawaban dan pilih jawaban yang benar
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {ANSWER_OPTIONS.map((key) => (
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
                                        <CheckCircle2 className="h-5 w-5 text-success" />
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

                {/* Correct Answer - ✅ FIX: Use ANSWER_OPTIONS */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-success" />
                            Jawaban Benar
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup
                            value={formData.correctAnswer}
                            onValueChange={(value) => handleChange('correctAnswer', value)}
                            className="flex flex-wrap gap-4"
                        >
                            {ANSWER_OPTIONS.map((key) => (
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

                {/* Default Score */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Skor Default</CardTitle>
                        <CardDescription>
                            Nilai poin untuk soal ini (1-10)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Input
                                type="number"
                                min={1}
                                max={10}
                                value={formData.defaultScore}
                                onChange={(e) => handleChange('defaultScore', parseInt(e.target.value) || 5)}
                                className={errors.defaultScore ? 'border-destructive' : ''}
                            />
                            {errors.defaultScore && (
                                <p className="text-sm text-destructive">{errors.defaultScore}</p>
                            )}
                        </div>
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