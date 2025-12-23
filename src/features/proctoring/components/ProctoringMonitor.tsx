// src/features/proctoring/components/ProctoringMonitor.tsx

/**
 * Proctoring Monitor Component - WITH ML INTEGRATION
 *
 * ============================================================================
 * CRITICAL FIX: Added complete ML/YOLO integration
 * ============================================================================
 *
 * Changes:
 * ✅ Integrated useAnalyzeFace hook for real-time face detection
 * ✅ Added periodic frame capture (captureInterval prop now functional)
 * ✅ Violation detection and logging via YOLO service
 * ✅ Real-time violation alerts with auto-dismiss
 * ✅ Store integration (addViolation, increment counters)
 * ✅ Indonesian error messages using PROCTORING_ERRORS
 * ✅ Graceful degradation on ML service failures
 *
 * Real-time proctoring with ML-powered face detection for exam taking interface
 */

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';
import {
    Camera,
    CameraOff,
    AlertTriangle,
    CheckCircle,
    RefreshCw,
    Eye,
} from 'lucide-react';
import { toast } from 'sonner';
import { useProctoringStore } from '../store/proctoring.store';
import { useAnalyzeFace } from '../hooks/useAnalyzeFace';
import { PROCTORING_ERRORS, getErrorMessage } from '@/shared/lib/errors';
import { getSeverityForEventType, isProctoringEventType } from '../types/proctoring.types';
import type { ProctoringEvent, FaceAnalysisResult, Violation } from '../types/proctoring.types';

// ============================================================================
// COMPONENT PROPS
// ============================================================================

export interface ProctoringMonitorProps {
    /** Current exam session ID */
    sessionId: number;
    /** Callback when a violation is detected */
    onViolation?: (event: ProctoringEvent) => void;
    /** Interval between frame captures (ms) */
    captureInterval?: number;
    /** Enable/disable proctoring */
    enabled?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function ProctoringMonitor({
                                      sessionId,
                                      onViolation,
                                      captureInterval = 10000,
                                      enabled = true,
                                  }: ProctoringMonitorProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const captureIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Get store state and actions
    const {
        webcam,
        violations,
        isAnalyzing,
        violationCount,
        highViolationCount,
        setWebcamEnabled,
        setWebcamStreaming,
        setWebcamPermission,
        setWebcamError,
        setAnalyzing,
        addViolation,
        incrementViolationCount,
        incrementHighViolationCount,
    } = useProctoringStore();

    // ✅ ML INTEGRATION: Face analysis hook
    const analyzeFace = useAnalyzeFace(sessionId);

    // ✅ ML INTEGRATION: State for ML analysis results
    const [lastAnalysis, setLastAnalysis] = useState<FaceAnalysisResult | null>(null);
    const [lastViolationAlert, setLastViolationAlert] = useState<string | null>(null);

    // ✅ ADAPTIVE RATE LIMITING: Dynamic interval adjustment
    const [currentInterval, setCurrentInterval] = useState(captureInterval);
    const [consecutiveErrors, setConsecutiveErrors] = useState(0);

    // ✅ TAB SWITCHING DETECTION: Track tab visibility
    const [tabSwitchCount, setTabSwitchCount] = useState(0);

    // ✅ OFFLINE MODE HANDLING: Network status tracking
    const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
    const [wasOffline, setWasOffline] = useState(false);

    // =========================================================================
    // ML INTEGRATION: FRAME CAPTURE AND ANALYSIS
    // =========================================================================

    /**
     * Capture frame from video and convert to base64
     */
    const captureFrame = useCallback((): string | null => {
        if (!videoRef.current || !canvasRef.current) return null;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) return null;

        // Set canvas size to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw current video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert to base64
        return canvas.toDataURL('image/jpeg', 0.8);
    }, []);

