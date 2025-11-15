"use client";

/**
 * AUTH INITIALIZER COMPONENT
 *
 * PURPOSE:
 * - Initializes authentication state on app load
 * - Checks for existing tokens in localStorage
 * - Fetches current user data if tokens exist
 * - Must be included in root layout
 *
 * USAGE:
 * Include this in your root layout.tsx:
 * <AuthInitializer />
 */

import { useEffect } from "react";
import { useInitAuth } from "@/features/auth/hooks";

export function AuthInitializer() {
    // Initialize auth state on mount
    const { isLoading, isError } = useInitAuth();

    // Optional: Log auth initialization status
    useEffect(() => {
        if (!isLoading) {
            console.log("[Auth] Initialization complete");
        }
        if (isError) {
            console.log("[Auth] Initialization failed - user logged out");
        }
    }, [isLoading, isError]);

    // This component doesn't render anything
    // It only manages auth state initialization
    return null;
}