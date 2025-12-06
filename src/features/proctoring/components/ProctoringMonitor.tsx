'use client';

import { useEffect, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { proctoringApi } from '../api/proctoring.api';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { AlertTriangle, CheckCircle, Video, VideoOff } from 'lucide-react';

interface ProctoringMonitorProps {
    sessionId: number;
    isActive: boolean;
}

/**
 * Real-time proctoring monitor component
 *
 * Features:
 * - Webcam capture
 * - Face detection via YOLO
 * - Violation tracking
 *
 * CRITICAL: Uses proctoringApi.getEvents() (NOT getViolations - that doesn't exist!)
 */
export function ProctoringMonitor({ sessionId, isActive }: ProctoringMonitorProps) {
    const queryClient = useQueryClient();
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // CRITICAL FIX: Initialize as null, not undefined
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const [webcamActive, setWebcamActive] = useState(false);
    const [lastAnalysis, setLastAnalysis] = useState<any>(null);

    // Fetch proctoring events (NOT getViolations!)
    // Returns: { events: ProctoringEvent[], total: number }
    const { data: eventsData } = useQuery({
        queryKey: ['proctoring-events', sessionId],
        queryFn: () => proctoringApi.getEvents(sessionId),
        enabled: isActive && !!sessionId,
        refetchInterval: 5000, // Refresh every 5 seconds
    });

    // Mutation for face analysis
    const analyzeFaceMutation = useMutation({
        mutationFn: (imageBase64: string) =>
            proctoringApi.analyzeFace(sessionId, { imageBase64 }),
        onSuccess: (data) => {
            setLastAnalysis(data.analysis);
            // Refresh events list if violation detected
            if (data.eventLogged) {
                queryClient.invalidateQueries({ queryKey: ['proctoring-events', sessionId] });
            }
        },
    });

    // Start webcam
    useEffect(() => {
        if (!isActive) return;

        const startWebcam = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 640, height: 480 },
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    setWebcamActive(true);
                }
            } catch (error) {
                console.error('Error accessing webcam:', error);
                setWebcamActive(false);
            }
        };

        startWebcam();

        return () => {
            if (videoRef.current?.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [isActive]);

    // Capture and analyze frames periodically
    useEffect(() => {
        if (!isActive || !webcamActive) return;

        const captureFrame = () => {
            if (!videoRef.current || !canvasRef.current) return;

            const canvas = canvasRef.current;
            const video = videoRef.current;
            const context = canvas.getContext('2d');

            if (!context) return;

            // Draw video frame to canvas
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0);

            // Convert to base64
            const imageBase64 = canvas.toDataURL('image/jpeg').split(',')[1];

            // Analyze face
            analyzeFaceMutation.mutate(imageBase64);
        };

        // Capture frame every 10 seconds
        intervalRef.current = setInterval(captureFrame, 10000);

        // Initial capture after 2 seconds
        setTimeout(captureFrame, 2000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isActive, webcamActive]);

    // Access events array directly (NOT eventsData.data)
    // eventsData is { events: ProctoringEvent[], total: number }
    const events = eventsData?.events || [];
    const recentViolations = events.filter((e) => e.severity === 'HIGH').slice(0, 3);

    if (!isActive) {
        return null;
    }

    return (
        <Card className="border-orange-200">
            <CardContent className="pt-6">
                <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold flex items-center">
                            <Video className="w-4 h-4 mr-2" />
                            Proctoring Monitor
                        </h3>
                        <Badge variant={webcamActive ? 'default' : 'destructive'}>
                            {webcamActive ? (
                                <>
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Aktif
                                </>
                            ) : (
                                <>
                                    <VideoOff className="w-3 h-3 mr-1" />
                                    Tidak Aktif
                                </>
                            )}
                        </Badge>
                    </div>

                    {/* Webcam Feed */}
                    <div className="relative bg-gray-900 rounded-lg overflow-hidden">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-48 object-cover"
                        />
                        <canvas ref={canvasRef} className="hidden" />
                    </div>

                    {/* Last Analysis */}
                    {lastAnalysis && (
                        <div className="p-3 bg-gray-50 rounded-lg text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Deteksi Wajah:</span>
                                <Badge variant={lastAnalysis.faceDetected ? 'default' : 'destructive'}>
                                    {lastAnalysis.faceDetected ? 'Terdeteksi' : 'Tidak Terdeteksi'}
                                </Badge>
                            </div>
                            {lastAnalysis.violations?.length > 0 && (
                                <div className="mt-2">
                                    <p className="text-orange-600 font-medium">
                                        Pelanggaran: {lastAnalysis.violations.join(', ')}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Recent Violations */}
                    {recentViolations.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-orange-600 flex items-center">
                                <AlertTriangle className="w-4 h-4 mr-2" />
                                Peringatan Terbaru
                            </p>
                            {recentViolations.map((event) => (
                                <div
                                    key={event.id}
                                    className="p-2 bg-orange-50 rounded text-xs text-orange-800"
                                >
                                    {event.eventType}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Info */}
                    <p className="text-xs text-gray-500 text-center">
                        Sistem proctoring aktif. Pastikan wajah Anda selalu terlihat di kamera.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}