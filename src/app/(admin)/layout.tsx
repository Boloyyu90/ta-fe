"use client";

/**
 * ADMIN LAYOUT
 *
 * PURPOSE:
 * - Wrapper for all admin pages
 * - Protect routes (admin-only access)
 *
 * AUTHENTICATION CHECK:
 * - If not authenticated → redirect to /login
 * - If authenticated but role !== ADMIN → redirect to /dashboard (403)
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { isAuthenticated, isLoading, user } = useAuth();

    // Redirect unauthenticated users to login
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, isLoading, router]);

    // Redirect non-admin users to participant dashboard
    useEffect(() => {
        if (!isLoading && isAuthenticated && user?.role === "PARTICIPANT") {
            router.push("/dashboard");
        }
    }, [isAuthenticated, isLoading, user, router]);

    // Show loading spinner while checking auth
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/30">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Memuat...</p>
                </div>
            </div>
        );
    }

    // Don't render if not authenticated or wrong role
    if (!isAuthenticated || user?.role !== "ADMIN") {
        return null;
    }

    // Render children for authenticated admins
    return <>{children}</>;
}