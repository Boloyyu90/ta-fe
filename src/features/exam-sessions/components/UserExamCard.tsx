/**
 * User Exam Session Card Component
 */

'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Progress } from '@/shared/components/ui/progress';
import {
    CheckCircle2,
    XCircle,
    Clock,
    Play,
    FileText,
    AlertTriangle,
    Calendar,
    Timer,
} from 'lucide-react';
import type { UserExam, ExamStatus } from '../types/exam-sessions.types';

// ============================================================================
// PROPS
// ============================================================================

export interface UserExamCardProps {
    userExam: UserExam;
    showActions?: boolean;
}

// ============================================================================
// STATUS CONFIG (Only valid backend statuses)
// ============================================================================

/**
 * Status configuration
 */
const statusConfig: Record<ExamStatus, {
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    icon: typeof CheckCircle2;
    canContinue: boolean;
}> = {
    IN_PROGRESS: {
        label: 'Sedang Berlangsung',
        variant: 'default',
        icon: Play,
        canContinue: true,
    },
    FINISHED: {
        label: 'Selesai',
        variant: 'secondary',
        icon: CheckCircle2,
        canContinue: false,
    },
    TIMEOUT: {
        label: 'Waktu Habis',
        variant: 'destructive',
        icon: AlertTriangle,
        canContinue: false,
    },
    CANCELLED: {
        label: 'Dibatalkan',
        variant: 'outline',
        icon: XCircle,
        canContinue: false,
    },
};

// ============================================================================
// COMPONENT
// ============================================================================

export function UserExamCard({ userExam, showActions = true }: UserExamCardProps) {
       const {
        exam,
        status,
        answeredQuestions,
        totalQuestions,
        remainingTimeMs,
        startedAt,
        totalScore,
        durationMinutes,       } = userExam;

    const statusInfo = statusConfig[status] ?? statusConfig.IN_PROGRESS;
    const StatusIcon = statusInfo.icon;

    const progress = totalQuestions > 0
        ? Math.round((answeredQuestions / totalQuestions) * 100)
        : 0;

    // Format remaining time
    const formatRemainingTime = (ms: number | null): string => {
        if (ms === null || ms <= 0) return '0:00';
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <Card className="h-full hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-lg line-clamp-2">
                        {exam.title}
                    </CardTitle>
                    <Badge variant={statusInfo.variant} className="shrink-0">
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusInfo.label}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Progress</span>
                        <span>{answeredQuestions}/{totalQuestions} soal</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>

                {/* Time Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    {/* Duration */}
                    {durationMinutes && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Timer className="h-4 w-4" />
                            <span>{durationMinutes} menit</span>
                        </div>
                    )}

                    {/* Remaining Time (for in-progress) */}
                    {status === 'IN_PROGRESS' && remainingTimeMs !== null && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>Sisa: {formatRemainingTime(remainingTimeMs)}</span>
                        </div>
                    )}

                    {/* Score (for finished) */}
                    {(status === 'FINISHED' || status === 'TIMEOUT') && totalScore !== null && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <FileText className="h-4 w-4" />
                            <span>Skor: {totalScore}</span>
                        </div>
                    )}
                </div>

                {/* Started At */}
                {startedAt && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                            Dimulai: {format(new Date(startedAt), 'PPp', { locale: localeId })}
                        </span>
                    </div>
                )}

                {/* Actions */}
                {showActions && (
                    <div className="pt-2">
                        {statusInfo.canContinue ? (
                            <Button asChild className="w-full">
                                <Link href={`/exam-sessions/${userExam.id}/take`}>
                                    <Play className="h-4 w-4 mr-2" />
                                    Lanjutkan Ujian
                                </Link>
                            </Button>
                        ) : (
                            <Button asChild variant="outline" className="w-full">
                                <Link href={`/results/${userExam.id}`}>
                                    <FileText className="h-4 w-4 mr-2" />
                                    Lihat Hasil
                                </Link>
                            </Button>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default UserExamCard;