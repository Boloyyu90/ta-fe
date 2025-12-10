// src/features/proctoring/store/proctoring.store.ts

/**
 * Proctoring Store (Zustand)
 *
 * ✅ AUDIT FIX v3: Fixed Violation import (now properly exported)
 *
 * Manages:
 * - Webcam state
 * - Violations list
 * - Analysis results
 */

import { create } from 'zustand';
import type { Violation, WebcamState, FaceDetectionResult } from '../types/proctoring.types';

interface ProctoringStore {
    // Webcam State
    webcam: WebcamState;
    setWebcamEnabled: (enabled: boolean) => void;
    setWebcamStreaming: (streaming: boolean) => void;
    setWebcamPermission: (hasPermission: boolean | null) => void;
    setWebcamError: (error: string | null) => void;

    // Violations
    violations: Violation[];
    addViolation: (violation: Violation) => void;
    clearViolations: () => void;

    // Analysis
    isAnalyzing: boolean;
    setAnalyzing: (analyzing: boolean) => void;
    lastAnalysis: FaceDetectionResult | null;
    setLastAnalysis: (analysis: FaceDetectionResult | null) => void;

    // Counts
    violationCount: number;
    highViolationCount: number;
    incrementViolationCount: () => void;
    incrementHighViolationCount: () => void;

    // Reset
    reset: () => void;
}

const initialWebcamState: WebcamState = {
    isEnabled: false,
    isStreaming: false,
    hasPermission: null,
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

    // Webcam actions
    setWebcamEnabled: (enabled) =>
        set((state) => ({
            webcam: { ...state.webcam, isEnabled: enabled },
        })),

    setWebcamStreaming: (streaming) =>
        set((state) => ({
            webcam: { ...state.webcam, isStreaming: streaming },
        })),

    setWebcamPermission: (hasPermission) =>
        set((state) => ({
            webcam: { ...state.webcam, hasPermission },
        })),

    setWebcamError: (error) =>
        set((state) => ({
            webcam: { ...state.webcam, error },
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