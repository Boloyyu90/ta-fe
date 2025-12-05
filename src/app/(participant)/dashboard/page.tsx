'use client';

import { useQuery } from '@tanstack/react-query';
import { examsApi } from '@/features/exams/api/exams.api';
import { examSessionsApi } from '@/features/exam-sessions/api/exam-sessions.api';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Clock, Award, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { UserExam } from '@/features/exam-sessions/types/exam-sessions.types';
import type { Exam } from '@/features/exams/types/exams.types';

interface ExamQuickCardProps {
    exam: {
        id: number;
        title: string;
        durationMinutes: number;
        _count: {
            examQuestions: number;
        };
    };
}

function ExamQuickCard({ exam }: ExamQuickCardProps) {
    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <CardTitle className="text-lg">{exam.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{exam.durationMinutes} minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        <span>{exam._count.examQuestions} questions</span>
                    </div>
                </div>
                <Button asChild className="w-full mt-4">
                    <Link href={`/exams/${exam.id}`}>
                        View Details
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}

export default function ParticipantDashboard() {
    const { user } = useAuthStore();

    // Fetch available exams
    const { data: examsData, isLoading: examsLoading } = useQuery({
        queryKey: ['exams', { page: 1, limit: 6 }],
        queryFn: () => examsApi.getExams({ page: 1, limit: 6 }),
    });

    // Fetch user's exam sessions
    const { data: sessionsData, isLoading: sessionsLoading } = useQuery({
        queryKey: ['my-results'],
        queryFn: () => examSessionsApi.getMyResults({ page: 1, limit: 10 }),
    });

    // Calculate statistics
    const stats = {
        totalExams: examsData?.pagination?.total || 0,
        completedExams:
            sessionsData?.data.filter((s) => s.status === 'FINISHED').length || 0,
        averageScore:
            sessionsData?.data.reduce((acc, s) => acc + (s.totalScore || 0), 0) /
            (sessionsData?.data.filter((s) => s.totalScore !== null).length || 1) || 0,
        totalTimeSpent:
            sessionsData?.data.reduce((acc, s) => acc + (s.timeSpent || 0), 0) || 0,
    };

    const exams = examsData?.data || [];
    const recentSessions = sessionsData?.data.slice(0, 3) || [];

    return (
        <div className="container py-8">
            {/* Welcome Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">
                    Welcome back, {user?.fullName}!
                </h1>
                <p className="text-muted-foreground">
                    Here's your exam progress overview
                </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            Available Exams
                        </CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {examsLoading ? (
                            <Skeleton className="h-8 w-16" />
                        ) : (
                            <div className="text-2xl font-bold">{stats.totalExams}</div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            Completed Exams
                        </CardTitle>
                        <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {sessionsLoading ? (
                            <Skeleton className="h-8 w-16" />
                        ) : (
                            <div className="text-2xl font-bold">{stats.completedExams}</div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            Average Score
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {sessionsLoading ? (
                            <Skeleton className="h-8 w-16" />
                        ) : (
                            <div className="text-2xl font-bold">
                                {stats.averageScore.toFixed(1)}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Time Spent
                        </CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {sessionsLoading ? (
                            <Skeleton className="h-8 w-16" />
                        ) : (
                            <div className="text-2xl font-bold">
                                {Math.floor(stats.totalTimeSpent / 60)}h
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Available Exams Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Available Exams</h2>
                    <Button variant="outline" asChild>
                        <Link href="/exams">View All</Link>
                    </Button>
                </div>

                {examsLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <Card key={i}>
                                <CardHeader>
                                    <Skeleton className="h-6 w-3/4" />
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="h-4 w-full mb-2" />
                                    <Skeleton className="h-4 w-2/3" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : exams.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {exams.map((exam) => (
                            <ExamQuickCard
                                key={exam.id}
                                exam={
                                    exam._count
                                        ? exam
                                        : { ...exam, _count: { examQuestions: 0, userExams: 0 } }
                                }
                            />
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                            No exams available at the moment
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Recent Activity Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Recent Activity</h2>
                    <Button variant="outline" asChild>
                        <Link href="/results">View All Results</Link>
                    </Button>
                </div>

                {sessionsLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <Card key={i}>
                                <CardContent className="py-4">
                                    <Skeleton className="h-4 w-full mb-2" />
                                    <Skeleton className="h-4 w-2/3" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : recentSessions.length > 0 ? (
                    <div className="space-y-4">
                        {recentSessions.map((session: UserExam) => (
                            <Card key={session.id}>
                                <CardContent className="py-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold">{session.exam.title}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Status: {session.status}
                                                {session.totalScore !== null &&
                                                    ` • Score: ${session.totalScore}`}
                                            </p>
                                        </div>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/results/${session.id}`}>View Details</Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                            No recent activity
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}