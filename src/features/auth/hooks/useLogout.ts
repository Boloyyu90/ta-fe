"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { authApi } from "@/features/auth/api/auth.api";
import { toast } from "sonner";

/**
 * Hook to handle user logout
 * Invalidates refresh token and clears auth state
 */
export const useLogout = () => {
    const router = useRouter();
    const { clearAuth, refreshToken } = useAuthStore();

    const mutation = useMutation({
        mutationFn: async () => {
            if (refreshToken) {
                await authApi.logout(refreshToken);
            }
        },
    });

    // Handle success in useEffect
    useEffect(() => {
        if (mutation.isSuccess) {
            clearAuth();
            toast.success("Logged out successfully");
            router.push("/login");
        }
    }, [mutation.isSuccess, clearAuth, router]);

    // Handle errors in useEffect
    useEffect(() => {
        if (mutation.isError) {
            // Clear auth even if API call fails
            clearAuth();
            router.push("/login");
            console.error("Logout error:", mutation.error);
        }
    }, [mutation.isError, mutation.error, clearAuth, router]);

    return mutation;
};