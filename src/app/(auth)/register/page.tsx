"use client";

import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { useAuth } from "@/features/auth/hooks";
import { AuthLottie } from "@/features/auth/components/AuthLottie";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/shared/components/ui/card";

export default function RegisterPage() {
    const { isAuthenticated } = useAuth();

    // Don't render register form if already authenticated (layout handles redirect)
    if (isAuthenticated) {
        return null;
    }

    return (
        <div className="grid w-full items-center gap-32 lg:grid-cols-2">
            {/* Lottie Animation - hidden on mobile, shown on lg+ */}
            <AuthLottie
                url="/lottie/lottie-register.json"
                className="order-2 lg:order-1"
            />

            {/* Card/Form - always first on mobile */}
            <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
                {/* Gradient Border Wrapper */}
                <div className="w-full max-w-md rounded-3xl bg-gradient-to-t from-primary via-primary/50 to-transparent p-[5px]">
                    <Card className="w-full border-0 shadow-md rounded-[calc(1.5rem-2px)] bg-background">
                        <CardHeader className="space-y-1 text-center">
                            <CardTitle className="text-2xl font-bold">
                                Buat Akun
                            </CardTitle>
                            <CardDescription>
                                Bergabung dengan Prestige Tryout hari ini
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <RegisterForm />
                        </CardContent>
                        <CardFooter className="flex-col gap-2 text-center">
                            <p className="text-xs text-muted-foreground">
                                Dengan mendaftar, Anda menyetujui{" "}
                                <a href="#" className="underline hover:text-foreground">
                                    Syarat & Ketentuan
                                </a>{" "}
                                dan{" "}
                                <a href="#" className="underline hover:text-foreground">
                                    Kebijakan Privasi
                                </a>
                            </p>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}