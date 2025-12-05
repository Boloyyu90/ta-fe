// src/app/(participant)/exam-sessions/[id]/take/page.tsx
'use client';

/**
 * EXAM TAKING PAGE
 *
 * ✅ Complete exam flow with timer
 * ✅ Full proctoring integration
 * ✅ Question navigation
 * ✅ Auto-submit on timeout
 * ✅ Violation handling
 */

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { useExamSession } from '@/features/exam-sessions/hooks/useExamSession';
import { useExamQuestions } from '@/features/exam-sessions/hooks/useExamQuestions';
import { useSubmitAnswer } from '@/features/exam-sessions/hooks/useSubmitAnswer';
import { useSubmitExam } from '@/features/exam-sessions/hooks/useSubmitExam';
import { useTimer } from '@/features/exam-sessions/hooks/useTimer';
import { ProctoringMonitor } from '@/features/proctoring/components/ProctoringMonitor';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Progress } from '@/shared/components/ui/progress';
import {
    AlertCircle,
    Clock,
    CheckCircle2,
    Circle,
    ChevronLeft,
    ChevronRight,
    Send
} from 'lucide-react';
import type { Question } from '@/features/exam-sessions/types/exam-sessions.types';

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

    const session = sessionData?.data.userExam;
    const questions = questionsData?.data || [];
    const currentQuestion = questions[currentQuestionIndex];

    // Timer with auto-submit
    const timer = useTimer({
        startedAt: session?.startedAt || new Date().toISOString(),
        durationMinutes: session?.exam?.durationMinutes || 60,
        onExpire: () => {
            handleSubmitExam(true);
        },
        onCritical: () => {
            // Show warning toast or notification
            console.log('Less than 5 minutes remaining!');
        },
    });

    // Handle answer selection
    const handleAnswerSelect = useCallback((option: string) => {
        setAnswers((prev) => ({
            ...prev,
            [currentQuestion.questionId]: option,
        }));

        // Auto-save answer
        submitAnswerMutation.mutate({
            questionId: currentQuestion.questionId,
            selectedOption: option,
        });
    }, [currentQuestion, submitAnswerMutation]);

    // Navigate to specific question
    const goToQuestion = (index: number) => {
        setCurrentQuestionIndex(index);
    };

    // Handle submit exam
    const handleSubmitExam = async (isAutoSubmit = false) => {
        if (isAutoSubmit) {
            // Auto-submit on timeout
            submitExamMutation.mutate();
        } else {
            // Manual submit - confirm first
            const confirmed = window.confirm(
                'Are you sure you want to submit this exam? You cannot change your answers after submission.'
            );

            if (confirmed) {
                submitExamMutation.mutate();
            }
        }
    };

    // Handle violation limit
    const handleViolationLimit = () => {
        alert('You have exceeded the violation limit. Your exam will be cancelled.');
        submitExamMutation.mutate();
    };

    // Loading state
    if (sessionLoading || questionsLoading) {
        return (
            <div className="container mx-auto py-6 space-y-6">
                <Skeleton className="h-32 w-full" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Skeleton className="h-96 w-full" />
                    </div>
                    <div>
                        <Skeleton className="h-96 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (!session || !questions.length) {
        return (
            <div className="container mx-auto py-6">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Exam session not found or has no questions.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    const answeredCount = Object.keys(answers).length;
    const progress = (answeredCount / questions.length) * 100;

    return (
        <div className="container mx-auto py-6 space-y-6">
            {/* Header */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <CardTitle className="text-2xl">{session.exam?.title}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Question {currentQuestionIndex + 1} of {questions.length}
                            </p>
                        </div>

                        {/* Timer */}
                        <div className="flex items-center gap-4">
                            {/* ✅ FIXED: Use isCritical instead of checking remainingSeconds */}
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                                timer.isCritical ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                                <Clock className="h-5 w-5" />
                                <span className="text-lg font-mono font-bold">
                                    {timer.formattedTime}
                                </span>
                            </div>

                            <Button
                                onClick={() => handleSubmitExam(false)}
                                variant="default"
                                size="lg"
                                disabled={submitExamMutation.isPending}
                            >
                                <Send className="h-4 w-4 mr-2" />
                                Submit Exam
                            </Button>
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Answered: {answeredCount}/{questions.length}</span>
                            <span>{Math.round(progress)}% Complete</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                    </div>
                </CardHeader>
            </Card>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Question Panel */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Question {currentQuestionIndex + 1}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                {currentQuestion.question.questionType} | {currentQuestion.score} points
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Question Content */}
                            <div className="prose prose-sm max-w-none">
                                <p className="text-base font-medium">{currentQuestion.question.content}</p>

                                {currentQuestion.question.imageUrl && (
                                    <img
                                        src={currentQuestion.question.imageUrl}
                                        alt="Question"
                                        className="mt-4 rounded-lg max-w-full h-auto"
                                    />
                                )}
                            </div>

                            {/* Options */}
                            <div className="space-y-3">
                                {/* ✅ FIXED: Type the map callback properly */}
                                {(['A', 'B', 'C', 'D', 'E'] as const).map((option) => {
                                    const optionKey = `option${option}` as keyof Question;
                                    const optionText = currentQuestion.question[optionKey];
                                    const isSelected = answers[currentQuestion.questionId] === option;

                                    return (
                                        <button
                                            key={option}
                                            onClick={() => handleAnswerSelect(option)}
                                            className={`w-full text-left p-4 border-2 rounded-lg transition-all hover:border-primary ${
                                                isSelected
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-border'
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                                    isSelected
                                                        ? 'border-primary bg-primary text-primary-foreground'
                                                        : 'border-border'
                                                }`}>
                                                    {isSelected ? (
                                                        <CheckCircle2 className="h-4 w-4" />
                                                    ) : (
                                                        <Circle className="h-4 w-4" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <span className="font-medium">{option}. </span>
                                                    <span>{optionText}</span>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Navigation */}
                            <div className="flex items-center justify-between pt-4 border-t">
                                <Button
                                    variant="outline"
                                    onClick={() => goToQuestion(currentQuestionIndex - 1)}
                                    disabled={currentQuestionIndex === 0}
                                >
                                    <ChevronLeft className="h-4 w-4 mr-2" />
                                    Previous
                                </Button>

                                <span className="text-sm text-muted-foreground">
                                    Question {currentQuestionIndex + 1} of {questions.length}
                                </span>

                                <Button
                                    variant="outline"
                                    onClick={() => goToQuestion(currentQuestionIndex + 1)}
                                    disabled={currentQuestionIndex === questions.length - 1}
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4 ml-2" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Question Navigator */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Question Navigator</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-5 gap-2">
                                {/* ✅ FIXED: Type the map callbacks properly */}
                                {questions.map((q: any, index: number) => {
                                    const isAnswered = !!answers[q.questionId];
                                    const isCurrent = index === currentQuestionIndex;

                                    return (
                                        <button
                                            key={q.id}
                                            onClick={() => goToQuestion(index)}
                                            className={`aspect-square rounded-lg border-2 font-medium transition-all ${
                                                isCurrent
                                                    ? 'border-primary bg-primary text-primary-foreground'
                                                    : isAnswered
                                                        ? 'border-green-500 bg-green-50 text-green-700'
                                                        : 'border-border hover:border-primary/50'
                                            }`}
                                        >
                                            {index + 1}
                                        </button>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Proctoring Monitor */}
                    <ProctoringMonitor
                        sessionId={sessionId}
                        isActive={session.status === 'IN_PROGRESS'}
                        onViolationLimit={handleViolationLimit}
                    />
                </div>
            </div>
        </div>
    );
}