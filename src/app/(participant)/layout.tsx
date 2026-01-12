"use client";

/**
 * PARTICIPANT LAYOUT
 *
 * PURPOSE:
 * - Wrapper for all participant pages
 * - Protect routes (redirect unauthenticated users)
 * - Redirect admin users to admin dashboard
 *
 * AUTHENTICATION CHECK:
 * - If not authenticated → redirect to /login
 * - If authenticated but role !== PARTICIPANT → redirect to /admin/dashboard
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks";
import { ParticipantNavbar } from "@/features/dashboard/components/participant";
import { Loader2 } from "lucide-react";

export default function ParticipantLayout({
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

    // Redirect admin users to admin dashboard
    useEffect(() => {
        if (!isLoading && isAuthenticated && user?.role === "ADMIN") {
            router.push("/admin/dashboard");
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
    if (!isAuthenticated || user?.role !== "PARTICIPANT") {
        return null;
    }

    // Render children for authenticated participants
    return (
        <div className="min-h-screen bg-muted/30">
            <ParticipantNavbar />
            <main>{children}</main>
        </div>
    );
}