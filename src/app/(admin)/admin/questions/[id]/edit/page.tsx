// src/app/(admin)/admin/questions/[id]/edit/page.tsx

'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { useQuestion } from '@/features/questions/hooks/useQuestion';
import { useUpdateQuestion } from '@/features/questions/hooks/useUpdateQuestion';
import { QuestionForm } from '@/features/questions/components/QuestionForm';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { QuestionType } from '@/features/questions/types/questions.types';

/**
 * Admin Question Edit Page
 *
 * Transforms between:
 * - Backend Question format: { content, options: {A, B, C, D, E}, correctAnswer, questionType, defaultScore }
 * - QuestionForm format: { content, options: {A, B, C, D, E}, correctAnswer, questionType, imageUrl? }
 *
 * Note: Backend Question does NOT have imageUrl field (removed in alignment)
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
    imageUrl?: string; // Optional for form, but not in backend Question
}

export default function EditQuestionPage() {
    const params = useParams();
    const router = useRouter();
    const questionId = params.id as string;

    // Fetch existing question - returns QuestionDetailResponse with nested data
    const { data: question, isLoading, isError } = useQuestion(questionId);

    // Update mutation
    const updateMutation = useUpdateQuestion(questionId);

    const [isSubmitting, setIsSubmitting] = useState(false);

    /**
     * Transform QuestionFormValues to backend UpdateQuestionRequest
     * ⚠️ Backend expects: content, options, correctAnswer, questionType, defaultScore
     * 🚫 Backend does NOT accept imageUrl
     */
    const handleSubmit = async (formData: QuestionFormValues) => {
        try {
            setIsSubmitting(true);

            // Extract only fields that backend accepts
            const updateData = {
                content: formData.content,
                options: formData.options,
                correctAnswer: formData.correctAnswer,
                questionType: formData.questionType,
                // Note: defaultScore not changed during edit (backend doesn't require it)
                // imageUrl is ignored - backend Question doesn't have this field
            };

            await updateMutation.mutateAsync(updateData);

            toast.success('Question updated successfully');
            router.push('/admin/questions');
        } catch (error: any) {
            console.error('Failed to update question:', error);
            toast.error(error.message || 'Failed to update question');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Loading question...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (isError || !question) {
        return (
            <div className="container mx-auto py-8">
                <Card className="p-6">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold text-destructive mb-2">
                            Failed to Load Question
                        </h2>
                        <p className="text-muted-foreground mb-4">
                            The question could not be found or you don't have permission to edit it.
                        </p>
                        <Button asChild>
                            <Link href="/admin/questions">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Questions
                            </Link>
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    /**
     * ✅ FIX: Access question.data because QuestionDetailResponse has nested structure
     * QuestionDetailResponse: { success: boolean, data: QuestionWithUsage }
     */
    const defaultValues: Partial<QuestionFormValues> = {
        content: question.data.content,
        options: question.data.options,
        correctAnswer: question.data.correctAnswer,
        questionType: question.data.questionType,
        // imageUrl: undefined (backend Question doesn't have this field)
    };

    return (
        <div className="container mx-auto py-8">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Edit Question</h1>
                    <p className="text-muted-foreground">
                        Update question details
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
                    defaultValues={defaultValues}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    submitLabel="Update Question"
                />
            </Card>
        </div>
    );
}