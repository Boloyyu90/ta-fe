// src/app/(participant)/results/[id]/page.tsx

'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { examSessionsApi } from '@/features/exam-sessions/api/exam-sessions.api';
import { proctoringApi } from '@/features/proctoring/api/proctoring.api';
import { formatDate, formatDuration } from '@/shared/lib/formatters';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import type { ProctoringEvent } from '@/features/proctoring/types/proctoring.types';

export default function ResultsDetailPage() {
    const params = useParams();
    const sessionId = Number(params.id);

    const { data: sessionData, isLoading: sessionLoading } = useQuery({
        queryKey: ['exam-session', sessionId],
        queryFn: () => examSessionsApi.getExamSession(sessionId),
    });

    const { data: eventsData, isLoading: eventsLoading } = useQuery({
        queryKey: ['proctoring-events', sessionId],
        queryFn: () => proctoringApi.getEvents(sessionId),
    });

    if (sessionLoading || eventsLoading) {
        return <div className="flex justify-center p-8">Loading results...</div>;
    }

    if (!sessionData) {
        return <div className="flex justify-center p-8">Results not found</div>;
    }

    const { userExam } = sessionData;

    // ✅ FIXED: eventsData is already an array of ProctoringEvent[]
    const events = eventsData || [];

    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-2xl font-bold">Exam Results</h1>
                <p className="text-muted-foreground">{userExam.exam.title}</p>
            </div>

            {/* Score Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Your Score</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-4xl font-bold">{userExam.totalScore || 0}</div>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>TIU Score:</span>
                            <span className="font-medium">{userExam.tiuScore || 0}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>TWK Score:</span>
                            <span className="font-medium">{userExam.twkScore || 0}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>TKP Score:</span>
                            <span className="font-medium">{userExam.tkpScore || 0}</span>
                        </div>
                    </div>
                    <div className="flex justify-between pt-4 border-t">
                        <span>Status:</span>
                        <Badge variant={userExam.status === 'FINISHED' ? 'default' : 'secondary'}>
                            {userExam.status}
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Exam Info Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Exam Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex justify-between">
                        <span>Started:</span>
                        <span className="font-medium">{formatDate(userExam.startTime)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Submitted:</span>
                        <span className="font-medium">{formatDate(userExam.submittedAt)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Duration:</span>
                        <span className="font-medium">
                            {formatDuration(userExam.exam.durationMinutes)}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span>Time Spent:</span>
                        <span className="font-medium">
                            {formatDuration(userExam.timeSpent ? Math.round(userExam.timeSpent / 60) : 0)}
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Proctoring Events Card */}
            {events.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Proctoring Events</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {events.map((event: ProctoringEvent) => ( // ✅ Explicit type annotation
                                <div
                                    key={event.id}
                                    className="flex items-center justify-between p-3 rounded-lg border"
                                >
                                    <div>
                                        <p className="font-medium">{event.eventType}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {formatDate(event.timestamp)}
                                        </p>
                                    </div>
                                    <Badge
                                        variant={
                                            event.severity === 'HIGH'
                                                ? 'destructive'
                                                : event.severity === 'MEDIUM'
                                                    ? 'default'
                                                    : 'secondary'
                                        }
                                    >
                                        {event.severity}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}