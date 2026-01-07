/**
 * Proctoring Monitor Component - WITH ML INTEGRATION
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
// CONSTANTS (matches backend-api-contract.md Section 5.7 recommendation)
// ============================================================================

/**
 * Default capture interval: 3 seconds = 20 requests/minute
 * Backend rate limit: 30 requests/minute
 * Buffer: 10 requests (33% margin)
 */
const DEFAULT_CAPTURE_INTERVAL_MS = 3000;

/**
 * Startup delay to let React complete hydration before starting captures.
 * This prevents burst requests during component mount/re-render phase.
 */
const STARTUP_DELAY_MS = 4000;

/**
 * Recovery delay after 429 error (slightly over half of rate limit window).
 * Backend rate limit window: 1 minute, so we wait 35 seconds to ensure reset.
 *
 * ✅ FIX: Changed from 65s to 35s to match documentation and allow faster recovery
 */
const RATE_LIMIT_RECOVERY_DELAY_MS = 35000;

// ============================================================================
// COMPONENT PROPS
// ============================================================================

export type ProctoringUIMode = 'full' | 'webcamOnly';

export interface ProctoringMonitorProps {
    /** Current exam session ID */
    sessionId: number;
    /** Callback when a violation is detected */
    onViolation?: (event: ProctoringEvent) => void;
    /** Callback when a new violation is added to UI */
    onNewViolation?: (violation: Violation) => void;
    /** Interval between frame captures (ms) - default 3000ms per backend recommendation */
    captureInterval?: number;
    /** Enable/disable proctoring */
    enabled?: boolean;
    /** UI render mode: 'full' shows complete card, 'webcamOnly' shows just webcam preview */
    uiMode?: ProctoringUIMode;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function ProctoringMonitor({
                                      sessionId,
                                      onViolation,
                                      onNewViolation,
                                      captureInterval = DEFAULT_CAPTURE_INTERVAL_MS,  // 3s = 20 req/min (per backend recommendation)
                                      enabled = true,
                                      uiMode = 'full',
                                  }: ProctoringMonitorProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const captureIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // ✅ FIX #1: Request deduplication - prevents concurrent API calls
    const isRequestInFlight = useRef(false);

    // ✅ FIX: Recovery timer ref for cleanup
    const recoveryTimerRef = useRef<NodeJS.Timeout | null>(null);

    // ✅ FIX: Stable ref for handleFrameAnalysis to prevent effect re-triggers
    const handleFrameAnalysisRef = useRef<(() => Promise<void>) | undefined>(undefined);

    // ✅ FIX: Stable ref for currentInterval to prevent effect re-triggers
    const currentIntervalRef = useRef(captureInterval);

    // ✅ FIX v2: Pause flag for 429 recovery - ACTUALLY stops interval from making requests
    // This is critical because setCurrentInterval() doesn't stop the running setInterval()
    const isPausedFor429Ref = useRef(false);

    // ✅ FIX v3: Track consecutive 429 recovery attempts to prevent infinite pause
    const consecutive429CountRef = useRef(0);
    const MAX_429_RECOVERY_ATTEMPTS = 3;

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
     * CRITICAL: Ensure proper dimensions for YOLO face detection
     */
    const captureFrame = useCallback((): string | null => {
        if (!videoRef.current || !canvasRef.current) {
            console.warn('[PROCTORING] captureFrame: video or canvas ref is null');
            return null;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) {
            console.warn('[PROCTORING] captureFrame: canvas context is null');
            return null;
        }

        // ✅ CRITICAL: Get ACTUAL video stream dimensions (not CSS dimensions)
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;

        // ✅ SAFEGUARD: Reject capture if video dimensions are 0 (not ready)
        if (videoWidth === 0 || videoHeight === 0) {
            console.warn('[PROCTORING] captureFrame: Video not ready (dimensions are 0)', {
                videoWidth,
                videoHeight,
                readyState: video.readyState,
                hint: 'Video stream may not be fully initialized'
            });
            return null; // Don't capture empty frames
        }

        // ✅ Validate dimensions are usable (minimum 100x100)
        if (videoWidth < 100 || videoHeight < 100) {
            console.warn('[PROCTORING] captureFrame: Video dimensions too small:', {
                videoWidth,
                videoHeight,
                hint: 'Check camera resolution settings'
            });
            return null; // Reject frames that are too small
        }

        // ✅ CRITICAL: Ensure canvas matches video dimensions exactly
        canvas.width = videoWidth;
        canvas.height = videoHeight;

        // Draw current video frame to canvas
        context.drawImage(video, 0, 0, videoWidth, videoHeight);

        // Convert to base64
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);

        // ✅ CRITICAL FIX: Strip data URL prefix for backend compatibility
        // Backend expects raw base64, not "data:image/jpeg;base64,..."
        const base64Frame = dataUrl.includes(',')
            ? dataUrl.split(',')[1]
            : dataUrl;

        // ✅ SAFEGUARD: Validate frame size (reject suspiciously small frames)
        const frameSizeKB = Math.round(base64Frame.length / 1024);
        const MIN_VALID_FRAME_SIZE_KB = 10; // A 640x480 JPEG should be at least 10KB

        if (frameSizeKB < MIN_VALID_FRAME_SIZE_KB) {
            console.warn('[PROCTORING] captureFrame: Frame too small, may be corrupted:', {
                frameSize: frameSizeKB + 'KB',
                minRequired: MIN_VALID_FRAME_SIZE_KB + 'KB',
                dimensions: `${videoWidth}x${videoHeight}`,
                hint: 'Video buffer may not have valid frame data'
            });
            return null; // Reject potentially corrupted frames
        }

        // ✅ DEBUG: Log frame capture stats
        if (process.env.NODE_ENV === 'development') {
            console.log('[PROCTORING] Frame captured:', {
                frameSize: frameSizeKB + 'KB',
                dimensions: `${videoWidth}x${videoHeight}`,
                isValidSize: frameSizeKB >= MIN_VALID_FRAME_SIZE_KB,
            });
        }

        return base64Frame;
    }, []);

