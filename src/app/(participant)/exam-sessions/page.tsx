// src/app/(participant)/exam-sessions/page.tsx
'use client';

import { useUserExams } from '@/features/exam-sessions/hooks/useUserExams';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';

export default function ExamSessionsPage() {
    const { data, isLoading } = useUserExams();

    if (isLoading) {
        return <Skeleton className="h-96" />;
    }

    const sessions = data?.data || [];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">My Exam Sessions</h1>
            {sessions.length === 0 ? (
                <Alert>
                    <AlertDescription>No exam sessions found</AlertDescription>
                </Alert>
            ) : (
                <div className="grid gap-4">
                    {sessions.map((session) => (
                        <div key={session.id} className="border p-4 rounded">
                            <p className="font-medium">{session.exam?.title}</p>
                            <p>Status: {session.status}</p>
                            {session.totalScore !== null && <p>Score: {session.totalScore}</p>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}