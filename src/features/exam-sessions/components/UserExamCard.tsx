import { Card, CardContent, CardFooter, CardHeader } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Calendar, Clock, BookOpen, Play, Eye, CheckCircle, XCircle, Loader } from 'lucide-react';
import Link from 'next/link';
import type { UserExam, UserExamStatus } from '../types/exam-sessions.types';
import { formatDate, formatDuration } from '@/lib/utils/formatters';

interface UserExamCardProps {
    userExam: UserExam;
}

interface StatusConfig {
    label: string;
    color: string;
    icon: typeof Play;
}

/**
 * Displays a user exam session card
 *
 * CRITICAL: Use UserExamStatus (not ExamStatus) for status configuration
 * Valid statuses: NOT_STARTED, IN_PROGRESS, FINISHED, TIMEOUT, CANCELLED, COMPLETED
 */
export function UserExamCard({ userExam }: UserExamCardProps) {
    // Status configuration for USER EXAM statuses (not exam definition statuses)
    const statusConfig: Record<UserExamStatus, StatusConfig> = {
        NOT_STARTED: {
            label: 'Belum Dimulai',
            color: 'bg-gray-100 text-gray-800',
            icon: Clock,
        },
        IN_PROGRESS: {
            label: 'Sedang Berlangsung',
            color: 'bg-blue-100 text-blue-800',
            icon: Loader,
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
            icon: Clock,
        },
        CANCELLED: {
            label: 'Dibatalkan',
            color: 'bg-red-100 text-red-800',
            icon: XCircle,
        },
    };

    const status = statusConfig[userExam.status];
    const StatusIcon = status.icon;

    const canStart = userExam.status === 'NOT_STARTED';
    const canContinue = userExam.status === 'IN_PROGRESS';
    const canViewResult = ['FINISHED', 'COMPLETED', 'TIMEOUT'].includes(userExam.status);

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{userExam.exam.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                            {userExam.exam.description}
                        </p>
                    </div>
                    <Badge className={status.color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {status.label}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Terdaftar: {formatDate(userExam.createdAt)}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Durasi: {formatDuration(userExam.exam.duration)}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                    <BookOpen className="w-4 h-4 mr-2" />
                    <span>{userExam.exam.totalQuestions} soal</span>
                </div>

                {userExam.totalScore !== null && userExam.totalScore !== undefined && (
                    <div className="flex items-center text-sm font-semibold text-green-600">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        <span>Skor: {userExam.totalScore}</span>
                    </div>
                )}
            </CardContent>

            <CardFooter>
                {canStart && (
                    <Link href={`/exam-sessions/${userExam.id}/take`} className="w-full">
                        <Button className="w-full">
                            <Play className="w-4 h-4 mr-2" />
                            Mulai Ujian
                        </Button>
                    </Link>
                )}

                {canContinue && (
                    <Link href={`/exam-sessions/${userExam.id}/take`} className="w-full">
                        <Button className="w-full">
                            <Loader className="w-4 h-4 mr-2" />
                            Lanjutkan Ujian
                        </Button>
                    </Link>
                )}

                {canViewResult && (
                    <Link href={`/results/${userExam.id}`} className="w-full">
                        <Button variant="outline" className="w-full">
                            <Eye className="w-4 h-4 mr-2" />
                            Lihat Hasil
                        </Button>
                    </Link>
                )}
            </CardFooter>
        </Card>
    );
}