// src/app/(participant)/exam-sessions/[id]/take/page.tsx
'use client';

import { use, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Send } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
import { toast } from 'sonner';

// Feature imports
import { useExamSession, useExamQuestions, useSubmitAnswer, useSubmitExam } from '@/features/exam-sessions/hooks';
import { useTimer } from '@/features/exam-sessions/hooks/useTimer';
import { ExamHeader } from '@/features/exam-sessions/components/ExamHeader';
import { QuestionDisplay } from '@/features/exam-sessions/components/QuestionDisplay';
import { AnswerOptions } from '@/features/exam-sessions/components/AnswerOptions';
import { QuestionNavigation } from '@/features/exam-sessions/components/QuestionNavigation';
import { ProctoringMonitor } from '@/features/proctoring/components/ProctoringMonitor';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function ExamTakingPage({ params }: PageProps) {
    const resolvedParams = use(params);
    const sessionId = parseInt(resolvedParams.id);
    const router = useRouter();

    // State
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Map<number, string>>(new Map());
    const [showSubmitDialog, setShowSubmitDialog] = useState(false);

    // Queries
    const { data: sessionData, isLoading: isLoadingSession } = useExamSession(sessionId);
    const { data: questionsData, isLoading: isLoadingQuestions } = useExamQuestions(sessionId);

    // Mutations
    const { mutate: submitAnswer, isPending: isSubmittingAnswer } = useSubmitAnswer(sessionId);
    const { mutate: submitExam, isPending: isSubmittingExam } = useSubmitExam(sessionId);

    const session = sessionData?.userExam;
    const questions = questionsData?.questions || [];
    const currentQuestion = questions[currentQuestionIndex];

    // Timer
    const { formattedTime, isCritical, isExpired, timeColor } = useTimer({
        startedAt: session?.startedAt || new Date().toISOString(),
        durationMinutes: session?.exam.durationMinutes || 0,
        onExpire: () => {
            toast.error('Time Expired!', {
                description: 'Your exam time has ended. Please submit immediately.',
                duration: 10000,
            });
        },
        onCritical: () => {
            toast.warning('5 Minutes Remaining!', {
                description: 'You have less than 5 minutes to complete your exam.',
                duration: 5000,
            });
        },
    });

    // Handle exam cancellation from proctoring
    const handleExamCancelled = useCallback(() => {
        toast.error('Exam Cancelled', {
            description: 'Your exam has been automatically cancelled due to violations.',
            duration: 10000,
        });

        setTimeout(() => {
            router.push('/exam-sessions');
        }, 3000);
    }, [router]);

    // Handle answer selection
    const handleSelectAnswer = useCallback(
        (option: string) => {
            if (!currentQuestion || isSubmittingAnswer) return;

            const examQuestionId = currentQuestion.examQuestionId;

            // Update local state immediately
            setAnswers((prev) => {
                const newAnswers = new Map(prev);
                newAnswers.set(examQuestionId, option);
                return newAnswers;
            });

            // Auto-save to backend (debounced via mutation)
            submitAnswer({
                examQuestionId,
                selectedOption: option,
            });
        },
        [currentQuestion, submitAnswer, isSubmittingAnswer]
    );

    // Navigation handlers
    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handleNavigate = (index: number) => {
        setCurrentQuestionIndex(index);
    };

    // Submit exam handler
    const handleSubmitExam = () => {
        const unansweredCount = questions.length - answers.size;

        if (unansweredCount > 0) {
            setShowSubmitDialog(true);
        } else {
            submitExam();
        }
    };

    const confirmSubmit = () => {
        setShowSubmitDialog(false);
        submitExam();
    };

    // Check if session is still in progress
    useEffect(() => {
        if (session && session.status !== 'IN_PROGRESS') {
            toast.error('Exam Not Active', {
                description: 'This exam session is no longer active.',
            });
            router.push(`/exam-sessions/${sessionId}`);
        }
    }, [session, sessionId, router]);

    // Loading state
    if (isLoadingSession || isLoadingQuestions) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Loading exam...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (!session || !currentQuestion) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-lg font-semibold text-foreground mb-2">Exam Not Found</p>
                    <Button onClick={() => router.push('/exam-sessions')}>Back to Sessions</Button>
                </div>
            </div>
        );
    }

    // Calculate progress
    const answeredQuestions = new Set(answers.keys());
    const progress = {
        answered: answers.size,
        total: questions.length,
        percentage: (answers.size / questions.length) * 100,
    };

    return (
        <div className="min-h-screen bg-muted/30 pb-24">
            {/* Header */}
            <ExamHeader
                examTitle={session.exam.title}
                formattedTime={formattedTime}
                timeColor={timeColor}
                isCritical={isCritical}
                isExpired={isExpired}
                progress={progress}
            />

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-[1fr,300px] gap-8">
                    {/* Left: Question & Answers */}
                    <div className="space-y-6">
                        <QuestionDisplay
                            question={currentQuestion}
                            questionNumber={currentQuestionIndex + 1}
                            totalQuestions={questions.length}
                        />

                        <AnswerOptions
                            question={currentQuestion}
                            selectedOption={answers.get(currentQuestion.examQuestionId) || null}
                            onSelectOption={handleSelectAnswer}
                            disabled={isSubmittingAnswer || isExpired}
                        />

                        {/* Submit Button (Desktop) */}
                        <div className="hidden lg:block pt-6">
                            <Button
                                size="lg"
                                onClick={handleSubmitExam}
                                disabled={isSubmittingExam || isExpired}
                                className="w-full"
                            >
                                {isSubmittingExam ? (
                                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                ) : (
                                    <Send className="h-5 w-5 mr-2" />
                                )}
                                Submit Exam
                            </Button>
                            <p className="text-xs text-muted-foreground text-center mt-2">
                                {answers.size} of {questions.length} questions answered
                            </p>
                        </div>
                    </div>

                    {/* Right: Proctoring Monitor */}
                    <div className="lg:sticky lg:top-24 lg:h-fit">
                        <ProctoringMonitor
                            sessionId={sessionId}
                            onExamCancelled={handleExamCancelled}
                            captureInterval={3000}
                        />

                        {/* Submit Button (Mobile) */}
                        <div className="lg:hidden mt-6">
                            <Button
                                size="lg"
                                onClick={handleSubmitExam}
                                disabled={isSubmittingExam || isExpired}
                                className="w-full"
                            >
                                {isSubmittingExam ? (
                                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                ) : (
                                    <Send className="h-5 w-5 mr-2" />
                                )}
                                Submit Exam
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Navigation */}
            <QuestionNavigation
                currentIndex={currentQuestionIndex}
                totalQuestions={questions.length}
                answeredQuestions={answeredQuestions}
                questions={questions}
                onNavigate={handleNavigate}
                onPrevious={handlePrevious}
                onNext={handleNext}
                canGoPrevious={currentQuestionIndex > 0}
                canGoNext={currentQuestionIndex < questions.length - 1}
            />

            {/* Submit Confirmation Dialog */}
            <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Submit Exam?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You have {questions.length - answers.size} unanswered questions.
                            Are you sure you want to submit your exam? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Review Answers</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmSubmit}>
                            Submit Anyway
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}