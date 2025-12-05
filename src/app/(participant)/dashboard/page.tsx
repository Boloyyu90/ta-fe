// src/app/(participant)/dashboard/page.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { useExamsStats } from '@/features/exams/hooks/useExamsStats';
import { useMyStats } from '@/features/exam-sessions/hooks/useMyStats';
import { useUserExams } from '@/features/exam-sessions/hooks/useUserExams';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { BookOpen, CheckCircle, Clock, Target } from 'lucide-react';

export default function ParticipantDashboardPage() {
    const { data: examsStats, isLoading: isLoadingExams } = useExamsStats();
    const { data: myStats, isLoading: isLoadingStats } = useMyStats();
    const { data: sessionsData, isLoading: isLoadingSessions } = useUserExams({ limit: 5 });

    const sessions = sessionsData?.data || [];

    if (isLoadingExams || isLoadingStats || isLoadingSessions) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-32" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Available Exams</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{examsStats?.availableExams || 0}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed Exams</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{myStats?.completedExams || 0}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{myStats?.avgScore || 0}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Time</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{myStats?.totalTimeMinutes || 0} min</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    {sessions.length === 0 ? (
                        <Alert>
                            <AlertDescription>No recent exam activity</AlertDescription>
                        </Alert>
                    ) : (
                        <div className="space-y-4">
                            {sessions.map((session) => (
                                <div key={session.id} className="flex items-center justify-between border-b pb-2">
                                    <div>
                                        <p className="font-medium">{session.exam?.title}</p>
                                        <p className="text-sm text-muted-foreground">{session.status}</p>
                                    </div>
                                    {session.totalScore !== null && (
                                        <div className="text-right">
                                            <p className="font-bold">{session.totalScore}</p>
                                            <p className="text-xs text-muted-foreground">Score</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}