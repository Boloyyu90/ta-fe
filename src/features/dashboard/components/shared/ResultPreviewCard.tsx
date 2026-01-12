import Link from "next/link";
import { CheckCircle2, XCircle, Eye } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import type { ExamResult } from "@/features/exam-sessions/types/exam-sessions.types";

interface ResultPreviewCardProps {
    result: ExamResult;
}

/**
 * ResultPreviewCard Component
 *
 * Displays a preview of an exam result with title, score, status badge,
 * and a button to view details.
 */
export function ResultPreviewCard({ result }: ResultPreviewCardProps) {
    const passingScore = result.exam.passingScore ?? 0;
    const isPassed =
        result.totalScore !== null &&
        passingScore > 0 &&
        result.totalScore >= passingScore;

    return (
        <Card className="h-full flex flex-col">
            <CardContent className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold line-clamp-1 mb-2">
                    {result.exam.title}
                </h3>

                {/* Pass/Fail Badge */}
                {passingScore > 0 && (
                    <Badge
                        variant={isPassed ? "default" : "destructive"}
                        className="mb-3 w-fit"
                    >
                        {isPassed ? (
                            <>
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Lulus
                            </>
                        ) : (
                            <>
                                <XCircle className="h-3 w-3 mr-1" />
                                Tidak Lulus
                            </>
                        )}
                    </Badge>
                )}

                <div className="space-y-1 text-sm mb-4">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Skor</span>
                        <span className="font-medium">
                            {result.totalScore ?? 0}
                            {passingScore > 0 && ` / ${passingScore}`}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Dijawab</span>
                        <span>
                            {result.answeredQuestions}/{result.totalQuestions}
                        </span>
                    </div>
                </div>

                <div className="mt-auto">
                    <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="w-full"
                    >
                        <Link href={`/results/${result.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            Detail
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
