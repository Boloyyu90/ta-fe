"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { useAuth } from "@/features/auth/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
    const { isAuthenticated, isLoading, user } = useAuth();
    const router = useRouter();

    // Redirect authenticated users to their dashboard
    useEffect(() => {
        if (!isLoading && isAuthenticated && user) {
            const redirectPath = user.role === 'ADMIN'
                ? '/admin/dashboard'
                : '/dashboard';
            router.push(redirectPath);
        }
    }, [isAuthenticated, isLoading, user, router]);

    // Show loading spinner while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/30">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    <p className="text-sm text-muted-foreground mt-2">Memeriksa status login...</p>
                </div>
            </div>
        );
    }

    // Don't render login form if already authenticated (will redirect)
    if (isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
            <div className="w-full max-w-md">
                {/* Logo & Branding */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center justify-center space-x-2 mb-2">
                         <span className="relative w-10 h-10 rounded-lg overflow-hidden">
                                <Image
                                    src="/logo-prestige.webp"
                                    alt="Prestige Tryout logo"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </span>
                        <span className="text-2xl font-bold text-foreground">Prestige Tryout</span>
                    </Link>
                </div>

                {/* Login Card */}
                <Card className="border-border shadow-lg">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">
                            Selamat Datang Kembali
                        </CardTitle>
                        <CardDescription className="text-center">
                            Masukkan kredensial yang sudah terdaftar
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <LoginForm />
                    </CardContent>
                </Card>

                {/* Footer Links */}
                <div className="mt-6 text-center space-y-2">

                    <p className="text-xs text-muted-foreground">
                        Dengan mendaftarkan diri, anda menyetujui {" "}
                        <a href="#" className="underline hover:text-foreground">
                            Ketentuan Layanan
                        </a>{" "}
                        dan{" "}
                        <a href="#" className="underline hover:text-foreground">
                            Kebijakan Privasi
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}