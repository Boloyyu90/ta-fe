/**
 * Test Utility for Proctoring Violation Flow
 *
 * ============================================================================
 * PURPOSE: Verify frontend violation handling works correctly
 * ============================================================================
 *
 * This utility simulates backend responses to test the full violation flow
 * without needing the actual ML service. Use this for:
 * - Thesis defense demonstration
 * - Frontend testing in isolation
 * - Debugging violation alert display
 *
 * Usage:
 * 1. Import and call in browser console: window.testViolationFlow.simulateNoFace()
 * 2. Or import in component for testing
 *
 * @example
 * // In browser console:
 * window.testViolationFlow.simulateNoFace()
 * window.testViolationFlow.simulateMultipleFaces()
 * window.testViolationFlow.simulateLookingAway()
 */

import type { Violation, Severity, ProctoringEventType } from '../types/proctoring.types';
import { useProctoringStore } from '../store/proctoring.store';

// ============================================================================
// MOCK RESPONSE GENERATORS
// ============================================================================

interface MockAnalyzeFaceResponse {
    analysis: {
        status: 'success' | 'timeout' | 'error';
        violations: string[];
        confidence: number;
        message: string;
        metadata?: {
            processingTimeMs: number;
        };
    };
    eventLogged: boolean;
    eventType: ProctoringEventType | null;
    usedFallback: boolean;
}

/**
 * Generate a mock "no face detected" response
 * This is what the backend SHOULD return when camera is covered
 */
export function mockNoFaceResponse(): MockAnalyzeFaceResponse {
    return {
        analysis: {
            status: 'success',
            violations: ['NO_FACE_DETECTED'],
            confidence: 0.95,
            message: 'No face detected in frame',
            metadata: {
                processingTimeMs: 150,
            },
        },
        eventLogged: true,
        eventType: 'NO_FACE_DETECTED',
        usedFallback: false,
    };
}

/**
 * Generate a mock "multiple faces" response
 */
export function mockMultipleFacesResponse(): MockAnalyzeFaceResponse {
    return {
        analysis: {
            status: 'success',
            violations: ['MULTIPLE_FACES'],
            confidence: 0.88,
            message: 'Multiple faces detected in frame',
            metadata: {
                processingTimeMs: 180,
            },
        },
        eventLogged: true,
        eventType: 'MULTIPLE_FACES',
        usedFallback: false,
    };
}

/**
 * Generate a mock "looking away" response
 */
export function mockLookingAwayResponse(): MockAnalyzeFaceResponse {
    return {
        analysis: {
            status: 'success',
            violations: ['LOOKING_AWAY'],
            confidence: 0.72,
            message: 'User is looking away from screen',
            metadata: {
                processingTimeMs: 165,
            },
        },
        eventLogged: true,
        eventType: 'LOOKING_AWAY',
        usedFallback: false,
    };
}

/**
 * Generate a mock "face detected" (normal/OK) response
 */
export function mockFaceDetectedResponse(): MockAnalyzeFaceResponse {
    return {
        analysis: {
            status: 'success',
            violations: ['FACE_DETECTED'],
            confidence: 0.98,
            message: 'Face detected successfully',
            metadata: {
                processingTimeMs: 120,
            },
        },
        eventLogged: false,
        eventType: null,
        usedFallback: false,
    };
}

// ============================================================================
// VIOLATION SIMULATORS (Direct Store Manipulation)
// ============================================================================

const SEVERITY_MAP: Record<ProctoringEventType, Severity> = {
    NO_FACE_DETECTED: 'HIGH',
    MULTIPLE_FACES: 'HIGH',
    LOOKING_AWAY: 'MEDIUM',
    FACE_DETECTED: 'LOW',
};

const MESSAGE_MAP: Record<ProctoringEventType, string> = {
    NO_FACE_DETECTED: 'Wajah tidak terdeteksi. Pastikan wajah Anda terlihat di kamera.',
    MULTIPLE_FACES: 'Terdeteksi lebih dari satu wajah. Pastikan hanya Anda yang terlihat.',
    LOOKING_AWAY: 'Anda terdeteksi tidak melihat ke layar.',
    FACE_DETECTED: 'Wajah terdeteksi dengan baik.',
};

/**
 * Create a violation object for testing
 */
