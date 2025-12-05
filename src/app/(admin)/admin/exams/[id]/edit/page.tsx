'use client';

/**
 * EDIT EXAM PAGE (Stub Implementation)
 *
 * TODO: Full implementation pending
 */

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function EditExamPage({ params }: PageProps) {
    const { id } = use(params);

    return (
        <div className="min-h-screen bg-muted/30">
            <div className="bg-background border-b border-border">
                <div className="container mx-auto px-4 py-6">
                    <Link href={`/admin/exams/${id}`}>
                        <Button variant="ghost" className="mb-4">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Exam
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Edit Exam</CardTitle>
                        <CardDescription>
                            Update exam details - Full implementation coming soon
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            This page is under construction. Exam editing functionality will be implemented in the next iteration.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}