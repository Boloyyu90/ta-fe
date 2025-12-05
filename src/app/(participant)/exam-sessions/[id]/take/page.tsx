'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { examSessionsApi } from '@/features/exam-sessions/api/exam-sessions.api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, ArrowRight, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import type { ExamQuestion, SubmitAnswerRequest } from '@/features/exam-sessions/types/exam-sessions.types';

interface QuestionDisplayProps {
    question: ExamQuestion;
    questionNumber: number;
}

function QuestionDisplay({ question, questionNumber }: QuestionDisplayProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3">
        <span className="text-2xl font-bold text-muted-foreground">
          Question {questionNumber}
        </span>
            </div>
            <p className="text-lg font-medium">{question.question.content}</p>
            {question.question.imageUrl && (
                <div className="relative w-full max-w-md h-64 border rounded-lg overflow-hidden">
                    <img
                        src={question.question.imageUrl}
                        alt="Question"
                        className="w-full h-full object-contain"
                    />
                </div>
            )}
        </div>
    );
}

interface AnswerOptionsProps {
    question: ExamQuestion;
    selectedAnswer: string | null;
    onSelectOption: (option: 'A' | 'B' | 'C' | 'D' | 'E') => void;
    disabled: boolean;
}

function AnswerOptions({ question, selectedAnswer, onSelectOption, disabled }: AnswerOptionsProps) {
    const optionLabels: ('A' | 'B' | 'C' | 'D' | 'E')[] = ['A', 'B', 'C', 'D', 'E'];
    const options = [
        question.question.optionA,
        question.question.optionB,
        question.question.optionC,
        question.question.optionD,
        question.question.optionE,
    ];

    return (
        <div className="space-y-3">
            {options.map((option, index) => {
                const label = optionLabels[index];
                const isSelected = selectedAnswer === label;

                return (
                    <button
                        key={label}
                        onClick={() => onSelectOption(label)}
                        disabled={disabled}
                        className={`w-full flex items-start gap-3 p-4 border-2 rounded-lg text-left transition-all ${
                            isSelected
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-blue-300'
                        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        <div
                            className={`flex items-center justify-center w-8 h-8 rounded-full border-2 font-medium ${
                                isSelected
                                    ? 'bg-blue-500 text-white border-blue-500'
                                    : 'bg-white border-gray-300'
                            }`}
                        >
                            {label}
                        </div>
                        <p className="flex-1 pt-1">{option}</p>
                    </button>
                );
            })}
        </div>
    );
}

export default function TakeExamPage() {
    const params = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const userExamId = Number(params.id);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Map<number, string>>(new Map());
    const [timeRemaining, setTimeRemaining] = useState<number>(0);

    // Fetch exam session
    const { data, isLoading, error } = useQuery({
        queryKey: ['exam-session', userExamId],
        queryFn: () => examSessionsApi.getExamSession(userExamId),
    });

    // Submit answer mutation
    const submitAnswerMutation = useMutation({
        mutationFn: (request: SubmitAnswerRequest) =>
            examSessionsApi.submitAnswer(userExamId, request),
        onError: (error: any) => {
            toast.error(error?.message || 'Failed to submit answer');
        },
    });

    // Finish exam mutation
    const finishExamMutation = useMutation({
        mutationFn: () => examSessionsApi.finishExam(userExamId),
        onSuccess: () => {
            toast.success('Exam submitted successfully!');
            queryClient.invalidateQueries({ queryKey: ['exam-session', userExamId] });
            router.push(`/results/${userExamId}`);
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Failed to submit exam');
        },
    });

    const submitAnswer = async (questionId: number, selectedOption: string) => {
        try {
            await submitAnswerMutation.mutateAsync({
                questionId,
                selectedOption,
            });

            // Update local answers map
            setAnswers((prev) => new Map(prev).set(questionId, selectedOption));
        } catch (error) {
            console.error('Failed to submit answer:', error);
        }
    };

    // Timer effect
    useEffect(() => {
        if (!data) return;

        const { userExam } = data.data;
        const startTime = new Date(userExam.startedAt!).getTime();
        const duration = userExam.exam.durationMinutes * 60 * 1000;
        const endTime = startTime + duration;

        const interval = setInterval(() => {
            const now = Date.now();
            const remaining = Math.max(0, endTime - now);
            setTimeRemaining(Math.floor(remaining / 1000));

            if (remaining <= 0) {
                clearInterval(interval);
                finishExamMutation.mutate();
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [data]);

    if (isLoading) {
        return (
            <div className="container py-8">
                <Skeleton className="h-8 w-64 mb-6" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="container py-8">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>Failed to load exam</AlertDescription>
                </Alert>
            </div>
        );
    }

    const { userExam, questions } = data.data;
    const currentQuestion = questions[currentQuestionIndex];

    // Load answers from API response
    useEffect(() => {
        if (data?.data.answers) {
            const answersMap = new Map<number, string>();
            data.data.answers.forEach((answer) => {
                if (answer.selectedOption) {
                    answersMap.set(answer.questionId, answer.selectedOption);
                }
            });
            setAnswers(answersMap);
        }
    }, [data]);

    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const isTimeRunningOut = timeRemaining < 300; // Less than 5 minutes

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleFinish = () => {
        if (
            confirm(
                'Are you sure you want to submit your exam? You cannot change your answers after submission.'
            )
        ) {
            finishExamMutation.mutate();
        }
    };

    const answeredCount = answers.size;
    const isSubmitting = submitAnswerMutation.isPending || finishExamMutation.isPending;

    return (
        <div className="container py-8">
            {/* Header with Timer */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">{userExam.exam.title}</h1>
                <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg font-bold ${
                        isTimeRunningOut
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                    }`}
                >
                    <Clock className="w-5 h-5" />
                    {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                </div>
            </div>

            {/* Progress */}
            <div className="mb-6">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
                    <span>
            Answered: {answeredCount}/{questions.length}
          </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${((answeredCount) / questions.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Question Card */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>
                        <QuestionDisplay
                            question={currentQuestion}
                            questionNumber={currentQuestionIndex + 1}
                        />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <AnswerOptions
                        question={currentQuestion}
                        selectedAnswer={answers.get(currentQuestion.id) || null}
                        onSelectOption={(option) => {
                            submitAnswer(currentQuestion.id, option);
                        }}
                        disabled={isSubmitting}
                    />
                </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0 || isSubmitting}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                </Button>

                <div className="flex items-center gap-2">
                    {currentQuestionIndex === questions.length - 1 ? (
                        <Button
                            onClick={handleFinish}
                            disabled={isSubmitting}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            {isSubmitting ? 'Submitting...' : 'Submit Exam'}
                        </Button>
                    ) : (
                        <Button onClick={handleNext} disabled={isSubmitting}>
                            Next
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Question Navigator */}
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle className="text-lg">Question Navigator</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-10 gap-2">
                        {questions.map((q, index) => {
                            const isAnswered = answers.has(q.id);
                            const isCurrent = index === currentQuestionIndex;

                            return (
                                <button
                                    key={q.id}
                                    onClick={() => setCurrentQuestionIndex(index)}
                                    disabled={isSubmitting}
                                    className={`aspect-square flex items-center justify-center rounded-lg font-medium text-sm transition-all ${
                                        isCurrent
                                            ? 'bg-blue-500 text-white'
                                            : isAnswered
                                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {index + 1}
                                </button>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}