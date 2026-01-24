/**
 * Answer Review Card Component
 */

'use client';

import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { AnswerWithQuestion } from '../types/exam-sessions.types';
import type { QuestionType } from '@/shared/types/enum.types';

// ============================================================================
// PROPS
// ============================================================================

interface AnswerReviewCardProps {
    answer: AnswerWithQuestion;
    index: number;
    showCorrectAnswer?: boolean;
}

// ============================================================================
// CONFIG
// ============================================================================

const typeColors: Record<QuestionType, string> = {
    TIU: 'bg-primary/10 text-primary border-primary/20',
    TWK: 'bg-success/10 text-success border-success/20',
    TKP: 'bg-secondary/10 text-secondary border-secondary/20',
};

const typeLabels: Record<QuestionType, string> = {
    TIU: 'Tes Intelegensia Umum',
    TWK: 'Tes Wawasan Kebangsaan',
    TKP: 'Tes Karakteristik Pribadi',
};

// ============================================================================
// COMPONENT
// ============================================================================

export function AnswerReviewCard({
                                     answer,
                                     index,
                                     showCorrectAnswer = true
                                 }: AnswerReviewCardProps) {
    const {
        questionContent,
        options,
        questionType,
        selectedOption,
        correctAnswer,
        isCorrect,
        score,
        orderNumber,
    } = answer;

    // Use orderNumber if available, otherwise use index
    const displayNumber = orderNumber ?? index + 1;

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-6">
                {/* Header: Question Type & Status */}
                <div className="mb-4 flex items-start justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge className={typeColors[questionType]}>
                            {questionType}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                            {typeLabels[questionType]}
                        </span>
                    </div>

                    {/* Correctness Indicator */}
                    {selectedOption !== null && (
                        <div className="flex items-center gap-2">
                            {isCorrect ? (
                                <div className="flex items-center gap-1 rounded-full bg-success/10 px-3 py-1 text-sm font-medium text-success">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Benar
                                </div>
                            ) : (
                                <div className="flex items-center gap-1 rounded-full bg-destructive/10 px-3 py-1 text-sm font-medium text-destructive">
                                    <XCircle className="h-4 w-4" />
                                    Salah
                                </div>
                            )}
                        </div>
                    )}
                    {selectedOption === null && (
                        <Badge variant="outline" className="text-muted-foreground">
                            Tidak Dijawab
                        </Badge>
                    )}
                </div>

                {/* Question Number */}
                <div className="mb-3">
                    <span className="text-sm font-semibold text-muted-foreground">
                        Soal {displayNumber}
                    </span>
                </div>

                {/* Question Content */}
                <div className="mb-4">
                    <p className="text-base leading-relaxed">
                        {questionContent}
                    </p>
                </div>

                {/* Score Display */}
                <div className="mb-4 flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Skor:</span>
                    <span className={`font-semibold ${isCorrect ? 'text-success' : 'text-destructive'}`}>
                        {score}
                    </span>
                </div>

                {/* Answer Options */}
                <div className="space-y-2">
                    {(['A', 'B', 'C', 'D', 'E'] as const).map((optionKey) => {
                        const optionText = options[optionKey];
                        const isSelected = selectedOption === optionKey;
                        const isCorrectOption = showCorrectAnswer && correctAnswer === optionKey;

                        // Determine styling
                        let optionClass = 'border-border bg-muted';

                        if (isSelected && isCorrect) {
                            // Selected and correct
                            optionClass = 'border-success bg-success/10';
                        } else if (isSelected && !isCorrect) {
                            // Selected but wrong
                            optionClass = 'border-destructive bg-destructive/10';
                        } else if (isCorrectOption && showCorrectAnswer) {
                            // Not selected but is correct answer
                            optionClass = 'border-success/50 bg-success/5';
                        }

                        return (
                            <div
                                key={optionKey}
                                className={`flex items-start gap-3 rounded-lg border p-3 transition-colors ${optionClass}`}
                            >
                                <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-sm font-medium ${
                                    isSelected
                                        ? isCorrect
                                            ? 'border-success bg-success text-success-foreground'
                                            : 'border-destructive bg-destructive text-destructive-foreground'
                                        : isCorrectOption && showCorrectAnswer
                                            ? 'border-success text-success'
                                            : 'border-border text-muted-foreground'
                                }`}>
                                    {optionKey}
                                </div>
                                <span className="text-sm">{optionText}</span>

                                {/* Indicators */}
                                {isSelected && (
                                    <span className="ml-auto text-xs font-medium">
                                        {isCorrect ? '✓ Jawaban Anda' : '✗ Jawaban Anda'}
                                    </span>
                                )}
                                {!isSelected && isCorrectOption && showCorrectAnswer && (
                                    <span className="ml-auto text-xs font-medium text-success">
                                        ✓ Jawaban Benar
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

export default AnswerReviewCard;