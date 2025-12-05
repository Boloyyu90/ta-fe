// src/app/(participant)/results/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useResultDetail } from '@/features/exam-sessions/hooks/useResultDetail';
import { useQuery } from '@tanstack/react-query';
import { proctoringApi } from '@/features/proctoring/api/proctoring.api';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';

export default function ResultDetailPage() {
    const params = useParams();
    const sessionId = parseInt(params.id as string);

    const { data: resultData, isLoading: isLoadingResult } = useResultDetail(sessionId);
    const { data: eventsData, isLoading: isLoadingEvents } = useQuery({
        queryKey: ['proctoring-events', sessionId],
        queryFn: () => proctoringApi.getViolations(sessionId),
        enabled: !!sessionId,
    });

    if (isLoadingResult || isLoadingEvents) {
        return <Skeleton className="h-96" />;
    }

    const session = resultData?.userExam;
    const events = eventsData || [];

    if (!session) {
        return (
            <Alert variant="destructive">
                <AlertDescription>Result not found</AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Result Detail</h1>
            <div className="border p-4 rounded">
                <p>Score: {session.totalScore}</p>
                <p>Correct: {session.correctAnswers} / {session.totalQuestions}</p>
                <p>Time Spent: {session.timeSpent ? Math.round(session.timeSpent / 60000) : 0} minutes</p>
            </div>

            <div>
                <h2 className="text-xl font-bold mb-4">Proctoring Events</h2>
                {events.length === 0 ? (
                    <Alert>
                        <AlertDescription>No violations detected</AlertDescription>
                    </Alert>
                ) : (
                    <div className="space-y-2">
                        {events.map((event) => (
                            <div key={event.id} className="border p-2 rounded">
                                <p>{event.violationType}: {event.description}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}