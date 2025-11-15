/**
 * REGISTRATION FORM COMPONENT
 *
 * PURPOSE:
 * - Render registration form with validation
 * - Submit to POST /auth/register
 * - Auto-login on success
 *
 * FORM FIELDS:
 * - Name (text input)
 * - Email (email input)
 * - Password (password input)
 * - Confirm Password (password input, client-side validation)
 * - Submit button
 * - Link to login page
 *
 * VALIDATION:
 * - Use registerSchema from schemas.ts
 * - Add confirmPassword field (client-only, not sent to backend)
 * - Password match validation
 *
 * IMPLEMENTATION:
 *
 * const registerWithConfirmSchema = registerSchema.extend({
 *   confirmPassword: z.string()
 * }).refine((data) => data.password === data.confirmPassword, {
 *   message: "Passwords don't match",
 *   path: ["confirmPassword"]
 * });
 *
 * export const RegisterForm = () => {
 *   const { mutate: register, isLoading, error } = useRegister();
 *
 *   const form = useForm({
 *     resolver: zodResolver(registerWithConfirmSchema)
 *   });
 *
 *   const onSubmit = ({ confirmPassword, ...data }) => {
 *     register(data); // Exclude confirmPassword from API call
 *   };
 *
 *   // Render form fields...
 * };
 *
 * ERROR HANDLING:
 * - 409 Conflict: "Email already registered"
 * - 400 Validation: Show specific field errors
 */