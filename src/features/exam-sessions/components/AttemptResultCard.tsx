'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Eye, Trophy, XCircle } from 'lucide-react';
import type { ExamResult } from '../types/exam-sessions.types';

// Passing grades per kategori CPNS (standard values)
const PASSING_GRADES = {
    TWK: 65,
    TIU: 80,
    TKP: 166,
} as const;

interface AttemptResultCardProps {
    title: string;
    result: ExamResult;
    showReviewButton?: boolean;
}

export function AttemptResultCard({
    title,
    result,
    showReviewButton = false,
}: AttemptResultCardProps) {
    const passingScore = result.exam.passingScore;
    const isPassed = result.totalScore !== null && result.totalScore >= passingScore;

    return (
        <Card className="overflow-hidden">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-primary">{title}</p>
                        <CardTitle className="text-lg mt-1">{result.exam.title}</CardTitle>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Score Display */}
                    <div className="flex-shrink-0 flex flex-col items-center lg:items-start">
                        <div className="relative">
                            <span className="text-5xl font-bold text-primary">
                                {result.totalScore ?? 0}
                            </span>
                            {/* Decorative dots pattern */}
                            <div className="absolute -right-8 top-0 grid grid-cols-4 gap-1 opacity-30">
                                {Array.from({ length: 16 }).map((_, i) => (
                                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary" />
                                ))}
                            </div>
                        </div>
                        <Badge
                            className={`mt-3 ${
                                isPassed
                                    ? 'bg-green-600 hover:bg-green-700'
                                    : 'bg-red-600 hover:bg-red-700'
                            }`}
                        >
                            {isPassed ? (
                                <>
                                    <Trophy className="h-3 w-3 mr-1" />
                                    LULUS
                                </>
                            ) : (
                                <>
                                    <XCircle className="h-3 w-3 mr-1" />
                                    TIDAK LULUS
                                </>
                            )}
                        </Badge>
                    </div>

                    {/* Score by Type Table */}
                    <div className="flex-1">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2 px-3 font-medium text-muted-foreground">
                                        Kategori
                                    </th>
                                    <th className="text-center py-2 px-3 font-medium text-muted-foreground">
                                        Passing Grade
                                    </th>
                                    <th className="text-center py-2 px-3 font-medium text-muted-foreground">
                                        Nilai Akhir
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {result.scoresByType && result.scoresByType.length > 0 ? (
                                    result.scoresByType.map((st) => {
                                        const categoryPassing =
                                            PASSING_GRADES[st.type as keyof typeof PASSING_GRADES] ?? 0;
                                        const isTypePassed = st.score >= categoryPassing;
                                        return (
                                            <tr key={st.type} className="border-b last:border-0">
                                                <td className="py-3 px-3">
                                                    <Badge variant="secondary" className="font-medium">
                                                        {st.type}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 px-3 text-center">{categoryPassing}</td>
                                                <td
                                                    className={`py-3 px-3 text-center font-bold ${
                                                        isTypePassed ? 'text-green-600' : 'text-red-500'
                                                    }`}
                                                >
                                                    {st.score}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    // Fallback jika scoresByType kosong
                                    <>
                                        <tr className="border-b">
                                            <td className="py-3 px-3">
                                                <Badge variant="secondary">TWK</Badge>
                                            </td>
                                            <td className="py-3 px-3 text-center">65</td>
                                            <td className="py-3 px-3 text-center text-muted-foreground">-</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="py-3 px-3">
                                                <Badge variant="secondary">TIU</Badge>
                                            </td>
                                            <td className="py-3 px-3 text-center">80</td>
                                            <td className="py-3 px-3 text-center text-muted-foreground">-</td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 px-3">
                                                <Badge variant="secondary">TKP</Badge>
                                            </td>
                                            <td className="py-3 px-3 text-center">166</td>
                                            <td className="py-3 px-3 text-center text-muted-foreground">-</td>
                                        </tr>
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Review Button */}
                    {showReviewButton && (
                        <div className="flex items-end justify-end lg:justify-start">
                            <Button asChild variant="outline" size="sm">
                                <Link href={`/results/${result.id}`}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    Pembahasan
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default AttemptResultCard;
