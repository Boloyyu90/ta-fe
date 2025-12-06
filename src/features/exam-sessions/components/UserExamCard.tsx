// src/features/exam-sessions/components/UserExamCard.tsx

'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Calendar, Clock, FileText, AlertCircle, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import type { UserExam, UserExamStatus } from '../types/exam-sessions.types';
import { getStatusConfig } from '../utils/status-config';

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

export function UserExamCard({
                                 userExam,
                                 onViewResults,
                                 onStartExam,
                                 showActions = true,
                             }: UserExamCardProps) {
    const { exam, status, totalScore, startTime, endTime, timeSpent, violationCount } = userExam;
    const statusConfig = getStatusConfig(status);

    // Determine if results are available
    const hasResults = ['FINISHED', 'TIMEOUT', 'COMPLETED'].includes(status);

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

                        {timeSpent !== undefined && timeSpent > 0 && (
                            <div className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>Time Spent: {formatTimeSpent(timeSpent)}</span>
                            </div>
                        )}

                        {hasResults && totalScore !== null && totalScore !== undefined && (
                            <div className="flex items-center gap-2 text-sm">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                <span className="font-semibold">
                                    Score: {totalScore.toFixed(2)}%
                                </span>
                            </div>
                        )}

                        {violationCount !== undefined && violationCount > 0 && (
                            <div className="flex items-center gap-2 text-sm">
                                <XCircle className="h-4 w-4 text-red-600" />
                                <span className="text-red-600">
                                    {violationCount} violation{violationCount > 1 ? 's' : ''}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>

            {showActions && (
                <CardFooter className="border-t bg-muted/30 pt-4">
                    <div className="flex w-full gap-2">
                        {canStart && onStartExam && (
                            <Button onClick={onStartExam} className="flex-1">
                                Start Exam
                            </Button>
                        )}

                        {isInProgress && (
                            <Button asChild className="flex-1">
                                <Link href={`/exam-session/${userExam.id}`}>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Continue Exam
                                </Link>
                            </Button>
                        )}

                        {hasResults && (
                            <Button
                                variant="default"
                                onClick={onViewResults}
                                className="flex-1"
                            >
                                View Results
                            </Button>
                        )}

                        {!canStart && !isInProgress && !hasResults && (
                            <div className="flex-1 text-center text-sm text-muted-foreground">
                                {status === 'CANCELLED' && 'Exam was cancelled'}
                                {status === 'NOT_STARTED' && 'Waiting to start'}
                            </div>
                        )}
                    </div>
                </CardFooter>
            )}
        </Card>
    );
}