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

    const isCompleted =
        userExam.status === 'COMPLETED' || userExam.status === 'FINISHED';

    const handleClick = () => {
        if (userExam.status === 'IN_PROGRESS') {
            router.push(`/exam-sessions/${userExam.id}/take`);
        } else if (isCompleted) {
            router.push(`/results/${userExam.id}`);
        }
    };

    return (
        <Card className="hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-1">
                            {userExam.exam.title}
                        </h3>
                        <Badge className={status.color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {status.label}
                        </Badge>
                    </div>

                    {isCompleted && userExam.totalScore !== null && (
                        <div className="text-right ml-4">
                            <div className="text-2xl font-bold text-primary">
                                {userExam.totalScore}
                            </div>
                            <p className="text-xs text-muted-foreground">Score</p>
                        </div>
                    )}
                </div>

                {/* Exam Info */}
                <div className="space-y-2 mb-4">
                    {userExam.startedAt && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
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

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Duration: {userExam.exam.durationMinutes} minutes</span>
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
                                <span className="text-muted-foreground">Accuracy</span>
                                <span className="font-semibold">
                  {userExam.correctAnswers}/{userExam.totalQuestions} (
                                    {progressPercentage.toFixed(0)}%)
                </span>
                            </div>
                            <Progress value={progressPercentage} className="h-2" />
                        </div>
                    )}
            </CardContent>

            <CardFooter className="p-6 pt-0">
                <Button
                    className="w-full"
                    onClick={handleClick}
                    disabled={
                        userExam.status === 'NOT_STARTED' ||
                        userExam.status === 'CANCELLED' ||
                        userExam.status === 'TIMEOUT'
                    }
                >
                    {userExam.status === 'IN_PROGRESS' && (
                        <>
                            <PlayCircle className="h-4 w-4 mr-2" />
                            Continue Exam
                        </>
                    )}

                    {isCompleted && (
                        <>
                            View Results
                            <ChevronRight className="h-4 w-4 ml-2" />
                        </>
                    )}

                    {userExam.status === 'CANCELLED' && !isCompleted && (
                        <>
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Cancelled
                        </>
                    )}

                    {userExam.status === 'NOT_STARTED' && 'Not Available'}

                    {userExam.status === 'TIMEOUT' && !isCompleted && 'Timeout'}
                </Button>
            </CardFooter>
        </Card>
    );
}
