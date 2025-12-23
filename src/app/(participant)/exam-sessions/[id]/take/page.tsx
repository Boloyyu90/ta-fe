// src/app/(participant)/exam-sessions/[id]/take/page.tsx

'use client';

import { useState, useEffect } from 'react';
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
import { Clock, CheckCircle, Circle, AlertTriangle } from 'lucide-react';
import { ProctoringMonitor } from '@/features/proctoring/components/ProctoringMonitor';
import { EXAM_SESSION_ERRORS, getErrorMessage } from '@/shared/lib/errors';
import {
    useExamSession,
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

    // Fetch session data
    const { data: sessionData, isLoading: isLoadingSession } = useExamSession(sessionId);

    // Fetch questions
    const { data: questionsData, isLoading: isLoadingQuestions } = useExamQuestions(sessionId);

    // Mutations
    const submitAnswerMutation = useSubmitAnswer(sessionId);
    const submitExamMutation = useSubmitExam(sessionId);

    // Update selectedOption when navigating between questions
    useEffect(() => {
        if (questionsData?.questions) {
            const currentQuestion = questionsData.questions[currentQuestionIndex];
            const savedAnswer = answersMap.get(currentQuestion.examQuestionId);
            setSelectedOption(savedAnswer || null);
        }
    }, [currentQuestionIndex, questionsData, answersMap]);

    // Timer with auto-submit
    // ✅ FIX: Always call useTimer unconditionally (Rules of Hooks)
    // Pass safe defaults when sessionData is not loaded yet
    // The hook now treats durationMinutes ≤ 0 as "loading" state
    const timer = useTimer({
        startedAt: sessionData?.startedAt || new Date().toISOString(),
        durationMinutes: sessionData?.durationMinutes || 0, // Will be treated as loading
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

    // Loading state
    if (isLoadingSession || isLoadingQuestions) {
        return <div className="flex justify-center p-8">Memuat ujian...</div>;
    }

    // No questions available
    if (!questionsData || !questionsData.questions || questionsData.questions.length === 0) {
        return <div className="flex justify-center p-8">Tidak ada soal tersedia</div>;
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
            {/* Sticky Header with Timer */}
            <div className="sticky top-0 z-50 bg-background border-b">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold">{sessionData?.exam.title}</h1>
                            {sessionData && (
                                <p className="text-sm text-muted-foreground">
                                    Percobaan ke-{sessionData.attemptNumber}
                                </p>
                            )}
                        </div>
                        <div className={`flex items-center gap-2 text-2xl font-mono font-bold ${timer.timeColor} ${timer.isCritical ? 'animate-pulse' : ''}`}>
                            <Clock className="h-6 w-6" />
                            {timer.formattedTime}
                        </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="mt-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                            <span>Progress: {answeredCount} / {totalQuestions} soal</span>
                            <span>{Math.round(progressPercentage)}%</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Proctoring Monitor */}
                        <ProctoringMonitor
                            sessionId={sessionId}
                            enabled={true}
                            captureInterval={5000}
                        />

                        {/* Question Navigation Grid */}
                        <Card>
                            <CardHeader>
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
                                                    ${isAnswered && !isCurrent ? 'border-green-500 bg-green-50 text-green-700' : ''}
                                                    ${!isAnswered && !isCurrent ? 'border-gray-300 hover:border-gray-400' : ''}
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
                                        <div className="w-4 h-4 rounded border-2 border-green-500 bg-green-50"></div>
                                        <span>Sudah dijawab</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded border-2 border-gray-300"></div>
                                        <span>Belum dijawab</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content - Question */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Soal {currentQuestionIndex + 1} dari {totalQuestions}
                                </CardTitle>
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
                </div>
            </div>
        </div>
    );
}