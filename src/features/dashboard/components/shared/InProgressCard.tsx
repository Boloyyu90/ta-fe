"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlayCircle, Timer, Calendar, Target } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import type { UserExam } from "@/features/exam-sessions/types/exam-sessions.types";

interface InProgressCardProps {
    session: UserExam;
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
 * TimeAgo component - client-side only to avoid hydration issues
 */
function TimeAgo({ date }: { date: string | Date }) {
    const [relativeTime, setRelativeTime] = useState<string>("...");

    useEffect(() => {
        const now = new Date();
        const target = new Date(date);
        const diffInSeconds = Math.floor(
            (now.getTime() - target.getTime()) / 1000
        );

        if (diffInSeconds < 60) {
            setRelativeTime("baru saja");
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            setRelativeTime(`${minutes} menit lalu`);
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            setRelativeTime(`${hours} jam lalu`);
        } else {
            const days = Math.floor(diffInSeconds / 86400);
            setRelativeTime(`${days} hari lalu`);
        }
    }, [date]);

    return <span>{relativeTime}</span>;
}

/**
 * InProgressCard Component
 *
 * Displays an in-progress exam session with exam title,
 * attempt number, duration, started time, progress, and a button to continue.
 */
export function InProgressCard({ session }: InProgressCardProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <Card className="border-primary/20">
            <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold line-clamp-1">
                        {session.exam.title}
                    </h3>
                    <div className="flex flex-col gap-1 items-end">
                        <Badge variant="default">
                            <PlayCircle className="h-3 w-3 mr-1" />
                            Berlangsung
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                            Percobaan ke-{session.attemptNumber}
                        </Badge>
                    </div>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    {session.durationMinutes && (
                        <div className="flex items-center gap-2">
                            <Timer className="h-4 w-4" />
                            {formatDuration(session.durationMinutes)}
                        </div>
                    )}
                    {isMounted && session.startedAt && (
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Dimulai <TimeAgo date={session.startedAt} />
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        {session.answeredQuestions}/{session.totalQuestions} soal
                    </div>
                </div>

                <Button asChild className="w-full">
                    <Link href={`/exam-sessions/${session.id}/take`}>
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Lanjutkan
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}
