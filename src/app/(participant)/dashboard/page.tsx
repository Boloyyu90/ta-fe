// src/app/(participant)/dashboard/page.tsx

'use client';

/**
 * PARTICIPANT DASHBOARD
 *
 * ✅ Real-time stats from exam sessions
 * ✅ Available exams display
 * ✅ Recent activity
 * ✅ Correct type usage
 */

import { useAuth } from '@/features/auth/hooks';
import { useUserExams } from '@/features/exam-sessions/hooks/useUserExams';
import { useExams } from '@/features/exams/hooks/useExams';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Badge } from '@/shared/components/ui/badge';
import {
    BookOpen,
    ClipboardList,
    Trophy,
    Clock,
    ArrowRight,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import Link from 'next/link';
import type { UserExam } from '@/features/exam-sessions/types/exam-sessions.types';

interface ExamQuickCardProps {
    exam: {
        id: number;
        title: string;
        durationMinutes: number;
        _count?: {
            examQuestions: number;
        };
    };
}

function ExamQuickCard({ exam }: ExamQuickCardProps) {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-2 line-clamp-1">
                    {exam.title}
                </h3>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {exam.durationMinutes} min
                    </span>
                    <span className="flex items-center gap-1">
                        <ClipboardList className="h-3 w-3" />
                        {exam._count?.examQuestions || 0} questions
                    </span>
                </div>
                <Button asChild size="sm" className="w-full mt-3">
                    <Link href={`/exams/${exam.id}`}>
                        View Details
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}

function SessionCard({ session }: { session: UserExam }) {
    const statusConfig = {
        IN_PROGRESS: {
            variant: 'default' as const,
            icon: Clock,
            label: 'In Progress',
        },
        FINISHED: {
            variant: 'default' as const,
            icon: CheckCircle2,
            label: 'Completed',
        },
        CANCELLED: {
            variant: 'destructive' as const,
            icon: XCircle,
            label: 'Cancelled',
        },
    };

    const config = statusConfig[session.status];
    const Icon = config.icon;

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-foreground line-clamp-1 flex-1">
                        {session.exam?.title || 'Exam'}
                    </h3>
                    <Badge variant={config.variant} className="ml-2">
                        <Icon className="h-3 w-3 mr-1" />
                        {config.label}
                    </Badge>
                </div>

                <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                        <span>Started:</span>
                        <span>{new Date(session.startedAt).toLocaleDateString()}</span>
                    </div>
                    {session.status === 'FINISHED' && session.totalScore !== null && (
                        <div className="flex justify-between font-semibold text-foreground">
                            <span>Score:</span>
                            <span>{session.totalScore} points</span>
                        </div>
                    )}
                </div>

                <Button asChild size="sm" variant="outline" className="w-full mt-3">
                    <Link href={
                        session.status === 'IN_PROGRESS'
                            ? `/exam-sessions/${session.id}/take`
                            : `/results/${session.id}`
                    }>
                        {session.status === 'IN_PROGRESS' ? 'Continue' : 'View Results'}
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}

export default function DashboardPage() {
    const { user } = useAuth();
    const { data: examsData, isLoading: examsLoading } = useExams({ page: 1, limit: 3 });
    const { data: sessionsData, isLoading: sessionsLoading } = useUserExams({
        page: 1,
        limit: 10
    });

    const exams = examsData?.data || [];
    const sessions = sessionsData?.data || [];

    // Calculate stats with proper typing
    const totalExamsTaken = sessions.length;
    const completedExams = sessions.filter((s: UserExam) => s.status === 'FINISHED').length;
    const inProgressExams = sessions.filter((s: UserExam) => s.status === 'IN_PROGRESS').length;

    const avgScore = completedExams > 0
        ? Math.round(
            sessions
                .filter((s: UserExam) => s.status === 'FINISHED' && s.totalScore !== null)
                .reduce((acc: number, s: UserExam) => acc + (s.totalScore || 0), 0) / completedExams
        )
        : 0;

    return (
        <div className="container mx-auto py-8 space-y-8">
            {/* Welcome Section */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">
                    Welcome back, {user?.name || 'User'}!
                </h1>
                <p className="text-muted-foreground mt-2">
                    Here's your exam activity overview
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
                        <ClipboardList className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalExamsTaken}</div>
                        <p className="text-xs text-muted-foreground">Exam attempts</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{completedExams}</div>
                        <p className="text-xs text-muted-foreground">Finished exams</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{inProgressExams}</div>
                        <p className="text-xs text-muted-foreground">Active sessions</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{avgScore}</div>
                        <p className="text-xs text-muted-foreground">Points average</p>
                    </CardContent>
                </Card>
            </div>

            {/* Available Exams */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-foreground">Available Exams</h2>
                    <Button asChild variant="outline">
                        <Link href="/exams">
                            View All
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                    </Button>
                </div>

                {examsLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} className="h-40" />
                        ))}
                    </div>
                ) : exams.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {exams.map((exam) => (
                            <ExamQuickCard key={exam.id} exam={exam} />
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">No exams available at the moment</p>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Recent Activity */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-foreground">Recent Activity</h2>
                    <Button asChild variant="outline">
                        <Link href="/exam-sessions">
                            View All Sessions
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                    </Button>
                </div>

                {sessionsLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <Skeleton key={i} className="h-40" />
                        ))}
                    </div>
                ) : sessions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sessions.slice(0, 6).map((session) => (
                            <SessionCard key={session.id} session={session} />
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">No exam sessions yet</p>
                            <Button asChild className="mt-4">
                                <Link href="/exams">
                                    Browse Exams
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}