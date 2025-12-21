'use client';

/**
 * DEPRECATED: Exam Session Page (Old Route)
 *
 * ============================================================================
 * MIGRATION NOTICE
 * ============================================================================
 *
 * This route is deprecated and redirects to the new exam taking page.
 *
 * Old route: /exam-sessions/:id
 * New route: /exam-sessions/:id/take
 *
 * The new route uses the refactored ProctoringMonitor component with full
 * ML/YOLO integration (fixed in CRITICAL-001).
 *
 * This file is kept for backwards compatibility and will be removed in a
 * future release.
 */

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function ExamSessionPage() {
    const router = useRouter();
    const params = useParams();
    const sessionId = Number(params.id);

    // Immediate redirect to new exam taking page
    useEffect(() => {
        router.replace(`/exam-sessions/${sessionId}/take`);
    }, [sessionId, router]);

    // Show loading state during redirect
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
                <p className="text-sm text-muted-foreground">Mengalihkan ke halaman ujian...</p>
            </div>
        </div>
    );
}
