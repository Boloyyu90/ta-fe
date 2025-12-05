// src/features/admin/components/questions/QuestionForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import type { Question } from '../types/questions.types';

// Validation schema
const questionSchema = z.object({
    content: z
        .string()
        .min(10, 'Question must be at least 10 characters')
        .max(5000, 'Question must not exceed 5000 characters'),
    optionA: z.string().min(1, 'Option A is required'),
    optionB: z.string().min(1, 'Option B is required'),
    optionC: z.string().min(1, 'Option C is required'),
    optionD: z.string().min(1, 'Option D is required'),
    optionE: z.string().min(1, 'Option E is required'),
    correctAnswer: z.enum(['A', 'B', 'C', 'D', 'E'], {
        required_error: 'Please select the correct answer',
    }),
    questionType: z.enum(['TIU', 'TWK', 'TKP'], {
        required_error: 'Please select a question type',
    }),
    defaultScore: z
        .number()
        .int()
        .min(1, 'Score must be at least 1')
        .max(100, 'Score must not exceed 100')
        .default(5),
});

type QuestionFormData = z.infer<typeof questionSchema>;

interface QuestionFormProps {
    question?: Question;
    onSubmit: (data: any) => void;
    isSubmitting: boolean;
    mode: 'create' | 'edit';
}

export function QuestionForm({ question, onSubmit, isSubmitting, mode }: QuestionFormProps) {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<QuestionFormData>({
        resolver: zodResolver(questionSchema),
        defaultValues: question
            ? {
                content: question.content,
                optionA: question.options.A,
                optionB: question.options.B,
                optionC: question.options.C,
                optionD: question.options.D,
                optionE: question.options.E,
                correctAnswer: question.correctAnswer,
                questionType: question.questionType,
                defaultScore: question.defaultScore,
            }
            : {
                defaultScore: 5,
            },
    });

    const correctAnswer = watch('correctAnswer');
    const questionType = watch('questionType');

    const handleFormSubmit = (data: QuestionFormData) => {
        const payload = {
            content: data.content,
            options: {
                A: data.optionA,
                B: data.optionB,
                C: data.optionC,
                D: data.optionD,
                E: data.optionE,
            },
            correctAnswer: data.correctAnswer,
            questionType: data.questionType,
            defaultScore: data.defaultScore,
        };
        onSubmit(payload);
    };

    const typeColors = {
        TIU: 'bg-blue-100 text-blue-700',
        TWK: 'bg-green-100 text-green-700',
        TKP: 'bg-purple-100 text-purple-700',
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Question Content */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Question Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="content">Question Text *</Label>
                        <textarea
                            id="content"
                            {...register('content')}
                            rows={4}
                            className="mt-2 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Enter your question here..."
                        />
                        {errors.content && (
                            <p className="text-sm text-red-600 mt-1">{errors.content.message}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                            {watch('content')?.length || 0} / 5000 characters
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="questionType">Question Type *</Label>
                            <Select
                                value={questionType}
                                onValueChange={(value) => setValue('questionType', value as any)}
                            >
                                <SelectTrigger className="mt-2">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="TIU">TIU - Tes Intelegensia Umum</SelectItem>
                                    <SelectItem value="TWK">TWK - Tes Wawasan Kebangsaan</SelectItem>
                                    <SelectItem value="TKP">TKP - Tes Karakteristik Pribadi</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.questionType && (
                                <p className="text-sm text-red-600 mt-1">{errors.questionType.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="defaultScore">Default Score *</Label>
                            <Input
                                id="defaultScore"
                                type="number"
                                {...register('defaultScore', { valueAsNumber: true })}
                                className="mt-2"
                            />
                            {errors.defaultScore && (
                                <p className="text-sm text-red-600 mt-1">{errors.defaultScore.message}</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Answer Options */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Answer Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {['A', 'B', 'C', 'D', 'E'].map((option) => (
                        <div
                            key={option}
                            className={`p-4 rounded-lg border-2 transition-colors ${
                                correctAnswer === option
                                    ? 'border-green-500 bg-green-50 dark:bg-green-950/30'
                                    : 'border-border'
                            }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="flex items-center gap-2 pt-2">
                                    <input
                                        type="radio"
                                        id={`correct-${option}`}
                                        value={option}
                                        {...register('correctAnswer')}
                                        className="w-4 h-4 cursor-pointer"
                                    />
                                    <Label
                                        htmlFor={`correct-${option}`}
                                        className="font-semibold cursor-pointer"
                                    >
                                        {option}
                                    </Label>
                                </div>

                                <div className="flex-1">
                                    <Input
                                        {...register(`option${option}` as any)}
                                        placeholder={`Option ${option} text`}
                                        className="mb-2"
                                    />
                                    {errors[`option${option}` as keyof typeof errors] && (
                                        <p className="text-sm text-red-600">
                                            {errors[`option${option}` as keyof typeof errors]?.message as string}
                                        </p>
                                    )}
                                </div>

                                {correctAnswer === option && (
                                    <Badge className="bg-green-500 text-white mt-2">Correct Answer</Badge>
                                )}
                            </div>
                        </div>
                    ))}

                    {errors.correctAnswer && (
                        <p className="text-sm text-red-600">{errors.correctAnswer.message}</p>
                    )}
                </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex items-center gap-4">
                <Button type="submit" size="lg" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    {mode === 'create' ? 'Create Question' : 'Update Question'}
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => window.history.back()}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
}