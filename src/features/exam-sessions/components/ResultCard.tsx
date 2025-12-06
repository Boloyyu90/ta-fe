import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Calendar, Clock, CheckCircle, XCircle, Eye, TrendingUp, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import type { UserExam, UserExamStatus } from '../types/exam-sessions.types';
import { formatDate, formatDuration } from '@/shared/lib/formatters';

interface ResultCardProps {
    userExam: UserExam;
}

/**
 * Displays an exam result card
 *
 * CRITICAL: Use UserExamStatus (not ExamStatus) for status configuration
 */
export function ResultCard({ userExam }: ResultCardProps) {
    // Status configuration for USER EXAM statuses
    const statusConfig: Record<UserExamStatus, { label: string; color: string; icon: typeof CheckCircle }> = {
        NOT_STARTED: {
            label: 'Belum Dimulai',
            color: 'bg-gray-100 text-gray-800',
            icon: Clock,
        },
        IN_PROGRESS: {
            label: 'Sedang Berlangsung',
            color: 'bg-blue-100 text-blue-800',
            icon: Clock,
        },
        FINISHED: {
            label: 'Selesai',
            color: 'bg-green-100 text-green-800',
            icon: CheckCircle,
        },
        COMPLETED: {
            label: 'Selesai',
            color: 'bg-green-100 text-green-800',
            icon: CheckCircle,
        },
        TIMEOUT: {
            label: 'Waktu Habis',
            color: 'bg-orange-100 text-orange-800',
            icon: AlertTriangle,
        },
        CANCELLED: {
            label: 'Dibatalkan',
            color: 'bg-red-100 text-red-800',
            icon: XCircle,
        },
    };

    const status = statusConfig[userExam.status];
    const StatusIcon = status.icon;

    const isPassed = (userExam.totalScore || 0) >= userExam.exam.passingScore;

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{userExam.exam.title}</h3>
                        <div className="flex items-center gap-2">
                            <Badge className={status.color}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {status.label}
                            </Badge>
                            {userExam.totalScore !== null && userExam.totalScore !== undefined && (
                                <Badge className={isPassed ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}>
                                    {isPassed ? 'Lulus' : 'Tidak Lulus'}
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Score Section */}
                {userExam.totalScore !== null && userExam.totalScore !== undefined && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Total Skor</span>
                            <span className="text-2xl font-bold">{userExam.totalScore}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                            <div>
                                <span className="text-gray-600">TIU:</span>
                                <span className="font-semibold ml-1">{userExam.tiuScore || 0}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">TWK:</span>
                                <span className="font-semibold ml-1">{userExam.twkScore || 0}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">TKP:</span>
                                <span className="font-semibold ml-1">{userExam.tkpScore || 0}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Details */}
                <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Selesai: {formatDate(userExam.submittedAt || userExam.endTime || userExam.updatedAt)}</span>
                    </div>

                    {userExam.timeSpent && (
                        <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>Waktu: {formatDuration(Math.floor(userExam.timeSpent / 60))}</span>
                        </div>
                    )}

                    {userExam.violationCount !== undefined && userExam.violationCount > 0 && (
                        <div className="flex items-center text-sm text-orange-600">
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            <span>{userExam.violationCount} pelanggaran terdeteksi</span>
                        </div>
                    )}
                </div>

                {/* Action Button */}
                <Link href={`/results/${userExam.id}`}>
                    <Button variant="outline" className="w-full">
                        <Eye className="w-4 h-4 mr-2" />
                        Lihat Detail
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}