// src/features/proctoring/components/ProctoringMonitor.tsx
'use client';

import { useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { proctoringApi } from '../api/proctoring.api';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';

interface ProctoringMonitorProps {
    sessionId: number;
    enabled?: boolean;
}

export function ProctoringMonitor({ sessionId, enabled = true }: ProctoringMonitorProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const { data: eventsData } = useQuery({
        queryKey: ['proctoring-events', sessionId],
        queryFn: () => proctoringApi.getViolations(sessionId),
        enabled: enabled && !!sessionId,
        refetchInterval: 5000, // Poll every 5 seconds
    });

    useEffect(() => {
        if (!enabled) return;

        // Start webcam
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            })
            .catch((error) => {
                console.error('Error accessing webcam:', error);
            });

        // Cleanup
        return () => {
            if (videoRef.current?.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [enabled]);

    const events = eventsData || [];
    const recentViolations = events.slice(-5);

    return (
        <div className="fixed bottom-4 right-4 space-y-2">
            <div className="w-64 bg-background border rounded-lg overflow-hidden shadow-lg">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full"
                />
            </div>
            {recentViolations.length > 0 && (
                <Alert variant="destructive" className="w-64">
                    <AlertDescription>
                        {recentViolations.length} recent violations detected
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}