'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { useCreateQuestion } from '@/features/questions/hooks';
import { QuestionForm } from '@/features/questions/components';
import type { CreateQuestionRequest } from '@/features/questions/types/questions.types';

// Type for the form data (flat structure used by QuestionForm)
type QuestionFormData = {
    content: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    optionE: string;
    correctAnswer: 'A' | 'B' | 'C' | 'D' | 'E';
    questionType: 'TIU' | 'TWK' | 'TKP';
    defaultScore: number;
};

export default function CreateQuestionPage() {
    const { mutate: createQuestion, isPending } = useCreateQuestion();

    const handleSubmit = (formData: QuestionFormData) => {
        // Transform flat form data to nested API request structure
        const requestData: CreateQuestionRequest = {
            content: formData.content,
            options: {
                A: formData.optionA,
                B: formData.optionB,
                C: formData.optionC,
                D: formData.optionD,
                E: formData.optionE,
            },
            correctAnswer: formData.correctAnswer,
            questionType: formData.questionType,
            defaultScore: formData.defaultScore,
        };
        createQuestion(requestData);
    };

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Header */}
            <div className="bg-background border-b border-border">
                <div className="container mx-auto px-4 py-6">
                    <Link href="/admin/questions">
                        <Button variant="ghost" className="mb-4">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Questions
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Create New Question</CardTitle>
                        <CardDescription>
                            Add a new question to the question bank. Make sure to fill all required
                            fields.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <QuestionForm
                            onSubmit={handleSubmit}
                            isLoading={isPending}
                            submitLabel="Create Question"
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}