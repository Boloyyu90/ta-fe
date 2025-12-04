// src/features/exam-sessions/components/ExamHeader.tsx
'use client';

import { Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { Progress } from '@/shared/components/ui/progress';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';

interface ExamHeaderProps {
    examTitle: string;
    formattedTime: string;
    timeColor: string;
    isCritical: boolean;
    isExpired: boolean;
    progress: {
        answered: number;
        total: number;
        percentage: number;
    };
}

export function ExamHeader({
                               examTitle,
                               formattedTime,
                               timeColor,
                               isCritical,
                               isExpired,
                               progress,
                           }: ExamHeaderProps) {
    return (
        <div className="sticky top-0 z-40 bg-background border-b border-border">
            <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col gap-4">
                    {/* Title & Timer */}
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-bold text-foreground">{examTitle}</h1>

                        <div className={`flex items-center gap-2 text-lg font-mono ${timeColor}`}>
                            <Clock className="h-5 w-5" />
                            <span>{formattedTime}</span>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Progress: {progress.answered} / {progress.total} answered
              </span>
                            <span className="font-medium">{Math.round(progress.percentage)}%</span>
                        </div>
                        <Progress value={progress.percentage} className="h-2" />
                    </div>

                    {/* Warnings */}
                    {isCritical && !isExpired && (
                        <Alert variant="destructive" className="py-2">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription className="text-sm">
                                ⏰ Less than 5 minutes remaining!
                            </AlertDescription>
                        </Alert>
                    )}

                    {isExpired && (
                        <Alert variant="destructive" className="py-2">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription className="text-sm">
                                ⏰ Time expired! Please submit your exam.
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            </div>
        </div>
    );
}