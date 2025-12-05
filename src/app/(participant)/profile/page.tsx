'use client';

import { useAuth } from '@/features/auth/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { User, Mail, Shield } from 'lucide-react';

export default function ProfilePage() {
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="container mx-auto py-8">
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">Please log in to view your profile</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">Profile</h1>
                <p className="text-muted-foreground mt-2">
                    View and manage your account information
                </p>
            </div>

            {/* Profile Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <p className="font-semibold text-foreground">{user.email}</p>
                            <p className="text-sm text-muted-foreground">User ID: {user.id}</p>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                        <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">Email</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Shield className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">Role</p>
                                <p className="text-sm text-muted-foreground">{user.role}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Account Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full" disabled>
                        Change Password (Coming Soon)
                    </Button>
                    <Button variant="outline" className="w-full" disabled>
                        Update Profile (Coming Soon)
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}