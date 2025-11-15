"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks";

export default function AuthLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { isAuthenticated, isLoading, user } = useAuth();

    // ✅ FIX: Only redirect, don't block rendering
    useEffect(() => {
        if (!isLoading && isAuthenticated && user) {
            const redirectPath = user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard";
            router.push(redirectPath);
        }
    }, [isAuthenticated, isLoading, user, router]);

    // ✅ FIX: Always render children immediately
    // Redirect happens in background without blocking UI
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
            {children}
        </div>
    );
}