// src/features/exam-sessions/components/UserExamCard.tsx

/**
 * User Exam Session Card Component
 *
 * ✅ AUDIT FIX v3: Removed examDate references (doesn't exist on Exam type)
 * Uses startTime/endTime instead for scheduling info
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
import type { UserExam, UserExamStatus } from '../types/exam-sessions.types';

export interface UserExamCardProps {
    userExam: UserExam;
    showActions?: boolean;
}

const statusConfig: Record<UserExamStatus, {
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    icon: typeof CheckCircle2;
    canContinue: boolean;
}> = {
    NOT_STARTED: {
        label: 'Belum Dimulai',
        variant: 'outline',
        icon: Clock,
        canContinue: true,
    },
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
    COMPLETED: {
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

export function UserExamCard({ userExam, showActions = true }: UserExamCardProps) {
    const { exam, status, answeredQuestions, totalQuestions, remainingTimeMs, startTime, totalScore } = userExam;

    const statusInfo = statusConfig[status] || statusConfig.NOT_STARTED;
    const StatusIcon = statusInfo.icon;

    const progress = totalQuestions > 0
        ? (answeredQuestions / totalQuestions) * 100
        : 0;

    // Format remaining time
    const formatRemainingTime = (ms: number | null) => {
        if (ms === null || ms <= 0) return 'Waktu habis';
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (hours > 0) {
            return `${hours}j ${minutes}m ${seconds}d`;
        }
        return `${minutes}m ${seconds}d`;
    };

    // Get action button config
    const getActionButton = () => {
        if (!showActions) return null;

        if (statusInfo.canContinue) {
            return (
                <Link href={`/exam-session/${userExam.id}`}>
                    <Button className="w-full">
                        <Play className="mr-2 h-4 w-4" />
                        {status === 'NOT_STARTED' ? 'Mulai Ujian' : 'Lanjutkan Ujian'}
                    </Button>
                </Link>
            );
        }

        // Completed states - show result link
        return (
            <Link href={`/results/${userExam.id}`}>
                <Button variant="outline" className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    Lihat Hasil
                </Button>
            </Link>
        );
    };

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                        <CardTitle className="text-lg line-clamp-1">{exam.title}</CardTitle>
                        {exam.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {exam.description}
                            </p>
                        )}
                    </div>
                    <Badge variant={statusInfo.variant} className="flex items-center gap-1 ml-2">
                        <StatusIcon className="h-3 w-3" />
                        {statusInfo.label}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Progress Section (for in-progress exams) */}
                {status === 'IN_PROGRESS' && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{answeredQuestions}/{totalQuestions} soal</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                    </div>
                )}

                {/* Score Section (for completed exams) */}
                {!statusInfo.canContinue && totalScore !== null && totalScore !== undefined && (
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span className="text-sm font-medium">Skor Akhir</span>
                        <span className="text-xl font-bold">{totalScore}</span>
                    </div>
                )}

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                    {/* Duration */}
                    <div className="flex items-center gap-2">
                        <Timer className="h-4 w-4 text-muted-foreground" />
                        <span>{exam.durationMinutes} menit</span>
                    </div>

                    {/* Questions Count */}
                    <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>{totalQuestions} soal</span>
                    </div>

                    {/* Remaining Time (for in-progress) */}
                    {status === 'IN_PROGRESS' && remainingTimeMs !== null && (
                        <div className="flex items-center gap-2 col-span-2">
                            <Clock className="h-4 w-4 text-orange-500" />
                            <span className="text-orange-600 font-medium">
                                Sisa: {formatRemainingTime(remainingTimeMs)}
                            </span>
                        </div>
                    )}

                    {/* Start Time (if available) */}
                    {startTime && (
                        <div className="flex items-center gap-2 col-span-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>
                                Dimulai: {format(new Date(startTime), 'PPp', { locale: localeId })}
                            </span>
                        </div>
                    )}

                    {/* Exam Schedule (if exam has startTime/endTime) */}
                    {exam.startTime && (
                        <div className="flex items-center gap-2 col-span-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>
                                Jadwal: {format(new Date(exam.startTime), 'PPP', { locale: localeId })}
                            </span>
                        </div>
                    )}
                </div>

                {/* Action Button */}
                {getActionButton()}
            </CardContent>
        </Card>
    );
}

export default UserExamCard;