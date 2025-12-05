'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { questionsApi } from '@/features/questions/api/questions.api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Edit, Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';

export default function QuestionDetailPage() {
    const params = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const questionId = Number(params.id);

    // Fetch question details
    const { data: question, isLoading, error } = useQuery({
        queryKey: ['questions', questionId],
        queryFn: () => questionsApi.getQuestionById(questionId),
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: () => questionsApi.deleteQuestion(questionId),
        onSuccess: () => {
            toast.success('Question deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['questions'] });
            router.push('/admin/questions');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Failed to delete question');
        },
    });

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this question?')) {
            deleteMutation.mutate();
        }
    };

    if (isLoading) {
        return (
            <div className="container py-8">
                <Skeleton className="h-8 w-64 mb-6" />
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-full" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error || !question) {
        return (
            <div className="container py-8">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Failed to load question details
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    const typeColors: Record<string, string> = {
        TIU: 'bg-blue-100 text-blue-800',
        TWK: 'bg-green-100 text-green-800',
        TKP: 'bg-purple-100 text-purple-800',
    };

    const optionLabels = ['A', 'B', 'C', 'D', 'E'];
    const options = [
        question.optionA,
        question.optionB,
        question.optionC,
        question.optionD,
        question.optionE,
    ];

    return (
        <div className="container py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/admin/questions">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Questions
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Question Details</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" asChild>
                        <Link href={`/admin/questions/${questionId}/edit`}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                        </Link>
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={deleteMutation.isPending}
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                    </Button>
                </div>
            </div>

            {/* Question Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Question #{question.id}</CardTitle>
                        <div className="flex items-center gap-2">
                            <Badge className={typeColors[question.questionType]}>
                                {question.questionType}
                            </Badge>
                            <Badge variant="outline">{question.defaultScore} points</Badge>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Question Content */}
                    <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">
                            Question Content
                        </p>
                        <p className="text-base">{question.content}</p>
                    </div>

                    {/* Image */}
                    {question.imageUrl && (
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-2">
                                Image
                            </p>
                            <div className="relative w-full max-w-md h-64 border rounded-lg overflow-hidden">
                                <Image
                                    src={question.imageUrl}
                                    alt="Question image"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    )}

                    {/* Options */}
                    <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">
                            Answer Options
                        </p>
                        <div className="space-y-2">
                            {options.map((option, index) => (
                                <div
                                    key={optionLabels[index]}
                                    className={`flex items-start gap-3 p-3 border rounded-lg ${
                                        question.correctAnswer === optionLabels[index]
                                            ? 'bg-green-50 border-green-500'
                                            : ''
                                    }`}
                                >
                                    <div
                                        className={`flex items-center justify-center w-6 h-6 rounded-full border font-medium text-sm ${
                                            question.correctAnswer === optionLabels[index]
                                                ? 'bg-green-500 text-white border-green-500'
                                                : 'bg-white'
                                        }`}
                                    >
                                        {optionLabels[index]}
                                    </div>
                                    <p className="flex-1">{option}</p>
                                    {question.correctAnswer === optionLabels[index] && (
                                        <Badge variant="outline" className="bg-green-100 text-green-800">
                                            Correct Answer
                                        </Badge>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                        <div>
                            <p className="text-sm text-muted-foreground">Created At</p>
                            <p className="font-medium">
                                {new Date(question.createdAt).toLocaleDateString('id-ID')}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Last Updated</p>
                            <p className="font-medium">
                                {new Date(question.updatedAt).toLocaleDateString('id-ID')}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Warning if used in exams */}
            {question._count && question._count.examQuestions > 0 ? (
                <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Warning: This question is used in {question._count.examQuestions} exam(s)!
                        Deleting will remove it from all exams.
                    </AlertDescription>
                </Alert>
            ) : null}
        </div>
    );
}