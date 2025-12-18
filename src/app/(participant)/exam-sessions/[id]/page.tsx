'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';

// Exam session hooks
import { useExamSession } from '@/features/exam-sessions/hooks/useExamSession';
import { useExamQuestions } from '@/features/exam-sessions/hooks/useExamQuestions';
import { useSubmitAnswer } from '@/features/exam-sessions/hooks/useSubmitAnswer';
import { useSubmitExam } from '@/features/exam-sessions/hooks/useSubmitExam';

// Proctoring hooks and components - THESIS SHOWCASE
import { useAnalyzeFace } from '@/features/proctoring/hooks/useAnalyzeFace';
import { useProctoringStore } from '@/features/proctoring/store/proctoring.store';
import { WebcamCapture } from '@/features/proctoring/components/WebcamCapture';
import type { Violation } from '@/features/proctoring/types/proctoring.types';

// Exam session components
import {
    ExamHeader,
    QuestionDisplay,
    AnswerOptions,
    QuestionNavigation,
} from '@/features/exam-sessions/components';

// UI components
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent } from '@/shared/components/ui/card';
import {
    AlertCircle,
    Loader2,
    Camera,
    AlertTriangle,
    CheckCircle,
    Eye,
    XCircle,
} from 'lucide-react';

// ============================================================================
// CONSTANTS
// ============================================================================

/** Interval between face analysis calls (ms) - balances detection vs rate limiting */
const PROCTORING_CAPTURE_INTERVAL = 5000; // 5 seconds

/** Maximum violations before showing critical warning */
const VIOLATION_WARNING_THRESHOLD = 3;

/** Maximum high-severity violations before potential exam cancellation */
const CRITICAL_VIOLATION_THRESHOLD = 5;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Format milliseconds to MM:SS display
 */
