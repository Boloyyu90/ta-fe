// src/app/(participant)/exam-sessions/[id]/take/page.tsx

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { Label } from '@/shared/components/ui/label';
import { Progress } from '@/shared/components/ui/progress';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/shared/components/ui/alert-dialog';
import { toast } from 'sonner';
import Link from 'next/link';
import { Clock, CheckCircle, Circle, AlertTriangle, AlertCircle, Loader2 } from 'lucide-react';
import { ProctoringMonitor } from '@/features/proctoring/components/ProctoringMonitor';
import { FullScreenViolationAlert } from '@/features/proctoring/components/FullScreenViolationAlert';
import { ViolationHistorySidebar } from '@/features/proctoring/components/ViolationHistorySidebar';
import { useProctoringStore } from '@/features/proctoring/store/proctoring.store';
import type { Violation } from '@/features/proctoring/types/proctoring.types';
import { ExamTakingSkeleton } from '@/features/exam-sessions/components/ExamTakingSkeleton';
import { EXAM_SESSION_ERRORS, getErrorMessage } from '@/shared/lib/errors';
import {
    useExamSession,
    useExamSessionData,
    useExamQuestions,
    useSubmitAnswer,
    useSubmitExam,
} from '@/features/exam-sessions/hooks';
import { useTimer } from '@/features/exam-sessions/hooks/useTimer';
import type { AnswerOption } from '@/shared/types/enum.types';

