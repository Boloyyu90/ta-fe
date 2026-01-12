/**
 * Result Card Component
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
    Play,
} from 'lucide-react';
import type { ExamResult, ExamStatus } from '../types/exam-sessions.types';

// ============================================================================
// PROPS
// ============================================================================

export interface ResultCardProps {
    result: ExamResult;
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
}> = {
    IN_PROGRESS: {
        label: 'Sedang Berlangsung',
        variant: 'default',
        icon: Clock,
    },
    FINISHED: {
        label: 'Selesai',
        variant: 'secondary',
        icon: CheckCircle2,
    },
    TIMEOUT: {
        label: 'Waktu Habis',
        variant: 'destructive',
        icon: AlertTriangle,
    },
    CANCELLED: {
        label: 'Dibatalkan',
        variant: 'outline',
        icon: XCircle,
    },
};

// ============================================================================
// COMPONENT
// ============================================================================

export function ResultCard({ result }: ResultCardProps) {
    const {
        id,
        exam,
        totalScore,
        status,
        answeredQuestions,
        totalQuestions,
        duration,
        scoresByType,
    } = result;

    const passingScore = exam.passingScore;
    const isPassed = totalScore !== null && totalScore >= passingScore;
    const scorePercentage = Math.min(((totalScore ?? 0) / passingScore) * 100, 100);

    const statusInfo = statusConfig[status] ?? statusConfig.FINISHED;
    const StatusIcon = statusInfo.icon;

    // Format duration (seconds to minutes)
    const formatDuration = (seconds: number | null): string => {
        if (seconds === null) return '-';
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}m ${secs}s`;
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
                {/* Pass/Fail Indicator */}
                {status === 'FINISHED' && totalScore !== null && (
                    <div className={`flex items-center gap-2 p-3 rounded-lg ${
                        isPassed
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                        {isPassed ? (
                            <>
                                <Trophy className="h-5 w-5" />
                                <span className="font-semibold">LULUS</span>
                            </>
                        ) : (
                            <>
                                <XCircle className="h-5 w-5" />
                                <span className="font-semibold">TIDAK LULUS</span>
                            </>
                        )}
                    </div>
                )}

                {/* Score Display */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Skor</span>
                        <span className="font-semibold">
                            {totalScore ?? 0} / {passingScore}
                        </span>
                    </div>
                    <Progress
                        value={scorePercentage}
                        className={`h-2 ${isPassed ? '[&>div]:bg-green-500' : '[&>div]:bg-red-500'}`}
                    />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                        <span className="text-muted-foreground">Soal Dijawab</span>
                        <p className="font-medium">{answeredQuestions}/{totalQuestions}</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-muted-foreground">Durasi</span>
                        <p className="font-medium">{formatDuration(duration)}</p>
                    </div>
                </div>

                {/* Score by Type (if available) */}
                {scoresByType && scoresByType.length > 0 && (
                    <div className="space-y-2 pt-2 border-t">
                        <span className="text-sm text-muted-foreground">Skor per Kategori</span>
                        <div className="grid grid-cols-3 gap-2">
                            {scoresByType.map((st) => (
                                <div
                                    key={st.type}
                                    className="text-center p-2 bg-muted rounded"
                                >
                                    <div className="text-xs text-muted-foreground">{st.type}</div>
                                    <div className="font-semibold">{st.score}/{st.maxScore}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* View Details Button */}
                <Button asChild variant="outline" className="w-full">
                    <Link href={`/results/${id}`}>
                        <FileText className="h-4 w-4 mr-2" />
                        Lihat Detail
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}

export default ResultCard;