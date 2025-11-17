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

    // Show nothing while loading or redirecting
    if (isLoading) {
        return null;
    }

    // Don't render if not authenticated or wrong role
    if (!isAuthenticated || user?.role !== "ADMIN") {
        return null;
    }

    // Render children for authenticated admins
    return <>{children}</>;
}