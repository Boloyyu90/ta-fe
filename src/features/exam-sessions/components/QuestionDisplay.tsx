// src/features/exam-sessions/components/QuestionDisplay.tsx
'use client';

import { Badge } from '@/shared/components/ui/badge';
import type { ExamQuestion } from '../types/exam-sessions.types';

interface QuestionDisplayProps {
    question: ExamQuestion;
    questionNumber: number;
    totalQuestions: number;
}

export function QuestionDisplay({ question, questionNumber, totalQuestions }: QuestionDisplayProps) {
    const typeColors = {
        TIU: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
        TWK: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
        TKP: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400',
    };

    return (
        <div className="space-y-4">
            {/* Question Header */}
            <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-sm">
                    Question {questionNumber} of {totalQuestions}
                </Badge>
                <Badge className={typeColors[question.questionType]}>
                    {question.questionType}
                </Badge>
            </div>

            {/* Question Content */}
            <div className="p-6 rounded-lg border border-border bg-card">
                <p className="text-base leading-relaxed text-card-foreground whitespace-pre-wrap">
                    {question.content}
                </p>
            </div>
        </div>
    );
}