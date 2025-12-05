// src/app/(participant)/dashboard/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { useRouter } from 'next/navigation';
import {
    BookOpen,
    Clock,
    TrendingUp,
    Award,
    AlertCircle,
    ArrowRight,
    CheckCircle,
    XCircle,
    Timer
} from 'lucide-react';

// Import hooks from feature modules (following architectural pattern)
import { useExams } from '@/features/exams/hooks';
import { useUserExams, useMyResults } from '@/features/exam-sessions/hooks';
import { useProfile } from '@/features/users/hooks';
import type { ExamResult } from '@/features/exam-sessions/types/exam-sessions.types';

export default function ParticipantDashboard() {
    const router = useRouter();

    // Fetch data from feature modules
    const { data: profileData, isLoading: isLoadingProfile } = useProfile();
    const { data: examsData, isLoading: isLoadingExams } = useExams({ page: 1, limit: 5 });
    const { data: sessionsData, isLoading: isLoadingSessions } = useUserExams({ page: 1, limit: 5 });
    const { data: resultsData, isLoading: isLoadingResults } = useMyResults({ page: 1, limit: 5 });

    // Calculate statistics
    const stats = {
        availableExams: examsData?.data?.length || 0, // ✅ Access .data array
        totalExams: examsData?.pagination?.totalItems || 0, // ✅ totalItems, not total
        completedExams: resultsData?.data?.filter((r: ExamResult) => r.status === 'FINISHED').length || 0,
        inProgressExams: sessionsData?.data?.filter((s: any) => s.status === 'IN_PROGRESS').length || 0,
        averageScore: resultsData?.data && resultsData.data.length > 0
            ? Math.round(
                resultsData.data
                    .filter((r: ExamResult) => r.totalScore !== null)
                    .reduce((sum: number, r: ExamResult) => sum + (r.totalScore || 0), 0) /
                (resultsData.data.filter((r: ExamResult) => r.totalScore !== null).length || 1)
            )
            : 0,
    };

    // Loading state
    if (isLoadingProfile || isLoadingExams || isLoadingSessions || isLoadingResults) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Welcome Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">
                    Welcome back, {profileData?.user.name}! 👋
                </h1>
                <p className="text-muted-foreground">
                    Here's your exam progress overview
                </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Available Exams"
                    value={stats.totalExams}
                    description="Exams you can take"
                    icon={<BookOpen className="h-4 w-4 text-muted-foreground" />}
                    trend={null}
                />
                <StatCard
                    title="Completed"
                    value={stats.completedExams}
                    description="Exams finished"
                    icon={<CheckCircle className="h-4 w-4 text-green-600" />}
                    trend={null}
                />
                <StatCard
                    title="In Progress"
                    value={stats.inProgressExams}
                    description="Active exam sessions"
                    icon={<Timer className="h-4 w-4 text-blue-600" />}
                    trend={stats.inProgressExams > 0 ? 'action-needed' : null}
                />
                <StatCard
                    title="Average Score"
                    value={stats.averageScore}
                    description="Your performance"
                    icon={<TrendingUp className="h-4 w-4 text-purple-600" />}
                    trend={stats.averageScore >= 70 ? 'good' : stats.averageScore > 0 ? 'needs-improvement' : null}
                    suffix="/100"
                />
            </div>

            {/* In-Progress Exams Alert */}
            {stats.inProgressExams > 0 && (
                <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="flex items-center justify-between">
            <span className="text-blue-900 dark:text-blue-100">
              You have {stats.inProgressExams} exam{stats.inProgressExams > 1 ? 's' : ''} in progress.
              Continue where you left off!
            </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push('/exam-sessions')}
                            className="ml-4"
                        >
                            View Sessions
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </AlertDescription>
                </Alert>
            )}

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Available Exams */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Available Exams</CardTitle>
                                <CardDescription>Start a new exam attempt</CardDescription>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push('/exams')}
                            >
                                View All
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {examsData?.data.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <p>No exams available at the moment</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {examsData?.data.slice(0, 3).map((exam) => (
                                    <ExamQuickCard
                                        key={exam.id}
                                        exam={exam}
                                        onStart={() => router.push(`/exams/${exam.id}`)}
                                    />
                                ))}
                                {(examsData?.data.length || 0) > 3 && (
                                    <Button
                                        variant="ghost"
                                        className="w-full"
                                        onClick={() => router.push('/exams')}
                                    >
                                        View {(examsData?.pagination.total || 0) - 3} more exams
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>Your latest exam sessions</CardDescription>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push('/results')}
                            >
                                View All
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {sessionsData?.data.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <p>No exam sessions yet</p>
                                <Button
                                    variant="link"
                                    size="sm"
                                    onClick={() => router.push('/exams')}
                                    className="mt-2"
                                >
                                    Start your first exam
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {sessionsData?.data.slice(0, 3).map((session) => (
                                    <SessionActivityCard
                                        key={session.id}
                                        session={session}
                                        onContinue={() => router.push(`/exam-sessions/${session.id}/take`)}
                                        onViewResult={() => router.push(`/results/${session.id}`)}
                                    />
                                ))}
                                {(sessionsData?.data.length || 0) > 3 && (
                                    <Button
                                        variant="ghost"
                                        className="w-full"
                                        onClick={() => router.push('/exam-sessions')}
                                    >
                                        View all sessions
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Recent Results Summary */}
            {resultsData && resultsData.data.length > 0 && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Recent Results</CardTitle>
                                <CardDescription>Your latest exam scores</CardDescription>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push('/results')}
                            >
                                View All
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {resultsData.data
                                .filter(r => r.status === 'FINISHED' && r.totalScore !== null)
                                .slice(0, 3)
                                .map((result) => (
                                    <ResultSummaryCard
                                        key={result.id}
                                        result={result}
                                        onViewDetails={() => router.push(`/results/${result.id}`)}
                                    />
                                ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Quick Actions */}
            <Card className="border-dashed">
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                        <Button
                            size="lg"
                            className="w-full md:w-auto"
                            onClick={() => router.push('/exams')}
                        >
                            <BookOpen className="mr-2 h-5 w-5" />
                            Browse Available Exams
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="w-full md:w-auto"
                            onClick={() => router.push('/exam-sessions')}
                        >
                            <Clock className="mr-2 h-5 w-5" />
                            View My Sessions
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="w-full md:w-auto"
                            onClick={() => router.push('/results')}
                        >
                            <Award className="mr-2 h-5 w-5" />
                            View My Results
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface StatCardProps {
    title: string;
    value: number;
    description: string;
    icon: React.ReactNode;
    trend: 'good' | 'needs-improvement' | 'action-needed' | null;
    suffix?: string;
}

function StatCard({ title, value, description, icon, trend, suffix = '' }: StatCardProps) {
    const trendColors = {
        good: 'text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400',
        'needs-improvement': 'text-orange-600 bg-orange-50 dark:bg-orange-950 dark:text-orange-400',
        'action-needed': 'text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400',
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {value}{suffix}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{description}</p>
                {trend && (
                    <Badge
                        variant="outline"
                        className={`mt-2 ${trendColors[trend]}`}
                    >
                        {trend === 'good' && '✓ Good performance'}
                        {trend === 'needs-improvement' && '↑ Keep improving'}
                        {trend === 'action-needed' && '⚠ Action needed'}
                    </Badge>
                )}
            </CardContent>
        </Card>
    );
}

interface ExamQuickCardProps {
    exam: {
        id: number;
        title: string;
        durationMinutes: number;
        _count: {
            examQuestions: number;
        };
    };
    onStart: () => void;
}

function ExamQuickCard({ exam, onStart }: ExamQuickCardProps) {
    return (
        <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors">
            <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">{exam.title}</h4>
                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
          <span className="flex items-center">
            <BookOpen className="h-3 w-3 mr-1" />
              {exam._count.examQuestions} questions
          </span>
                    <span className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
                        {exam.durationMinutes} mins
          </span>
                </div>
            </div>
            <Button size="sm" onClick={onStart}>
                Start
                <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
        </div>
    );
}

interface SessionActivityCardProps {
    session: {
        id: number;
        exam: {
            title: string;
        };
        status: 'IN_PROGRESS' | 'FINISHED' | 'CANCELLED' | 'TIMEOUT';
        totalScore: number | null;
        startedAt: string | null;
    };
    onContinue: () => void;
    onViewResult: () => void;
}

function SessionActivityCard({ session, onContinue, onViewResult }: SessionActivityCardProps) {
    const statusConfig = {
        IN_PROGRESS: {
            label: 'In Progress',
            color: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
            icon: <Timer className="h-3 w-3" />,
        },
        FINISHED: {
            label: 'Completed',
            color: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
            icon: <CheckCircle className="h-3 w-3" />,
        },
        TIMEOUT: {
            label: 'Timed Out',
            color: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400',
            icon: <AlertCircle className="h-3 w-3" />,
        },
        CANCELLED: {
            label: 'Cancelled',
            color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
            icon: <XCircle className="h-3 w-3" />,
        },
    };

    const config = statusConfig[session.status];

    return (
        <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">{session.exam.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className={config.color}>
                        {config.icon}
                        <span className="ml-1">{config.label}</span>
                    </Badge>
                    {session.totalScore !== null && (
                        <span className="text-sm text-muted-foreground">
              Score: {session.totalScore}/100
            </span>
                    )}
                </div>
            </div>
            {session.status === 'IN_PROGRESS' ? (
                <Button size="sm" onClick={onContinue}>
                    Continue
                </Button>
            ) : session.status === 'FINISHED' ? (
                <Button size="sm" variant="outline" onClick={onViewResult}>
                    View Result
                </Button>
            ) : null}
        </div>
    );
}

interface ResultSummaryCardProps {
    result: ExamResult; // Use the full ExamResult type
    onViewDetails: () => void;
}

function ResultSummaryCard({ result, onViewDetails }: ResultSummaryCardProps) {
    const scoreColor = (result.totalScore || 0) >= 70 ? 'text-green-600' : 'text-orange-600';
    const submittedDate = result.submittedAt
        ? new Date(result.submittedAt).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
        : 'N/A';

    return (
        <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
            <div className="flex-1">
                <div className="flex items-center gap-3">
                    <div className={`text-2xl font-bold ${scoreColor}`}>
                        {result.totalScore || 0}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{result.exam.title}</h4>
                        <p className="text-sm text-muted-foreground">{submittedDate}</p>
                    </div>
                </div>
            </div>
            <Button size="sm" variant="outline" onClick={onViewDetails}>
                Details
            </Button>
        </div>
    );
}

// Loading skeleton
function DashboardSkeleton() {
    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-48" />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-8 w-16" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-4 w-32" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {[...Array(2)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-64" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {[...Array(3)].map((_, j) => (
                                <Skeleton key={j} className="h-20 w-full" />
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}