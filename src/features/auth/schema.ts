/**
 * AUTH VALIDATION SCHEMAS
 *
 * Zod schemas matching backend validation rules
 * Ensures client-side validation consistency with server
 */

import { z } from "zod";

// Password validation schema matching backend requirements
const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be less than 128 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number");

// Login schema
export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, "Email is required")
        .email("Invalid email address")
        .max(255, "Email must be less than 255 characters"),
    password: z.string().min(1, "Password is required"),
});

// Register schema
export const registerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Name is required")
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must be less than 100 characters")
        .regex(
            /^[a-zA-Z\s'-]+$/,
            "Name can only contain letters, spaces, hyphens, and apostrophes"
        ),
    email: z
        .string()
        .trim()
        .min(1, "Email is required")
        .email("Invalid email address")
        .max(255, "Email must be less than 255 characters"),
    password: passwordSchema,
});

// Register form schema with confirm password (client-side only)
export const registerFormSchema = registerSchema
    .extend({
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

// Type inference
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type RegisterFormInput = z.infer<typeof registerFormSchema>;