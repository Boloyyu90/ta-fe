// src/features/questions/components/QuestionForm.tsx

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/shared/components/ui/button';
import {
    Form,
    FormControl,
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
import type { Question, QuestionType } from '../types/questions.types';

// ✅ FIXED: Validation schema uses options object
const questionFormSchema = z.object({
    content: z.string().min(10, 'Question must be at least 10 characters'),
    options: z.object({
        A: z.string().min(1, 'Option A is required'),
        B: z.string().min(1, 'Option B is required'),
        C: z.string().min(1, 'Option C is required'),
        D: z.string().min(1, 'Option D is required'),
        E: z.string().min(1, 'Option E is required'),
    }),
    correctAnswer: z.enum(['A', 'B', 'C', 'D', 'E']),
    questionType: z.enum(['TIU', 'TWK', 'TKP']),
    imageUrl: z.string().optional(),
});

type QuestionFormValues = z.infer<typeof questionFormSchema>;

interface QuestionFormProps {
    defaultValues?: Partial<Question>;
    onSubmit: (data: QuestionFormValues) => void;
    isLoading?: boolean;
}

/**
 * Form for creating/editing questions
 *
 * ⚠️ FIXED:
 * - Uses options object (options.A-E) not individual optionA-E fields
 * - Removed defaultScore (not part of Question model)
 */
export function QuestionForm({ defaultValues, onSubmit, isLoading }: QuestionFormProps) {
    const form = useForm<QuestionFormValues>({
        resolver: zodResolver(questionFormSchema),
        defaultValues: {
            content: defaultValues?.content || '',
            // ✅ FIXED: Default values use options object
            options: {
                A: defaultValues?.options?.A || '',
                B: defaultValues?.options?.B || '',
                C: defaultValues?.options?.C || '',
                D: defaultValues?.options?.D || '',
                E: defaultValues?.options?.E || '',
            },
            correctAnswer: defaultValues?.correctAnswer || 'A',
            questionType: (defaultValues?.questionType as QuestionType) || 'TIU',
            imageUrl: defaultValues?.imageUrl || '',
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Question Content */}
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Question Content</FormLabel>
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

                {/* Options A-E */}
                {['A', 'B', 'C', 'D', 'E'].map((optionKey) => (
                    <FormField
                        key={optionKey}
                        control={form.control}
                        name={`options.${optionKey}` as any} // ✅ FIXED: Access nested options
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Option {optionKey}</FormLabel>
                                <FormControl>
                                    <Input placeholder={`Enter option ${optionKey}...`} {...field} />
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
                                    {['A', 'B', 'C', 'D', 'E'].map((option) => (
                                        <SelectItem key={option} value={option}>
                                            Option {option}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

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
                                    <SelectItem value="TIU">TIU (Tes Intelegensi Umum)</SelectItem>
                                    <SelectItem value="TWK">TWK (Tes Wawasan Kebangsaan)</SelectItem>
                                    <SelectItem value="TKP">TKP (Tes Karakteristik Pribadi)</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Image URL (Optional) */}
                <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Image URL (Optional)</FormLabel>
                            <FormControl>
                                <Input placeholder="https://example.com/image.jpg" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* ✅ REMOVED: defaultScore field (not part of Question model) */}

                {/* Submit Button */}
                <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? 'Saving...' : defaultValues ? 'Update Question' : 'Create Question'}
                </Button>
            </form>
        </Form>
    );
}