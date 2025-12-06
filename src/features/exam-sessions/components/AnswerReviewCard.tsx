// src/features/exam-sessions/components/AnswerReviewCard.tsx

'use client';

import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { AnswerWithQuestion, QuestionType } from '../types/exam-sessions.types';

/**
 * AnswerReviewCard Component
 *
 * Displays a single answer with its associated question for review
 *
 * ⚠️ CRITICAL: Backend structure changed!
 * OLD: answer.questionContent, answer.options, answer.selectedAnswer, answer.score
 * NEW: answer.examQuestion.content, answer.examQuestion.options, answer.selectedOption, answer.isCorrect
 *
 * Backend contract (API page 22-23):
 * - AnswerWithQuestion.examQuestion: { id, examQuestionId, content, options, questionType, orderNumber, imageUrl? }
 * - AnswerWithQuestion.selectedOption: 'A' | 'B' | 'C' | 'D' | 'E' | null
 * - AnswerWithQuestion.isCorrect: boolean (no score field returned)
 */

interface AnswerReviewCardProps {
    answer: AnswerWithQuestion;
    showCorrectAnswer?: boolean;
}

// Type badge color mapping
const typeColors: Record<QuestionType, string> = {
    TIU: 'bg-blue-100 text-blue-800 border-blue-200',
    TWK: 'bg-green-100 text-green-800 border-green-200',
    TKP: 'bg-purple-100 text-purple-800 border-purple-200',
};

// Type labels for display
const typeLabels: Record<QuestionType, string> = {
    TIU: 'Tes Intelegensia Umum',
    TWK: 'Tes Wawasan Kebangsaan',
    TKP: 'Tes Karakteristik Pribadi',
};

export function AnswerReviewCard({ answer, showCorrectAnswer = true }: AnswerReviewCardProps) {
    /**
     * Extract data from nested examQuestion
     * ⚠️ All question data is in answer.examQuestion!
     */
    const { content, options, questionType, orderNumber, imageUrl } = answer.examQuestion;
    const { selectedOption, isCorrect } = answer;

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
                                <div className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Correct
                                </div>
                            ) : (
                                <div className="flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
                                    <XCircle className="h-4 w-4" />
                                    Incorrect
                                </div>
                            )}
                        </div>
                    )}
                    {selectedOption === null && (
                        <Badge variant="outline" className="text-muted-foreground">
                            Not Answered
                        </Badge>
                    )}
                </div>

                {/* Question Number */}
                <div className="mb-3">
                    <span className="text-sm font-semibold text-muted-foreground">
                        Question {orderNumber}
                    </span>
                </div>

                {/* Question Content */}
                <div className="mb-4">
                    <p className="text-base leading-relaxed">
                        {content}
                    </p>
                </div>

                {/* Question Image (if exists) */}
                {imageUrl && (
                    <div className="mb-4">
                        <img
                            src={imageUrl}
                            alt={`Question ${orderNumber} illustration`}
                            className="max-h-64 w-full rounded-lg border object-contain"
                        />
                    </div>
                )}

                {/* Answer Options */}
                <div className="space-y-2">
                    {(['A', 'B', 'C', 'D', 'E'] as const).map((optionKey) => {
                        const optionText = options[optionKey];
                        const isSelected = selectedOption === optionKey;
                        const isCorrectOption = showCorrectAnswer && answer.examQuestion.orderNumber > 0; // Note: correctAnswer not in examQuestion response

                        /**
                         * Styling logic:
                         * 1. Selected & Correct: Green background
                         * 2. Selected & Incorrect: Red background
                         * 3. Not selected: Default background
                         */
                        let optionClassName = 'flex items-start gap-3 rounded-lg border p-4 transition-colors';

                        if (isSelected) {
                            if (isCorrect) {
                                optionClassName += ' border-green-500 bg-green-50';
                            } else {
                                optionClassName += ' border-red-500 bg-red-50';
                            }
                        } else {
                            optionClassName += ' border-gray-200 bg-white';
                        }

                        return (
                            <div key={optionKey} className={optionClassName}>
                                <div className="flex items-center">
                                    {/* Option Label */}
                                    <div
                                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 font-semibold ${
                                            isSelected
                                                ? isCorrect
                                                    ? 'border-green-600 bg-green-600 text-white'
                                                    : 'border-red-600 bg-red-600 text-white'
                                                : 'border-gray-300 bg-white text-gray-700'
                                        }`}
                                    >
                                        {optionKey}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm leading-relaxed">{optionText}</p>
                                </div>
                                {/* Show status icon for selected answer */}
                                {isSelected && (
                                    <div className="flex items-center">
                                        {isCorrect ? (
                                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                                        ) : (
                                            <XCircle className="h-5 w-5 text-red-600" />
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Explanation or Note */}
                {!selectedOption && (
                    <div className="mt-4 rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
                        You did not answer this question.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}