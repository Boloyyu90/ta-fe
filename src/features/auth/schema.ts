/**
 * AUTH VALIDATION SCHEMAS (Zod)
 *
 * PURPOSE:
 * - Reuse backend validation rules on frontend
 * - Consistent validation across client & server
 * - Type inference for TypeScript
 *
 * SCHEMAS TO DEFINE:
 *
 * 1. registerSchema
 *    - email: Valid email, lowercase
 *    - password: Min 8 chars, 1 upper, 1 lower, 1 number
 *    - name: Min 2 chars, max 100
 *
 * 2. loginSchema
 *    - email: Valid email
 *    - password: String, min 1 char
 *
 * IMPLEMENTATION:
 *
 * import { z } from 'zod';
 *
 * const passwordSchema = z
 *   .string()
 *   .min(8, 'Password must be at least 8 characters')
 *   .regex(
 *     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
 *     'Password must contain uppercase, lowercase, and number'
 *   );
 *
 * export const registerSchema = z.object({
 *   email: z.string().email('Invalid email').toLowerCase(),
 *   password: passwordSchema,
 *   name: z.string().min(2).max(100)
 * });
 *
 * export const loginSchema = z.object({
 *   email: z.string().email('Invalid email'),
 *   password: z.string().min(1, 'Password is required')
 * });
 *
 * // Type inference
 * export type RegisterInput = z.infer<typeof registerSchema>;
 * export type LoginInput = z.infer<typeof loginSchema>;
 *
 * USAGE:
 * - Use with React Hook Form: resolver: zodResolver(loginSchema)
 * - Frontend validates before API call
 * - Backend validates again (defense in depth)
 */