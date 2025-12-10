// src/features/exam-sessions/components/ResultCard.tsx

/**
 * Result Card Component
 *
 * ✅ AUDIT FIX v3: Changed from UserExam to ExamResult prop type
 * to match what /results endpoint returns
 */

'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Progress } from '@/shared/components/ui/progress';
import {
    CheckCircle2,
    XCircle,
    Clock,
    FileText,
    Trophy,
    AlertTriangle,
} from 'lucide-react';
import type { ExamResult, UserExamStatus } from '../types/exam-sessions.types';

export interface ResultCardProps {
    result: ExamResult;
}

const statusConfig: Record<UserExamStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: typeof CheckCircle2 }> = {
    NOT_STARTED: { label: 'Belum Mulai', variant: 'outline', icon: Clock },
    IN_PROGRESS: { label: 'Sedang Berlangsung', variant: 'default', icon: Clock },
    FINISHED: { label: 'Selesai', variant: 'secondary', icon: CheckCircle2 },
    COMPLETED: { label: 'Selesai', variant: 'secondary', icon: CheckCircle2 },
    TIMEOUT: { label: 'Waktu Habis', variant: 'destructive', icon: AlertTriangle },
    CANCELLED: { label: 'Dibatalkan', variant: 'outline', icon: XCircle },
};

export function ResultCard({ result }: ResultCardProps) {
    const { exam, totalScore, status, answeredQuestions, totalQuestions, duration, scoresByType } = result;

    const passingScore = exam.passingScore ?? 0;
    const isPassed = totalScore !== null && totalScore >= passingScore;
    const scorePercentage = passingScore > 0 ? ((totalScore ?? 0) / passingScore) * 100 : 0;

    const statusInfo = statusConfig[status] || statusConfig.FINISHED;
    const StatusIcon = statusInfo.icon;

    // Format duration (seconds to minutes)
    const formatDuration = (seconds: number | null) => {
        if (seconds === null) return '-';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    };

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-lg line-clamp-1">{exam.title}</CardTitle>
                        {exam.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {exam.description}
                            </p>
                        )}
                    </div>
                    <Badge variant={statusInfo.variant} className="flex items-center gap-1">
                        <StatusIcon className="h-3 w-3" />
                        {statusInfo.label}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Score Section */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Trophy className={`h-5 w-5 ${isPassed ? 'text-green-500' : 'text-red-500'}`} />
                        <span className="text-2xl font-bold">
                            {totalScore ?? 0}
                        </span>
                        <span className="text-muted-foreground">/ {passingScore}</span>
                    </div>
                    <Badge variant={isPassed ? 'default' : 'destructive'}>
                        {isPassed ? 'LULUS' : 'TIDAK LULUS'}
                    </Badge>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                    <Progress
                        value={Math.min(scorePercentage, 100)}
                        className={`h-2 ${isPassed ? '[&>div]:bg-green-500' : '[&>div]:bg-red-500'}`}
                    />
                    <p className="text-xs text-muted-foreground text-right">
                        {scorePercentage.toFixed(1)}% dari passing grade
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>
                            {answeredQuestions}/{totalQuestions} Dijawab
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDuration(duration)}</span>
                    </div>
                </div>

                {/* Score by Type (if available) */}
                {scoresByType && scoresByType.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 text-xs">
                        {scoresByType.map((score) => (
                            <div key={score.type} className="text-center p-2 bg-muted rounded">
                                <div className="font-medium">{score.type}</div>
                                <div>{score.score}/{score.maxScore}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Action Button */}
                <Link href={`/results/${result.id}`}>
                    <Button variant="outline" className="w-full">
                        Lihat Detail
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}

export default ResultCard;