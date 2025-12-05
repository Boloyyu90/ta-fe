// src/features/exam-sessions/components/UserExamCard.tsx
'use client';

import { useRouter } from 'next/navigation';
import {
    Clock,
    Calendar,
    PlayCircle,
    CheckCircle,
    AlertTriangle,
    Clock4,
    ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Progress } from '@/shared/components/ui/progress';
import type { UserExam, ExamStatus } from '../types/exam-sessions.types';

interface UserExamCardProps {
    userExam: UserExam;
}

type StatusConfig = {
    label: string;
    color: string;
    icon: typeof CheckCircle;
};

const statusConfig: Record<ExamStatus, StatusConfig> = {
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
    FINISHED: {
        label: 'Finished',
        color: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
        icon: CheckCircle,
    },
    COMPLETED: {
        label: 'Completed',
        color: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
        icon: CheckCircle,
    },
    TIMEOUT: {
        label: 'Timeout',
        color: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400',
        icon: Clock,
    },
    CANCELLED: {
        label: 'Cancelled',
        color: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
        icon: AlertTriangle,
    },
};

export function UserExamCard({ userExam }: UserExamCardProps) {
    const router = useRouter();

    const status = statusConfig[userExam.status];
    const StatusIcon = status.icon;

    // Safe calculation with null checks
    const progressPercentage =
        userExam.totalQuestions &&
        userExam.totalQuestions > 0 &&
        userExam.correctAnswers !== null &&
        userExam.correctAnswers !== undefined
            ? (userExam.correctAnswers / userExam.totalQuestions) * 100
            : 0;

    const isInProgress = userExam.status === 'IN_PROGRESS';
    const isCompleted = ['FINISHED', 'COMPLETED', 'TIMEOUT', 'CANCELLED'].includes(userExam.status);

    const handleAction = () => {
        if (isInProgress) {
            router.push(`/exam-sessions/${userExam.id}/take`);
        } else if (isCompleted) {
            router.push(`/results/${userExam.id}`);
        }
    };

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            {/* ✅ FIXED: Add null check for userExam.exam */}
                            <h3 className="font-semibold text-lg text-foreground line-clamp-2">
                                {userExam.exam?.title || 'Exam Title Not Available'}
                            </h3>
                            <Badge className={`mt-2 ${status.color}`}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {status.label}
                            </Badge>
                        </div>

                        {isCompleted && userExam.totalScore !== null && (
                            <div className="flex flex-col items-end">
                                <span className="text-sm text-muted-foreground">Score</span>
                                <span className="text-2xl font-bold text-foreground">
                                    {userExam.totalScore}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Info Grid */}
                    <div className="space-y-2 text-sm">
                        {isInProgress && userExam.startedAt && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>
                                    Started:{' '}
                                    {new Date(userExam.startedAt).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </span>
                            </div>
                        )}

                        {/* ✅ FIXED: Add null check for userExam.exam */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>Duration: {userExam.exam?.durationMinutes || 0} minutes</span>
                        </div>

                        {isCompleted && userExam.completedAt && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CheckCircle className="h-4 w-4" />
                                <span>
                                    Completed:{' '}
                                    {new Date(userExam.completedAt).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Progress Bar for Completed Exams */}
                    {isCompleted &&
                        userExam.correctAnswers !== null &&
                        userExam.correctAnswers !== undefined &&
                        userExam.totalQuestions !== null &&
                        userExam.totalQuestions !== undefined && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Correct: {userExam.correctAnswers}/{userExam.totalQuestions}
                                    </span>
                                    <span className="font-medium">{Math.round(progressPercentage)}%</span>
                                </div>
                                <Progress value={progressPercentage} className="h-2" />
                            </div>
                        )}
                </div>
            </CardContent>

            <CardFooter className="p-6 pt-0">
                <Button
                    onClick={handleAction}
                    variant={isInProgress ? 'default' : 'outline'}
                    className="w-full"
                >
                    {isInProgress ? (
                        <>
                            <PlayCircle className="h-4 w-4 mr-2" />
                            Continue Exam
                        </>
                    ) : (
                        <>
                            <ChevronRight className="h-4 w-4 mr-2" />
                            View Details
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}