// src/app/(participant)/exam-sessions/[id]/review/page.tsx

'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { examSessionsApi } from '@/features/exam-sessions/api/exam-sessions.api';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';

export default function ExamReviewPage() {
    const params = useParams();
    const sessionId = Number(params.id);

    const { data: answersData, isLoading } = useQuery({
        queryKey: ['exam-answers', sessionId],
        queryFn: () => examSessionsApi.getExamAnswers(sessionId),
    });

    if (isLoading) {
        return <div className="flex justify-center p-8">Loading answers...</div>;
    }

    if (!answersData || !answersData.answers) {
        return <div className="flex justify-center p-8">No answers found</div>;
    }

    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-2xl font-bold">Exam Review</h1>
                <p className="text-muted-foreground">Review your submitted answers</p>
            </div>

            <div className="space-y-4">
                {answersData.answers.map((answer, index) => (
                    <Card key={answer.id}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">
                                    Question {index + 1}
                                </CardTitle>
                                {answer.isCorrect ? (
                                    <Badge className="bg-green-500">
                                        <CheckCircle className="mr-1 h-3 w-3" />
                                        Correct
                                    </Badge>
                                ) : (
                                    <Badge variant="destructive">
                                        <XCircle className="mr-1 h-3 w-3" />
                                        Incorrect
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* ✅ FIXED: Access via answer.examQuestion.content */}
                            <p className="font-medium">{answer.examQuestion.content}</p>

                            <div className="space-y-2">
                                {/* ✅ FIXED: Access via answer.selectedOption */}
                                <p>
                                    <span className="font-medium">Your answer:</span>{' '}
                                    {answer.selectedOption || 'Not answered'}
                                </p>

                                {/* ✅ FIXED: Correct answer is in examQuestion */}
                                {!answer.isCorrect && (
                                    <p className="text-green-600">
                                        <span className="font-medium">Correct answer:</span>{' '}
                                        {answer.examQuestion.options[
                                            answer.examQuestion.content.match(/correct.*?([A-E])/i)?.[1] as 'A' | 'B' | 'C' | 'D' | 'E'
                                            ] || 'N/A'}
                                    </p>
                                )}
                            </div>

                            {/* Show all options */}
                            <div className="space-y-2 pt-2 border-t">
                                <p className="font-medium text-sm text-muted-foreground">Options:</p>
                                {(['A', 'B', 'C', 'D', 'E'] as const).map((optionKey) => (
                                    <div
                                        key={optionKey}
                                        className={`p-2 rounded ${
                                            answer.selectedOption === optionKey
                                                ? 'bg-blue-50 border border-blue-200'
                                                : ''
                                        }`}
                                    >
                                        <span className="font-medium">{optionKey}.</span>{' '}
                                        {answer.examQuestion.options[optionKey]}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}