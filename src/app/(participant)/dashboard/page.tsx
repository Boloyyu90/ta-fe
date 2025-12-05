// src/app/(participant)/dashboard/page.tsx
'use client';

import { useState } from 'react';
import { useExamsStats } from '@/features/exams/hooks/useExamsStats';
import { useMyStats } from '@/features/exam-sessions/hooks/useMyStats';
import { useUserExams } from '@/features/exam-sessions/hooks/useUserExams';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import {
    BookOpen,
    ClipboardCheck,
    Award,
    Clock,
    PlayCircle,
    CheckCircle,
    AlertTriangle,
    Clock4,
    ChevronRight,
    TrendingUp
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { UserExam, ExamStatus } from '@/features/exam-sessions/types/exam-sessions.types';

export default function ParticipantDashboardPage() {
    const router = useRouter();
    const [sessionFilter, setSessionFilter] = useState<'all' | 'IN_PROGRESS' | 'FINISHED'>('all');

    const { data: examsStats, isLoading: examsLoading } = useExamsStats();
    const { data: myStats, isLoading: statsLoading } = useMyStats();
    const { data: sessionsData, isLoading: sessionsLoading } = useUserExams({
        page: 1,
        limit: 6,
    });

    const isLoading = examsLoading || statsLoading || sessionsLoading;

    // ✅ FIXED: Unwrap sessionsData correctly - it's { data: UserExam[], pagination: {...} }
    const sessions = sessionsData?.data || [];

    // Define status config with ALL possible ExamStatus values including NOT_STARTED
    const statusConfig: Record<ExamStatus, {
        variant: 'default' | 'secondary' | 'destructive' | 'outline';
        icon: typeof PlayCircle;
        label: string;
    }> = {
        NOT_STARTED: {
            variant: 'secondary',
            icon: Clock4,
            label: 'Not Started',
        },
        IN_PROGRESS: {
            variant: 'default',
            icon: PlayCircle,
            label: 'In Progress',
        },
        FINISHED: {
            variant: 'outline',
            icon: CheckCircle,
            label: 'Finished',
        },
        COMPLETED: {
            variant: 'outline',
            icon: CheckCircle,
            label: 'Completed',
        },
        TIMEOUT: {
            variant: 'destructive',
            icon: Clock,
            label: 'Timeout',
        },
        CANCELLED: {
            variant: 'destructive',
            icon: AlertTriangle,
            label: 'Cancelled',
        },
    };

    // Filter sessions if needed
    const filteredSessions = sessionFilter === 'all'
        ? sessions
        : sessions.filter((s: UserExam) => s.status === sessionFilter);

    return (
        <div className="container mx-auto py-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome back! Here's an overview of your exam progress.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Available Exams */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Available Exams</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {examsLoading ? (
                            <Skeleton className="h-8 w-16" />
                        ) : (
                            <div className="text-2xl font-bold">{examsStats?.availableExams || 0}</div>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">Ready to take</p>
                    </CardContent>
                </Card>

                {/* Completed Exams */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed Exams</CardTitle>
                        <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {statsLoading ? (
                            <Skeleton className="h-8 w-16" />
                        ) : (
                            <div className="text-2xl font-bold">{myStats?.totalCompleted || 0}</div>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">Exams finished</p>
                    </CardContent>
                </Card>

                {/* Average Score */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                        <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {statsLoading ? (
                            <Skeleton className="h-8 w-16" />
                        ) : (
                            <div className="text-2xl font-bold">
                                {myStats?.averageScore ? myStats.averageScore.toFixed(1) : '0.0'}
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">Out of 100</p>
                    </CardContent>
                </Card>

                {/* Total Time Spent */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Time Spent</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {statsLoading ? (
                            <Skeleton className="h-8 w-16" />
                        ) : (
                            <div className="text-2xl font-bold">
                                {myStats?.totalTimeSpent
                                    ? `${Math.floor(myStats.totalTimeSpent / 60)}h`
                                    : '0h'}
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">In minutes</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Sessions */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Recent Exam Sessions</CardTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push('/exam-sessions')}
                        >
                            View All
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {sessionsLoading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} className="h-20 w-full" />
                            ))}
                        </div>
                    ) : filteredSessions.length === 0 ? (
                        <Alert>
                            <AlertDescription>
                                No exam sessions yet. Start by taking an exam!
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <div className="space-y-3">
                            {/* ✅ FIXED: Type the session parameter properly */}
                            {sessions.slice(0, 6).map((session: UserExam) => {
                                const config = statusConfig[session.status];
                                const StatusIcon = config.icon;

                                return (
                                    <div
                                        key={session.id}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                                        onClick={() => {
                                            if (session.status === 'IN_PROGRESS') {
                                                router.push(`/exam-sessions/${session.id}/take`);
                                            } else if (['FINISHED', 'COMPLETED', 'TIMEOUT', 'CANCELLED'].includes(session.status)) {
                                                router.push(`/results/${session.id}`);
                                            }
                                        }}
                                    >
                                        <div className="flex-1">
                                            <h4 className="font-medium">{session.exam?.title || 'Exam'}</h4>
                                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                                {/* ✅ FIXED: Add null check before new Date() */}
                                                {session.startedAt && (
                                                    <>
                                                        <Clock4 className="h-3 w-3" />
                                                        <span>{new Date(session.startedAt).toLocaleDateString()}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {session.totalScore !== null && (
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold">{session.totalScore}</div>
                                                    <div className="text-xs text-muted-foreground">Score</div>
                                                </div>
                                            )}
                                            <Badge variant={config.variant}>
                                                <StatusIcon className="h-3 w-3 mr-1" />
                                                {config.label}
                                            </Badge>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/exams')}>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-lg">
                                <BookOpen className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Browse Exams</h3>
                                <p className="text-sm text-muted-foreground">Find and start new exams</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/results')}>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-500/10 rounded-lg">
                                <TrendingUp className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold">View Results</h3>
                                <p className="text-sm text-muted-foreground">Check your past exam scores</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}