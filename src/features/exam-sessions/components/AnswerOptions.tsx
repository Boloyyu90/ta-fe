import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { Label } from '@/shared/components/ui/label';
import type { ExamQuestion } from '../types/exam-sessions.types';

interface AnswerOptionsProps {
    question: ExamQuestion;
    selectedAnswer?: 'A' | 'B' | 'C' | 'D' | 'E';
    onAnswerChange: (answer: 'A' | 'B' | 'C' | 'D' | 'E') => void;
    disabled?: boolean;
}

/**
 * Displays answer options for a question
 *
 * CRITICAL: Options structure is:
 * question.options = { A: "text", B: "text", ... }
 *
 * NOT: question.question.optionA
 */
export function AnswerOptions({
                                  question,
                                  selectedAnswer,
                                  onAnswerChange,
                                  disabled = false,
                              }: AnswerOptionsProps) {
    const optionKeys: ('A' | 'B' | 'C' | 'D' | 'E')[] = ['A', 'B', 'C', 'D', 'E'];

    return (
        <RadioGroup
            value={selectedAnswer}
            onValueChange={(value) => onAnswerChange(value as 'A' | 'B' | 'C' | 'D' | 'E')}
            disabled={disabled}
            className="space-y-3"
        >
            {optionKeys.map((optionKey) => {
                // Access via question.options.A (not question.question.optionA)
                const optionText = question.options[optionKey];

                return (
                    <div
                        key={optionKey}
                        className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-gray-50"
                    >
                        <RadioGroupItem value={optionKey} id={`option-${optionKey}`} />
                        <Label
                            htmlFor={`option-${optionKey}`}
                            className="flex-1 cursor-pointer font-normal"
                        >
                            <span className="font-semibold mr-2">{optionKey}.</span>
                            {optionText}
                        </Label>
                    </div>
                );
            })}
        </RadioGroup>
    );
}