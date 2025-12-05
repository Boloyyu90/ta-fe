// src/features/exam-sessions/components/ResultCard.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Calendar, Clock, Award, Eye, AlertTriangle, CheckCircle, PlayCircle, Clock4, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import type { ExamSessionListItem, ExamStatus } from '../types/exam-sessions.types';

interface ResultCardProps {
    result: ExamSessionListItem;
}

export function ResultCard({ result }: ResultCardProps) {
    const router = useRouter();

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

    const status = statusConfig[result.status];
    const StatusIcon = status.icon;

    const completedAt = result.completedAt
        ? new Date(result.completedAt).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        })
        : 'N/A';

    const handleViewResult = () => {
        router.push(`/results/${result.id}`);
    };

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            {/* ✅ FIXED: Add null check for result.exam */}
                            <h3 className="font-semibold text-lg text-foreground">
                                {result.exam?.title || 'Exam Title Not Available'}
                            </h3>
                            <Badge className={`mt-2 ${status.color}`}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {status.label}
                            </Badge>
                        </div>

                        {result.totalScore !== null && (
                            <div className="flex flex-col items-end">
                                <span className="text-sm text-muted-foreground">Score</span>
                                <span className="text-2xl font-bold text-foreground">
                                    {result.totalScore}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{completedAt}</span>
                        </div>

                        {/* ✅ FIXED: Add null check for result.exam */}
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>Duration: {result.exam?.durationMinutes || 0} minutes</span>
                        </div>

                        {result.correctAnswers !== null && result.totalQuestions !== null && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Award className="h-4 w-4" />
                                <span>
                                    Correct: {result.correctAnswers}/{result.totalQuestions}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <Button
                        onClick={handleViewResult}
                        variant="outline"
                        className="w-full"
                    >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}