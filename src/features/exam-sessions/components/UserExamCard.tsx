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

export function UserExamCard({ userExam }: UserExamCardProps) {
    const router = useRouter();

    const statusConfig: Record<
        ExamStatus,
        {
            label: string;
            color: string;
            icon: typeof CheckCircle;
        }
    > = {
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

    const status = statusConfig[userExam.status];
    const StatusIcon = status.icon;

    // Safe calculation with null checks
    const progressPercentage =
        userExam.totalQuestions && userExam.totalQuestions > 0 && userExam.correctAnswers !== null
            ? (userExam.correctAnswers / userExam.totalQuestions) * 100
            : 0;

    const handleClick = () => {
        if (userExam.status === 'IN_PROGRESS') {
            router.push(`/exam-sessions/${userExam.id}/take`);
        } else if (userExam.status === 'COMPLETED') {
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

                    {userExam.status === 'COMPLETED' && userExam.totalScore !== null && (
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

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Duration: {userExam.exam.durationMinutes} minutes</span>
                    </div>

                    {userExam.status === 'COMPLETED' && userExam.completedAt && (
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
                {userExam.status === 'COMPLETED' &&
                    userExam.correctAnswers !== null &&
                    userExam.totalQuestions !== null && (
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
                    disabled={userExam.status === 'NOT_STARTED' || userExam.status === 'CANCELLED'}
                >
                    {userExam.status === 'IN_PROGRESS' && (
                        <>
                            <PlayCircle className="h-4 w-4 mr-2" />
                            Continue Exam
                        </>
                    )}
                    {userExam.status === 'COMPLETED' && (
                        <>
                            View Results
                            <ChevronRight className="h-4 w-4 ml-2" />
                        </>
                    )}
                    {userExam.status === 'CANCELLED' && (
                        <>
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Cancelled
                        </>
                    )}
                    {userExam.status === 'NOT_STARTED' && 'Not Available'}
                </Button>
            </CardFooter>
        </Card>
    );
}
