/**
 * AUTH HOOKS - Barrel Export
 *
 * Centralized export for all authentication hooks
 * This allows clean imports: import { useLogin, useRegister } from '@/features/auth/hooks'
 */

export { useLogin } from "./useLogin";
export { useRegister } from "./useRegister";
export { useLogout } from "./useLogout";

// Auth state hook (simple re-export from store)
export { useAuth } from "./useAuth";