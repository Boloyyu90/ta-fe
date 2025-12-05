'use client';

import { useAuth } from '@/features/auth/hooks';
import { useUserExams } from '@/features/exam-sessions/hooks/useUserExams';
import { useExams } from '@/features/exams/hooks/useExams';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { BookOpen, ClipboardList, Trophy, TrendingUp, ArrowRight } from 'lucide-react';
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
                    <span>{exam.durationMinutes} min</span>
                    <span>{exam._count?.examQuestions || 0} questions</span>
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

export default function DashboardPage() {
    const { user } = useAuth();
    const { data: examsData, isLoading: examsLoading } = useExams({ page: 1, limit: 3 });
    const { data: sessionsData, isLoading: sessionsLoading } = useUserExams({ page: 1, limit: 10 });

    const exams = examsData?.data || [];
    const sessions = sessionsData?.data || [];

    // Calculate stats with proper typing
    const totalExamsTaken = sessions.length;
    const completedExams = sessions.filter((s: UserExam) => s.status === 'FINISHED').length;
    const inProgressExams = sessions.filter((s: UserExam) => s.status === 'IN_PROGRESS').length;
    const avgScore = completedExams > 0
        ? Math.round(
            (sessionsData?.data || [])
                .filter((s: UserExam) => s.status === 'FINISHED')
                .reduce((acc: number, s: UserExam) => acc + (s.totalScore || 0), 0) / completedExams
        )
        : 0;

    return (
        <div className="container mx-auto py-8 space-y-8">
            {/* Welcome Section */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">
                    Welcome back, {user?.email || 'User'}!
                </h1>
                <p className="text-muted-foreground mt-2">
                    Here's an overview of your exam activity
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
                        <ClipboardList className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalExamsTaken}</div>
                        <p className="text-xs text-muted-foreground">Exams taken</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{completedExams}</div>
                        <p className="text-xs text-muted-foreground">Finished exams</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{inProgressExams}</div>
                        <p className="text-xs text-muted-foreground">Active exams</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
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
                            <ExamQuickCard
                                key={exam.id}
                                exam={exam}
                            />
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-muted-foreground">No exams available</p>
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
                    <Skeleton className="h-64" />
                ) : sessions.length > 0 ? (
                    <Card>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                {sessions.slice(0, 5).map((session: UserExam) => (
                                    <div
                                        key={session.id}
                                        className="flex items-center justify-between py-3 border-b last:border-0"
                                    >
                                        <div>
                                            <p className="font-medium">{session.exam.title}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {session.status === 'FINISHED' && `Score: ${session.totalScore || 0}`}
                                                {session.status === 'IN_PROGRESS' && 'In Progress'}
                                                {session.status === 'CANCELLED' && 'Cancelled'}
                                            </p>
                                        </div>
                                        <Button asChild variant="ghost" size="sm">
                                            <Link href={`/exam-sessions/${session.id}`}>
                                                View
                                            </Link>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-muted-foreground">No recent activity</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}