function createTestViolation(type: ProctoringEventType): Violation {
    return {
        id: `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type,
        severity: SEVERITY_MAP[type],
        timestamp: new Date().toISOString(),
        message: MESSAGE_MAP[type],
    };
}

/**
 * Simulate a NO_FACE_DETECTED violation
 * This directly adds to the store and increments counters
 */
export function simulateNoFace(): Violation {
    const store = useProctoringStore.getState();
    const violation = createTestViolation('NO_FACE_DETECTED');

    store.addViolation(violation);
    store.incrementViolationCount();
    store.incrementHighViolationCount(); // NO_FACE_DETECTED is HIGH severity

    console.log('[TEST] Simulated NO_FACE_DETECTED violation:', violation);
    return violation;
}

/**
 * Simulate a MULTIPLE_FACES violation
 */
export function simulateMultipleFaces(): Violation {
    const store = useProctoringStore.getState();
    const violation = createTestViolation('MULTIPLE_FACES');

    store.addViolation(violation);
    store.incrementViolationCount();
    store.incrementHighViolationCount(); // MULTIPLE_FACES is HIGH severity

    console.log('[TEST] Simulated MULTIPLE_FACES violation:', violation);
    return violation;
}

/**
 * Simulate a LOOKING_AWAY violation
 */
export function simulateLookingAway(): Violation {
    const store = useProctoringStore.getState();
    const violation = createTestViolation('LOOKING_AWAY');

    store.addViolation(violation);
    store.incrementViolationCount();
    // LOOKING_AWAY is MEDIUM severity, so no incrementHighViolationCount

    console.log('[TEST] Simulated LOOKING_AWAY violation:', violation);
    return violation;
}

/**
 * Clear all test violations (reset store)
 */
export function clearTestViolations(): void {
    const store = useProctoringStore.getState();
    store.reset();
    console.log('[TEST] Cleared all violations');
}

/**
 * Get current violation state for debugging
 */
export function getViolationState(): {
    violations: Violation[];
    violationCount: number;
    highViolationCount: number;
} {
    const store = useProctoringStore.getState();
    return {
        violations: store.violations,
        violationCount: store.violationCount,
        highViolationCount: store.highViolationCount,
    };
}

// ============================================================================
// GLOBAL EXPORT FOR BROWSER CONSOLE TESTING
// ============================================================================

/**
 * Expose test functions to window for browser console testing
 * Usage: window.testViolationFlow.simulateNoFace()
 */
export function exposeToWindow(): void {
    if (typeof window !== 'undefined') {
        (window as unknown as { testViolationFlow: typeof testViolationFlow }).testViolationFlow = testViolationFlow;
        console.log('[TEST] Proctoring test utilities exposed to window.testViolationFlow');
        console.log('Available commands:');
        console.log('  window.testViolationFlow.simulateNoFace()');
        console.log('  window.testViolationFlow.simulateMultipleFaces()');
        console.log('  window.testViolationFlow.simulateLookingAway()');
        console.log('  window.testViolationFlow.clearTestViolations()');
        console.log('  window.testViolationFlow.getViolationState()');
    }
}

// ============================================================================
// FULL ALERT FLOW TESTER
// ============================================================================

/**
 * Test the full alert flow with a callback for the violation
 *
 * Use this with the onNewViolation callback from ProctoringMonitor
 *
 * @param onNewViolation - Callback to trigger full-screen alert
 * @param type - Type of violation to simulate
 * @returns The created violation
 *
 * @example
 * // In take/page.tsx, add a test button:
 * <Button onClick={() => {
 *   const violation = testFullAlertFlow(handleNewViolation, 'NO_FACE_DETECTED');
 *   console.log('Triggered violation:', violation);
 * }}>
 *   Test Violation Alert
 * </Button>
 */
export function testFullAlertFlow(
    onNewViolation: (violation: Violation) => void,
    type: Exclude<ProctoringEventType, 'FACE_DETECTED'> = 'NO_FACE_DETECTED'
): Violation {
    const store = useProctoringStore.getState();
    const violation = createTestViolation(type);

    // Add to store
    store.addViolation(violation);
    store.incrementViolationCount();

    if (type === 'NO_FACE_DETECTED' || type === 'MULTIPLE_FACES') {
        store.incrementHighViolationCount();
    }

    // Trigger the callback (this shows FullScreenViolationAlert)
    onNewViolation(violation);

    console.log('[TEST] Full alert flow triggered:', violation);
    return violation;
}

// ============================================================================
// EXPORT ALL FUNCTIONS
// ============================================================================

export const testViolationFlow = {
    // Mock response generators
    mockNoFaceResponse,
    mockMultipleFacesResponse,
    mockLookingAwayResponse,
    mockFaceDetectedResponse,

    // Direct store simulators
    simulateNoFace,
    simulateMultipleFaces,
    simulateLookingAway,
    clearTestViolations,
    getViolationState,

    // Full flow tester
    testFullAlertFlow,

    // Browser console exposure
    exposeToWindow,
};

export default testViolationFlow;
