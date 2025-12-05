// src/app/admin/questions/create/page.tsx
'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { useCreateQuestion } from '@/features/questions/hooks';
import { QuestionForm } from '@/features/questions/components';

export default function CreateQuestionPage() {
    const { mutate: createQuestion, isPending } = useCreateQuestion();

    const handleSubmit = (data: any) => {
        createQuestion(data);
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
                            isSubmitting={isPending}
                            mode="create"
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}