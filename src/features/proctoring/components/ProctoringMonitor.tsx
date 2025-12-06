// src/features/proctoring/components/ProctoringMonitor.tsx

'use client';

import { useQuery } from '@tanstack/react-query';
import { proctoringApi } from '../api/proctoring.api';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { AlertCircle } from 'lucide-react';
import type { ProctoringEvent } from '../types/proctoring.types';

interface ProctoringMonitorProps {
    userExamId: number;
}

/**
 * Monitor proctoring events during exam
 *
 * ⚠️ FIXED: proctoringApi.getEvents() returns ProctoringEvent[] directly
 * NOT { events: ProctoringEvent[], total: number }
 */
export function ProctoringMonitor({ userExamId }: ProctoringMonitorProps) {
    const { data: eventsData, isLoading } = useQuery({
        queryKey: ['proctoring-events', userExamId],
        queryFn: () => proctoringApi.getEvents(userExamId),
        refetchInterval: 5000, // Poll every 5 seconds
    });

    // ✅ FIXED: eventsData is already an array, no .events property
    const events = eventsData || [];

    // ✅ FIXED: Add explicit type annotation to avoid implicit any
    const recentViolations = events.filter((e: ProctoringEvent) => e.severity === 'HIGH').slice(0, 3);

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm">Proctoring Monitor</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Loading proctoring data...</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">Proctoring Monitor</CardTitle>
                    <Badge variant={recentViolations.length > 0 ? 'destructive' : 'secondary'}>
                        {events.length} Events
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Violation Summary */}
                <div className="space-y-2">
                    <p className="text-sm font-medium">Recent Violations</p>
                    {recentViolations.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No violations detected</p>
                    ) : (
                        <div className="space-y-2">
                            {recentViolations.map((event: ProctoringEvent) => ( // ✅ Explicit type
                                <div
                                    key={event.id}
                                    className="flex items-start gap-2 p-2 rounded-lg border border-red-200 bg-red-50"
                                >
                                    <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-red-900">
                                            {event.eventType}
                                        </p>
                                        {event.details && (
                                            <p className="text-xs text-red-700">{event.details}</p>
                                        )}
                                        <p className="text-xs text-red-600 mt-1">
                                            {new Date(event.timestamp).toLocaleTimeString()}
                                        </p>
                                    </div>
                                    <Badge variant="destructive" className="text-xs">
                                        {event.severity}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Status Info */}
                <div className="pt-2 border-t">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Events:</span>
                        <span className="font-medium">{events.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">High Severity:</span>
                        <span className="font-medium text-red-600">
                            {events.filter((e: ProctoringEvent) => e.severity === 'HIGH').length}
                        </span>
                    </div>
                </div>

                {/* Warning */}
                {recentViolations.length >= 3 && (
                    <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                        <p className="text-sm font-medium text-yellow-900">⚠️ Warning</p>
                        <p className="text-xs text-yellow-700 mt-1">
                            Multiple violations detected. Your exam may be subject to review.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}