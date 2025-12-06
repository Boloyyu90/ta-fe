// src/features/exam-sessions/components/UserExamCard.tsx

'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Calendar, Clock, FileText, AlertCircle, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import type { UserExam, UserExamStatus } from '../types/exam-sessions.types';

/**
 * UserExamCard Component
 *
 * Displays a single user exam session with exam details and status
 *
 * ⚠️ CRITICAL: Exam now uses `durationMinutes` (integer) not `duration` (string)
 * Backend contract: Exam.durationMinutes is a number representing minutes
 */

interface UserExamCardProps {
    userExam: UserExam;
    onViewResults?: () => void;
    onStartExam?: () => void;
    showActions?: boolean;
}

/**
 * Format duration from minutes to human-readable string
 * @param minutes - Duration in minutes (integer)
 * @returns Formatted string like "90 minutes" or "2 hours 30 minutes"
 */
function formatDuration(minutes: number): string {
    if (minutes < 60) {
        return `${minutes} minutes`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
        return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    }

    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${remainingMinutes} minutes`;
}

/**
 * Format time spent in exam session
 * @param seconds - Time spent in seconds
 * @returns Formatted string like "45m 23s"
 */
function formatTimeSpent(seconds?: number): string {
    if (!seconds) return 'N/A';

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}m ${remainingSeconds}s`;
}

/**
 * ✅ INLINED STATUS CONFIG (was imported from non-existent file)
 * Maps UserExamStatus to display config
 */
function getStatusConfig(status: UserExamStatus) {
    const config: Record<UserExamStatus, { label: string; color: string; icon: typeof CheckCircle2 }> = {
        NOT_STARTED: {
            label: 'Not Started',
            color: 'bg-gray-100 text-gray-800',
            icon: Clock,
        },
        IN_PROGRESS: {
            label: 'In Progress',
            color: 'bg-blue-100 text-blue-800',
            icon: Loader2,
        },
        FINISHED: {
            label: 'Finished',
            color: 'bg-green-100 text-green-800',
            icon: CheckCircle2,
        },
        COMPLETED: {
            label: 'Completed',
            color: 'bg-green-100 text-green-800',
            icon: CheckCircle2,
        },
        TIMEOUT: {
            label: 'Timeout',
            color: 'bg-orange-100 text-orange-800',
            icon: AlertCircle,
        },
        CANCELLED: {
            label: 'Cancelled',
            color: 'bg-red-100 text-red-800',
            icon: XCircle,
        },
    };

    return config[status];
}

export function UserExamCard({
                                 userExam,
                                 onViewResults,
                                 onStartExam,
                                 showActions = true,
                             }: UserExamCardProps) {
    const { exam, status, totalScore, startTime, endTime, timeSpent, violationCount } = userExam;
    const statusConfig = getStatusConfig(status);
    const StatusIcon = statusConfig.icon;

    /**
     * ✅ FIX: Avoid type narrowing by using explicit boolean checks
     * The problem: .includes() narrows status to a union subset, making later comparisons impossible
     * Solution: Use explicit comparisons that preserve the full UserExamStatus type
     */
    const hasResults = status === 'FINISHED' || status === 'TIMEOUT' || status === 'COMPLETED';

    // Determine if exam can be started
    const canStart = status === 'NOT_STARTED';

    // Determine if exam is in progress
    const isInProgress = status === 'IN_PROGRESS';

    return (
        <Card className="overflow-hidden transition-shadow hover:shadow-md">
            <CardHeader className="border-b bg-muted/50 pb-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-1">
                        <h3 className="text-xl font-semibold leading-tight">
                            {exam.title}
                        </h3>
                        {exam.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {exam.description}
                            </p>
                        )}
                    </div>
                    <Badge
                        variant={status === 'FINISHED' || status === 'COMPLETED' ? 'default' : 'secondary'}
                        className="shrink-0"
                    >
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {statusConfig.label}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="pt-6">
                <div className="grid gap-4 sm:grid-cols-2">
                    {/* Exam Details */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-muted-foreground">Exam Details</h4>

                        <div className="flex items-center gap-2 text-sm">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span>{exam.totalQuestions} questions</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {/* ⚠️ FIXED: Use exam.durationMinutes (number) instead of exam.duration */}
                            <span>Duration: {formatDuration(exam.durationMinutes)}</span>
                        </div>

                        {exam.examDate && (
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>Date: {format(new Date(exam.examDate), 'PPP')}</span>
                            </div>
                        )}

                        <div className="flex items-center gap-2 text-sm">
                            <AlertCircle className="h-4 w-4 text-muted-foreground" />
                            <span>Passing Score: {exam.passingScore}%</span>
                        </div>
                    </div>

                    {/* Session Details */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-muted-foreground">Your Session</h4>

                        {startTime && (
                            <div className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>Started: {format(new Date(startTime), 'PPp')}</span>
                            </div>
                        )}

                        {endTime && (
                            <div className="flex items-center gap-2 text-sm">
                                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                                <span>Ended: {format(new Date(endTime), 'PPp')}</span>
                            </div>
                        )}

                        {timeSpent !== null && timeSpent !== undefined && (
                            <div className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>Time Spent: {formatTimeSpent(timeSpent)}</span>
                            </div>
                        )}

                        {totalScore !== null && totalScore !== undefined && (
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                <span>Score: {totalScore}%</span>
                            </div>
                        )}

                        {violationCount !== null && violationCount !== undefined && violationCount > 0 && (
                            <div className="flex items-center gap-2 text-sm text-orange-600">
                                <AlertCircle className="h-4 w-4" />
                                <span>{violationCount} violations</span>
                            </div>
                        )}

                        {/* Status-specific messages */}
                        {status === 'NOT_STARTED' && (
                            <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-700">
                                Ready to start this exam
                            </div>
                        )}

                        {status === 'IN_PROGRESS' && (
                            <div className="rounded-md bg-yellow-50 p-3 text-sm text-yellow-700">
                                Exam in progress - continue where you left off
                            </div>
                        )}

                        {status === 'TIMEOUT' && (
                            <div className="rounded-md bg-orange-50 p-3 text-sm text-orange-700">
                                Time limit exceeded
                            </div>
                        )}

                        {status === 'CANCELLED' && (
                            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                                Exam was cancelled
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>

            {showActions && (
                <CardFooter className="flex gap-2 border-t bg-muted/50 pt-4">
                    {canStart && (
                        <Button
                            className="flex-1"
                            onClick={onStartExam}
                            asChild={!onStartExam}
                        >
                            {onStartExam ? (
                                'Start Exam'
                            ) : (
                                <Link href={`/exam-session/${userExam.id}`}>Start Exam</Link>
                            )}
                        </Button>
                    )}

                    {isInProgress && (
                        <Button className="flex-1" asChild>
                            <Link href={`/exam-session/${userExam.id}`}>
                                Continue Exam
                            </Link>
                        </Button>
                    )}

                    {hasResults && (
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={onViewResults}
                            asChild={!onViewResults}
                        >
                            {onViewResults ? (
                                'View Results'
                            ) : (
                                <Link href={`/results/${userExam.id}`}>View Results</Link>
                            )}
                        </Button>
                    )}

                    <Button variant="outline" asChild>
                        <Link href={`/exams/${exam.id}`}>
                            Exam Details
                        </Link>
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}