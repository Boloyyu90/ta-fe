"use client";

/**
 * USE LOGOUT HOOK - FIXED
 *
 * ✅ Removed useEffect anti-pattern
 * ✅ Uses onSuccess/onError callbacks
 * ✅ Proper Indonesian message
 */

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { authApi } from "@/features/auth/api/auth.api";
import { toast } from "sonner";

/**
 * Hook to handle user logout
 * Invalidates refresh token on backend and clears auth state
 *
 * @returns Mutation object with logout function and states
 *
 * @example
 * const { mutate: logout, isPending } = useLogout();
 * logout();
 */
export const useLogout = () => {
    const router = useRouter();
    const { clearAuth, refreshToken } = useAuthStore();

    return useMutation({
        mutationFn: async () => {
            if (refreshToken) {
                await authApi.logout(refreshToken);
            }
        },
        onSuccess: () => {
            // Clear auth state from store and storage
            clearAuth();

            // Show success message in Indonesian
            toast.success("Berhasil keluar");

            // Redirect to login page
            router.push("/login");
        },
        onError: (error) => {
            // Clear auth even if API call fails (offline/network error)
            clearAuth();

            // Still redirect to login
            router.push("/login");

            // Log error for debugging
            console.error("Logout error:", error);
        },
    });
};