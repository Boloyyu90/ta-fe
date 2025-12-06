// src/app/(admin)/admin/questions/create/page.tsx

'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { useCreateQuestion } from '@/features/questions/hooks/useCreateQuestion';
import { QuestionForm } from '@/features/questions/components/QuestionForm';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { QuestionType } from '@/features/questions/types/questions.types';

/**
 * Admin Question Create Page
 *
 * Transforms between:
 * - QuestionForm format: { content, options: {A, B, C, D, E}, correctAnswer, questionType, imageUrl? }
 * - Backend CreateQuestionRequest: { content, options, correctAnswer, questionType, defaultScore }
 *
 * Note: Backend requires defaultScore field (not in form)
 */

// Form values expected by QuestionForm component
interface QuestionFormValues {
    content: string;
    options: {
        A: string;
        B: string;
        C: string;
        D: string;
        E: string;
    };
    correctAnswer: 'A' | 'B' | 'C' | 'D' | 'E';
    questionType: QuestionType;
    imageUrl?: string; // Optional for form
}

export default function CreateQuestionPage() {
    const router = useRouter();
    const createMutation = useCreateQuestion();
    const [isSubmitting, setIsSubmitting] = useState(false);

    /**
     * Transform QuestionFormValues to backend CreateQuestionRequest
     * ⚠️ Backend expects: content, options, correctAnswer, questionType, defaultScore (required!)
     * 🚫 Backend does NOT accept imageUrl
     */
    const handleSubmit = async (formData: QuestionFormValues) => {
        try {
            setIsSubmitting(true);

            /**
             * Calculate default score based on question type (CPNS standard)
             * TIU (Tes Intelegensia Umum): 5 points
             * TWK (Tes Wawasan Kebangsaan): 5 points
             * TKP (Tes Karakteristik Pribadi): 5 points
             *
             * This can be adjusted based on your thesis requirements
             */
            const defaultScore = 5; // Standard CPNS scoring

            // Transform to backend format
            const createData = {
                content: formData.content,
                options: formData.options,
                correctAnswer: formData.correctAnswer,
                questionType: formData.questionType,
                defaultScore, // Required by backend
                // imageUrl is ignored - backend Question doesn't have this field
            };

            await createMutation.mutateAsync(createData);

            toast.success('Question created successfully');
            router.push('/admin/questions');
        } catch (error: any) {
            console.error('Failed to create question:', error);
            toast.error(error.message || 'Failed to create question');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto py-8">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Create New Question</h1>
                    <p className="text-muted-foreground">
                        Add a new question to the question bank
                    </p>
                </div>
                <Button variant="outline" asChild>
                    <Link href="/admin/questions">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Questions
                    </Link>
                </Button>
            </div>

            <Card className="p-6">
                <QuestionForm
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    submitLabel="Create Question"
                />
            </Card>
        </div>
    );
}