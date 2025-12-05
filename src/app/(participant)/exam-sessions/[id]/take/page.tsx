// src/app/(participant)/exam-sessions/[id]/take/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useExamSession } from '@/features/exam-sessions/hooks/useExamSession';
import { useExamQuestions } from '@/features/exam-sessions/hooks/useExamQuestions';
import { useSubmitAnswer } from '@/features/exam-sessions/hooks/useSubmitAnswer';
import { useSubmitExam } from '@/features/exam-sessions/hooks/useSubmitExam';
import { useTimer } from '@/features/exam-sessions/hooks/useTimer';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { AlertCircle, Clock } from 'lucide-react';
import {
    ExamHeader,
    QuestionDisplay,
    AnswerOptions,
    QuestionNavigation,
} from '@/features/exam-sessions/components';
import { ProctoringMonitor } from '@/features/proctoring/components/ProctoringMonitor';

export default function TakeExamPage() {
    const params = useParams();
    const router = useRouter();
    const sessionId = parseInt(params.id as string);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});

    const { data: sessionData, isLoading: sessionLoading } = useExamSession(sessionId);
    const { data: questionsData, isLoading: questionsLoading } = useExamQuestions(sessionId);
    const submitAnswerMutation = useSubmitAnswer(sessionId);
    const submitExamMutation = useSubmitExam(sessionId);

    const session = sessionData?.data?.userExam;
    const questions = questionsData?.data || [];
    const currentQuestion = questions[currentQuestionIndex];

    // Timer
    const timer = useTimer({
        startedAt: session?.startedAt || new Date().toISOString(),
        durationMinutes: session?.exam?.durationMinutes || 60,
        onExpire: () => {
            handleSubmitExam();
        },
    });

    const handleSelectAnswer = (option: 'A' | 'B' | 'C' | 'D' | 'E') => {
        if (!currentQuestion) return;

        const examQuestionId = currentQuestion.id;
        const questionId = currentQuestion.questionId;

        // Update local state
        setAnswers((prev) => ({
            ...prev,
            [examQuestionId]: option,
        }));

        // Submit to backend
        submitAnswerMutation.mutate({
            questionId,
            selectedOption: option,
        });
    };

    const handleSubmitExam = () => {
        if (confirm('Are you sure you want to submit your exam?')) {
            submitExamMutation.mutate();
        }
    };

    const handleExamCancelled = () => {
        alert('Your exam has been cancelled due to proctoring violations.');
        router.push('/exam-sessions');
    };

    if (sessionLoading || questionsLoading) {
        return (
            <div className="min-h-screen bg-background">
                <Skeleton className="h-24 w-full" />
                <div className="container mx-auto py-8">
                    <Skeleton className="h-96" />
                </div>
            </div>
        );
    }

    if (!session || !currentQuestion) {
        return (
            <div className="container mx-auto py-8">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Failed to load exam session. Please try again.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    const progress = {
        answered: Object.keys(answers).length,
        total: questions.length,
        percentage: (Object.keys(answers).length / questions.length) * 100,
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header with Timer */}
            <ExamHeader
                examTitle={session.exam.title}
                formattedTime={timer.formattedTime}
                timeColor={timer.timeColor}
                isCritical={timer.isCritical}
                isExpired={timer.isExpired}
                progress={progress}
            />

            <div className="container mx-auto py-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Question */}
                        <QuestionDisplay
                            question={currentQuestion}
                            questionNumber={currentQuestionIndex + 1}
                        />

                        {/* Answer Options */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Select Your Answer</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <AnswerOptions
                                    question={currentQuestion}
                                    selectedAnswer={answers[currentQuestion.id] || null}
                                    onSelectAnswer={handleSelectAnswer}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar - Proctoring */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-6">
                            <CardHeader>
                                <CardTitle className="text-sm">Proctoring</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ProctoringMonitor
                                    sessionId={sessionId}
                                    onExamCancelled={handleExamCancelled}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Navigation Footer */}
            <QuestionNavigation
                currentIndex={currentQuestionIndex}
                totalQuestions={questions.length}
                answeredQuestions={new Set(Object.keys(answers).map(Number))}
                questions={questions.map((q) => ({ examQuestionId: q.id }))}
                onNavigate={setCurrentQuestionIndex}
                onPrevious={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                onNext={() =>
                    setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1))
                }
                canGoPrevious={currentQuestionIndex > 0}
                canGoNext={currentQuestionIndex < questions.length - 1}
            />

            {/* Submit Button */}
            <div className="fixed bottom-20 right-6">
                <Button
                    size="lg"
                    onClick={handleSubmitExam}
                    disabled={submitExamMutation.isPending}
                >
                    {submitExamMutation.isPending ? 'Submitting...' : 'Submit Exam'}
                </Button>
            </div>
        </div>
    );
}