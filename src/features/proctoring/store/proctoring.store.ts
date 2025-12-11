// src/features/proctoring/store/proctoring.store.ts

/**
 * Proctoring Store (Zustand)
 *
 * ============================================================================
 * AUDIT FIX v5: Full compatibility for both components
 * ============================================================================
 *
 * Manages:
 * - Webcam state (with both new and legacy accessors)
 * - Violations list
 * - Analysis results
 *
 * Components using this store:
 * - WebcamCapture.tsx: Uses setWebcam({ isActive, stream, error })
 * - ProctoringMonitor.tsx: Uses setWebcamEnabled, setWebcamStreaming, etc.
 */

import { create } from 'zustand';
import type { Violation, FaceAnalysisResult } from '../types/proctoring.types';

// Type alias for backward compatibility
type FaceAnalysisData = FaceAnalysisResult;

// ============================================================================
// EXTENDED WEBCAM STATE (includes legacy fields for ProctoringMonitor)
// ============================================================================

interface ExtendedWebcamState {
    // Core fields (WebcamState interface)
    isActive: boolean;
    stream: MediaStream | null;
    error: string | null;

    // Legacy compatibility fields for ProctoringMonitor
    isStreaming: boolean;   // Alias for isActive
    hasPermission: boolean; // Track permission status
}

// ============================================================================
// STORE INTERFACE
// ============================================================================

interface ProctoringStore {
    // =========================================================================
    // WEBCAM STATE
    // =========================================================================
    webcam: ExtendedWebcamState;

    // New unified setter (used by WebcamCapture)
    setWebcam: (webcam: Partial<ExtendedWebcamState>) => void;

    // Legacy granular setters (used by ProctoringMonitor)
    setWebcamEnabled: (enabled: boolean) => void;
    setWebcamStreaming: (streaming: boolean) => void;
    setWebcamPermission: (permission: boolean) => void;
    setWebcamError: (error: string | null) => void;

    // =========================================================================
    // VIOLATIONS
    // =========================================================================
    violations: Violation[];
    addViolation: (violation: Violation) => void;
    clearViolations: () => void;

    // =========================================================================
    // ANALYSIS STATE
    // =========================================================================
    isAnalyzing: boolean;
    setAnalyzing: (analyzing: boolean) => void;
    lastAnalysis: FaceAnalysisData | null;
    setLastAnalysis: (analysis: FaceAnalysisData | null) => void;

    // =========================================================================
    // VIOLATION COUNTS
    // =========================================================================
    violationCount: number;
    highViolationCount: number;
    incrementViolationCount: () => void;
    incrementHighViolationCount: () => void;

    // =========================================================================
    // RESET
    // =========================================================================
    reset: () => void;
}

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialWebcamState: ExtendedWebcamState = {
    // Core fields
    isActive: false,
    stream: null,
    error: null,
    // Legacy fields
    isStreaming: false,
    hasPermission: false,
};

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

export const useProctoringStore = create<ProctoringStore>((set) => ({
    // =========================================================================
    // INITIAL STATE
    // =========================================================================
    webcam: initialWebcamState,
    violations: [],
    isAnalyzing: false,
    lastAnalysis: null,
    violationCount: 0,
    highViolationCount: 0,

    // =========================================================================
    // WEBCAM ACTIONS
    // =========================================================================

    /**
     * Unified webcam setter (used by WebcamCapture)
     * Automatically syncs isActive ↔ isStreaming
     */
    setWebcam: (webcamUpdate) =>
        set((state) => {
            const newWebcam = { ...state.webcam, ...webcamUpdate };

            // Sync isActive and isStreaming
            if ('isActive' in webcamUpdate) {
                newWebcam.isStreaming = webcamUpdate.isActive!;
            }
            if ('isStreaming' in webcamUpdate) {
                newWebcam.isActive = webcamUpdate.isStreaming!;
            }

            return { webcam: newWebcam };
        }),

    /**
     * Set webcam enabled state (legacy - used by ProctoringMonitor)
     */
    setWebcamEnabled: (enabled) =>
        set((state) => ({
            webcam: {
                ...state.webcam,
                isActive: enabled,
                isStreaming: enabled, // Keep in sync
            },
        })),

    /**
     * Set webcam streaming state (legacy - used by ProctoringMonitor)
     */
    setWebcamStreaming: (streaming) =>
        set((state) => ({
            webcam: {
                ...state.webcam,
                isStreaming: streaming,
                isActive: streaming, // Keep in sync
            },
        })),

    /**
     * Set webcam permission state (legacy - used by ProctoringMonitor)
     */
    setWebcamPermission: (permission) =>
        set((state) => ({
            webcam: {
                ...state.webcam,
                hasPermission: permission,
            },
        })),

    /**
     * Set webcam error (legacy - used by ProctoringMonitor)
     */
    setWebcamError: (error) =>
        set((state) => ({
            webcam: {
                ...state.webcam,
                error,
            },
        })),

    // =========================================================================
    // VIOLATIONS ACTIONS
    // =========================================================================

    /**
     * Add a violation to the list
     * Keeps last 100 violations
     */
    addViolation: (violation) =>
        set((state) => ({
            violations: [violation, ...state.violations].slice(0, 100),
        })),

    /**
     * Clear all violations
     */
    clearViolations: () => set({ violations: [] }),

    // =========================================================================
    // ANALYSIS ACTIONS
    // =========================================================================

    /**
     * Set analyzing state
     */
    setAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),

    /**
     * Set last analysis result
     */
    setLastAnalysis: (analysis) => set({ lastAnalysis: analysis }),

    // =========================================================================
    // COUNT ACTIONS
    // =========================================================================

    /**
     * Increment total violation count
     */
    incrementViolationCount: () =>
        set((state) => ({
            violationCount: state.violationCount + 1,
        })),

    /**
     * Increment high severity violation count
     */
    incrementHighViolationCount: () =>
        set((state) => ({
            highViolationCount: state.highViolationCount + 1,
        })),

    // =========================================================================
    // RESET ACTION
    // =========================================================================

    /**
     * Reset all proctoring state
     * Call when exam ends or user navigates away
     */
    reset: () =>
        set({
            webcam: initialWebcamState,
            violations: [],
            isAnalyzing: false,
            lastAnalysis: null,
            violationCount: 0,
            highViolationCount: 0,
        }),
}));

// ============================================================================
// SELECTOR HOOKS (for convenience)
// ============================================================================

/**
 * Get webcam state
 */
export const useWebcamState = () => useProctoringStore((state) => state.webcam);

/**
 * Get violations list
 */
export const useViolations = () => useProctoringStore((state) => state.violations);

/**
 * Get violation counts
 */
export const useViolationCounts = () =>
    useProctoringStore((state) => ({
        total: state.violationCount,
        high: state.highViolationCount,
    }));

/**
 * Check if should auto-cancel exam
 * Based on backend rules: 3 HIGH violations OR 10 MEDIUM violations
 */
export const useShouldCancelExam = () =>
    useProctoringStore((state) => state.highViolationCount >= 3);