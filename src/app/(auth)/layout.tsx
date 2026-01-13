"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks";
import { Navbar } from "@/features/landing/components/Navbar";
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

    return (
        <div className="min-h-screen flex flex-col bg-muted/30">
            {/* Navbar with auth variant */}
            <Navbar variant="auth" />

            {/* Main content - with padding top for fixed navbar */}
            <main className="flex-1 flex items-center justify-center pt-16 py-8 px-4">
                <div className="w-full max-w-5xl">
                    {children}
                </div>
            </main>
        </div>
    );
}
