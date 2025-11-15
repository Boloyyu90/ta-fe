"use client";

/**
 * AUTH LAYOUT
 *
 * PURPOSE:
 * - Wrapper layout for login/register pages
 * - Prevents authenticated users from accessing auth pages
 * - Provides consistent styling for auth pages
 *
 * FEATURES:
 * - Redirects authenticated users to appropriate dashboard
 * - Clean, minimal layout focused on the auth forms
 * - No navigation or footer (different from main layout)
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks";
import { Loader2 } from "lucide-react";

export default function AuthLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { isAuthenticated, isLoading, user } = useAuth();

    // Redirect authenticated users to their dashboard
    useEffect(() => {
        if (!isLoading && isAuthenticated && user) {
            const redirectPath = user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard";
            router.push(redirectPath);
        }
    }, [isAuthenticated, isLoading, user, router]);

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/30">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Checking authentication...</p>
                </div>
            </div>
        );
    }

    // Don't render children if user is authenticated (will redirect)
    if (isAuthenticated) {
        return null;
    }

    // Render auth pages for unauthenticated users
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
            {children}
        </div>
    );
}