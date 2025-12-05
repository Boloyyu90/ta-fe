// src/features/exam-sessions/components/AnswerOptions.tsx
import { cn } from '@/shared/lib/utils';
import type { ExamQuestion } from '../types/exam-sessions.types';

interface AnswerOptionsProps {
    question: ExamQuestion;
    selectedAnswer: string | null;
    onSelectAnswer: (option: 'A' | 'B' | 'C' | 'D' | 'E') => void;
    disabled?: boolean;
}

export function AnswerOptions({
                                  question,
                                  selectedAnswer,
                                  onSelectAnswer,
                                  disabled = false,
                              }: AnswerOptionsProps) {
    const options: Array<'A' | 'B' | 'C' | 'D' | 'E'> = ['A', 'B', 'C', 'D', 'E'];

    return (
        <div className="space-y-3">
            {options.map((optionKey) => {
                // ✅ Access nested question properties correctly
                const optionText = question.question[`option${optionKey}` as keyof typeof question.question];
                const isSelected = selectedAnswer === optionKey;

                return (
                    <button
                        key={optionKey}
                        type="button"
                        onClick={() => onSelectAnswer(optionKey)}
                        disabled={disabled}
                        className={cn(
                            'w-full p-4 text-left border-2 rounded-lg transition-all',
                            'hover:bg-accent hover:border-primary',
                            isSelected && 'bg-primary text-primary-foreground border-primary',
                            disabled && 'opacity-50 cursor-not-allowed'
                        )}
                    >
                        <div className="flex items-start gap-3">
                            <span className="font-bold">{optionKey}.</span>
                            <span>{optionText as string}</span>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}