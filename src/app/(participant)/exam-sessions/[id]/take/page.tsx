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

    const session = sessionData?.userExam;
    const questions = questionsData?.questions || [];
    const currentQuestion = questions[currentQuestionIndex];

    // Timer with auto-submit
    const timer = useTimer({
        startedAt: session?.startedAt || new Date().toISOString(),
        durationMinutes: session?.exam?.durationMinutes || 60,
        onExpire: () => {
            handleSubmitExam(true); // Auto-submit
        },
    });

    // Check if exam is already finished
    useEffect(() => {
        if (session?.status === 'FINISHED' || session?.status === 'CANCELLED') {
            router.push(`/results/${sessionId}`);
        }
    }, [session, sessionId, router]);

    // Handle answer selection
    const handleSelectAnswer = useCallback((option: 'A' | 'B' | 'C' | 'D' | 'E') => {
        if (!currentQuestion) return;

        const questionId = currentQuestion.questionId;

        // Update local state immediately
        setAnswers((prev) => ({
            ...prev,
            [questionId]: option,
        }));

        // Submit to backend (auto-save)
        submitAnswerMutation.mutate({
            questionId,
            selectedOption: option,
        });
    }, [currentQuestion, submitAnswerMutation]);

    // Handle exam submission
    const handleSubmitExam = useCallback((isAutoSubmit = false) => {
        const message = isAutoSubmit
            ? 'Time is up! Your exam will be submitted automatically.'
            : 'Are you sure you want to submit your exam? This action cannot be undone.';

        if (!isAutoSubmit && !confirm(message)) {
            return;
        }

        submitExamMutation.mutate();
    }, [submitExamMutation]);

    // Handle exam cancellation due to violations
    const handleExamCancelled = useCallback(() => {
        alert('Your exam has been cancelled due to excessive proctoring violations.');
        router.push('/dashboard');
    }, [router]);

    // Navigation handlers
    const goToNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const goToPreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const jumpToQuestion = (index: number) => {
        setCurrentQuestionIndex(index);
    };

    // Loading state
    if (sessionLoading || questionsLoading) {
        return (
            <div className="container mx-auto py-8 space-y-6">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-96" />
            </div>
        );
    }

    // No session or questions
    if (!session || questions.length === 0) {
        return (
            <div className="container mx-auto py-8">
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
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                                timer.remainingSeconds < 300 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Question Card */}
                    {currentQuestion && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        {currentQuestion.questionType}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        Question {currentQuestionIndex + 1}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Question Content */}
                                <div className="text-lg">
                                    {currentQuestion.content}
                                </div>

                                {/* Options */}
                                <div className="space-y-3">
                                    {(['A', 'B', 'C', 'D', 'E'] as const).map((option) => {
                                        const isSelected = answers[currentQuestion.questionId] === option;

                                        return (
                                            <button
                                                key={option}
                                                onClick={() => handleSelectAnswer(option)}
                                                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                                                    isSelected
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                                }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                                        isSelected
                                                            ? 'border-blue-500 bg-blue-500'
                                                            : 'border-gray-300'
                                                    }`}>
                                                        {isSelected && (
                                                            <CheckCircle2 className="h-4 w-4 text-white" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <span className="font-semibold mr-2">{option}.</span>
                                                        <span>{currentQuestion.options[option]}</span>
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Navigation */}
                                <div className="flex justify-between pt-4">
                                    <Button
                                        onClick={goToPreviousQuestion}
                                        disabled={currentQuestionIndex === 0}
                                        variant="outline"
                                    >
                                        <ChevronLeft className="h-4 w-4 mr-2" />
                                        Previous
                                    </Button>

                                    <Button
                                        onClick={goToNextQuestion}
                                        disabled={currentQuestionIndex === questions.length - 1}
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4 ml-2" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Proctoring Monitor */}
                    <ProctoringMonitor
                        sessionId={sessionId}
                        onExamCancelled={handleExamCancelled}
                        analyzeIntervalMs={10000} // 10 seconds
                        maxViolations={10}
                    />

                    {/* Question Navigator */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Question Navigator</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-5 gap-2">
                                {questions.map((q, index) => {
                                    const isAnswered = !!answers[q.questionId];
                                    const isCurrent = index === currentQuestionIndex;

                                    return (
                                        <button
                                            key={q.id}
                                            onClick={() => jumpToQuestion(index)}
                                            className={`aspect-square rounded-lg border-2 font-semibold transition-all ${
                                                isCurrent
                                                    ? 'border-blue-500 bg-blue-500 text-white'
                                                    : isAnswered
                                                        ? 'border-green-500 bg-green-50 text-green-700'
                                                        : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            {index + 1}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="mt-4 space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded border-2 border-green-500 bg-green-50" />
                                    <span>Answered</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded border-2 border-gray-200" />
                                    <span>Not answered</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded border-2 border-blue-500 bg-blue-500" />
                                    <span>Current</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}