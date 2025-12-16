/**
 * Proctoring Hooks - Centralized exports
 *
 * Participant hooks:
 * - useAnalyzeFace: Analyze face via YOLO ML (POST /proctoring/exam-sessions/:id/analyze-face)
 * - useProctoringEvents: Get session events (GET /proctoring/exam-sessions/:id/events)
 * - useLogEvent: Log proctoring event (POST /proctoring/events)
 *
 * Admin hooks:
 * - useAdminProctoringEvents: Get all events (GET /admin/proctoring/events)
 */

// Participant
export { useAnalyzeFace } from './useAnalyzeFace';
export { useProctoringEvents } from './useProctoringEvents';
export { useLogEvent } from './useLogEvent';

// Admin
export { useAdminProctoringEvents } from './useAdminProctoringEvents';