// src/features/questions/components/QuestionForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/shared/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';
import type { Question } from '@/features/exam-sessions/types/exam-sessions.types';

// ✅ FIXED: Correct Zod enum syntax with proper error messages
const questionSchema = z.object({
    content: z.string().min(10, 'Question must be at least 10 characters'),
    optionA: z.string().min(1, 'Option A is required'),
    optionB: z.string().min(1, 'Option B is required'),
    optionC: z.string().min(1, 'Option C is required'),
    optionD: z.string().min(1, 'Option D is required'),
    optionE: z.string().min(1, 'Option E is required'),
    // ✅ OPTION 1: Simple string message (recommended)
    correctAnswer: z.enum(['A', 'B', 'C', 'D', 'E'], {
        message: 'Please select the correct answer',
    }),
    questionType: z.enum(['TIU', 'TWK', 'TKP'], {
        message: 'Please select a question type',
    }),
    defaultScore: z.number().min(1, 'Score must be at least 1'),
});

type QuestionFormData = z.infer<typeof questionSchema>;

interface QuestionFormProps {
    onSubmit: (data: QuestionFormData) => void;
    defaultValues?: Partial<Question>;
    isLoading?: boolean;
    submitLabel?: string;
}

export function QuestionForm({
                                 onSubmit,
                                 defaultValues,
                                 isLoading = false,
                                 submitLabel = 'Submit',
                             }: QuestionFormProps) {
    const form = useForm<QuestionFormData>({
        resolver: zodResolver(questionSchema),
        defaultValues: {
            content: defaultValues?.content || '',
            optionA: defaultValues?.optionA || '',
            optionB: defaultValues?.optionB || '',
            optionC: defaultValues?.optionC || '',
            optionD: defaultValues?.optionD || '',
            optionE: defaultValues?.optionE || '',
            correctAnswer: (defaultValues?.correctAnswer as 'A' | 'B' | 'C' | 'D' | 'E') || undefined,
            questionType: defaultValues?.questionType || undefined,
            defaultScore: defaultValues?.defaultScore ?? 5,
        },
    });

    const handleFormSubmit = (data: QuestionFormData) => {
        onSubmit(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
                {/* Question Type */}
                <FormField
                    control={form.control}
                    name="questionType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Question Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select question type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="TIU">TIU - Tes Intelegensi Umum</SelectItem>
                                    <SelectItem value="TWK">TWK - Tes Wawasan Kebangsaan</SelectItem>
                                    <SelectItem value="TKP">TKP - Tes Karakteristik Pribadi</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Question Content */}
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Question</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Enter the question..."
                                    className="min-h-[100px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Options */}
                {(['A', 'B', 'C', 'D', 'E'] as const).map((option) => (
                    <FormField
                        key={option}
                        control={form.control}
                        name={`option${option}` as keyof QuestionFormData}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Option {option}</FormLabel>
                                <FormControl>
                                    <Input placeholder={`Enter option ${option}...`} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                ))}

                {/* Correct Answer */}
                <FormField
                    control={form.control}
                    name="correctAnswer"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Correct Answer</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select correct answer" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="A">A</SelectItem>
                                    <SelectItem value="B">B</SelectItem>
                                    <SelectItem value="C">C</SelectItem>
                                    <SelectItem value="D">D</SelectItem>
                                    <SelectItem value="E">E</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Default Score */}
                <FormField
                    control={form.control}
                    name="defaultScore"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Default Score</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    min="1"
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                />
                            </FormControl>
                            <FormDescription>Points awarded for correct answer</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? 'Submitting...' : submitLabel}
                </Button>
            </form>
        </Form>
    );
}