export default function TakeExamPage() {
    const params = useParams();
    const router = useRouter();
    const sessionId = Number(params.id);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<AnswerOption>(null);
    const [answersMap, setAnswersMap] = useState<Map<number, AnswerOption>>(new Map());

    // Proctoring state for full-screen violation alerts
    const [showViolationAlert, setShowViolationAlert] = useState(false);
    const [latestViolation, setLatestViolation] = useState<Violation | null>(null);
    const { violationCount } = useProctoringStore();

    // Handle new violation from ProctoringMonitor
    const handleNewViolation = useCallback((violation: Violation) => {
        setLatestViolation(violation);
        setShowViolationAlert(true);
    }, []);

    // Dismiss violation alert
    const handleDismissViolationAlert = useCallback(() => {
        setShowViolationAlert(false);
    }, []);

    // Fetch session data
    const {
        data: sessionData,
        isLoading: isLoadingSession,
        isError: isSessionError,
        error: sessionError,
        refetch: refetchSession,
    } = useExamSession(sessionId);

    // Get cached session data with existing answers
    const { data: cachedSessionData } = useExamSessionData(sessionId);

    // Fetch questions
    const {
        data: questionsData,
        isLoading: isLoadingQuestions,
        isError: isQuestionsError,
        error: questionsError,
        refetch: refetchQuestions,
    } = useExamQuestions(sessionId);

    // Mutations
    const submitAnswerMutation = useSubmitAnswer(sessionId);
    const submitExamMutation = useSubmitExam(sessionId);

    // ✅ P1 FIX: Load existing answers when cached data is available
    useEffect(() => {
        if (cachedSessionData?.answers && cachedSessionData.answers.length > 0) {
            const newAnswersMap = new Map<number, AnswerOption>();
            cachedSessionData.answers.forEach((answer) => {
                if (answer.selectedOption !== null) {
                    newAnswersMap.set(answer.examQuestionId, answer.selectedOption);
                }
            });
            setAnswersMap(newAnswersMap);
        }
    }, [cachedSessionData]);

    // Update selectedOption when navigating between questions
    useEffect(() => {
        if (questionsData?.questions) {
            const currentQuestion = questionsData.questions[currentQuestionIndex];
            const savedAnswer = answersMap.get(currentQuestion.examQuestionId);
            setSelectedOption(savedAnswer || null);
        }
    }, [currentQuestionIndex, questionsData, answersMap]);

    // MED-006 FIX: Browser close/refresh warning during exam
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            // Only warn if exam is in progress
            if (sessionData?.status === 'IN_PROGRESS') {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [sessionData?.status]);

    // Timer with auto-submit
    // Always call useTimer unconditionally (Rules of Hooks)
    // Pass safe defaults when sessionData is not loaded yet
    // The hook treats durationMinutes ≤ 0 as "loading" state
    //
    // ✅ FIX: Get durationMinutes from correct location in response
    // Backend sends: userExam.exam.durationMinutes (nested in exam object)
    // Priority: sessionData.exam.durationMinutes > sessionData.durationMinutes > cachedData > 0
    const timerStartedAt = sessionData?.startedAt
        || cachedSessionData?.userExam?.startedAt
        || new Date().toISOString();

    // ✅ FIX: durationMinutes is inside exam object, not at root level
    const timerDurationMinutes = (sessionData?.exam as { durationMinutes?: number })?.durationMinutes
        || sessionData?.durationMinutes
        || cachedSessionData?.userExam?.durationMinutes
        || 0;

    const timerRemainingMs = sessionData?.remainingTimeMs
        ?? cachedSessionData?.userExam?.remainingTimeMs
        ?? undefined;

    // Debug logging for timer data (only in development)
    if (process.env.NODE_ENV === 'development' && sessionData) {
        console.log('[TIMER DEBUG]', {
            startedAt: sessionData?.startedAt,
            'exam.durationMinutes': (sessionData?.exam as { durationMinutes?: number })?.durationMinutes,
            'root.durationMinutes': sessionData?.durationMinutes,
            resolved: timerDurationMinutes,
            remainingTimeMs: timerRemainingMs,
        });
    }

    const timer = useTimer({
        startedAt: timerStartedAt,
        durationMinutes: timerDurationMinutes,
        initialRemainingMs: timerRemainingMs,
        onExpire: () => {
            toast.error(getErrorMessage(EXAM_SESSION_ERRORS.EXAM_SESSION_TIMEOUT));
            submitExamMutation.mutate(undefined, {
                onSuccess: (result) => {
                    router.push(`/results/${result.result.id}`);
                },
            });
        },
        onCritical: () => {
            toast.warning('Waktu tersisa kurang dari 5 menit!', { duration: 5000 });
        },
    });

    // Loading state - use skeleton for better UX
    if (isLoadingSession || isLoadingQuestions) {
        return <ExamTakingSkeleton />;
    }

    // Error state - show error message with retry
    if (isSessionError || isQuestionsError) {
        const errorMessage = (sessionError as Error)?.message
            || (questionsError as Error)?.message
            || 'Terjadi kesalahan saat memuat ujian.';

        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="max-w-md mx-auto text-center space-y-4 px-4">
                    <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
                    <h2 className="text-xl font-semibold">Gagal Memuat Ujian</h2>
                    <p className="text-muted-foreground">{errorMessage}</p>
                    <div className="flex gap-2 justify-center">
                        <Button
                            onClick={() => {
                                refetchSession();
                                refetchQuestions();
                            }}
                        >
                            Coba Lagi
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/exams">Kembali ke Daftar Ujian</Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // No questions available
    if (!questionsData || !questionsData.questions || questionsData.questions.length === 0) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="max-w-md mx-auto text-center space-y-4 px-4">
                    <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto" />
                    <h2 className="text-xl font-semibold">Tidak Ada Soal</h2>
                    <p className="text-muted-foreground">
                        Ujian ini belum memiliki soal. Silakan hubungi admin.
                    </p>
                    <Button asChild>
                        <Link href="/exams">Kembali ke Daftar Ujian</Link>
                    </Button>
                </div>
            </div>
        );
    }

    const currentQuestion = questionsData.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questionsData.questions.length - 1;
    const answeredCount = answersMap.size;
    const totalQuestions = questionsData.questions.length;
    const progressPercentage = (answeredCount / totalQuestions) * 100;

    // Handle answer change
    const handleAnswerChange = async (value: AnswerOption) => {
        setSelectedOption(value);

        // Update local answers map
        const newAnswersMap = new Map(answersMap);
        newAnswersMap.set(currentQuestion.examQuestionId, value);
        setAnswersMap(newAnswersMap);

        // Auto-save answer
        submitAnswerMutation.mutate({
            examQuestionId: currentQuestion.examQuestionId,
            selectedOption: value,
        }, {
            onSuccess: () => {
                toast.success('Jawaban tersimpan', { duration: 1000 });
            },
            onError: () => {
                toast.error(getErrorMessage(EXAM_SESSION_ERRORS.EXAM_SESSION_ANSWER_SAVE_FAILED));
            },
        });
    };

    // Handle question navigation
    const goToQuestion = (index: number) => {
        setCurrentQuestionIndex(index);
    };

    // Handle submit exam
    const handleSubmitExam = () => {
        submitExamMutation.mutate(undefined, {
            onSuccess: (result) => {
                toast.success('Ujian berhasil diserahkan!');
                router.push(`/results/${result.result.id}`);
            },
            onError: () => {
                toast.error(getErrorMessage(EXAM_SESSION_ERRORS.EXAM_SESSION_SUBMIT_FAILED));
            },
        });
    };

    return (
        <div className="min-h-screen bg-background">
            {/* ✅ THESIS SHOWCASE: Full-Screen Violation Alert Overlay */}
            <FullScreenViolationAlert
                violation={latestViolation}
                show={showViolationAlert}
                onDismiss={handleDismissViolationAlert}
                violationCount={violationCount}
                autoDismissDelay={3000}
            />

            {/* Sticky Header with Timer and Webcam Preview */}
            <div className="sticky top-0 z-40 bg-background border-b shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    {/* Top Row: Title + Timer + Webcam Preview */}
                    <div className="flex items-start gap-4">
                        {/* Left: Title, Timer, and Progress */}
                        <div className="flex-1 space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-lg font-bold">{sessionData?.exam.title}</h1>
                                    {sessionData && (
                                        <p className="text-xs text-muted-foreground">
                                            Percobaan ke-{sessionData.attemptNumber}
                                        </p>
                                    )}
                                </div>
                                {/* Timer */}
                                <div className={`flex items-center gap-2 text-xl font-mono font-bold ${timer.timeColor} ${timer.isCritical ? 'animate-pulse' : ''}`}>
                                    <Clock className="h-5 w-5" />
                                    {timer.formattedTime}
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div>
                                <div className="flex items-center justify-between text-xs mb-1">
                                    <span>Progress: {answeredCount} / {totalQuestions} soal</span>
                                    <span>{Math.round(progressPercentage)}%</span>
                                </div>
                                <Progress value={progressPercentage} className="h-1.5" />
                            </div>
                        </div>

                        {/* Right: Webcam Preview Only - Always Visible */}
                        <div className="w-48 lg:w-56 flex-shrink-0">
                            <ProctoringMonitor
                                sessionId={sessionId}
                                enabled={true}
                                // captureInterval uses default 3000ms (per backend-api-contract.md Section 5.7)
                                onNewViolation={handleNewViolation}
                                uiMode="webcamOnly"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6">
                {/* Enhanced layout: Questions (main) + Navigation & Violations (sidebar) */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
                    {/* Main Content - Question Card */}
                    <div className="order-2 lg:order-1">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>
                                        Soal {currentQuestionIndex + 1} dari {totalQuestions}
                                    </CardTitle>
                                    {/* MED-002 FIX: Show saving indicator */}
                                    {submitAnswerMutation.isPending && (
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                            Menyimpan...
                                        </span>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <p className="text-lg whitespace-pre-wrap">{currentQuestion.content}</p>

                                {/* Question Image (if exists) */}
                                {currentQuestion.imageUrl && (
                                    <div className="rounded-lg border overflow-hidden">
                                        <img
                                            src={currentQuestion.imageUrl}
                                            alt="Gambar soal"
                                            className="w-full h-auto"
                                        />
                                    </div>
                                )}

                                {/* Answer Options */}
                                <RadioGroup
                                    value={selectedOption || ''}
                                    onValueChange={(value) => handleAnswerChange(value as AnswerOption)}
                                >
                                    {(['A', 'B', 'C', 'D', 'E'] as const).map((optionKey) => (
                                        <div
                                            key={optionKey}
                                            className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all ${
                                                selectedOption === optionKey
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <RadioGroupItem value={optionKey} id={`option-${optionKey}`} />
                                            <Label htmlFor={`option-${optionKey}`} className="flex-1 cursor-pointer">
                                                <span className="font-semibold mr-2">{optionKey}.</span>
                                                {currentQuestion.options[optionKey]}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>

                                {/* Navigation Buttons */}
                                <div className="flex justify-between items-center pt-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                                        disabled={currentQuestionIndex === 0}
                                    >
                                        Sebelumnya
                                    </Button>

                                    <div className="flex gap-2">
                                        {!isLastQuestion ? (
                                            <Button
                                                onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                                            >
                                                Selanjutnya
                                            </Button>
                                        ) : (
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button>
                                                        Serahkan Ujian
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Serahkan Ujian?</AlertDialogTitle>
                                                        <AlertDialogDescription className="space-y-2">
                                                            <p>
                                                                Anda akan menyerahkan ujian ini. Pastikan semua jawaban sudah benar.
                                                            </p>
                                                            <p className="font-semibold">
                                                                Soal terjawab: {answeredCount} dari {totalQuestions}
                                                            </p>
                                                            {answeredCount < totalQuestions && (
                                                                <p className="text-yellow-600 flex items-center gap-2">
                                                                    <AlertTriangle className="h-4 w-4" />
                                                                    Masih ada {totalQuestions - answeredCount} soal yang belum dijawab.
                                                                </p>
                                                            )}
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Batal</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={handleSubmitExam}
                                                            disabled={submitExamMutation.isPending}
                                                        >
                                                            {submitExamMutation.isPending ? 'Menyerahkan...' : 'Ya, Serahkan'}
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar - Navigation + Violations */}
                    <div className="order-1 lg:order-2 space-y-4 lg:sticky lg:top-24 lg:h-fit">
                        {/* Question Navigation Grid */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">Navigasi Soal</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-5 gap-2">
                                    {questionsData.questions.map((q, index) => {
                                        const isAnswered = answersMap.has(q.examQuestionId);
                                        const isCurrent = index === currentQuestionIndex;
                                        return (
                                            <button
                                                key={q.examQuestionId}
                                                onClick={() => goToQuestion(index)}
                                                className={`
                                                    aspect-square rounded-lg border-2 flex items-center justify-center text-sm font-medium
                                                    transition-all
                                                    ${isCurrent ? 'border-primary bg-primary text-primary-foreground' : ''}
                                                    ${isAnswered && !isCurrent ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : ''}
                                                    ${!isAnswered && !isCurrent ? 'border-gray-300 hover:border-gray-400 dark:border-gray-600' : ''}
                                                `}
                                            >
                                                {index + 1}
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="mt-4 space-y-2 text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded border-2 border-primary bg-primary"></div>
                                        <span>Soal saat ini</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded border-2 border-green-500 bg-green-50 dark:bg-green-900/20"></div>
                                        <span>Sudah dijawab</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded border-2 border-gray-300 dark:border-gray-600"></div>
                                        <span>Belum dijawab</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* ✅ THESIS SHOWCASE: Violation History Sidebar */}
                        <ViolationHistorySidebar
                            maxHeight="300px"
                            collapsible={true}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