function formatTime(ms: number): string {
    if (ms <= 0) return '00:00';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Get color class based on remaining time
 */
function getTimeColor(ms: number): string {
    if (ms <= 60000) return 'text-red-600'; // < 1 min
    if (ms <= 300000) return 'text-orange-500'; // < 5 min
    return 'text-foreground';
}

/**
 * Create a violation message from event type
 */
function getViolationMessage(violationType: string): string {
    const messages: Record<string, string> = {
        NO_FACE_DETECTED: 'Wajah tidak terdeteksi. Pastikan wajah Anda terlihat di kamera.',
        MULTIPLE_FACES: 'Terdeteksi lebih dari satu wajah. Pastikan hanya Anda yang ada di frame.',
        LOOKING_AWAY: 'Anda terdeteksi tidak melihat ke layar.',
        FACE_DETECTED: 'Wajah terdeteksi dengan baik.',
    };
    return messages[violationType] || 'Pelanggaran proctoring terdeteksi.';
}

/**
 * Get severity badge variant
 */
function getSeverityVariant(severity: string): 'default' | 'secondary' | 'destructive' | 'outline' {
    switch (severity) {
        case 'HIGH':
            return 'destructive';
        case 'MEDIUM':
            return 'secondary';
        default:
            return 'outline';
    }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ExamSessionPage() {
    const router = useRouter();
    const params = useParams();
    const sessionId = Number(params.id);

    // Compatibility redirect: /exam-sessions/:id → /exam-sessions/:id/take
    useEffect(() => {
        router.replace(`/exam-sessions/${sessionId}/take`);
    }, [sessionId, router]);

    // =========================================================================
    // DATA FETCHING
    // =========================================================================

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

    // =========================================================================
    // MUTATIONS
    // =========================================================================

    const submitAnswer = useSubmitAnswer(sessionId);
    const submitExam = useSubmitExam(sessionId);
    const analyzeFace = useAnalyzeFace(sessionId);

    // =========================================================================
    // PROCTORING STORE
    // =========================================================================

    const {
        webcam,
        violations,
        isAnalyzing,
        violationCount,
        highViolationCount,
        addViolation,
        setAnalyzing,
        setLastAnalysis,
        incrementViolationCount,
        incrementHighViolationCount,
    } = useProctoringStore();

    // =========================================================================
    // LOCAL UI STATE
    // =========================================================================

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D' | 'E'>>({});
    const [remainingMs, setRemainingMs] = useState<number>(0);
    const [lastViolationAlert, setLastViolationAlert] = useState<string | null>(null);
    const [showViolationPanel, setShowViolationPanel] = useState(true);

    // =========================================================================
    // EXTRACT DATA
    // =========================================================================

    // sessionData is already UserExam (hook unwraps it)
    const userExam = sessionData;
    const questions = questionsData?.questions || [];
    const currentQuestion = questions[currentQuestionIndex];

    // =========================================================================
    // TIMER LOGIC
    // =========================================================================

    // Initialize timer from backend's remainingTimeMs
    useEffect(() => {
        if (userExam?.remainingTimeMs !== null && userExam?.remainingTimeMs !== undefined) {
            setRemainingMs(userExam.remainingTimeMs);
        }
    }, [userExam?.remainingTimeMs]);

    // Countdown timer
    useEffect(() => {
        if (remainingMs <= 0) return;

        const interval = setInterval(() => {
            setRemainingMs((prev) => {
                const newValue = prev - 1000;
                if (newValue <= 0) {
                    // Auto-submit when time expires
                    handleSubmitExam(true);
                    return 0;
                }
                return newValue;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [remainingMs > 0]); // eslint-disable-line react-hooks/exhaustive-deps

    // =========================================================================
    // PROCTORING: FRAME CAPTURE HANDLER - THESIS SHOWCASE
    // =========================================================================

    /**
     * Handle webcam frame capture and send to YOLO ML service
     * This is the core ML integration for thesis demonstration
     */
    const handleFrameCapture = useCallback(
        async (imageData: string) => {
            // Skip if already analyzing or exam not active
            if (isAnalyzing || !userExam || userExam.status !== 'IN_PROGRESS') {
                return;
            }

            setAnalyzing(true);

            try {
                // Call YOLO ML service via backend
                const result = await analyzeFace.mutateAsync({
                    imageBase64: imageData,
                });

                // Store the analysis result
                setLastAnalysis(result.analysis);

                // Check for violations (not FACE_DETECTED)
                const hasViolation = result.analysis.violations.some(
                    (v) => v !== 'FACE_DETECTED'
                );

                if (hasViolation && result.eventLogged) {
                    // Increment counters
                    incrementViolationCount();

                    // Determine severity and track high violations
                    const violationType = result.analysis.violations[0];
                    const isHighSeverity =
                        violationType === 'NO_FACE_DETECTED' ||
                        violationType === 'MULTIPLE_FACES';

                    if (isHighSeverity) {
                        incrementHighViolationCount();
                    }

                    // Create violation for UI display
                    const violation: Violation = {
                        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                        type: result.eventType || 'NO_FACE_DETECTED',
                        severity: isHighSeverity ? 'HIGH' : 'MEDIUM',
                        timestamp: new Date().toISOString(),
                        message: getViolationMessage(violationType),
                    };

                    addViolation(violation);

                    // Show alert for new violation
                    setLastViolationAlert(violation.message);

                    // Auto-hide alert after 5 seconds
                    setTimeout(() => {
                        setLastViolationAlert(null);
                    }, 5000);
                }
            } catch (error) {
                console.error('Face analysis error:', error);
                // Don't block exam on proctoring errors - graceful degradation
            } finally {
                setAnalyzing(false);
            }
        },
        [
            isAnalyzing,
            userExam,
            analyzeFace,
            setAnalyzing,
            setLastAnalysis,
            addViolation,
            incrementViolationCount,
            incrementHighViolationCount,
        ]
    );

    // =========================================================================
    // ANSWER HANDLING
    // =========================================================================

    const handleAnswerChange = useCallback(
        (answer: 'A' | 'B' | 'C' | 'D' | 'E') => {
            if (!currentQuestion) return;

            const examQuestionId = currentQuestion.examQuestionId;

            // Update local state immediately for responsive UI
            setSelectedAnswers((prev) => ({
                ...prev,
                [examQuestionId]: answer,
            }));

            // Submit to backend
            submitAnswer.mutate({
                examQuestionId,
                selectedOption: answer,
            });
        },
        [currentQuestion, submitAnswer]
    );

    // =========================================================================
    // NAVIGATION
    // =========================================================================

    const handlePrevQuestion = useCallback(() => {
        setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
    }, []);

    const handleNextQuestion = useCallback(() => {
        setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1));
    }, [questions.length]);

    const handleNavigate = useCallback((index: number) => {
        if (index >= 0 && index < questions.length) {
            setCurrentQuestionIndex(index);
        }
    }, [questions.length]);

    // Navigation guards
    const canGoPrevious = currentQuestionIndex > 0;
    const canGoNext = currentQuestionIndex < questions.length - 1;

    // =========================================================================
    // EXAM SUBMISSION
    // =========================================================================

    const handleSubmitExam = useCallback(
        (isAutoSubmit = false) => {
            const answeredCount = Object.keys(selectedAnswers).length;

            // Confirm if not auto-submit and not all questions answered
            if (!isAutoSubmit && answeredCount < questions.length) {
                const unanswered = questions.length - answeredCount;
                const confirmMessage = `Anda masih memiliki ${unanswered} soal yang belum dijawab. Yakin ingin mengumpulkan ujian?`;

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
                    alert('Gagal mengumpulkan ujian. Silakan coba lagi.');
                },
            });
        },
        [questions.length, selectedAnswers, submitExam, router]
    );

    // =========================================================================
    // COMPUTED VALUES
    // =========================================================================

    const answeredCount = Object.keys(selectedAnswers).length;
    const progress = {
        answered: answeredCount,
        total: questions.length,
        percentage: questions.length > 0 ? (answeredCount / questions.length) * 100 : 0,
    };

    const timeColor = getTimeColor(remainingMs);
    const isCritical = remainingMs <= 300000; // < 5 minutes
    const isExpired = remainingMs <= 0;

    // Convert selectedAnswers map to Set for QuestionNavigation
    const answeredQuestionsSet = new Set(Object.keys(selectedAnswers).map(Number));

    // Recent violations for display (last 3)
    const recentViolations = violations.slice(0, 3);

    // =========================================================================
    // LOADING STATES
    // =========================================================================

    if (sessionLoading || questionsLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    <p className="text-muted-foreground">Memuat ujian...</p>
                </div>
            </div>
        );
    }

    // =========================================================================
    // ERROR STATES
    // =========================================================================

    if (sessionError || questionsError) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Alert variant="destructive" className="max-w-md">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        {sessionError?.message || questionsError?.message || 'Gagal memuat ujian'}
                    </AlertDescription>
                    <Button variant="outline" className="mt-4" onClick={() => router.push('/dashboard')}>
                        Kembali ke Dashboard
                    </Button>
                </Alert>
            </div>
        );
    }

    // =========================================================================
    // DATA VALIDATION
    // =========================================================================

    if (!userExam || questions.length === 0) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Alert variant="destructive" className="max-w-md">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Sesi ujian tidak ditemukan atau tidak memiliki soal. Silakan hubungi administrator.
                    </AlertDescription>
                    <Button variant="outline" className="mt-4" onClick={() => router.push('/dashboard')}>
                        Kembali ke Dashboard
                    </Button>
                </Alert>
            </div>
        );
    }

    // =========================================================================
    // EXAM ALREADY FINISHED
    // =========================================================================

    if (userExam.status === 'FINISHED' || userExam.status === 'TIMEOUT') {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Alert className="max-w-md">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Ujian ini telah selesai. Anda dapat melihat hasil ujian.
                    </AlertDescription>
                    <Button
                        variant="default"
                        className="mt-4"
                        onClick={() => router.push(`/results/${userExam.id}`)}
                    >
                        Lihat Hasil
                    </Button>
                </Alert>
            </div>
        );
    }

    // =========================================================================
    // MAIN RENDER
    // =========================================================================

    return (
        <div className="min-h-screen bg-background">
            {/* Exam Header with Timer */}
            <ExamHeader
                examTitle={userExam.exam.title}
                formattedTime={formatTime(remainingMs)}
                timeColor={timeColor}
                isCritical={isCritical}
                isExpired={isExpired}
                progress={progress}
            />

            {/* Violation Alert Banner */}
            {lastViolationAlert && (
                <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-2">
                    <div className="container max-w-6xl mx-auto flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                        <span className="text-sm text-destructive font-medium">
                            {lastViolationAlert}
                        </span>
                    </div>
                </div>
            )}

            {/* Critical Violation Warning */}
            {highViolationCount >= VIOLATION_WARNING_THRESHOLD && (
                <div className="bg-destructive text-destructive-foreground px-4 py-3">
                    <div className="container max-w-6xl mx-auto flex items-center gap-2">
                        <XCircle className="h-5 w-5" />
                        <span className="font-medium">
                            Peringatan: Anda telah melakukan {highViolationCount} pelanggaran serius.
                            Ujian dapat dibatalkan jika pelanggaran berlanjut.
                        </span>
                    </div>
                </div>
            )}

            <div className="container max-w-6xl mx-auto py-6 px-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content - Questions */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Question Display */}
                        <QuestionDisplay
                            question={currentQuestion}
                            questionNumber={currentQuestionIndex + 1}
                        />

                        {/* Answer Options */}
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
                                    Gagal menyimpan jawaban. Silakan coba lagi.
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Question Navigation */}
                        <QuestionNavigation
                            currentIndex={currentQuestionIndex}
                            totalQuestions={questions.length}
                            answeredQuestions={answeredQuestionsSet}
                            questions={questions}
                            onNavigate={handleNavigate}
                            onPrevious={handlePrevQuestion}
                            onNext={handleNextQuestion}
                            canGoPrevious={canGoPrevious}
                            canGoNext={canGoNext}
                        />

                        {/* Submit Exam Section */}
                        <div className="bg-card border rounded-lg p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-lg">Siap Mengumpulkan?</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {answeredCount} dari {questions.length} soal dijawab (
                                        {Math.round(progress.percentage)}%)
                                    </p>
                                </div>
                                <Button
                                    size="lg"
                                    onClick={() => handleSubmitExam(false)}
                                    disabled={submitExam.isPending || isExpired}
                                    className="min-w-[140px]"
                                >
                                    {submitExam.isPending ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Mengumpulkan...
                                        </>
                                    ) : (
                                        'Kumpulkan Ujian'
                                    )}
                                </Button>
                            </div>

                            {answeredCount < questions.length && (
                                <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        Anda memiliki {questions.length - answeredCount} soal yang belum dijawab.
                                        Anda tetap dapat mengumpulkan, tetapi soal yang tidak dijawab akan dianggap salah.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </div>

                    {/* Sidebar - Proctoring Panel */}
                    <div className="space-y-4">
                        {/* Webcam Feed - THESIS SHOWCASE */}
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Eye className="h-4 w-4 text-primary" />
                                        <span className="font-medium text-sm">Proctoring</span>
                                    </div>
                                    <Badge
                                        variant={webcam.isActive ? 'default' : 'destructive'}
                                        className="text-xs"
                                    >
                                        {webcam.isActive ? (
                                            <>
                                                <Camera className="h-3 w-3 mr-1" />
                                                Live
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="h-3 w-3 mr-1" />
                                                Offline
                                            </>
                                        )}
                                    </Badge>
                                </div>

                                {/* Webcam Component */}
                                <WebcamCapture
                                    onFrameCapture={handleFrameCapture}
                                    captureInterval={PROCTORING_CAPTURE_INTERVAL}
                                    className="border-0 shadow-none"
                                />

                                {/* Analysis Status */}
                                {isAnalyzing && (
                                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                        <span>Menganalisis...</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Violation Summary */}
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="font-medium text-sm">Status Proctoring</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowViolationPanel(!showViolationPanel)}
                                    >
                                        {showViolationPanel ? 'Sembunyikan' : 'Tampilkan'}
                                    </Button>
                                </div>

                                {showViolationPanel && (
                                    <div className="space-y-3">
                                        {/* Violation Counter */}
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Total Pelanggaran</span>
                                            <Badge
                                                variant={violationCount > 0 ? 'destructive' : 'secondary'}
                                            >
                                                {violationCount}
                                            </Badge>
                                        </div>

                                        {/* Status Indicator */}
                                        <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                                            {violationCount === 0 ? (
                                                <>
                                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                                    <span className="text-sm text-green-700">
                                                        Tidak ada pelanggaran
                                                    </span>
                                                </>
                                            ) : highViolationCount >= VIOLATION_WARNING_THRESHOLD ? (
                                                <>
                                                    <XCircle className="h-4 w-4 text-destructive" />
                                                    <span className="text-sm text-destructive">
                                                        Peringatan kritis
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                                                    <span className="text-sm text-orange-700">
                                                        Perhatian diperlukan
                                                    </span>
                                                </>
                                            )}
                                        </div>

                                        {/* Recent Violations List */}
                                        {recentViolations.length > 0 && (
                                            <div className="space-y-2">
                                                <span className="text-xs text-muted-foreground">
                                                    Pelanggaran Terakhir:
                                                </span>
                                                {recentViolations.map((violation) => (
                                                    <div
                                                        key={violation.id}
                                                        className="flex items-start gap-2 p-2 rounded border text-xs"
                                                    >
                                                        <Badge
                                                            variant={getSeverityVariant(violation.severity)}
                                                            className="text-xs shrink-0"
                                                        >
                                                            {violation.severity}
                                                        </Badge>
                                                        <span className="text-muted-foreground line-clamp-2">
                                                            {violation.message}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Proctoring Info */}
                        <Card className="bg-primary/5 border-primary/20">
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    <Camera className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <div className="text-xs text-muted-foreground space-y-1">
                                        <p className="font-medium text-foreground">
                                            Proctoring Aktif
                                        </p>
                                        <p>
                                            Sistem menggunakan deteksi wajah YOLO untuk memastikan
                                            integritas ujian. Pastikan wajah Anda terlihat jelas.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}