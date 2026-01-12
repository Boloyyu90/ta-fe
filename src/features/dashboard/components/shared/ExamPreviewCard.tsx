import Link from "next/link";
import { Timer, Target, Award } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import type { ExamPublic } from "@/features/exams/types/exams.types";

interface ExamPreviewCardProps {
    exam: ExamPublic;
}

/**
 * Format duration in minutes to readable string
 */
function formatDuration(minutes: number): string {
    if (minutes < 60) return `${minutes} menit`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}j ${mins}m` : `${hours} jam`;
}

/**
 * ExamPreviewCard Component
 *
 * Displays a preview of an available exam with title, description,
 * duration, question count, and a button to start the exam.
 */
export function ExamPreviewCard({ exam }: ExamPreviewCardProps) {
    return (
        <Card className="h-full flex flex-col">
            <CardContent className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold line-clamp-1 mb-2">{exam.title}</h3>
                {exam.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {exam.description}
                    </p>
                )}

                <div className="space-y-1 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                        <Timer className="h-4 w-4" />
                        {formatDuration(exam.durationMinutes)}
                    </div>
                    <div className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        {exam._count?.examQuestions ?? 0} soal
                    </div>
                    <div className="flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        <span>Passing: {exam.passingScore}</span>
                    </div>
                </div>

                <div className="mt-auto">
                    <Button asChild className="w-full">
                        <Link href={`/exams/${exam.id}`}>Mulai Ujian</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
