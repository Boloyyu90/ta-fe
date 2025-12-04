// src/features/exams/components/ExamCard.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Clock, BookOpen, Calendar, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import type { Exam } from '../types/exams.types';

interface ExamCardProps {
    exam: Exam;
}

export function ExamCard({ exam }: ExamCardProps) {
    const router = useRouter();

    const hasSchedule = exam.startTime && exam.endTime;
    const questionCount = exam._count?.examQuestions || 0;

    // Check if exam is currently available
    const now = new Date();
    const isAvailable = exam.isActive && (!hasSchedule || (
        new Date(exam.startTime!) <= now && new Date(exam.endTime!) >= now
    ));

    const handleViewDetails = () => {
        router.push(`/exams/${exam.id}`);
    };

    return (
        <Card className="hover:shadow-lg transition-all duration-200 hover:border-primary/50">
            <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">
                            {exam.title}
                        </h3>
                        {exam.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {exam.description}
                            </p>
                        )}
                    </div>

                    {isAvailable ? (
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400 ml-2 flex-shrink-0">
                            Available
                        </Badge>
                    ) : !exam.isActive ? (
                        <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-400 ml-2 flex-shrink-0">
                            Inactive
                        </Badge>
                    ) : (
                        <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400 ml-2 flex-shrink-0">
                            Scheduled
                        </Badge>
                    )}
                </div>

                {/* Exam Info */}
                <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <BookOpen className="h-4 w-4" />
                        <span>
              {questionCount} {questionCount === 1 ? 'Question' : 'Questions'}
            </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{exam.durationMinutes} minutes</span>
                    </div>

                    {hasSchedule && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>
                {new Date(exam.startTime!).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                })}
                                {' - '}
                                {new Date(exam.endTime!).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                })}
              </span>
                        </div>
                    )}
                </div>
            </CardContent>

            <CardFooter className="p-6 pt-0">
                <Button
                    className="w-full"
                    onClick={handleViewDetails}
                    disabled={!exam.isActive}
                >
                    View Details
                    <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
            </CardFooter>
        </Card>
    );
}