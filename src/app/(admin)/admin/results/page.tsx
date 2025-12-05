'use client';

/**
 * RESULTS MONITORING PAGE (Admin) (Stub Implementation)
 *
 * TODO: Full implementation pending
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';

export default function ResultsMonitoringPage() {
    return (
        <div className="min-h-screen bg-muted/30">
            <div className="bg-background border-b border-border">
                <div className="container mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold">Results Monitoring</h1>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Exam Results</CardTitle>
                        <CardDescription>
                            Monitor all exam results - Full implementation coming soon
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            This page is under construction. Results monitoring functionality will be implemented in the next iteration.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}