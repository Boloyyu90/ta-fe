'use client';

import Link from 'next/link';
import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
    CheckCircle2,
    XCircle,
    Clock,
    Trophy,
    AlertTriangle,
    Eye,
    Calendar,
} from 'lucide-react';
import type { ExamResult, ExamStatus } from '../types/exam-sessions.types';

// ============================================================================
// PROPS
// ============================================================================

export interface ResultCardProps {
    result: ExamResult;
    /** Format date function - passed from parent to keep component pure */
    formatDate?: (dateString: string | null) => string;
}

// ============================================================================
// STATUS CONFIG
// ============================================================================

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

export function ResultCard({ result, formatDate }: ResultCardProps) {
    const {
        id,
        exam,
        totalScore,
        status,
        answeredQuestions,
        totalQuestions,
        attemptNumber,
        submittedAt,
    } = result;

    const passingScore = exam.passingScore;
    const isPassed = status === 'FINISHED' && totalScore !== null && totalScore >= passingScore;
    const statusInfo = statusConfig[status] ?? statusConfig.FINISHED;
    const StatusIcon = statusInfo.icon;

    // Default date formatter
    const defaultFormatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const dateFormatter = formatDate ?? defaultFormatDate;

    return (
        <Card className="overflow-hidden hover:shadow-medium transition-shadow">
            <div className="flex flex-col md:flex-row">
                {/* Left Side - Score Display */}
                <div className={`flex-shrink-0 p-6 flex flex-col items-center justify-center md:w-56 relative`}>

                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                        Perolehan Try Out
                    </p>
                    <p className="text-sm font-semibold text-primary line-clamp-1 text-center mb-3">
                        Percobaan #{attemptNumber}
                    </p>

                    {/* Score */}
                    <div className="text-center">
                        <p className={`text-5xl font-black tracking-tight ${
                            status === 'FINISHED'
                                ? isPassed
                                    ? 'text-success'
                                    : 'text-destructive'
                                : 'text-foreground'
                        }`}>
                            {totalScore ?? 0}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            dari {passingScore} (KKM)
                        </p>
                    </div>

                    {/* Pass/Fail Badge */}
                    {status === 'FINISHED' && totalScore !== null && (
                        <Badge
                            variant={isPassed ? 'success' : 'destructive'}
                            className="mt-4 px-4 py-1 text-sm font-bold"
                        >
                            {isPassed ? (
                                <>
                                    <Trophy className="h-4 w-4 mr-1.5" />
                                    LULUS
                                </>
                            ) : (
                                <>
                                    <XCircle className="h-4 w-4 mr-1.5" />
                                    TIDAK LULUS
                                </>
                            )}
                        </Badge>
                    )}
                </div>

                {/* Right Side - Details */}
                <div className="flex-1 p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-lg line-clamp-2 mb-1">
                                {exam.title}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>{dateFormatter(submittedAt)}</span>
                            </div>
                        </div>
                        <Badge variant={statusInfo.variant} className="shrink-0">
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusInfo.label}
                        </Badge>
                    </div>

                    {/* Score Details Table */}
                    <div className="rounded-lg border bg-muted/30 overflow-hidden mb-4">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Keterangan</th>
                                    <th className="px-4 py-2 text-right font-medium text-muted-foreground">Nilai</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b">
                                    <td className="px-4 py-2.5">Passing Score (KKM)</td>
                                    <td className="px-4 py-2.5 text-right font-semibold">{passingScore}</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="px-4 py-2.5">Nilai Akhir</td>
                                    <td className={`px-4 py-2.5 text-right font-bold ${
                                        status === 'FINISHED'
                                            ? isPassed
                                                ? 'text-success'
                                                : 'text-destructive'
                                            : ''
                                    }`}>
                                        {totalScore ?? '-'}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-2.5">Soal Dijawab</td>
                                    <td className="px-4 py-2.5 text-right font-medium">
                                        {answeredQuestions} / {totalQuestions}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Action Button */}
                    <Button asChild className="w-full md:w-auto">
                        <Link href={`/results/${id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            Lihat Detail
                        </Link>
                    </Button>
                </div>
            </div>
        </Card>
    );
}

export default ResultCard;
