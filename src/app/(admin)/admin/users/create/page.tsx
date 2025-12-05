'use client';

/**
 * CREATE USER PAGE (Admin) (Stub Implementation)
 *
 * TODO: Full implementation pending
 */

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';

export default function CreateUserPage() {
    return (
        <div className="min-h-screen bg-muted/30">
            <div className="bg-background border-b border-border">
                <div className="container mx-auto px-4 py-6">
                    <Link href="/admin/users">
                        <Button variant="ghost" className="mb-4">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Users
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Create New User</CardTitle>
                        <CardDescription>
                            Add a new user account - Full implementation coming soon
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            This page is under construction. User creation functionality will be implemented in the next iteration.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}