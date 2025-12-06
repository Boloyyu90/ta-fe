import Image from 'next/image';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent } from '@/shared/components/ui/card';
import type { ExamQuestion } from '../types/exam-sessions.types';

interface QuestionDisplayProps {
    question: ExamQuestion;
    questionNumber: number;
}

/**
 * Displays a single exam question with its content and image
 *
 * CRITICAL: ExamQuestion structure is:
 * {
 *   id, examQuestionId, content, options: { A, B, C, D, E },
 *   questionType, orderNumber, imageUrl
 * }
 *
 * NOT: { question: { content, optionA, ... } }
 */
export function QuestionDisplay({ question, questionNumber }: QuestionDisplayProps) {
    // Type color mapping
    const typeColors: Record<'TIU' | 'TWK' | 'TKP', string> = {
        TIU: 'bg-blue-100 text-blue-800',
        TWK: 'bg-green-100 text-green-800',
        TKP: 'bg-purple-100 text-purple-800',
    };

    return (
        <Card className="mb-6">
            <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold">
                        Soal {questionNumber}
                    </h3>
                    {/* Access questionType directly, not question.question.questionType */}
                    <Badge className={typeColors[question.questionType]}>
                        {question.questionType}
                    </Badge>
                </div>

                <div className="space-y-4">
                    {/* Access content directly */}
                    <p className="text-base">{question.content}</p>

                    {/* Access imageUrl directly */}
                    {question.imageUrl && (
                        <div className="relative w-full h-64">
                            <Image
                                src={question.imageUrl}
                                alt="Question illustration"
                                fill
                                className="object-contain rounded-md"
                            />
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}