    /**
     * Handle ML face analysis
     * THESIS SHOWCASE: YOLO integration for real-time face detection
     */
    const handleFrameAnalysis = useCallback(
        async () => {
            // Skip if already analyzing or not streaming
            if (isAnalyzing || !webcam.isStreaming) {
                return;
            }

            const imageData = captureFrame();
            if (!imageData) return;

            setAnalyzing(true);

            try {
                // Call YOLO ML service via backend
                const result = await analyzeFace.mutateAsync({
                    imageBase64: imageData,
                });

                // Store the analysis result
                setLastAnalysis(result.analysis);

                // ✅ ADAPTIVE RATE LIMITING: Reset on successful analysis
                if (consecutiveErrors > 0) {
                    setConsecutiveErrors(0);
                    setCurrentInterval(captureInterval);
                    console.info('ML service recovered. Reset to normal interval.');
                }

                // Check for violations (not FACE_DETECTED)
                const hasViolation = result.analysis.violations.some(
                    (v) => v !== 'FACE_DETECTED'
                );

                if (hasViolation && result.eventLogged) {
                    // Increment counters
                    incrementViolationCount();

                    // Determine severity using helper function with type guard
                    const violationString = result.analysis.violations[0];
                    
                    // Validate that violation is a valid ProctoringEventType
                    if (!isProctoringEventType(violationString)) {
                        console.warn(
                            `[Proctoring] Unknown violation type: ${violationString}. Using fallback.`
                        );
                        return; // Skip this violation
                    }
                    
                    const violationType = violationString; // Now properly typed as ProctoringEventType
                    const severity = getSeverityForEventType(violationType);
                    const isHighSeverity = severity === 'HIGH';

                    if (isHighSeverity) {
                        incrementHighViolationCount();
                    }

                    // Get violation message
                    const message = violationType === 'NO_FACE_DETECTED'
                        ? 'Wajah tidak terdeteksi'
                        : violationType === 'MULTIPLE_FACES'
                            ? 'Terdeteksi beberapa wajah'
                            : violationType === 'LOOKING_AWAY'
                                ? 'Anda sedang melihat ke arah lain'
                                : 'Pelanggaran terdeteksi';

                    // Create violation for UI display
                    const violation: Violation = {
                        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                        type: result.eventType || 'NO_FACE_DETECTED',
                        severity,
                        timestamp: new Date().toISOString(),
                        message,
                    };

                    addViolation(violation);

                    // Show alert for new violation
                    setLastViolationAlert(message);

                    // Auto-hide alert after 5 seconds
                    setTimeout(() => {
                        setLastViolationAlert(null);
                    }, 5000);
                }
            } catch (error) {
                console.error('Face analysis error:', error);

                // ✅ ADAPTIVE RATE LIMITING: Exponential backoff on errors
                const newErrorCount = consecutiveErrors + 1;
                setConsecutiveErrors(newErrorCount);

                // Increase interval exponentially: 5s → 10s → 20s → 40s (max)
                const backoffMultiplier = Math.min(Math.pow(2, newErrorCount), 8);
                const newInterval = captureInterval * backoffMultiplier;
                setCurrentInterval(newInterval);

                // Show error toast only on first error to avoid spam
                if (newErrorCount === 1) {
                    const errorMsg = getErrorMessage(PROCTORING_ERRORS.PROCTORING_ML_SERVICE_ERROR);
                    toast.error('Error Proctoring', {
                        description: errorMsg,
                        duration: 10000,
                    });
                }

                console.warn(`ML service error. Backing off to ${newInterval}ms interval.`);
                // Don't block exam on proctoring errors - graceful degradation
            } finally {
                setAnalyzing(false);
            }
        },
        [
            isAnalyzing,
            webcam.isStreaming,
            captureFrame,
            setAnalyzing,
            analyzeFace,
            setLastAnalysis,
            addViolation,
            incrementViolationCount,
            incrementHighViolationCount,
            onViolation,
            consecutiveErrors,
            captureInterval,
        ]
    );

    // =========================================================================
    // WEBCAM INITIALIZATION
    // =========================================================================

