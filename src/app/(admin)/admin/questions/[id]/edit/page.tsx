// src/app/admin/questions/[id]/edit/page.tsx
'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { useQuestion, useUpdateQuestion } from '@/features/questions/hooks';
import { QuestionForm } from '@/features/questions/components';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function EditQuestionPage({ params }: PageProps) {
    const { id } = use(params);
    const { data, isLoading, error } = useQuestion(id);
    const { mutate: updateQuestion, isPending } = useUpdateQuestion(id);

    const question = data?.data;

    const handleSubmit = (formData: any) => {
        updateQuestion(formData);
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Loading question...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !question) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
                    <h2 className="text-2xl font-bold text-foreground">Question Not Found</h2>
                    <p className="text-muted-foreground">
                        The question you're looking for doesn't exist or has been deleted.
                    </p>
                    <Link href="/admin/questions">
                        <Button>Back to Questions</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Header */}
            <div className="bg-background border-b border-border">
                <div className="container mx-auto px-4 py-6">
                    <Link href={`/admin/questions/${id}`}>
                        <Button variant="ghost" className="mb-4">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Question
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Edit Question</CardTitle>
                        <CardDescription>
                            Update the question details. Changes will be reflected in all exams using
                            this question.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <QuestionForm
                            question={question}
                            onSubmit={handleSubmit}
                            isSubmitting={isPending}
                            mode="edit"
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}