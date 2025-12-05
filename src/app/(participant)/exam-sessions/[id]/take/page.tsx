// src/app/(participant)/exam-sessions/[id]/take/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useExamSession } from '@/features/exam-sessions/hooks/useExamSession';
import { useExamQuestions } from '@/features/exam-sessions/hooks/useExamQuestions';
import { useSubmitAnswer } from '@/features/exam-sessions/hooks/useSubmitAnswer';
import { useSubmitExam } from '@/features/exam-sessions/hooks/useSubmitExam';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Button } from '@/shared/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { Label } from '@/shared/components/ui/label';

export default function TakeExamPage() {
    const params = useParams();
    const sessionId = parseInt(params.id as string);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string>('');

    const { data: sessionData, isLoading: isLoadingSession } = useExamSession(sessionId);
    const { data: questionsData, isLoading: isLoadingQuestions } = useExamQuestions(sessionId);
    const submitAnswerMutation = useSubmitAnswer(sessionId);
    const submitExamMutation = useSubmitExam(sessionId);

    if (isLoadingSession || isLoadingQuestions) {
        return <Skeleton className="h-96" />;
    }

    const session = sessionData?.userExam;
    const questions = questionsData?.questions || [];
    const currentQuestion = questions[currentQuestionIndex];

    if (!session || !currentQuestion) {
        return (
            <Alert variant="destructive">
                <AlertDescription>Session or questions not found</AlertDescription>
            </Alert>
        );
    }

    const handleSubmitAnswer = async () => {
        if (selectedAnswer) {
            await submitAnswerMutation.mutateAsync({
                questionId: currentQuestion.id,
                selectedOption: selectedAnswer,
            });
            setSelectedAnswer('');

            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            }
        }
    };

    const handleSubmitExam = async () => {
        await submitExamMutation.mutateAsync();
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Take Exam</h1>
            <div className="border p-6 rounded">
                <p className="font-medium mb-4">Question {currentQuestionIndex + 1} of {questions.length}</p>
                <p className="text-lg mb-4">{currentQuestion.content}</p>

                <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                    {Object.entries(currentQuestion.options).map(([key, value]) => (
                        <div key={key} className="flex items-center space-x-2 mb-2">
                            <RadioGroupItem value={key} id={key} />
                            <Label htmlFor={key}>{key}. {value}</Label>
                        </div>
                    ))}
                </RadioGroup>

                <div className="mt-6 flex gap-4">
                    <Button onClick={handleSubmitAnswer} disabled={!selectedAnswer}>
                        {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Last Question'}
                    </Button>
                    {currentQuestionIndex === questions.length - 1 && (
                        <Button onClick={handleSubmitExam} variant="default">
                            Submit Exam
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}