'use client';

/**
 * USERS MANAGEMENT PAGE (Stub Implementation)
 *
 * TODO: Full implementation pending
 */

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';

export default function UsersManagementPage() {
    return (
        <div className="min-h-screen bg-muted/30">
            <div className="bg-background border-b border-border">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold">User Management</h1>
                        <Link href="/admin/users/create">
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Create User
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Users List</CardTitle>
                        <CardDescription>
                            Manage all users - Full implementation coming soon
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            This page is under construction. User management functionality will be implemented in the next iteration.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}