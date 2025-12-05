// src/features/proctoring/store/proctoring.store.ts
import { create } from 'zustand';
import type { Violation, WebcamState } from '../types/proctoring.types';

interface ProctoringState {
    // Webcam state
    webcam: WebcamState;

    // Violation tracking
    violations: Violation[];
    totalViolations: number;
    highViolations: number;
    warningLevel: number; // 0, 1, 2, 3

    // Monitoring state
    isMonitoring: boolean;
    lastAnalysis: string | null; // timestamp

    // Actions
    setWebcam: (webcam: Partial<WebcamState>) => void;
    addViolation: (violation: Violation) => void;
    setWarningLevel: (level: number) => void;
    startMonitoring: () => void;
    stopMonitoring: () => void;
    reset: () => void;
}

const initialState: Omit<ProctoringState, 'setWebcam' | 'addViolation' | 'setWarningLevel' | 'startMonitoring' | 'stopMonitoring' | 'reset'> = {
    webcam: {
        isActive: false,
        stream: null,
        error: null,
        lastCapture: null,
    },
    violations: [],
    totalViolations: 0,
    highViolations: 0,
    warningLevel: 0,
    isMonitoring: false,
    lastAnalysis: null,
};

export const useProctoringStore = create<ProctoringState>((set) => ({
    ...initialState,

    setWebcam: (webcam) =>
        set((state) => ({
            webcam: { ...state.webcam, ...webcam },
        })),

    addViolation: (violation) =>
        set((state) => ({
            violations: [...state.violations, violation],
            totalViolations: state.totalViolations + 1,
            highViolations: violation.severity === 'HIGH' ? state.highViolations + 1 : state.highViolations,
        })),

    setWarningLevel: (level) => set({ warningLevel: level }),

    startMonitoring: () =>
        set({
            isMonitoring: true,
            lastAnalysis: new Date().toISOString(),
        }),

    stopMonitoring: () => set({ isMonitoring: false }),

    reset: () => set(initialState),
}));