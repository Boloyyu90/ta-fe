"use client";

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

    // Redirect authenticated users to appropriate dashboard
    useEffect(() => {
        if (!isLoading && isAuthenticated && user) {
            const redirectPath = user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard";
            router.push(redirectPath);
        }
    }, [isAuthenticated, isLoading, user, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Memeriksa autentikasi...</p>
                </div>
            </div>
        );
    }

    // Single full-screen centered wrapper for all auth pages (supports 2-column layout)
    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 py-8 px-4">
            <div className="w-full max-w-5xl">
                {children}
            </div>
        </div>
    );
}