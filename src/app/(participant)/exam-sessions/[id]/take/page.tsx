// src/app/(participant)/exam-sessions/[id]/take/page.tsx

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { Label } from '@/shared/components/ui/label';
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
import { AlertTriangle, AlertCircle, Loader2, ChevronLeft, ChevronRight, Flag } from 'lucide-react';
import { ProctoringMonitor } from '@/features/proctoring/components/ProctoringMonitor';
import { FullScreenViolationAlert } from '@/features/proctoring/components/FullScreenViolationAlert';
import { ViolationHistorySidebar } from '@/features/proctoring/components/ViolationHistorySidebar';
import { useProctoringStore } from '@/features/proctoring/store/proctoring.store';
import type { Violation } from '@/features/proctoring/types/proctoring.types';
import { ExamTakingSkeleton } from '@/features/exam-sessions/components/ExamTakingSkeleton';
import { ExamHeader } from '@/features/exam-sessions/components/ExamHeader';
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

    // localStorage backup key for this session
    const ANSWER_BACKUP_KEY = `exam-${sessionId}-answers-backup`;

    // Load existing answers when cached data is available OR from localStorage backup
    useEffect(() => {
        // First try to load from server cache
        if (cachedSessionData?.answers && cachedSessionData.answers.length > 0) {
            const newAnswersMap = new Map<number, AnswerOption>();
            cachedSessionData.answers.forEach((answer) => {
                if (answer.selectedOption !== null) {
                    newAnswersMap.set(answer.examQuestionId, answer.selectedOption);
                }
            });
            setAnswersMap(newAnswersMap);
            return;
        }

        // Fallback: Try to restore from localStorage backup (crash recovery)
        try {
            const backup = localStorage.getItem(ANSWER_BACKUP_KEY);
            if (backup && answersMap.size === 0) {
                const parsed = JSON.parse(backup) as Record<string, string>;
                const restoredMap = new Map<number, AnswerOption>(
                    Object.entries(parsed).map(([k, v]) => [Number(k), v as AnswerOption])
                );
                if (restoredMap.size > 0) {
                    setAnswersMap(restoredMap);
                    console.log('[Exam] Restored', restoredMap.size, 'answers from localStorage backup');
                    toast.info(`${restoredMap.size} jawaban dipulihkan dari backup lokal`);
                }
            }
        } catch (e) {
            console.warn('[Exam] Failed to restore backup:', e);
        }
    }, [cachedSessionData, ANSWER_BACKUP_KEY, answersMap.size]);

    // Update selectedOption when navigating between questions
    useEffect(() => {
        if (questionsData?.questions) {
            const currentQuestion = questionsData.questions[currentQuestionIndex];
            const savedAnswer = answersMap.get(currentQuestion.examQuestionId);
            setSelectedOption(savedAnswer || null);
        }
    }, [currentQuestionIndex, questionsData, answersMap]);

    // Browser close/refresh warning during exam
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (sessionData?.status === 'IN_PROGRESS') {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [sessionData?.status]);

    // Timer with auto-submit
    const timerStartedAt = sessionData?.startedAt
        || cachedSessionData?.userExam?.startedAt
        || new Date().toISOString();

    const timerDurationMinutes = (sessionData?.exam as { durationMinutes?: number })?.durationMinutes
        || sessionData?.durationMinutes
        || cachedSessionData?.userExam?.durationMinutes
        || 0;

    const timerRemainingMs = sessionData?.remainingTimeMs
        ?? cachedSessionData?.userExam?.remainingTimeMs
        ?? undefined;

    const timer = useTimer({
        startedAt: timerStartedAt,
        durationMinutes: timerDurationMinutes,
        initialRemainingMs: timerRemainingMs,
        onExpire: () => {
            toast.error('Waktu habis! Ujian diserahkan otomatis.');
            submitExamMutation.mutate(undefined, {
                onSuccess: (result) => {
                    // Clear localStorage backup on successful submit
                    localStorage.removeItem(`exam-${sessionId}-answers-backup`);
                    router.push(`/results/${result.result.id}`);
                },
                onError: (error) => {
                    // CRITICAL: Always redirect to results, even on error
                    // Backend may have auto-submitted due to time expiry
                    console.error('[Timer Expiry] Auto-submit failed:', error);

                    const status = (error as { status?: number })?.status;

                    if (status === 429) {
                        toast.error('Server sibuk. Mengarahkan ke halaman hasil...');
                    } else if (status === 401 || status === 403) {
                        toast.error('Sesi berakhir. Mengarahkan ke halaman hasil...');
                    } else {
                        toast.error('Gagal menyerahkan ujian. Mengarahkan ke halaman hasil...');
                    }

                    // Redirect to exam sessions page - let user check their result there
                    // Backend might have auto-completed the session
                    setTimeout(() => {
                        router.push(`/exam-sessions/${sessionId}`);
                    }, 1500);
                },
            });
        },
        onCritical: () => {
            toast.warning('Waktu tersisa kurang dari 5 menit!', { duration: 5000 });
        },
    });

    // Loading state
    if (isLoadingSession || isLoadingQuestions) {
        return <ExamTakingSkeleton />;
    }

    // Error state
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
                    <AlertTriangle className="h-12 w-12 text-warning mx-auto" />
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
    const totalQuestions = questionsData.questions.length;
    const answeredCount = answersMap.size;

    // Handle answer change with localStorage backup
    const handleAnswerChange = async (value: AnswerOption) => {
        setSelectedOption(value);

        const newAnswersMap = new Map(answersMap);
        newAnswersMap.set(currentQuestion.examQuestionId, value);
        setAnswersMap(newAnswersMap);

        // BACKUP TO LOCALSTORAGE (always, before server call)
        try {
            const backupData = Object.fromEntries(newAnswersMap);
            localStorage.setItem(ANSWER_BACKUP_KEY, JSON.stringify(backupData));
        } catch (e) {
            console.warn('[Exam] Failed to backup answer:', e);
        }

        // Submit to server
        submitAnswerMutation.mutate({
            examQuestionId: currentQuestion.examQuestionId,
            selectedOption: value,
        }, {
            onSuccess: () => {
                toast.success('Jawaban tersimpan', { duration: 1000 });
            },
            onError: (error) => {
                const status = (error as { status?: number })?.status;

                if (status === 429) {
                    // Rate limited - answer is already backed up locally
                    toast.warning('Server sibuk, jawaban disimpan lokal', { duration: 2000 });
                    console.warn('[SubmitAnswer] Rate limited, answer backed up locally');
                } else if (status === 401 || status === 403) {
                    // Auth error - don't show scary message during exam
                    toast.warning('Sesi terputus, jawaban disimpan lokal', { duration: 2000 });
                } else {
                    toast.error(getErrorMessage(EXAM_SESSION_ERRORS.EXAM_SESSION_ANSWER_SAVE_FAILED));
                }
                // Answer is already backed up to localStorage above
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
                // Clear localStorage backup on successful submission
                localStorage.removeItem(ANSWER_BACKUP_KEY);
                toast.success('Ujian berhasil diserahkan!');
                router.push(`/results/${result.result.id}`);
            },
            onError: (error) => {
                const status = (error as { status?: number })?.status;

                if (status === 429) {
                    toast.error('Server sibuk. Silakan coba lagi dalam beberapa detik.');
                } else if (status === 401 || status === 403) {
                    // Auth error during submit - redirect to session page, backend might have auto-submitted
                    toast.error('Sesi terputus. Mengarahkan ke halaman ujian...');
                    setTimeout(() => {
                        router.push(`/exam-sessions/${sessionId}`);
                    }, 1500);
                } else {
                    toast.error(getErrorMessage(EXAM_SESSION_ERRORS.EXAM_SESSION_SUBMIT_FAILED));
                }
            },
        });
    };

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Full-Screen Violation Alert Overlay */}
            <FullScreenViolationAlert
                violation={latestViolation}
                show={showViolationAlert}
                onDismiss={handleDismissViolationAlert}
                violationCount={violationCount}
                autoDismissDelay={3000}
            />

            {/* Sticky Header with Timer */}
            <div className="sticky top-0 z-40 shadow-sm">
                <ExamHeader
                    examTitle={sessionData?.exam.title || 'Ujian'}
                    subtitle={`Kerjakan soal dengan jujur dan sungguh-sungguh untuk mengukur potensimu, Semangat!`}
                    timeSegments={timer.timeSegments}
                    isCritical={timer.isCritical}
                    isExpired={timer.isExpired}
                    webcamSlot={
                        <ProctoringMonitor
                            sessionId={sessionId}
                            enabled={true}
                            onNewViolation={handleNewViolation}
                            uiMode="webcamOnly"
                        />
                    }
                />
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto p-4 lg:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
                    {/* Left: Question Card */}
                    <div className="order-2 lg:order-1">
                        <Card>
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">
                                        Soal No.{currentQuestionIndex + 1}
                                        {currentQuestion.questionType && (
                                            <span className="text-muted-foreground font-normal ml-2">
                                                ({currentQuestion.questionType})
                                            </span>
                                        )}
                                    </CardTitle>
                                    {submitAnswerMutation.isPending && (
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                            Menyimpan...
                                        </span>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Question Text */}
                                <p className="text-base leading-relaxed whitespace-pre-wrap">
                                    {currentQuestion.content}
                                </p>

                                {/* Question Image */}
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
                                            className={`
                                                flex items-start space-x-3 p-4 rounded-lg border transition-all cursor-pointer
                                                ${selectedOption === optionKey
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-border hover:border-muted-foreground/30 hover:bg-muted/50'
                                                }
                                            `}
                                            onClick={() => handleAnswerChange(optionKey)}
                                        >
                                            <RadioGroupItem value={optionKey} id={`option-${optionKey}`} className="mt-0.5" />
                                            <Label htmlFor={`option-${optionKey}`} className="flex-1 cursor-pointer leading-relaxed">
                                                <span className="font-semibold mr-2">{optionKey}.</span>
                                                {currentQuestion.options[optionKey]}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>

                                {/* Navigation Buttons */}
                                <div className="flex items-center justify-between pt-4 border-t">
                                    <Button
                                        variant="outline"
                                        onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                                        disabled={currentQuestionIndex === 0}
                                    >
                                        <ChevronLeft className="h-4 w-4 mr-1" />
                                        Sebelumnya
                                    </Button>

                                    <Button
                                        variant="outline"
                                        onClick={() => toast.info('Fitur tandai soal akan segera hadir')}
                                    >
                                        <Flag className="h-4 w-4 mr-1" />
                                        Tandai Soal
                                    </Button>

                                    <Button
                                        variant="outline"
                                        onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                                        disabled={currentQuestionIndex === totalQuestions - 1}
                                    >
                                        Selanjutnya
                                        <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right: Sidebar */}
                    <div className="order-1 lg:order-2 space-y-4 lg:sticky lg:top-28 lg:h-fit">
                        {/* Question Navigation Grid */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">Daftar Soal</CardTitle>
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
                                                    aspect-square rounded-lg border flex items-center justify-center text-sm font-medium
                                                    transition-all
                                                    ${isCurrent
                                                        ? 'border-primary bg-primary text-primary-foreground'
                                                        : isAnswered
                                                            ? 'border-success bg-success/10 text-success'
                                                            : 'border-border hover:border-muted-foreground/50'
                                                    }
                                                `}
                                            >
                                                {index + 1}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Progress summary */}
                                <p className="text-xs text-muted-foreground mt-4 text-center">
                                    {answeredCount} dari {totalQuestions} soal terjawab
                                </p>
                            </CardContent>
                        </Card>

                        {/* Submit Exam Button */}
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                                    size="lg"
                                >
                                    Selesai
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
                                            <p className="text-warning flex items-center gap-2">
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

                        {/* Violation History */}
                        <ViolationHistorySidebar
                            maxHeight="200px"
                            collapsible={true}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
