// src/features/exam-sessions/components/AnswerReviewCard.tsx
'use client';

import { CheckCircle, XCircle, Circle } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import type { AnswerWithQuestion, QuestionType } from '../types/exam-sessions.types';

interface AnswerReviewCardProps {
    answer: AnswerWithQuestion;
    questionNumber: number;
}

export function AnswerReviewCard({ answer, questionNumber }: AnswerReviewCardProps) {
    const typeColors: Record<QuestionType, string> = {
        TIU: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
        TWK: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
        TKP: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400',
    };

    const options: Array<'A' | 'B' | 'C' | 'D' | 'E'> = ['A', 'B', 'C', 'D', 'E'];

    return (
        <div className="p-6 rounded-lg border border-border bg-card">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <Badge variant="outline">Question {questionNumber}</Badge>
                    <Badge className={typeColors[answer.questionType]}>
                        {answer.questionType}
                    </Badge>
                </div>

                <div className="flex items-center gap-2">
                    {answer.isCorrect ? (
                        <>
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <span className="text-sm font-semibold text-green-600">
                                +{answer.score} points
                            </span>
                        </>
                    ) : answer.selectedOption ? (
                        <>
                            <XCircle className="h-5 w-5 text-red-600" />
                            <span className="text-sm font-semibold text-red-600">
                                0 points
                            </span>
                        </>
                    ) : (
                        <>
                            <Circle className="h-5 w-5 text-muted-foreground" />
                            <span className="text-sm font-semibold text-muted-foreground">
                                Not answered
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Question Content */}
            <div className="mb-4">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                    {answer.questionContent}
                </p>
            </div>

            {/* Answer Options */}
            <div className="space-y-2">
                {options.map((optionKey) => {
                    const optionText = answer.options[optionKey];
                    const isCorrectAnswer = answer.correctAnswer === optionKey;
                    const isUserAnswer = answer.selectedOption === optionKey;

                    let statusIcon = <Circle className="h-5 w-5 text-muted-foreground" />;
                    let borderClass = 'border-border';
                    let bgClass = 'bg-card';

                    if (isCorrectAnswer) {
                        statusIcon = <CheckCircle className="h-5 w-5 text-green-600" />;
                        borderClass = 'border-green-500';
                        bgClass = 'bg-green-50 dark:bg-green-950/30';
                    } else if (isUserAnswer && !isCorrectAnswer) {
                        statusIcon = <XCircle className="h-5 w-5 text-red-600" />;
                        borderClass = 'border-red-500';
                        bgClass = 'bg-red-50 dark:bg-red-950/30';
                    }

                    return (
                        <div
                            key={optionKey}
                            className={`p-3 rounded-lg border-2 ${borderClass} ${bgClass} flex items-start gap-3`}
                        >
                            <div className="flex-shrink-0 mt-0.5">{statusIcon}</div>

                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-sm">{optionKey}.</span>
                                    {isCorrectAnswer && (
                                        <Badge variant="outline" className="text-xs border-green-500 text-green-700">
                                            Correct Answer
                                        </Badge>
                                    )}
                                    {isUserAnswer && !isCorrectAnswer && (
                                        <Badge variant="outline" className="text-xs border-red-500 text-red-700">
                                            Your Answer
                                        </Badge>
                                    )}
                                    {isUserAnswer && isCorrectAnswer && (
                                        <Badge variant="outline" className="text-xs border-green-500 text-green-700">
                                            Your Answer (Correct)
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-sm text-foreground">{optionText}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* User didn't answer */}
            {!answer.selectedOption && (
                <div className="mt-4 p-3 rounded-lg bg-muted border border-border">
                    <p className="text-sm text-muted-foreground italic">
                        You did not answer this question.
                    </p>
                </div>
            )}
        </div>
    );
}