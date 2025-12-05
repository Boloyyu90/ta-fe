// src/app/(participant)/results/[id]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useResultDetail } from '@/features/exam-sessions/hooks/useResultDetail';
import { useProctoringEvents } from '@/features/proctoring/hooks/useProctoringEvents';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import {
    ArrowLeft,
    Calendar,
    Clock,
    Award,
    AlertTriangle,
    CheckCircle,
    Eye,
} from 'lucide-react';
import { ProctoringEventsList } from '@/features/proctoring/components/ProctoringEventsList';
import Link from 'next/link';
import type { ExamStatus } from '@/features/exam-sessions/types/exam-sessions.types';

export default function ResultDetailPage() {
    const params = useParams();
    const router = useRouter();
    const sessionId = parseInt(params.id as string);

    const { data: sessionData, isLoading: sessionLoading } = useResultDetail(sessionId);
    const { data: eventsData, isLoading: eventsLoading } = useProctoringEvents(sessionId);

    if (sessionLoading) {
        return (
            <div className="container mx-auto py-8 space-y-6">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-64" />
            </div>
        );
    }

    const session = sessionData?.data?.userExam;
    const events = eventsData?.data || [];
    const violations = events.filter((e) => e.severity === 'HIGH');

    if (!session) {
        return (
            <div className="container mx-auto py-8">
                <Alert variant="destructive">
                    <AlertDescription>Result not found.</AlertDescription>
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
            color: 'bg-gray-100 text-gray-700',
            icon: Clock,
        },
        IN_PROGRESS: {
            label: 'In Progress',
            color: 'bg-blue-100 text-blue-700',
            icon: Clock,
        },
        FINISHED: {
            label: 'Finished',
            color: 'bg-green-100 text-green-700',
            icon: CheckCircle,
        },
        COMPLETED: {
            label: 'Completed',
            color: 'bg-green-100 text-green-700',
            icon: CheckCircle,
        },
        TIMEOUT: {
            label: 'Timeout',
            color: 'bg-orange-100 text-orange-700',
            icon: Clock,
        },
        CANCELLED: {
            label: 'Cancelled',
            color: 'bg-red-100 text-red-700',
            icon: AlertTriangle,
        },
    };

    const status = statusConfig[session.status];
    const StatusIcon = status.icon;

    const isCompleted = session.status === 'FINISHED' || session.status === 'COMPLETED';

    return (
        <div className="container mx-auto py-8 space-y-6">
            {/* Back Button */}
            <Button variant="ghost" asChild>
                <Link href="/results">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Results
                </Link>
            </Button>

            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">{session.exam.title}</h1>
                    <Badge className={`${status.color} mt-2`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {status.label}
                    </Badge>
                </div>

                {isCompleted && (
                    <div className="text-right">
                        <div className="text-4xl font-bold text-primary">
                            {session.totalScore || 0}
                        </div>
                        <p className="text-sm text-muted-foreground">Total Score</p>
                    </div>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Started At
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-foreground">
                            {session.startedAt
                                ? new Date(session.startedAt).toLocaleString('id-ID')
                                : 'N/A'}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Duration
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-foreground">{session.exam.durationMinutes} minutes</p>
                    </CardContent>
                </Card>

                {isCompleted && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Award className="h-4 w-4" />
                                Accuracy
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-foreground">
                                {session.correctAnswers || 0}/{session.totalQuestions || 0} correct
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Violations Alert */}
            {violations.length > 0 && (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                        {violations.length} proctoring violation(s) detected during this exam.
                    </AlertDescription>
                </Alert>
            )}

            {/* Proctoring Events */}
            <Card>
                <CardHeader>
                    <CardTitle>Proctoring Events</CardTitle>
                </CardHeader>
                <CardContent>
                    {eventsLoading ? (
                        <Skeleton className="h-64" />
                    ) : (
                        <ProctoringEventsList events={events} />
                    )}
                </CardContent>
            </Card>

            {/* Actions */}
            {isCompleted && (
                <div className="flex gap-4">
                    <Button asChild className="flex-1">
                        <Link href={`/exam-sessions/${sessionId}/review`}>
                            <Eye className="h-4 w-4 mr-2" />
                            Review Answers
                        </Link>
                    </Button>
                </div>
            )}
        </div>
    );
}