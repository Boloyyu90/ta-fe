// src/app/(participant)/results/[id]/page.tsx
'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Loader2,
    ArrowLeft,
    Calendar,
    Clock,
    Award,
    Eye,
    AlertTriangle,
    CheckCircle,
    BarChart3,
    PlayCircle,
    Clock4,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Progress } from '@/shared/components/ui/progress';
import { useResultDetail } from '@/features/exam-sessions/hooks/useResultDetail';
import { useProctoringEvents } from '@/features/proctoring/hooks/useProctoringEvents';
import { ProctoringEventsList } from '@/features/proctoring/components/ProctoringEventsList';
import type { ExamStatus } from '@/features/exam-sessions/types/exam-sessions.types';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function ResultDetailPage({ params }: PageProps) {
    const resolvedParams = use(params);
    const sessionId = parseInt(resolvedParams.id);
    const router = useRouter();

    const [activeTab, setActiveTab] = useState('summary');

    const { data: sessionData, isLoading: isLoadingSession } = useResultDetail(sessionId);
    const { data: eventsData, isLoading: isLoadingEvents } = useProctoringEvents(sessionId, {
        isAdmin: false,
    });

    const session = sessionData?.userExam;
    const events = eventsData?.events || [];
    const violations = events.filter((e) => e.severity === 'HIGH');

    // Calculate statistics
    const stats = session
        ? {
            total: session.totalQuestions || 0,
            correct: session.correctAnswers || 0,
            incorrect: (session.totalQuestions || 0) - (session.correctAnswers || 0),
            score: session.totalScore || 0,
            percentage:
                session.totalQuestions && session.totalQuestions > 0
                    ? ((session.correctAnswers || 0) / session.totalQuestions) * 100
                    : 0,
        }
        : null;

    // Loading state
    if (isLoadingSession) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Loading result details...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
                    <h2 className="text-2xl font-bold text-foreground">Result Not Found</h2>
                    <Button onClick={() => router.push('/results')}>Back to Results</Button>
                </div>
            </div>
        );
    }

    // Define status config with ALL possible ExamStatus values
    const statusConfig: Record<ExamStatus, {
        label: string;
        color: string;
        icon: typeof CheckCircle;
    }> = {
        NOT_STARTED: {
            label: 'Not Started',
            color: 'bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-400',
            icon: Clock4,
        },
        IN_PROGRESS: {
            label: 'In Progress',
            color: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
            icon: PlayCircle,
        },
        COMPLETED: {
            label: 'Completed',
            color: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
            icon: CheckCircle,
        },
        CANCELLED: {
            label: 'Cancelled',
            color: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
            icon: AlertTriangle,
        },
    };

    const status = statusConfig[session.status];
    const StatusIcon = status.icon;

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Header */}
            <div className="bg-background border-b border-border">
                <div className="container mx-auto px-4 py-6">
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/results')}
                        className="mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Results
                    </Button>

                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground mb-2">
                                {session.exam.title}
                            </h1>
                            <div className="flex items-center gap-3 flex-wrap">
                                <Badge className={status.color}>
                                    <StatusIcon className="h-3 w-3 mr-1" />
                                    {status.label}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                  {session.completedAt &&
                      new Date(session.completedAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                      })}
                </span>
                            </div>
                        </div>

                        {session.status === 'COMPLETED' && stats && (
                            <div className="text-right">
                                <div className="text-4xl font-bold text-primary">{stats.score}</div>
                                <p className="text-sm text-muted-foreground">Final Score</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-6">
                        <TabsTrigger value="summary">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Summary
                        </TabsTrigger>
                        <TabsTrigger value="proctoring">
                            <Eye className="h-4 w-4 mr-2" />
                            Proctoring Events ({events.length})
                        </TabsTrigger>
                    </TabsList>

                    {/* Summary Tab */}
                    <TabsContent value="summary" className="space-y-6">
                        <div className="grid lg:grid-cols-3 gap-6">
                            {/* Statistics Cards */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Exam Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Started At</p>
                                            <p className="text-sm font-medium">
                                                {new Date(session.startedAt).toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                    </div>

                                    {session.completedAt && (
                                        <div className="flex items-center gap-3">
                                            <Clock className="h-5 w-5 text-muted-foreground" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">Completed At</p>
                                                <p className="text-sm font-medium">
                                                    {new Date(session.completedAt).toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3">
                                        <Clock className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Duration</p>
                                            <p className="text-sm font-medium">
                                                {session.exam.durationMinutes} minutes
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {session.status === 'COMPLETED' && stats && (
                                <>
                                    {/* Score Card */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-base">Performance</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">
                            Accuracy Rate
                          </span>
                                                    <span className="text-sm font-semibold">
                            {stats.percentage.toFixed(1)}%
                          </span>
                                                </div>
                                                <Progress value={stats.percentage} className="h-2" />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 pt-2">
                                                <div>
                                                    <p className="text-xs text-muted-foreground mb-1">Correct</p>
                                                    <p className="text-2xl font-bold text-green-600">
                                                        {stats.correct}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground mb-1">Incorrect</p>
                                                    <p className="text-2xl font-bold text-red-600">
                                                        {stats.incorrect}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Violations Card */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-base">Proctoring Status</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">Total Events</span>
                                                <span className="text-lg font-semibold">{events.length}</span>
                                            </div>

                                            <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          High Violations
                        </span>
                                                <span className="text-lg font-semibold text-red-600">
                          {violations.length}
                        </span>
                                            </div>

                                            {violations.length === 0 ? (
                                                <div className="flex items-center gap-2 text-green-600 text-sm pt-2">
                                                    <CheckCircle className="h-4 w-4" />
                                                    <span>Clean exam session</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-orange-600 text-sm pt-2">
                                                    <AlertTriangle className="h-4 w-4" />
                                                    <span>Violations detected</span>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </>
                            )}

                            {session.status === 'CANCELLED' && (
                                <Card className="lg:col-span-2 border-red-200 bg-red-50 dark:bg-red-950/20">
                                    <CardContent className="py-6">
                                        <div className="flex items-start gap-4">
                                            <AlertTriangle className="h-8 w-8 text-red-600 flex-shrink-0" />
                                            <div>
                                                <h3 className="font-semibold text-red-900 dark:text-red-400 mb-2">
                                                    Exam Automatically Cancelled
                                                </h3>
                                                <p className="text-sm text-red-700 dark:text-red-300">
                                                    This exam was automatically cancelled due to multiple high-severity
                                                    proctoring violations. You accumulated 3 or more HIGH violations
                                                    during the exam session.
                                                </p>
                                                <p className="text-sm text-red-700 dark:text-red-300 mt-2">
                                                    Please review the proctoring events tab for details.
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Action Buttons */}
                        {session.status === 'COMPLETED' && (
                            <Card>
                                <CardContent className="py-6">
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <Button
                                            size="lg"
                                            onClick={() =>
                                                router.push(`/exam-sessions/${session.id}/review`)
                                            }
                                        >
                                            <Award className="h-5 w-5 mr-2" />
                                            Review All Answers
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            onClick={() => setActiveTab('proctoring')}
                                        >
                                            <Eye className="h-5 w-5 mr-2" />
                                            View Proctoring Events
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    {/* Proctoring Events Tab */}
                    <TabsContent value="proctoring" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Proctoring Timeline</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    All events recorded during your exam session
                                </p>
                            </CardHeader>
                            <CardContent>
                                {isLoadingEvents ? (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                    </div>
                                ) : (
                                    <ProctoringEventsList events={events} />
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}