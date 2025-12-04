// src/features/exam-sessions/components/AnswerOptions.tsx
'use client';

import { Button } from '@/shared/components/ui/button';
import { CheckCircle, Circle } from 'lucide-react';
import type { ExamQuestion } from '../types/exam-sessions.types';

interface AnswerOptionsProps {
    question: ExamQuestion;
    selectedOption: string | null;
    onSelectOption: (option: string) => void;
    disabled?: boolean;
}

export function AnswerOptions({
                                  question,
                                  selectedOption,
                                  onSelectOption,
                                  disabled = false,
                              }: AnswerOptionsProps) {
    const options = ['A', 'B', 'C', 'D', 'E'] as const;

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Select your answer:</h3>

            {options.map((optionKey) => {
                const isSelected = selectedOption === optionKey;
                const optionText = question.options[optionKey];

                return (
                    <button
                        key={optionKey}
                        onClick={() => onSelectOption(optionKey)}
                        disabled={disabled}
                        className={`
              w-full p-4 rounded-lg border-2 text-left transition-all
              flex items-start gap-3
              ${
                            isSelected
                                ? 'border-primary bg-primary/5 shadow-sm'
                                : 'border-border hover:border-primary/50 hover:bg-muted/50'
                        }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
                    >
                        <div className="flex-shrink-0 mt-0.5">
                            {isSelected ? (
                                <CheckCircle className="h-5 w-5 text-primary" />
                            ) : (
                                <Circle className="h-5 w-5 text-muted-foreground" />
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm">{optionKey}.</span>
                            </div>
                            <p className="text-sm text-foreground">{optionText}</p>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}