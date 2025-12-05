// src/app/(participant)/exam-sessions/[id]/review/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useExamSession } from '@/features/exam-sessions/hooks/useExamSession';
import { useExamAnswers } from '@/features/exam-sessions/hooks/useExamAnswers';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';

export default function ExamReviewPage() {
    const params = useParams();
    const sessionId = parseInt(params.id as string);

    const { data: sessionData, isLoading: isLoadingSession } = useExamSession(sessionId);
    const { data: answersData, isLoading: isLoadingAnswers } = useExamAnswers(sessionId);

    if (isLoadingSession || isLoadingAnswers) {
        return <Skeleton className="h-96" />;
    }

    const session = sessionData?.userExam;
    const answers = answersData?.answers || [];

    if (!session) {
        return (
            <Alert variant="destructive">
                <AlertDescription>Session not found</AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Exam Review</h1>
            <p>Score: {session.totalScore}</p>
            <div className="space-y-4">
                {answers.map((answer, index) => (
                    <div key={answer.id} className="border p-4 rounded">
                        <p className="font-medium">Question {index + 1}</p>
                        <p>{answer.questionContent}</p>
                        <p className="mt-2">
                            Your answer: {answer.selectedOption}
                            {answer.isCorrect ? ' ✓' : ' ✗'}
                        </p>
                        <p>Correct answer: {answer.correctAnswer}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}