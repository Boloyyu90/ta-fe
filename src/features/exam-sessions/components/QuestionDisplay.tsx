// src/features/exam-sessions/components/QuestionDisplay.tsx
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import type { ExamQuestion } from '../types/exam-sessions.types';

interface QuestionDisplayProps {
    question: ExamQuestion;
    questionNumber: number;
}

export function QuestionDisplay({ question, questionNumber }: QuestionDisplayProps) {
    const typeColors = {
        TIU: 'bg-blue-100 text-blue-800',
        TWK: 'bg-green-100 text-green-800',
        TKP: 'bg-purple-100 text-purple-800',
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Question {questionNumber}</h3>
                    {/* ✅ Access nested question.question.questionType */}
                    <Badge className={typeColors[question.question.questionType]}>
                        {question.question.questionType}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="prose max-w-none">
                    {/* ✅ Access nested question.question.content */}
                    <p className="text-base">{question.question.content}</p>

                    {question.question.imageUrl && (
                        <img
                            src={question.question.imageUrl}
                            alt="Question illustration"
                            className="mt-4 max-w-full rounded-lg"
                        />
                    )}
                </div>
            </CardContent>
        </Card>
    );
}