/**
 * LOGIN FORM COMPONENT
 *
 * PURPOSE:
 * - Render login form with validation
 * - Submit to POST /auth/login
 * - Handle errors and loading states
 *
 * FORM FIELDS:
 * - Email (text input, email type)
 * - Password (password input)
 * - Submit button
 * - Link to register page
 *
 * VALIDATION:
 * - Use loginSchema from schemas.ts
 * - React Hook Form + Zod resolver
 *
 * IMPLEMENTATION:
 *
 * import { useForm } from 'react-hook-form';
 * import { zodResolver } from '@hookform/resolvers/zod';
 * import { loginSchema } from '../schemas';
 * import { useLogin } from '../hooks';
 *
 * export const LoginForm = () => {
 *   const { mutate: login, isLoading, error } = useLogin();
 *
 *   const form = useForm({
 *     resolver: zodResolver(loginSchema),
 *     defaultValues: { email: '', password: '' }
 *   });
 *
 *   const onSubmit = (data) => {
 *     login(data);
 *   };
 *
 *   return (
 *     <form onSubmit={form.handleSubmit(onSubmit)}>
 *       // Email input with error display
 *       // Password input with error display
 *       // Submit button (disabled when loading)
 *       // Show error message if login fails
 *       // Link: "Don't have an account? Register"
 *     </form>
 *   );
 * };
 *
 * ERROR HANDLING:
 * - 401 Unauthorized: "Invalid email or password"
 * - 429 Too Many Requests: "Too many attempts, try again later"
 * - Network errors: "Connection failed, check your internet"
 */