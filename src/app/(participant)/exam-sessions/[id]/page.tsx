'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { useExamSession } from '@/features/exam-sessions/hooks/useExamSession';
import { useExamQuestions } from '@/features/exam-sessions/hooks/useExamQuestions';
import { useSubmitAnswer } from '@/features/exam-sessions/hooks/useSubmitAnswer';
import { useSubmitExam } from '@/features/exam-sessions/hooks/useSubmitExam';
import {
    ExamHeader,
    QuestionDisplay,
    AnswerOptions,
    QuestionNavigation,
} from '@/features/exam-sessions/components';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Button } from '@/shared/components/ui/button';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function ExamSessionPage() {
    const router = useRouter();
    const params = useParams();
    const sessionId = Number(params.id);

    // Data fetching
    const {
        data: sessionData,
        isLoading: sessionLoading,
        error: sessionError,
    } = useExamSession(sessionId);

    const {
        data: questionsData,
        isLoading: questionsLoading,
        error: questionsError,
    } = useExamQuestions(sessionId);

    // Mutations
    const submitAnswer = useSubmitAnswer(sessionId);
    const submitExam = useSubmitExam(sessionId);

    // Local UI state
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D' | 'E'>>({});
    const [remainingMs, setRemainingMs] = useState<number>(0);

    // Extract data
    const userExam = sessionData;
    const questions = questionsData?.questions || [];
    const currentQuestion = questions[currentQuestionIndex];

    // Initialize timer from backend's remainingTimeMs
    useEffect(() => {
        if (userExam?.remainingTimeMs !== null && userExam?.remainingTimeMs !== undefined) {
            setRemainingMs(userExam.remainingTimeMs);
        }
    }, [userExam?.remainingTimeMs]);

    // Countdown timer
    useEffect(() => {
        if (remainingMs <= 0) {
            // Auto-submit when time expires
            handleSubmitExam(true);
            return;
        }

        const interval = setInterval(() => {
            setRemainingMs((prev) => Math.max(0, prev - 1000));
        }, 1000);

        return () => clearInterval(interval);
    }, [remainingMs]);

    // Format time for display
    const formatTime = (ms: number): string => {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (hours > 0) {
            return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
        return `${minutes}:${String(seconds).padStart(2, '0')}`;
    };

    // Determine time color and critical state
    const isCritical = remainingMs < 5 * 60 * 1000; // Less than 5 minutes
    const isExpired = remainingMs <= 0;
    const timeColor = isExpired ? 'text-red-600' : isCritical ? 'text-orange-600' : 'text-foreground';

    // Calculate progress
    const answeredCount = Object.keys(selectedAnswers).length;
    const progress = {
        answered: answeredCount,
        total: questions.length,
        percentage: questions.length > 0 ? (answeredCount / questions.length) * 100 : 0,
    };

    // Handle answer selection
    const handleAnswerChange = useCallback(
        (answer: 'A' | 'B' | 'C' | 'D' | 'E') => {
            if (!currentQuestion) return;

            // Update local state immediately for UI responsiveness
            setSelectedAnswers((prev) => ({
                ...prev,
                [currentQuestion.examQuestionId]: answer,
            }));

            // Submit to backend (auto-save)
            submitAnswer.mutate({
                examQuestionId: currentQuestion.examQuestionId,
                selectedOption: answer,
            });
        },
        [currentQuestion, submitAnswer]
    );

    // Navigation handlers
    const handleNavigate = useCallback((index: number) => {
        setCurrentQuestionIndex(index);
    }, []);

    const goToNext = useCallback(() => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        }
    }, [currentQuestionIndex, questions.length]);

    const goToPrevious = useCallback(() => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1);
        }
    }, [currentQuestionIndex]);

    const canGoPrevious = currentQuestionIndex > 0;
    const canGoNext = currentQuestionIndex < questions.length - 1;

    // Submit exam handler
    const handleSubmitExam = useCallback(
        (isAutoSubmit = false) => {
            const unansweredCount = questions.length - answeredCount;

            if (!isAutoSubmit) {
                let confirmMessage = 'Are you sure you want to submit this exam?';
                if (unansweredCount > 0) {
                    confirmMessage += `\n\nYou have ${unansweredCount} unanswered question${
                        unansweredCount > 1 ? 's' : ''
                    }.`;
                }
                confirmMessage += '\n\nYou cannot change your answers after submission.';

                if (!window.confirm(confirmMessage)) {
                    return;
                }
            }

            submitExam.mutate(undefined, {
                onSuccess: (response) => {
                    // Redirect to results page
                    router.push(`/results/${response.result.id}`);
                },
                onError: (error) => {
                    console.error('Failed to submit exam:', error);
                    alert('Failed to submit exam. Please try again.');
                },
            });
        },
        [questions.length, answeredCount, submitExam, router]
    );

    // Convert selectedAnswers map to Set for QuestionNavigation
    const answeredQuestionsSet = new Set(
        Object.keys(selectedAnswers).map(Number)
    );

    // Loading states
    if (sessionLoading || questionsLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    <p className="text-muted-foreground">Loading exam...</p>
                </div>
            </div>
        );
    }

    // Error states
    if (sessionError || questionsError) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Alert variant="destructive" className="max-w-md">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        {sessionError?.message || questionsError?.message || 'Failed to load exam'}
                    </AlertDescription>
                    <Button variant="outline" className="mt-4" onClick={() => router.push('/dashboard')}>
                        Return to Dashboard
                    </Button>
                </Alert>
            </div>
        );
    }

    // Data validation
    if (!userExam || questions.length === 0) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Alert variant="destructive" className="max-w-md">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Exam session not found or has no questions. Please contact your administrator.
                    </AlertDescription>
                    <Button variant="outline" className="mt-4" onClick={() => router.push('/dashboard')}>
                        Return to Dashboard
                    </Button>
                </Alert>
            </div>
        );
    }

    // Check if exam is already finished
    if (userExam.status === 'FINISHED' || userExam.status === 'TIMEOUT') {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Alert className="max-w-md">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        This exam has already been submitted. You can view your results.
                    </AlertDescription>
                    <Button
                        variant="default"
                        className="mt-4"
                        onClick={() => router.push(`/results/${userExam.id}`)}
                    >
                        View Results
                    </Button>
                </Alert>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Exam Header with Timer - Props match actual ExamHeaderProps */}
            <ExamHeader
                examTitle={userExam.exam.title}
                formattedTime={formatTime(remainingMs)}
                timeColor={timeColor}
                isCritical={isCritical}
                isExpired={isExpired}
                progress={progress}
            />

            <div className="container max-w-4xl mx-auto py-8 px-4 space-y-6">
                {/* Question Display - Props match actual QuestionDisplayProps */}
                <QuestionDisplay
                    question={currentQuestion}
                    questionNumber={currentQuestionIndex + 1}
                />

                {/* Answer Options - Props match actual AnswerOptionsProps */}
                <AnswerOptions
                    question={currentQuestion}
                    selectedAnswer={selectedAnswers[currentQuestion.examQuestionId] || null}
                    onAnswerChange={handleAnswerChange}
                    disabled={submitAnswer.isPending}
                />

                {/* Submission feedback */}
                {submitAnswer.isError && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            Failed to save answer. Please try again.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Question Navigation - Props match actual QuestionNavigationProps */}
                <QuestionNavigation
                    currentIndex={currentQuestionIndex}
                    totalQuestions={questions.length}
                    answeredQuestions={answeredQuestionsSet}
                    questions={questions}
                    onNavigate={handleNavigate}
                    onPrevious={goToPrevious}
                    onNext={goToNext}
                    canGoPrevious={canGoPrevious}
                    canGoNext={canGoNext}
                />

                {/* Submit Exam Section */}
                <div className="bg-card border rounded-lg p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-lg">Ready to Submit?</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                {answeredCount} of {questions.length} questions answered (
                                {Math.round(progress.percentage)}%)
                            </p>
                        </div>
                        <Button
                            size="lg"
                            onClick={() => handleSubmitExam(false)}
                            disabled={submitExam.isPending || isExpired}
                            className="min-w-[120px]"
                        >
                            {submitExam.isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                'Submit Exam'
                            )}
                        </Button>
                    </div>

                    {answeredCount < questions.length && (
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                You have {questions.length - answeredCount} unanswered question
                                {questions.length - answeredCount > 1 ? 's' : ''}. You can still
                                submit, but unanswered questions will be marked as incorrect.
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            </div>
        </div>
    );
}