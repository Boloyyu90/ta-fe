'use client';

/**
 * EXAM SESSIONS MONITORING PAGE (Admin) (Stub Implementation)
 *
 * TODO: Full implementation pending
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';

export default function ExamSessionsMonitoringPage() {
    return (
        <div className="min-h-screen bg-muted/30">
            <div className="bg-background border-b border-border">
                <div className="container mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold">Exam Sessions Monitoring</h1>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Active Sessions</CardTitle>
                        <CardDescription>
                            Monitor all exam sessions - Full implementation coming soon
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            This page is under construction. Session monitoring functionality will be implemented in the next iteration.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}