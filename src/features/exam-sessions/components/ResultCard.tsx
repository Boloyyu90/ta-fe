// src/features/exam-sessions/components/ResultCard.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Calendar, Clock, Award, Eye, AlertTriangle, CheckCircle, PlayCircle, Clock4 } from 'lucide-react';
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

    const status = statusConfig[result.status];
    const StatusIcon = status.icon;

    const completedAt = result.completedAt
        ? new Date(result.completedAt).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
        : 'N/A';

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-1">
                            {result.exam.title}
                        </h3>
                        <div className="flex items-center gap-2">
                            <Badge className={status.color}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {status.label}
                            </Badge>
                        </div>
                    </div>

                    {result.status === 'COMPLETED' && (
                        <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                                {result.totalScore || 0}
                            </div>
                            <p className="text-xs text-muted-foreground">Score</p>
                        </div>
                    )}
                </div>

                {/* Exam Info */}
                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Completed: {completedAt}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Duration: {result.exam.durationMinutes} minutes</span>
                    </div>

                    {result.status === 'COMPLETED' && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Award className="h-4 w-4" />
                            <span>
                {result.correctAnswers || 0}/{result.totalQuestions || 0} Correct
              </span>
                        </div>
                    )}

                    {result.status === 'CANCELLED' && (
                        <div className="flex items-center gap-2 text-sm text-red-600">
                            <AlertTriangle className="h-4 w-4" />
                            <span>Exam cancelled due to violations</span>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => router.push(`/results/${result.id}`)}
                    >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                    </Button>

                    {result.status === 'COMPLETED' && (
                        <Button
                            variant="default"
                            size="sm"
                            className="flex-1"
                            onClick={() => router.push(`/exam-sessions/${result.id}/review`)}
                        >
                            Review Answers
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}