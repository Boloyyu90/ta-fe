// src/features/exam-sessions/components/UserExamCard.tsx

'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/shared/components/ui/card'; // ✅ FIXED: Correct import path
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Calendar, Clock, FileText, AlertCircle, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import type { UserExam, UserExamStatus } from '../types/exam-sessions.types';
import { getStatusConfig } from '@/shared/lib/status-config'; // ✅ FIXED: Correct import path

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
function formatTimeSpent(seconds: number | undefined): string {
    if (seconds === undefined) return 'Not started';

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
}

/**
 * Calculate score percentage
 */
function calculatePercentage(score: number, max: number): number {
    if (max === 0) return 0;
    return Math.round((score / max) * 100);
}

export function UserExamCard({
                                 userExam,
                                 onViewResults,
                                 onStartExam,
                                 showActions = true,
                             }: UserExamCardProps) {
    const { exam, status, startTime, endTime, submittedAt, totalScore, timeSpent, violationCount } = userExam;

    // ✅ FIXED: Use explicit boolean checks to avoid type narrowing
    const hasResults = status === 'FINISHED' || status === 'TIMEOUT' || status === 'COMPLETED';
    const isInProgress = status === 'IN_PROGRESS';
    const isNotStarted = status === 'NOT_STARTED';
    const isCancelled = status === 'CANCELLED';

    // Get status configuration
    const statusConfig = getStatusConfig(status);
    const StatusIcon = statusConfig.icon;

    // Calculate score details if available
    const maxScore = exam.totalQuestions * 5; // Assuming max 5 points per question
    const scorePercentage = totalScore !== null && totalScore !== undefined
        ? calculatePercentage(totalScore, maxScore)
        : null;

    // Determine if passed (if exam has passing score)
    const hasPassed = totalScore !== null && totalScore !== undefined && exam.passingScore
        ? totalScore >= exam.passingScore
        : null;

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-1">
                        <h3 className="text-xl font-semibold line-clamp-2">{exam.title}</h3>
                        {exam.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {exam.description}
                            </p>
                        )}
                    </div>

                    {/* Status Badge */}
                    <Badge className={`${statusConfig.color} border flex items-center gap-1`}>
                        <StatusIcon className="h-3 w-3" />
                        {statusConfig.label}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-4">
                {/* Exam Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Duration */}
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                            <p className="text-xs text-muted-foreground">Duration</p>
                            <p className="text-sm font-medium">
                                {formatDuration(exam.durationMinutes)}
                            </p>
                        </div>
                    </div>

                    {/* Questions */}
                    <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                            <p className="text-xs text-muted-foreground">Questions</p>
                            <p className="text-sm font-medium">{exam.totalQuestions}</p>
                        </div>
                    </div>

                    {/* Exam Date (if scheduled) */}
                    {exam.examDate && (
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-xs text-muted-foreground">Exam Date</p>
                                <p className="text-sm font-medium">
                                    {format(new Date(exam.examDate), 'MMM dd, yyyy')}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Passing Score */}
                    {exam.passingScore && (
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-xs text-muted-foreground">Passing Score</p>
                                <p className="text-sm font-medium">{exam.passingScore}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Progress/Results Section */}
                {hasResults && totalScore !== null && totalScore !== undefined && (
                    <div className="pt-4 border-t space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Score</span>
                            <div className="flex items-center gap-2">
                                {hasPassed !== null && (
                                    hasPassed ? (
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <XCircle className="h-4 w-4 text-red-600" />
                                    )
                                )}
                                <span className="text-lg font-bold">
                                    {totalScore} / {maxScore}
                                </span>
                                {scorePercentage !== null && (
                                    <span className="text-sm text-muted-foreground">
                                        ({scorePercentage}%)
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Progress Bar */}
                        {scorePercentage !== null && (
                            <div className="w-full bg-muted rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all ${
                                        hasPassed
                                            ? 'bg-green-600'
                                            : 'bg-red-600'
                                    }`}
                                    style={{ width: `${scorePercentage}%` }}
                                />
                            </div>
                        )}

                        {/* Time Spent */}
                        {timeSpent && (
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Time Spent</span>
                                <span>{formatTimeSpent(timeSpent)}</span>
                            </div>
                        )}

                        {/* Violations */}
                        {violationCount !== undefined && violationCount > 0 && (
                            <div className="flex items-center gap-2 text-sm text-orange-600">
                                <AlertCircle className="h-4 w-4" />
                                <span>{violationCount} violation{violationCount > 1 ? 's' : ''} detected</span>
                            </div>
                        )}
                    </div>
                )}

                {/* In Progress Info */}
                {isInProgress && (
                    <div className="pt-4 border-t">
                        <div className="flex items-center gap-2 text-blue-600">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm font-medium">Exam in progress...</span>
                        </div>
                        {startTime && (
                            <p className="text-xs text-muted-foreground mt-1">
                                Started: {format(new Date(startTime), 'MMM dd, yyyy HH:mm')}
                            </p>
                        )}
                    </div>
                )}

                {/* Not Started Info */}
                {isNotStarted && (
                    <div className="pt-4 border-t">
                        <p className="text-sm text-muted-foreground">
                            Ready to begin this exam
                        </p>
                    </div>
                )}

                {/* Cancelled Info */}
                {isCancelled && (
                    <div className="pt-4 border-t">
                        <div className="flex items-center gap-2 text-red-600">
                            <XCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">Exam was cancelled</span>
                        </div>
                        {violationCount !== undefined && violationCount > 0 && (
                            <p className="text-xs text-muted-foreground mt-1">
                                Due to violations
                            </p>
                        )}
                    </div>
                )}
            </CardContent>

            {/* Action Buttons */}
            {showActions && (
                <CardFooter className="bg-muted/50 flex gap-2">
                    {hasResults && onViewResults && (
                        <Button
                            onClick={onViewResults}
                            variant="default"
                            className="flex-1"
                        >
                            View Results
                        </Button>
                    )}

                    {isNotStarted && onStartExam && (
                        <Button
                            onClick={onStartExam}
                            variant="default"
                            className="flex-1"
                        >
                            Start Exam
                        </Button>
                    )}

                    {isInProgress && (
                        <Button
                            asChild
                            variant="default"
                            className="flex-1"
                        >
                            <Link href={`/exam-session/${userExam.id}`}>
                                Continue Exam
                            </Link>
                        </Button>
                    )}

                    {/* Always show exam details link */}
                    <Button
                        asChild
                        variant="outline"
                        className="flex-1"
                    >
                        <Link href={`/exams/${exam.id}`}>
                            View Details
                        </Link>
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}