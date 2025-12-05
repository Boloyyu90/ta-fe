// src/features/exams/components/ExamCard.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Calendar, Clock, FileQuestion, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import type { Exam } from '../types/exams.types';

interface ExamCardProps {
    exam: Exam;
}

export function ExamCard({ exam }: ExamCardProps) {
    const router = useRouter();

    const hasSchedule = exam.startTime && exam.endTime;
    const isAvailable = exam.isActive && (!hasSchedule || (
        new Date() >= new Date(exam.startTime!) &&
        new Date() <= new Date(exam.endTime!)
    ));

    const questionCount = exam._count?.examQuestions || 0;

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <CardTitle className="text-xl">{exam.title}</CardTitle>
                    {isAvailable ? (
                        <Badge className="bg-green-100 text-green-700">
                            Available
                        </Badge>
                    ) : !exam.isActive ? (
                        <Badge variant="secondary">
                            Inactive
                        </Badge>
                    ) : (
                        <Badge variant="secondary">
                            Scheduled
                        </Badge>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-3">
                {exam.description && (
                    <p className="text-muted-foreground text-sm line-clamp-2">
                        {exam.description}
                    </p>
                )}

                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{exam.durationMinutes} minutes</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileQuestion className="h-4 w-4" />
                        <span>{questionCount} questions</span>
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
                            </span>
                        </div>
                    )}
                </div>
            </CardContent>

            <CardFooter>
                <Button
                    className="w-full"
                    onClick={() => router.push(`/exams/${exam.id}`)}
                    disabled={!exam.isActive}
                >
                    View Details
                    <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
            </CardFooter>
        </Card>
    );
}