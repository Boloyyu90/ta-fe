/**
 * AUTH LAYOUT
 *
 * PURPOSE:
 * - Wrapper layout for login/register pages
 * - Centers content, adds branding, consistent styling
 * - Prevents authenticated users from accessing auth pages
 *
 * IMPLEMENTATION:
 * - Check auth state from auth store
 * - If authenticated, redirect to appropriate dashboard
 * - Display logo, background image, or decorative elements
 * - Center children (login/register forms) vertically & horizontally
 */