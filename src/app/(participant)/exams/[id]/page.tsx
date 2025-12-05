'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { examsApi } from '@/features/exams/api/exams.api';
import { useStartExam } from '@/features/exams/hooks/useStartExam';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
    ArrowLeft,
    Clock,
    BookOpen,
    Award,
    AlertCircle,
    Calendar,
    PlayCircle,
} from 'lucide-react';
import Link from 'next/link';

export default function ExamDetailPage() {
    const params = useParams();
    const router = useRouter();
    const examId = Number(params.id);

    const { data: exam, isLoading, error } = useQuery({
        queryKey: ['exams', examId],
        queryFn: () => examsApi.getExamById(examId),
    });

    const { startExam, isPending } = useStartExam();

    if (isLoading) {
        return (
            <div className="container py-8">
                <Skeleton className="h-8 w-64 mb-6" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    if (error || !exam) {
        return (
            <div className="container py-8">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>Failed to load exam details</AlertDescription>
                </Alert>
            </div>
        );
    }

    const handleStartExam = async () => {
        try {
            const userExamId = await startExam(examId);
            router.push(`/exam-sessions/${userExamId}/take`);
        } catch (error) {
            console.error('Failed to start exam:', error);
        }
    };

    const hasSchedule = exam.startTime && exam.endTime;
    const now = new Date();
    const isAvailable = !hasSchedule || (
        new Date(exam.startTime!) <= now && new Date(exam.endTime!) >= now
    );

    return (
        <div className="container py-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/exams">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Exams
                    </Link>
                </Button>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Title Card */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-2xl mb-2">{exam.title}</CardTitle>
                                    {exam.description && (
                                        <p className="text-muted-foreground">{exam.description}</p>
                                    )}
                                </div>
                                <Badge variant={exam.isPublished ? 'default' : 'secondary'}>
                                    {exam.isPublished ? 'Published' : 'Draft'}
                                </Badge>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Instructions */}
                    {exam.instructions && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Instructions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div
                                    className="prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{ __html: exam.instructions }}
                                />
                            </CardContent>
                        </Card>
                    )}

                    {/* Availability Alert */}
                    {hasSchedule && !isAvailable && (
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                This exam is not currently available. Please check the schedule below.
                            </AlertDescription>
                        </Alert>
                    )}
                </div>

                {/* Right Column - Info & Actions */}
                <div className="space-y-6">
                    {/* Exam Info Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Exam Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Duration</p>
                                    <p className="font-medium">{exam.durationMinutes} minutes</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <BookOpen className="w-5 h-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Questions</p>
                                    <p className="font-medium">
                                        {exam._count?.examQuestions || 0} questions
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Award className="w-5 h-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Passing Score</p>
                                    <p className="font-medium">{exam.passingScore}</p>
                                </div>
                            </div>

                            {hasSchedule && (
                                <div className="pt-4 border-t">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Calendar className="w-5 h-5 text-muted-foreground" />
                                        <p className="text-sm font-medium">Schedule</p>
                                    </div>
                                    <div className="space-y-2">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Start Time</p>
                                            <p className="font-medium">
                                                {new Date(exam.startTime!).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">End Time</p>
                                            <p className="font-medium">
                                                {new Date(exam.endTime!).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Action Button */}
                    <Button
                        onClick={handleStartExam}
                        disabled={!isAvailable || isPending || !exam.isPublished}
                        className="w-full"
                        size="lg"
                    >
                        <PlayCircle className="w-5 h-5 mr-2" />
                        {isPending ? 'Starting...' : 'Start Exam'}
                    </Button>

                    {!exam.isPublished && (
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                This exam is not yet published and cannot be started.
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            </div>
        </div>
    );
}