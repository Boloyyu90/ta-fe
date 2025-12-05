// src/app/(participant)/results/[id]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useResultDetail } from '@/features/exam-sessions/hooks/useResultDetail';
import { useProctoringEvents } from '@/features/proctoring/hooks/useProctoringEvents';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import {
    AlertCircle,
    Award,
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    PlayCircle,
    Clock4,
    ChevronLeft,
    AlertTriangle,
} from 'lucide-react';
import type { ExamStatus } from '@/features/exam-sessions/types/exam-sessions.types';
import type { ProctoringEvent } from '@/features/proctoring/types/proctoring.types';

export default function ResultDetailPage() {
    const params = useParams();
    const router = useRouter();
    const sessionId = parseInt(params.id as string);

    const { data: resultData, isLoading: resultLoading } = useResultDetail(sessionId);
    const { data: eventsData, isLoading: eventsLoading } = useProctoringEvents(sessionId, {
        page: 1,
        limit: 100,
    });

    // ✅ FIXED: Properly unwrap the response data
    const session = resultData?.data.userExam;
    // ✅ FIXED: eventsData is already unwrapped as { data: ProctoringEvent[], pagination: {...} }
    const events = eventsData?.data || [];
    // ✅ FIXED: Type the filter callback properly
    const violations = events.filter((e: ProctoringEvent) => e.severity === 'HIGH');

    if (resultLoading) {
        return (
            <div className="container mx-auto py-6 space-y-6">
                <Skeleton className="h-32 w-full" />
                <div className="grid gap-6 md:grid-cols-2">
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="container mx-auto py-6">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Result not found or you don't have permission to view it.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    const statusConfig: Record<ExamStatus, {
        label: string;
        color: string;
        icon: typeof CheckCircle;
    }> = {
        NOT_STARTED: {
            label: 'Not Started',
            color: 'bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-400',
            icon: Clock4,
        },
        IN_PROGRESS: {
            label: 'In Progress',
            color: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
            icon: PlayCircle,
        },
        FINISHED: {
            label: 'Finished',
            color: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
            icon: CheckCircle,
        },
        COMPLETED: {
            label: 'Completed',
            color: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
            icon: CheckCircle,
        },
        TIMEOUT: {
            label: 'Timeout',
            color: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400',
            icon: Clock,
        },
        CANCELLED: {
            label: 'Cancelled',
            color: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
            icon: AlertTriangle,
        },
    };

    // ✅ FIXED: Type assertion to ensure status is valid ExamStatus
    const status = statusConfig[session.status as ExamStatus];
    const StatusIcon = status.icon;

    const successRate = session.totalQuestions
        ? ((session.correctAnswers || 0) / session.totalQuestions) * 100
        : 0;

    return (
        <div className="container mx-auto py-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
            </div>

            {/* Overview Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <CardTitle className="text-2xl">{session.exam?.title}</CardTitle>
                            <div className="flex items-center gap-2 mt-2">
                                <Badge className={status.color}>
                                    <StatusIcon className="h-3 w-3 mr-1" />
                                    {status.label}
                                </Badge>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="text-sm text-muted-foreground">Final Score</div>
                            <div className="text-4xl font-bold text-primary">
                                {session.totalScore || 0}
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Correct Answers</div>
                                <div className="text-lg font-semibold">
                                    {session.correctAnswers || 0}/{session.totalQuestions || 0}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Clock className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Time Spent</div>
                                <div className="text-lg font-semibold">
                                    {session.timeSpent ? `${Math.floor(session.timeSpent / 60)} min` : 'N/A'}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Award className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Success Rate</div>
                                <div className="text-lg font-semibold">{successRate.toFixed(1)}%</div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Details Grid */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Exam Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Exam Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Duration</span>
                            <span className="font-medium">{session.exam?.durationMinutes} minutes</span>
                        </div>

                        {session.startedAt && (
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Started</span>
                                <span className="font-medium">
                                    {new Date(session.startedAt).toLocaleString('id-ID')}
                                </span>
                            </div>
                        )}

                        {session.finishedAt && (
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Finished</span>
                                <span className="font-medium">
                                    {new Date(session.finishedAt).toLocaleString('id-ID')}
                                </span>
                            </div>
                        )}

                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Total Questions</span>
                            <span className="font-medium">{session.totalQuestions || 0}</span>
                        </div>

                        {session.exam?.passingScore && (
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Passing Score</span>
                                <span className="font-medium">{session.exam.passingScore}</span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Proctoring Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle>Proctoring Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {eventsLoading ? (
                            <Skeleton className="h-20 w-full" />
                        ) : (
                            <>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Total Events</span>
                                    <span className="font-medium">{events.length}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">High Violations</span>
                                    <span className={`font-medium ${violations.length > 0 ? 'text-red-600' : ''}`}>
                                        {violations.length}
                                    </span>
                                </div>

                                {violations.length > 0 && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>
                                            This exam had {violations.length} high severity violation(s).
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {violations.length === 0 && (
                                    <Alert>
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <AlertDescription>
                                            No high severity violations detected.
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}