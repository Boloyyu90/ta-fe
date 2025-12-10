// src/features/proctoring/store/proctoring.store.ts

/**
 * Proctoring Store (Zustand)
 *
 * ✅ AUDIT FIX v4: Added setWebcam action for WebcamCapture component
 *
 * Manages:
 * - Webcam state
 * - Violations list
 * - Analysis results
 */

import { create } from 'zustand';
import type { Violation, WebcamState, FaceAnalysisData } from '../types/proctoring.types';

interface ProctoringStore {
    // Webcam State
    webcam: WebcamState;
    setWebcam: (webcam: Partial<WebcamState>) => void;

    // Violations
    violations: Violation[];
    addViolation: (violation: Violation) => void;
    clearViolations: () => void;

    // Analysis
    isAnalyzing: boolean;
    setAnalyzing: (analyzing: boolean) => void;
    lastAnalysis: FaceAnalysisData | null;
    setLastAnalysis: (analysis: FaceAnalysisData | null) => void;

    // Counts
    violationCount: number;
    highViolationCount: number;
    incrementViolationCount: () => void;
    incrementHighViolationCount: () => void;

    // Reset
    reset: () => void;
}

const initialWebcamState: WebcamState = {
    isActive: false,
    stream: null,
    error: null,
};

export const useProctoringStore = create<ProctoringStore>((set) => ({
    // Initial state
    webcam: initialWebcamState,
    violations: [],
    isAnalyzing: false,
    lastAnalysis: null,
    violationCount: 0,
    highViolationCount: 0,

    // ✅ FIX: Added setWebcam action for updating webcam state
    setWebcam: (webcamUpdate) =>
        set((state) => ({
            webcam: { ...state.webcam, ...webcamUpdate },
        })),

    // Violations actions
    addViolation: (violation) =>
        set((state) => ({
            violations: [violation, ...state.violations].slice(0, 100), // Keep last 100
        })),

    clearViolations: () =>
        set({ violations: [] }),

    // Analysis actions
    setAnalyzing: (analyzing) =>
        set({ isAnalyzing: analyzing }),

    setLastAnalysis: (analysis) =>
        set({ lastAnalysis: analysis }),

    // Count actions
    incrementViolationCount: () =>
        set((state) => ({
            violationCount: state.violationCount + 1,
        })),

    incrementHighViolationCount: () =>
        set((state) => ({
            highViolationCount: state.highViolationCount + 1,
        })),

    // Reset action
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