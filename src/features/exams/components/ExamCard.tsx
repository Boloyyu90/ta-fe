// src/features/exams/components/ExamCard.tsx

/**
 * Exam Card Component
 *
 * ✅ AUDIT FIX v4: Accepts Exam type with optional _count field
 * Falls back to 0 if _count is not present
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
    Users,
    Play,
    CheckCircle,
    XCircle,
} from 'lucide-react';
import type { Exam } from '../types/exams.types';
import { isExamAvailable, getExamAvailabilityStatus } from '../types/exams.types';

export interface ExamCardProps {
    // ✅ FIX: Accept Exam type (with optional _count) instead of ExamWithCounts
    exam: Exam;
    showActions?: boolean;
    onStart?: (examId: number) => void;
    isStarting?: boolean;
}

export function ExamCard({ exam, showActions = true, onStart, isStarting }: ExamCardProps) {
    // ✅ FIX: Safely access _count with fallback to 0
    const questionCount = exam._count?.examQuestions ?? 0;
    const participantCount = exam._count?.userExams ?? 0;

    const availability = getExamAvailabilityStatus(exam);
    const canStart = isExamAvailable(exam);

    const getAvailabilityBadge = () => {
        const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
            available: 'default',
            upcoming: 'secondary',
            ended: 'destructive',
            inactive: 'outline',
        };

        const icons: Record<string, typeof CheckCircle> = {
            available: CheckCircle,
            upcoming: Clock,
            ended: XCircle,
            inactive: XCircle,
        };

        const Icon = icons[availability.status];

        return (
            <Badge variant={variants[availability.status]} className="flex items-center gap-1">
                <Icon className="h-3 w-3" />
                {availability.label}
            </Badge>
        );
    };

    const handleStart = () => {
        if (onStart && canStart) {
            onStart(exam.id);
        }
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
                    {getAvailabilityBadge()}
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                    {/* Duration */}
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{exam.durationMinutes} menit</span>
                    </div>

                    {/* Questions Count */}
                    <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>{questionCount} soal</span>
                    </div>

                    {/* Passing Score */}
                    <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        <span>Passing: {exam.passingScore}</span>
                    </div>

                    {/* Participants */}
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{participantCount} peserta</span>
                    </div>

                    {/* Schedule (if available) */}
                    {exam.startTime && (
                        <div className="flex items-center gap-2 col-span-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>
                                {format(new Date(exam.startTime), 'PPP', { locale: localeId })}
                                {exam.endTime && (
                                    <> - {format(new Date(exam.endTime), 'PPP', { locale: localeId })}</>
                                )}
                            </span>
                        </div>
                    )}
                </div>

                {/* Actions */}
                {showActions && (
                    <div className="flex gap-2">
                        <Link href={`/exams/${exam.id}`} className="flex-1">
                            <Button variant="outline" className="w-full">
                                Detail
                            </Button>
                        </Link>
                        {canStart && (
                            <Button
                                onClick={handleStart}
                                disabled={isStarting}
                                className="flex-1"
                            >
                                <Play className="mr-2 h-4 w-4" />
                                {isStarting ? 'Memulai...' : 'Mulai'}
                            </Button>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default ExamCard;