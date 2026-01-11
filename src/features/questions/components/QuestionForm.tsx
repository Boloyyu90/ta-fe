// src/features/questions/components/QuestionForm.tsx

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { Loader2 } from 'lucide-react';
import type { QuestionType, Question } from '../types/questions.types';

/**
 * QuestionForm Component
 *
 * Form for creating and editing questions in the question bank
 *
 * ⚠️ CRITICAL: Backend Question does NOT have imageUrl field!
 * Backend Question schema: { id, content, options, correctAnswer, questionType, defaultScore, createdAt, updatedAt }
 *
 * This form includes imageUrl as an optional field for future enhancement,
 * but it's NOT currently supported by the backend API.
 */

// Form validation schema
const questionFormSchema = z.object({
    content: z.string().min(10, 'Isi pertanyaan minimal 10 karakter'),
    options: z.object({
        A: z.string().min(1, 'Opsi A wajib diisi'),
        B: z.string().min(1, 'Opsi B wajib diisi'),
        C: z.string().min(1, 'Opsi C wajib diisi'),
        D: z.string().min(1, 'Opsi D wajib diisi'),
        E: z.string().min(1, 'Opsi E wajib diisi'),
    }),
    correctAnswer: z.enum(['A', 'B', 'C', 'D', 'E']),
    questionType: z.enum(['TIU', 'TWK', 'TKP']),
    imageUrl: z.string().url().optional().or(z.literal('')), // Optional for future use
});

export type QuestionFormValues = z.infer<typeof questionFormSchema>;

interface QuestionFormProps {
    defaultValues?: Partial<QuestionFormValues>;
    onSubmit: (data: QuestionFormValues) => void;
    isSubmitting?: boolean;
    submitLabel?: string;
}

export function QuestionForm({
                                 defaultValues,
                                 onSubmit,
                                 isSubmitting = false,
                                 submitLabel = 'Simpan',
                             }: QuestionFormProps) {
    /**
     * Initialize form with react-hook-form
     *
     * ⚠️ FIXED: Don't access imageUrl from defaultValues since Question type doesn't have it
     * Instead, set imageUrl to empty string (default for optional field)
     */
    const form = useForm<QuestionFormValues>({
        resolver: zodResolver(questionFormSchema),
        defaultValues: {
            content: defaultValues?.content || '',
            options: defaultValues?.options || {
                A: '',
                B: '',
                C: '',
                D: '',
                E: '',
            },
            correctAnswer: defaultValues?.correctAnswer || 'A',
            questionType: defaultValues?.questionType || 'TIU',
            // ⚠️ FIXED: Don't try to access defaultValues?.imageUrl since Question doesn't have this field
            // Just set to empty string (will be omitted in API call anyway)
            imageUrl: '', // Not supported by backend yet
        },
    });

    const questionType = form.watch('questionType');

    // Question type labels for display
    const questionTypeLabels: Record<QuestionType, string> = {
        TIU: 'Tes Intelegensia Umum',
        TWK: 'Tes Wawasan Kebangsaan',
        TKP: 'Tes Karakteristik Pribadi',
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Question Type Selection */}
                <FormField
                    control={form.control}
                    name="questionType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tipe Soal</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih tipe soal" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {(['TIU', 'TWK', 'TKP'] as const).map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type} - {questionTypeLabels[type]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                Pilih kategori untuk soal ini
                            </FormDescription>
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
                            <FormLabel>Isi Pertanyaan</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Masukkan teks pertanyaan..."
                                    className="min-h-[120px] resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Tulis pertanyaan yang jelas dan ringkas (minimal 10 karakter)
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Answer Options */}
                <div className="space-y-4">
                    <h3 className="text-sm font-medium">Pilihan Jawaban</h3>
                    {(['A', 'B', 'C', 'D', 'E'] as const).map((optionKey) => (
                        <FormField
                            key={optionKey}
                            control={form.control}
                            name={`options.${optionKey}`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Opsi {optionKey}</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={`Masukkan opsi ${optionKey}...`}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))}
                </div>

                {/* Correct Answer Selection */}
                <FormField
                    control={form.control}
                    name="correctAnswer"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel>Jawaban Benar</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1"
                                >
                                    {(['A', 'B', 'C', 'D', 'E'] as const).map((optionKey) => {
                                        const optionText = form.watch(`options.${optionKey}`);
                                        return (
                                            <FormItem
                                                key={optionKey}
                                                className="flex items-center space-x-3 space-y-0"
                                            >
                                                <FormControl>
                                                    <RadioGroupItem value={optionKey} />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Opsi {optionKey}
                                                    {optionText && `: ${optionText}`}
                                                </FormLabel>
                                            </FormItem>
                                        );
                                    })}
                                </RadioGroup>
                            </FormControl>
                            <FormDescription>
                                Pilih opsi mana yang merupakan jawaban benar
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Image URL (Optional - Not yet supported by backend) */}
                <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>URL Gambar (Opsional)</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="https://example.com/image.jpg"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                ⚠️ Catatan: Fitur upload gambar belum didukung oleh backend.
                                Field ini untuk pengembangan di masa depan.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Submit Button */}
                <div className="flex justify-end gap-4">
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {submitLabel}
                    </Button>
                </div>
            </form>
        </Form>
    );
}