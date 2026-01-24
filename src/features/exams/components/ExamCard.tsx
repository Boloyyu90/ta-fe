/**
 * Exam Card Component
 */

'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
    Clock,
    FileText,
    Calendar,
    Target,
    CheckCircle,
    XCircle,
    AlertTriangle,
} from 'lucide-react';
import type { Exam, ExamPublic } from '../types/exams.types';
import { isExamAvailable, getExamAvailabilityStatus, formatDuration } from '../types/exams.types';
import { PriceBadge } from '@/features/transactions';

// ============================================================================
// PROPS
// ============================================================================

export interface ExamCardProps {
    exam: Exam | ExamPublic;
    showActions?: boolean;
}

// ============================================================================
// AVAILABILITY CONFIG
// ============================================================================

const availabilityConfig = {
    available: {
        label: 'Tersedia',
        variant: 'default' as const,
        icon: CheckCircle,
        color: 'text-success',
    },
    upcoming: {
        label: 'Segera',
        variant: 'secondary' as const,
        icon: Clock,
        color: 'text-info',
    },
    ended: {
        label: 'Berakhir',
        variant: 'outline' as const,
        icon: XCircle,
        color: 'text-muted-foreground',
    },
    'no-questions': {
        label: 'Belum Ada Soal',
        variant: 'outline' as const,
        icon: AlertTriangle,
        color: 'text-warning',
    },
};

// ============================================================================
// COMPONENT
// ============================================================================

export function ExamCard({ exam, showActions = true }: ExamCardProps) {
    const availability = getExamAvailabilityStatus(exam);
    const availInfo = availabilityConfig[availability];
    const AvailIcon = availInfo.icon;
    const canStart = availability === 'available';

    // Question count from _count
    const questionCount = exam._count?.examQuestions ?? 0;

    return (
        <Card className="h-full hover:shadow-medium transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-lg line-clamp-2">
                        {exam.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 shrink-0">
                        <Badge variant={availInfo.variant}>
                            <AvailIcon className={`h-3 w-3 mr-1 ${availInfo.color}`} />
                            {availInfo.label}
                        </Badge>
                        <PriceBadge price={exam.price} />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Description */}
                {exam.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {exam.description}
                    </p>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    {/* Duration */}
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{formatDuration(exam.durationMinutes)}</span>
                    </div>

                    {/* Question Count */}
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <span>{questionCount} soal</span>
                    </div>

                    {/* Passing Score */}
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Target className="h-4 w-4" />
                        <span>Nilai Lulus: {exam.passingScore}</span>
                    </div>

                    {/* Schedule (if set) */}
                    {exam.startTime && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>
                                {format(new Date(exam.startTime), 'dd MMM', { locale: localeId })}
                            </span>
                        </div>
                    )}
                </div>

                {/* Time Window Info */}
                {(exam.startTime || exam.endTime) && (
                    <div className="text-xs text-muted-foreground border-t pt-3">
                        {exam.startTime && (
                            <p>Mulai: {format(new Date(exam.startTime), 'PPp', { locale: localeId })}</p>
                        )}
                        {exam.endTime && (
                            <p>Berakhir: {format(new Date(exam.endTime), 'PPp', { locale: localeId })}</p>
                        )}
                    </div>
                )}

                {/* Actions */}
                {showActions && (
                    <div className="pt-2">
                        {canStart ? (
                            <Button asChild className="w-full">
                                <Link href={`/exams/${exam.id}`}>
                                    Lihat Detail
                                </Link>
                            </Button>
                        ) : (
                            <Button variant="outline" className="w-full" disabled>
                                {availability === 'upcoming' ? 'Belum Dimulai' : 'Tidak Tersedia'}
                            </Button>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default ExamCard;