    /**
     * Handle ML face analysis
     * THESIS SHOWCASE: YOLO integration for real-time face detection
     *
     * ✅ RATE LIMITING FIX: Implements request deduplication and smart 429 handling
     */
    const handleFrameAnalysis = useCallback(
        async () => {
            // ✅ FIX v2: Check pause flag FIRST - skip if paused for 429 recovery
            if (isPausedFor429Ref.current) {
                if (process.env.NODE_ENV === 'development') {
                    console.log('[PROCTORING] Skipping: paused for 429 recovery');
                }
                return;
            }

            // ✅ FIX #1: Request deduplication - prevents concurrent API calls
            // Uses ref instead of state to avoid stale closure issues
            if (isRequestInFlight.current) {
                if (process.env.NODE_ENV === 'development') {
                    console.log('[PROCTORING] Skipping: request already in flight');
                }
                return;
            }

            // Skip if already analyzing (state-based) or not streaming
            if (isAnalyzing || !webcam.isStreaming) {
                if (process.env.NODE_ENV === 'development') {
                    console.log('[PROCTORING] Skipping analysis:', {
                        reason: isAnalyzing ? 'already analyzing' : 'webcam not streaming',
                        isAnalyzing,
                        isStreaming: webcam.isStreaming,
                    });
                }
                return;
            }

            const imageData = captureFrame();
            if (!imageData) {
                if (process.env.NODE_ENV === 'development') {
                    console.warn('[PROCTORING] captureFrame returned null - check video/canvas refs');
                }
                return;
            }

            // ✅ Lock: Prevent concurrent requests
            isRequestInFlight.current = true;
            setAnalyzing(true);

            try {
                if (process.env.NODE_ENV === 'development') {
                    console.log('[PROCTORING] Sending frame to ML API:', {
                        sessionId,
                        frameSize: Math.round(imageData.length / 1024) + 'KB',
                        timestamp: new Date().toISOString(),
                    });
                }

                // Call YOLO ML service via backend
                const result = await analyzeFace.mutateAsync({
                    imageBase64: imageData,
                });

                if (process.env.NODE_ENV === 'development') {
                    console.log('[PROCTORING] ML API Response:', {
                        status: result.analysis.status,
                        violations: result.analysis.violations,
                        eventLogged: result.eventLogged,
                        eventType: result.eventType,
                        usedFallback: result.usedFallback,
                    });
                }

                // Store the analysis result
                setLastAnalysis(result.analysis);

                // ✅ Reset error state on successful analysis
                if (consecutiveErrors > 0 || consecutive429CountRef.current > 0) {
                    setConsecutiveErrors(0);
                    consecutive429CountRef.current = 0; // ✅ FIX v3: Reset 429 counter on success
                    setCurrentInterval(captureInterval);
                    if (process.env.NODE_ENV === 'development') {
                        console.info('[PROCTORING] ML service recovered. Reset to normal interval and 429 counter.');
                    }
                }

                // Check for violations (not FACE_DETECTED)
                const hasViolation = result.analysis.violations.some(
                    (v) => v !== 'FACE_DETECTED'
                );

                if (hasViolation && result.eventLogged) {
                    // Determine severity using helper function with type guard
                    const violationString = result.analysis.violations[0];

                    // Validate type BEFORE incrementing counters
                    if (!isProctoringEventType(violationString)) {
                        console.warn(
                            `[PROCTORING] Unknown violation type: ${violationString}. Skipping.`
                        );
                        return;
                    }

                    const violationType = violationString;
                    const severity = getSeverityForEventType(violationType);

                    // Increment counters AFTER validation
                    incrementViolationCount();
                    const isHighSeverity = severity === 'HIGH';

                    if (isHighSeverity) {
                        incrementHighViolationCount();
                    }

                    // Get violation message (Indonesian per user-stories)
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
                        type: violationType,
                        severity,
                        timestamp: new Date().toISOString(),
                        message,
                    };

                    addViolation(violation);

                    // Notify parent component of new violation
                    onNewViolation?.(violation);

                    // Show alert for new violation
                    setLastViolationAlert(message);

                    // Auto-hide alert after 5 seconds
                    setTimeout(() => {
                        setLastViolationAlert(null);
                    }, 5000);
                }
            } catch (error: unknown) {
                // ✅ FIX #4: Smart 429 error handling with auto-recovery
                const errorStatus = (error as { status?: number; response?: { status?: number } })?.status
                    || (error as { response?: { status?: number } })?.response?.status;
                const errorMessage = (error as Error)?.message || 'Unknown error';

                if (process.env.NODE_ENV === 'development') {
                    console.error('[PROCTORING] Face analysis error:', {
                        message: errorMessage,
                        status: errorStatus,
                    });
                }

                if (errorStatus === 429) {
                    // ✅ FIX v3: Track consecutive 429 attempts
                    consecutive429CountRef.current += 1;

                    // ✅ FIX v2: Set pause flag to ACTUALLY stop requests
                    isPausedFor429Ref.current = true;

                    const recoverySeconds = Math.round(RATE_LIMIT_RECOVERY_DELAY_MS / 1000);
                    console.warn(`[PROCTORING] Rate limited (429). Attempt ${consecutive429CountRef.current}/${MAX_429_RECOVERY_ATTEMPTS}. Pausing ${recoverySeconds}s for recovery.`);

                    // ✅ FIX v3: If exceeded max recovery attempts, disable proctoring captures
                    if (consecutive429CountRef.current >= MAX_429_RECOVERY_ATTEMPTS) {
                        console.error('[PROCTORING] Max 429 recovery attempts reached. Disabling proctoring captures.');
                        toast.error('Sistem proctoring tidak dapat dipulihkan. Capture dihentikan untuk sesi ini.', {
                            duration: 10000,
                            id: 'proctoring-disabled',
                        });
                        // Keep isPausedFor429Ref.current = true, don't schedule recovery
                        return;
                    }

                    // User-friendly notification (Indonesian per user-stories)
                    // ✅ FIX: Use actual recovery delay value instead of hardcoded
                    toast.warning(`Sistem proctoring diperlambat sementara. Akan dilanjutkan otomatis dalam ${recoverySeconds} detik. (Percobaan ${consecutive429CountRef.current}/${MAX_429_RECOVERY_ATTEMPTS})`, {
                        duration: 5000,
                        id: 'proctoring-rate-limit',
                    });

                    // Clear any existing recovery timer
                    if (recoveryTimerRef.current) {
                        clearTimeout(recoveryTimerRef.current);
                    }

                    // ✅ Schedule auto-recovery
                    recoveryTimerRef.current = setTimeout(() => {
                        if (process.env.NODE_ENV === 'development') {
                            console.log('[PROCTORING] Auto-recovering, resuming captures');
                        }

                        // ✅ FIX v2: Clear pause flag to resume captures
                        isPausedFor429Ref.current = false;
                        setConsecutiveErrors(0);
                        // Note: Don't reset consecutive429CountRef here - it resets on successful request

                        toast.success('Sistem proctoring kembali normal.', {
                            duration: 3000,
                            id: 'proctoring-recovered',
                        });
                    }, RATE_LIMIT_RECOVERY_DELAY_MS);

                } else {
                    // Non-429 errors: Use exponential backoff per user-stories Section 8.2
                    const newErrorCount = consecutiveErrors + 1;
                    setConsecutiveErrors(newErrorCount);

                    // Exponential backoff: 3s → 6s → 12s → 24s → max 30s
                    const backoffMs = Math.min(captureInterval * Math.pow(2, newErrorCount), 30000);
                    setCurrentInterval(backoffMs);

                    // Show error toast only on first error to avoid spam
                    if (newErrorCount === 1) {
                        const errorMsg = getErrorMessage(PROCTORING_ERRORS.PROCTORING_ML_SERVICE_ERROR);
                        toast.error('Error Proctoring', {
                            description: errorMsg,
                            duration: 10000,
                        });
                    }

                    console.warn(`[PROCTORING] Error #${newErrorCount}. Backing off to ${backoffMs}ms.`);
                }
            } finally {
                // ✅ Unlock: Allow next request
                setAnalyzing(false);
                isRequestInFlight.current = false;
            }
        },
        [
            isAnalyzing,
            webcam.isStreaming,
            captureFrame,
            setAnalyzing,
            analyzeFace,
            addViolation,
            incrementViolationCount,
            incrementHighViolationCount,
            onNewViolation,
            consecutiveErrors,
            captureInterval,
        ]
    );

    // ✅ FIX: Keep handleFrameAnalysis ref updated (avoids stale closure in interval)
    useEffect(() => {
        handleFrameAnalysisRef.current = handleFrameAnalysis;
    }, [handleFrameAnalysis]);

    // ✅ FIX: Keep currentInterval ref updated (avoids effect re-triggers)
    useEffect(() => {
        currentIntervalRef.current = currentInterval;
    }, [currentInterval]);

    // =========================================================================
    // WEBCAM INITIALIZATION
    // =========================================================================

    useEffect(() => {
        if (!enabled) return;

        const initWebcam = async () => {
            try {
                console.log('[PROCTORING] Initializing webcam...');

                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'user', width: 640, height: 480 },
                    audio: false,
                });

                // Log stream info for debugging
                const videoTrack = stream.getVideoTracks()[0];
                const settings = videoTrack?.getSettings();
                console.log('[PROCTORING] Stream acquired:', {
                    trackLabel: videoTrack?.label,
                    width: settings?.width,
                    height: settings?.height,
                });

                streamRef.current = stream;

                // ✅ CRITICAL SAFEGUARD: Retry logic if videoRef is not ready
                // This handles race conditions where effect runs before DOM is fully painted
                const attachStreamWithRetry = (retryCount = 0, maxRetries = 10) => {
                    if (videoRef.current) {
                        const video = videoRef.current;
                        video.srcObject = stream;

                        console.log('[PROCTORING] Stream attached to video element');

                        // ✅ FIX: Wait for video to be ready before enabling capture
                        // This prevents capturing empty/black frames when video buffer isn't ready
                        const handleVideoReady = () => {
                            // Verify dimensions are valid (not 0)
                            if (video.videoWidth > 0 && video.videoHeight > 0) {
                                console.log('[PROCTORING] Video ready:', {
                                    videoWidth: video.videoWidth,
                                    videoHeight: video.videoHeight,
                                    clientWidth: video.clientWidth,
                                    clientHeight: video.clientHeight,
                                });
                                setWebcamEnabled(true);
                                setWebcamStreaming(true);
                                setWebcamPermission(true);
                                setWebcamError(null);
                                // ✅ CRITICAL: This should trigger the capture interval effect
                                console.log('[PROCTORING] ✅ Webcam fully initialized - capture interval should start now');
                            } else {
                                console.warn('[PROCTORING] Video ready but dimensions are 0, waiting...');
                                // Retry on next frame
                                requestAnimationFrame(() => {
                                    if (video.videoWidth > 0 && video.videoHeight > 0) {
                                        console.log('[PROCTORING] Video dimensions resolved on retry:', {
                                            videoWidth: video.videoWidth,
                                            videoHeight: video.videoHeight,
                                        });
                                        setWebcamEnabled(true);
                                        setWebcamStreaming(true);
                                        setWebcamPermission(true);
                                        setWebcamError(null);
                                        console.log('[PROCTORING] ✅ Webcam initialized (retry) - capture interval should start');
                                    }
                                });
                            }
                        };

                        // Listen for loadedmetadata (dimensions available) and canplay (ready to render)
                        video.addEventListener('loadedmetadata', handleVideoReady, { once: true });

                        // Fallback: If already loaded (e.g., re-mount), check immediately
                        if (video.readyState >= 1) { // HAVE_METADATA
                            handleVideoReady();
                        }
                    } else if (retryCount < maxRetries) {
                        // ✅ SAFEGUARD: Retry after a short delay if ref not ready
                        console.warn(`[PROCTORING] videoRef not ready, retry ${retryCount + 1}/${maxRetries}`);
                        setTimeout(() => attachStreamWithRetry(retryCount + 1, maxRetries), 50);
                    } else {
                        console.error('[PROCTORING] CRITICAL: videoRef never became available. Video element may not be in DOM.');
                        setWebcamError('Gagal menginisialisasi video - elemen tidak ditemukan');
                    }
                };

                // Start attachment with retry logic
                attachStreamWithRetry();

            } catch (error) {
                console.error('[PROCTORING] Webcam error:', error);
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
                console.log('[PROCTORING] Cleaning up webcam stream');
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            // ✅ Also cleanup recovery timer if pending
            if (recoveryTimerRef.current) {
                clearTimeout(recoveryTimerRef.current);
                recoveryTimerRef.current = null;
            }
        };
    }, [enabled, setWebcamEnabled, setWebcamStreaming, setWebcamPermission, setWebcamError]);

    // =========================================================================
    // ML INTEGRATION: PERIODIC FRAME CAPTURE
    // ✅ FIX: Uses refs to avoid dependency-triggered re-runs
    // =========================================================================

    useEffect(() => {
        // Guard: Early exit if not enabled or not streaming
        if (!enabled || !webcam.isStreaming) {
            if (captureIntervalRef.current) {
                clearInterval(captureIntervalRef.current);
                captureIntervalRef.current = null;
            }
            if (process.env.NODE_ENV === 'development') {
                console.log('[PROCTORING] Capture interval skipped:', {
                    enabled,
                    isStreaming: webcam.isStreaming,
                });
            }
            return;
        }

        let intervalId: NodeJS.Timeout | null = null;
        let isCleanedUp = false;

        if (process.env.NODE_ENV === 'development') {
            console.log('[PROCTORING] Scheduling capture start:', {
                startupDelayMs: STARTUP_DELAY_MS,
                captureIntervalMs: currentIntervalRef.current,
                timestamp: new Date().toISOString(),
            });
        }

        // ✅ Startup delay to let React stabilize (2.5 seconds)
        const startupTimer = setTimeout(() => {
            if (isCleanedUp) {
                if (process.env.NODE_ENV === 'development') {
                    console.log('[PROCTORING] Startup timer fired but already cleaned up, skipping');
                }
                return;
            }

            if (process.env.NODE_ENV === 'development') {
                console.log('[PROCTORING] Startup delay complete, beginning capture cycle');
            }

            // ✅ FIX: Call via ref - doesn't need to be in deps
            handleFrameAnalysisRef.current?.();

            // Start regular interval using ref value
            intervalId = setInterval(() => {
                // ✅ FIX v2: Check pause flag inside interval callback
                // This allows the interval to keep running but skip API calls during 429 recovery
                if (isPausedFor429Ref.current) {
                    if (process.env.NODE_ENV === 'development') {
                        console.log('[PROCTORING] Interval tick SKIPPED - paused for 429 recovery');
                    }
                    return;
                }

                if (process.env.NODE_ENV === 'development') {
                    console.log('[PROCTORING] Interval tick - calling handleFrameAnalysis');
                }
                handleFrameAnalysisRef.current?.();
            }, currentIntervalRef.current);

            captureIntervalRef.current = intervalId;

            if (process.env.NODE_ENV === 'development') {
                console.log('[PROCTORING] ✅ Capture interval started:', {
                    intervalMs: currentIntervalRef.current,
                    expectedReqPerMin: Math.floor(60000 / currentIntervalRef.current),
                    rateLimit: '30/min (backend-api-contract.md Section 1.8)',
                    timestamp: new Date().toISOString(),
                });
            }
        }, STARTUP_DELAY_MS);

        // ✅ Comprehensive cleanup
        return () => {
            isCleanedUp = true;
            clearTimeout(startupTimer);
            if (intervalId) {
                clearInterval(intervalId);
            }
            if (captureIntervalRef.current) {
                clearInterval(captureIntervalRef.current);
                captureIntervalRef.current = null;
            }
            if (process.env.NODE_ENV === 'development') {
                console.log('[PROCTORING] Capture interval cleaned up');
            }
        };
    }, [enabled, webcam.isStreaming]); // ✅ MINIMAL DEPS - no handleFrameAnalysis, no currentInterval!

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

    // =========================================================================
    // WEBCAM-ONLY MODE: Minimal UI with just the webcam preview
    // =========================================================================
    if (uiMode === 'webcamOnly') {
        return (
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden border-2 border-primary/20">
                {/* ✅ CRITICAL FIX: Video/canvas MUST always be in DOM for refs to work
                 * Previous bug: Conditional rendering prevented stream attachment
                 * because videoRef.current was null when initWebcam effect ran.
                 *
                 * The video element must exist BEFORE getUserMedia resolves,
                 * otherwise video.srcObject = stream fails silently.
                 */}
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    width={640}
                    height={480}
                    className={`w-full h-full object-cover ${webcam.isStreaming ? '' : 'invisible'}`}
                />
                {/* Hidden canvas for ML frame capture - MUST always be in DOM */}
                <canvas
                    ref={canvasRef}
                    width={640}
                    height={480}
                    className="hidden"
                />

                {/* Placeholder overlay - shown when not streaming */}
                {!webcam.isStreaming && (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted">
                        <div className="text-center">
                            <CameraOff className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">
                                {webcam.error || 'Menunggu kamera...'}
                            </p>
                        </div>
                    </div>
                )}

                {/* Minimal overlay: LIVE indicator + status */}
                <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
                    {/* LIVE indicator */}
                    {webcam.isStreaming && isOnline && (
                        <Badge className="status-live text-[10px] px-1.5 py-0.5 h-5 flex items-center gap-1">
                            <div className="h-1.5 w-1.5 bg-white rounded-full animate-pulse" />
                            LIVE
                        </Badge>
                    )}

                    {/* Offline indicator */}
                    {!isOnline && (
                        <Badge variant="destructive" className="text-[10px] px-1.5 py-0.5 h-5">
                            <AlertTriangle className="h-3 w-3 mr-0.5" />
                            Offline
                        </Badge>
                    )}

                    {/* Analyzing indicator */}
                    {isAnalyzing && isOnline && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 h-5 bg-background/80">
                            <RefreshCw className="h-3 w-3 mr-0.5 animate-spin" />
                            Analyzing
                        </Badge>
                    )}
                </div>

                {/* Bottom overlay: Session ID + violation count */}
                {webcam.isStreaming && (
                    <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 h-5 bg-background/80">
                            Session #{sessionId}
                        </Badge>
                        {violationCount > 0 && (
                            <Badge variant="destructive" className="text-[10px] px-1.5 py-0.5 h-5">
                                {violationCount} violation{violationCount > 1 ? 's' : ''}
                            </Badge>
                        )}
                    </div>
                )}
            </div>
        );
    }

    // =========================================================================
    // FULL MODE: Complete card UI with all details
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
                    {/* ✅ CRITICAL FIX: Video/canvas MUST always be in DOM for refs to work
                     * Previous bug: Conditional rendering prevented stream attachment
                     * because videoRef.current was null when initWebcam effect ran.
                     */}
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        width={640}
                        height={480}
                        className={`w-full h-full object-cover ${webcam.isStreaming ? '' : 'invisible'}`}
                    />
                    {/* Hidden canvas for ML frame capture - MUST always be in DOM */}
                    <canvas ref={canvasRef} width={640} height={480} className="hidden" />

                    {/* Placeholder overlay - shown when not streaming */}
                    {!webcam.isStreaming && (
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