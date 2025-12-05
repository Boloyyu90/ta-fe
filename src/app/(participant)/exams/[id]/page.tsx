// src/app/(participant)/exams/[id]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { examsApi } from '@/features/exams/api/exams.api';
import { useStartExam } from '@/features/exam-sessions/hooks/useStartExam';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Skeleton } from '@/shared/components/ui/skeleton';
import {
    Clock,
    FileQuestion,
    AlertCircle,
    Calendar,
    PlayCircle,
    ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

export default function ExamDetailPage() {
    const params = useParams();
    const router = useRouter();
    const examId = parseInt(params.id as string);

    const { data, isLoading, error } = useQuery({
        queryKey: ['exam', examId],
        queryFn: () => examsApi.getExam(examId),
    });

    const startExamMutation = useStartExam();

    const handleStartExam = () => {
        startExamMutation.mutate(examId);
    };

    if (isLoading) {
        return (
            <div className="container mx-auto py-8 space-y-6">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-64" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto py-8">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Failed to load exam details. Please try again later.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    const exam = data?.data;

    if (!exam) {
        return (
            <div className="container mx-auto py-8">
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>Exam not found.</AlertDescription>
                </Alert>
            </div>
        );
    }

    const isAvailable = exam.isActive;
    const hasSchedule = exam.startTime && exam.endTime;

    return (
        <div className="container mx-auto py-8 space-y-6">
            {/* Back Button */}
            <Button variant="ghost" asChild>
                <Link href="/exams">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Exams
                </Link>
            </Button>

            {/* Exam Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">{exam.title}</h1>
                    <div className="flex items-center gap-2 mt-2">
                        <Badge variant={isAvailable ? 'default' : 'secondary'}>
                            {isAvailable ? 'Available' : 'Unavailable'}
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Exam Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Exam Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {exam.description && (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">
                                    Description
                                </p>
                                <p className="text-foreground">{exam.description}</p>
                            </div>
                        )}

                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{exam.durationMinutes} minutes</span>
                        </div>

                        <div className="flex items-center gap-2 text-muted-foreground">
                            <FileQuestion className="h-4 w-4" />
                            <span>{exam._count?.examQuestions || 0} questions</span>
                        </div>

                        {hasSchedule && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>
                                    {new Date(exam.startTime!).toLocaleDateString('id-ID')} -{' '}
                                    {new Date(exam.endTime!).toLocaleDateString('id-ID')}
                                </span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Requirements</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>Stable internet connection</li>
                            <li>Webcam access for proctoring</li>
                            <li>Quiet environment</li>
                            <li>Complete exam in one sitting</li>
                        </ul>

                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                This exam includes AI proctoring. Your webcam will monitor your
                                face during the exam.
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>
            </div>

            {/* Start Exam Button */}
            <Card>
                <CardContent className="p-6">
                    <Button
                        size="lg"
                        className="w-full"
                        onClick={handleStartExam}
                        disabled={!isAvailable || startExamMutation.isPending}
                    >
                        <PlayCircle className="h-5 w-5 mr-2" />
                        {startExamMutation.isPending ? 'Starting...' : 'Start Exam'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}