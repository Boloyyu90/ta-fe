// src/app/(participant)/exam-sessions/[id]/take/page.tsx

'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { examSessionsApi } from '@/features/exam-sessions/api/exam-sessions.api';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group'; // ✅ Now exists
import { Label } from '@/shared/components/ui/label';
import { toast } from 'sonner';
import { ProctoringMonitor } from '@/features/proctoring/components/ProctoringMonitor';

export default function TakeExamPage() {
    const params = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const sessionId = Number(params.id);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | 'E' | null>(null);

    const { data: questionsData, isLoading } = useQuery({
        queryKey: ['exam-questions', sessionId],
        queryFn: () => examSessionsApi.getExamQuestions(sessionId),
    });

    const submitAnswerMutation = useMutation({
        mutationFn: (data: { examQuestionId: number; selectedOption: 'A' | 'B' | 'C' | 'D' | 'E' | null }) =>
            examSessionsApi.submitAnswer(sessionId, data),
        onSuccess: () => {
            toast.success('Answer saved');
            queryClient.invalidateQueries({ queryKey: ['exam-answers', sessionId] });
        },
        onError: () => {
            toast.error('Failed to save answer');
        },
    });

    if (isLoading) {
        return <div className="flex justify-center p-8">Loading exam...</div>;
    }

    if (!questionsData || !questionsData.questions || questionsData.questions.length === 0) {
        return <div className="flex justify-center p-8">No questions available</div>;
    }

    const currentQuestion = questionsData.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questionsData.questions.length - 1;

    const handleSubmitAnswer = async () => {
        // ✅ FIXED: Use correct payload structure
        await submitAnswerMutation.mutateAsync({
            examQuestionId: currentQuestion.examQuestionId, // ✅ examQuestionId (not questionId)
            selectedOption, // ✅ selectedOption (not selectedAnswer)
        });

        if (isLastQuestion) {
            router.push(`/exam-sessions/${sessionId}/review`);
        } else {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(null);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Proctoring Monitor - Sidebar */}
                <div className="lg:col-span-1">
                    <ProctoringMonitor
                        sessionId={sessionId}
                        enabled={true}
                        captureInterval={5000}
                    />
                </div>

                {/* Question Card - Main Content */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Question {currentQuestionIndex + 1} of {questionsData.questions.length}
                            </CardTitle>
                        </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-lg">{currentQuestion.content}</p>

                    <RadioGroup value={selectedOption || ''} onValueChange={(value) => setSelectedOption(value as any)}>
                        {(['A', 'B', 'C', 'D', 'E'] as const).map((optionKey) => (
                            <div key={optionKey} className="flex items-center space-x-3 p-4 rounded-lg border">
                                <RadioGroupItem value={optionKey} id={`option-${optionKey}`} />
                                <Label htmlFor={`option-${optionKey}`} className="flex-1 cursor-pointer">
                                    <span className="font-semibold mr-2">{optionKey}.</span>
                                    {currentQuestion.options[optionKey]}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>

                    <div className="flex justify-between">
                        <Button
                            variant="outline"
                            onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                            disabled={currentQuestionIndex === 0}
                        >
                            Previous
                        </Button>

                        <Button
                            onClick={handleSubmitAnswer}
                            disabled={!selectedOption || submitAnswerMutation.isPending}
                        >
                            {submitAnswerMutation.isPending
                                ? 'Saving...'
                                : isLastQuestion
                                    ? 'Finish'
                                    : 'Next'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
                </div>
            </div>
        </div>
    );
}