    useEffect(() => {
        if (!enabled) return;

        const initWebcam = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'user', width: 640, height: 480 },
                    audio: false,
                });

                streamRef.current = stream;

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }

                setWebcamEnabled(true);
                setWebcamStreaming(true);
                setWebcamPermission(true);
                setWebcamError(null);
            } catch (error) {
                console.error('Webcam error:', error);
                setWebcamEnabled(false);
                setWebcamStreaming(false);
                setWebcamPermission(false);
                setWebcamError(
                    error instanceof Error
                        ? error.message
                        : 'Gagal mengakses kamera'
                );
            }
        };

        initWebcam();

        // Cleanup on unmount
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [enabled, setWebcamEnabled, setWebcamStreaming, setWebcamPermission, setWebcamError]);

    // =========================================================================
    // ML INTEGRATION: PERIODIC FRAME CAPTURE
    // =========================================================================

    useEffect(() => {
        if (!enabled || !webcam.isStreaming) {
            // Clear interval if webcam is not streaming
            if (captureIntervalRef.current) {
                clearInterval(captureIntervalRef.current);
                captureIntervalRef.current = null;
            }
            return;
        }

        // Start periodic frame capture with adaptive interval
        captureIntervalRef.current = setInterval(() => {
            handleFrameAnalysis();
        }, currentInterval);

        // Cleanup on unmount or when dependencies change
        return () => {
            if (captureIntervalRef.current) {
                clearInterval(captureIntervalRef.current);
                captureIntervalRef.current = null;
            }
        };
    }, [enabled, webcam.isStreaming, currentInterval, handleFrameAnalysis]);

    // =========================================================================
    // TAB SWITCHING DETECTION
    // =========================================================================

    useEffect(() => {
        if (!enabled) return;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                // Tab switched away or minimized
                const newCount = tabSwitchCount + 1;
                setTabSwitchCount(newCount);

                // Log as violation (could be sent to backend)
                const violation: Violation = {
                    id: `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    type: 'LOOKING_AWAY', // Use existing type or add TAB_SWITCH type
                    severity: 'MEDIUM',
                    timestamp: new Date().toISOString(),
                    message: `Tab switched atau jendela diminimalkan (${newCount}x)`,
                };

                addViolation(violation);
                incrementViolationCount();

                // Show warning toast
                toast.warning('Peringatan: Tab Switching Terdeteksi', {
                    description: `Anda beralih tab atau meminimalkan jendela. Total: ${newCount}x`,
                    duration: 5000,
                });

                console.warn(`Tab visibility changed: hidden (count: ${newCount})`);
            } else {
                // Tab became visible again
                console.info('Tab visibility changed: visible');
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [enabled, tabSwitchCount, addViolation, incrementViolationCount]);

    // =========================================================================
    // OFFLINE MODE HANDLING
    // =========================================================================

    useEffect(() => {
        if (!enabled) return;

        const handleOnline = () => {
            setIsOnline(true);

            if (wasOffline) {
                // Coming back online after being offline
                toast.success('Koneksi Internet Pulih', {
                    description: 'Proctoring aktif kembali. Ujian dilanjutkan.',
                    duration: 5000,
                });

                setWasOffline(false);
                console.info('Network status: online (recovered)');
            }
        };

        const handleOffline = () => {
            setIsOnline(false);
            setWasOffline(true);

            // Show persistent warning about offline mode
            toast.warning('Koneksi Internet Terputus', {
                description: 'Proctoring tidak aktif. Ujian tetap berjalan tetapi tidak dimonitor.',
                duration: 10000,
            });

            // Log as violation
            const violation: Violation = {
                id: `offline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                type: 'LOOKING_AWAY', // Or add OFFLINE type
                severity: 'HIGH',
                timestamp: new Date().toISOString(),
                message: 'Koneksi internet terputus selama ujian',
            };

            addViolation(violation);
            incrementViolationCount();
            incrementHighViolationCount(); // Offline is high severity

            console.warn('Network status: offline');
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [enabled, wasOffline, addViolation, incrementViolationCount, incrementHighViolationCount]);

    // =========================================================================
    // DERIVED STATE
    // =========================================================================

    // Get recent violations (last 3) for display
    const recentViolations = violations.slice(0, 3);

    // =========================================================================
    // RENDER
    // =========================================================================

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        Proctoring Monitor
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        {isAnalyzing && isOnline && (
                            <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
                        )}
                        {!isOnline && (
                            <Badge variant="destructive" className="mr-2">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Offline
                            </Badge>
                        )}
                        <Badge variant={webcam.isStreaming && isOnline ? 'default' : 'destructive'}>
                            {webcam.isStreaming && isOnline ? (
                                <>
                                    <Camera className="h-3 w-3 mr-1" />
                                    Aktif
                                </>
                            ) : (
                                <>
                                    <CameraOff className="h-3 w-3 mr-1" />
                                    {isOnline ? 'Nonaktif' : 'Offline'}
                                </>
                            )}
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* ✅ OFFLINE MODE: Network status alert */}
                {!isOnline && (
                    <Alert variant="destructive" className="animate-in slide-in-from-top">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Offline Mode</AlertTitle>
                        <AlertDescription>
                            Koneksi internet terputus. Proctoring tidak aktif saat ini.
                        </AlertDescription>
                    </Alert>
                )}

                {/* ✅ ML INTEGRATION: Violation Alert */}
                {lastViolationAlert && isOnline && (
                    <Alert variant="destructive" className="animate-in slide-in-from-top">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Pelanggaran Terdeteksi!</AlertTitle>
                        <AlertDescription>{lastViolationAlert}</AlertDescription>
                    </Alert>
                )}

                {/* Webcam Preview */}
                <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                    {webcam.isStreaming ? (
                        <>
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover"
                            />
                            {/* ✅ ML INTEGRATION: Hidden canvas for frame capture */}
                            <canvas ref={canvasRef} className="hidden" />
                        </>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <CameraOff className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                    {webcam.error || 'Kamera tidak aktif'}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Overlay with status */}
                    {webcam.isStreaming && (
                        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                            <Badge variant="secondary" className="text-xs">
                                Session #{sessionId}
                            </Badge>
                            {isAnalyzing && (
                                <Badge variant="outline" className="text-xs bg-background/80">
                                    Analyzing...
                                </Badge>
                            )}
                        </div>
                    )}
                </div>

                {/* Violation Stats */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-muted text-center">
                        <div className="text-2xl font-bold">{violationCount}</div>
                        <div className="text-xs text-muted-foreground">Total Violations</div>
                    </div>
                    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-center">
                        <div className="text-2xl font-bold text-red-600">{highViolationCount}</div>
                        <div className="text-xs text-muted-foreground">High Severity</div>
                    </div>
                </div>

                {/* Warning for high violations */}
                {highViolationCount >= 2 && highViolationCount < 3 && (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Peringatan!</AlertTitle>
                        <AlertDescription>
                            Anda telah menerima {highViolationCount} pelanggaran tinggi.
                            1 pelanggaran lagi akan membatalkan ujian Anda.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Recent Violations */}
                {recentViolations.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium">Pelanggaran Terakhir</h4>
                        {recentViolations.map((violation) => (
                            <Alert
                                key={violation.id}
                                variant="destructive"
                                className="py-2"
                            >
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle className="text-sm">
                                    {violation.type.replace(/_/g, ' ')}
                                </AlertTitle>
                                <AlertDescription className="text-xs">
                                    {violation.message}
                                    {/*
                                     * ✅ FIX: Removed event.details
                                     * Violation type only has: id, type, severity, timestamp, message
                                     * The message field already contains the violation description
                                     */}
                                    <span className="block mt-1 text-muted-foreground">
                                        {new Date(violation.timestamp).toLocaleTimeString('id-ID')}
                                    </span>
                                </AlertDescription>
                            </Alert>
                        ))}
                    </div>
                )}

                {/* Webcam Error Alert */}
                {webcam.error && (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Error Kamera</AlertTitle>
                        <AlertDescription>
                            {webcam.error}
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-2 w-full"
                                onClick={() => window.location.reload()}
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Muat Ulang
                            </Button>
                        </AlertDescription>
                    </Alert>
                )}

                {/* Success State */}
                {webcam.isStreaming && violationCount === 0 && (
                    <div className="flex items-center gap-2 text-green-600 text-sm">
                        <CheckCircle className="h-4 w-4" />
                        <span>Tidak ada pelanggaran terdeteksi</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default ProctoringMonitor;