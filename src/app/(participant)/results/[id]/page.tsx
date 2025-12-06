'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useResultDetail } from '@/features/exam-sessions/hooks/useResultDetail';
import { proctoringApi } from '@/features/proctoring/api/proctoring.api';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Calendar, Clock, CheckCircle, XCircle, AlertTriangle, Eye } from 'lucide-react';
import Link from 'next/link';
import { formatDate, formatDuration } from '@/lib/utils/formatters';

/**
 * Result Detail Page
 *
 * Shows detailed exam results including:
 * - Score breakdown
 * - Time spent
 * - Proctoring events (violations)
 */
export default function ResultDetailPage() {
    const params = useParams();
    const sessionId = parseInt(params.id as string);

    // Fetch result detail
    // Returns: { userExam: UserExam }
    const { data: resultData, isLoading: resultLoading } = useResultDetail(sessionId);

    // Fetch proctoring events (NOT getViolations - that doesn't exist!)
    // Returns: { events: ProctoringEvent[], total: number }
    const { data: eventsData, isLoading: eventsLoading } = useQuery({
        queryKey: ['proctoring-events', sessionId],
        queryFn: () => proctoringApi.getEvents(sessionId),
        enabled: !!sessionId,
    });

    // Access the userExam from the wrapper
    const userExam = resultData?.userExam;

    // Access events array directly (NOT eventsData.data - it's just an array)
    const events = eventsData?.events || [];

    if (resultLoading) {
        return (
            <div className="container mx-auto py-8">
                <div className="text-center py-12 text-gray-500">
                    Memuat data...
                </div>
            </div>
        );
    }

    if (!userExam) {
        return (
            <div className="container mx-auto py-8">
                <Card>
                    <CardContent className="text-center py-12">
                        <p className="text-gray-600">Hasil ujian tidak ditemukan</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const isPassed = (userExam.totalScore || 0) >= userExam.exam.passingScore;

    return (
        <div className="container mx-auto py-8 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">{userExam.exam.title}</h1>
                <p className="text-gray-600 mt-2">Detail hasil ujian</p>
            </div>

            {/* Score Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Hasil Ujian</span>
                        <Badge className={isPassed ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}>
                            {isPassed ? (
                                <>
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Lulus
                                </>
                            ) : (
                                <>
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Tidak Lulus
                                </>
                            )}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Total Score */}
                    <div className="bg-gray-50 p-6 rounded-lg text-center">
                        <p className="text-sm text-gray-600 mb-2">Total Skor</p>
                        <p className="text-5xl font-bold">{userExam.totalScore || 0}</p>
                        <p className="text-sm text-gray-500 mt-2">
                            Passing Score: {userExam.exam.passingScore}
                        </p>
                    </div>

                    {/* Score Breakdown */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg text-center">
                            <p className="text-sm text-blue-600 mb-1">TIU</p>
                            <p className="text-2xl font-bold text-blue-800">{userExam.tiuScore || 0}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg text-center">
                            <p className="text-sm text-green-600 mb-1">TWK</p>
                            <p className="text-2xl font-bold text-green-800">{userExam.twkScore || 0}</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg text-center">
                            <p className="text-sm text-purple-600 mb-1">TKP</p>
                            <p className="text-2xl font-bold text-purple-800">{userExam.tkpScore || 0}</p>
                        </div>
                    </div>

                    {/* Exam Info */}
                    <div className="space-y-2 pt-4 border-t">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                Waktu Pengerjaan
                            </span>
                            <span className="font-medium">
                                {formatDate(userExam.submittedAt || userExam.endTime || userExam.updatedAt)}
                            </span>
                        </div>

                        {userExam.timeSpent && (
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 flex items-center">
                                    <Clock className="w-4 h-4 mr-2" />
                                    Durasi
                                </span>
                                <span className="font-medium">
                                    {formatDuration(Math.floor(userExam.timeSpent / 60))} menit
                                </span>
                            </div>
                        )}

                        {userExam.violationCount !== undefined && (
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 flex items-center">
                                    <AlertTriangle className="w-4 h-4 mr-2" />
                                    Pelanggaran
                                </span>
                                <span className={`font-medium ${userExam.violationCount > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                                    {userExam.violationCount} kejadian
                                </span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Proctoring Events */}
            {events.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
                            Riwayat Proctoring
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {events.map((event) => (
                                <div
                                    key={event.id}
                                    className="flex items-start justify-between p-3 bg-orange-50 rounded-lg"
                                >
                                    <div>
                                        <p className="font-medium text-sm">{event.eventType}</p>
                                        <p className="text-xs text-gray-600 mt-1">
                                            {formatDate(event.timestamp)}
                                        </p>
                                    </div>
                                    <Badge variant="outline" className="text-orange-600">
                                        Severity: {event.severity}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Review Answers Button */}
            <div className="flex justify-center">
                <Link href={`/exam-sessions/${sessionId}/review`}>
                    <Button size="lg">
                        <Eye className="w-4 h-4 mr-2" />
                        Review Jawaban
                    </Button>
                </Link>
            </div>
        </div>
    );
}