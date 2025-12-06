// src/app/(admin)/admin/questions/[id]/edit/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { QuestionForm } from '@/features/questions/components/QuestionForm';
import { useQuestion } from '@/features/questions/hooks/useQuestion';
import { useUpdateQuestion } from '@/features/questions/hooks/useUpdateQuestion';
import type { QuestionFormData } from '@/features/questions/components/QuestionForm';

export default function EditQuestionPage() {
    const params = useParams();
    const router = useRouter();
    const questionId = params.id as string;

    // Fetch question data
    const { data: questionResponse, isLoading, error } = useQuestion(questionId);

    // Update mutation
    const updateMutation = useUpdateQuestion(questionId);

    const handleSubmit = async (data: QuestionFormData) => {
        try {
            await updateMutation.mutateAsync({
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
            });

            router.push('/admin/questions');
        } catch (error) {
            console.error('Failed to update question:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-destructive/10 text-destructive rounded-lg p-4">
                    <p className="font-medium">Failed to load question</p>
                    <p className="text-sm mt-1">
                        {error instanceof Error ? error.message : 'Unknown error occurred'}
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => router.push('/admin/questions')}
                    className="mt-4"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Questions
                </Button>
            </div>
        );
    }

    if (!questionResponse?.data) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-muted rounded-lg p-4">
                    <p>Question not found</p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => router.push('/admin/questions')}
                    className="mt-4"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Questions
                </Button>
            </div>
        );
    }

    // ✅ FIXED: Access nested data property
    const question = questionResponse.data;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Button
                    variant="outline"
                    onClick={() => router.push('/admin/questions')}
                    className="mb-4"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Questions
                </Button>
                <h1 className="text-3xl font-bold">Edit Question</h1>
                <p className="text-muted-foreground mt-2">
                    Update the question details below
                </p>
            </div>

            <div className="bg-card rounded-lg border p-6">
                <QuestionForm
                    mode="edit"
                    defaultValues={{
                        // ✅ FIXED: Access properties from nested data object
                        content: question.content,
                        optionA: question.options.A,
                        optionB: question.options.B,
                        optionC: question.options.C,
                        optionD: question.options.D,
                        optionE: question.options.E,
                        correctAnswer: question.correctAnswer,
                        questionType: question.questionType,
                        defaultScore: question.defaultScore,
                    }}
                    onSubmit={handleSubmit}
                    isSubmitting={updateMutation.isPending}
                />
            </div>
        </div>
    );
}