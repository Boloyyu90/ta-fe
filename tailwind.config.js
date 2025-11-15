/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                    50: "hsl(213, 50%, 95%)",
                    100: "hsl(213, 50%, 90%)",
                    200: "hsl(213, 50%, 80%)",
                    300: "hsl(213, 50%, 70%)",
                    400: "hsl(213, 50%, 60%)",
                    500: "hsl(213, 50%, 50%)",
                    600: "hsl(213, 50%, 40%)", // #327498 - Main primary
                    700: "hsl(213, 50%, 30%)",
                    800: "hsl(213, 50%, 20%)",
                    900: "hsl(213, 50%, 10%)",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                    50: "hsl(33, 85%, 95%)",
                    100: "hsl(33, 85%, 90%)",
                    200: "hsl(33, 85%, 80%)",
                    300: "hsl(33, 85%, 70%)",
                    400: "hsl(33, 85%, 61%)", // #F0A245 - Main secondary
                    500: "hsl(33, 85%, 55%)",
                    600: "hsl(33, 85%, 50%)",
                    700: "hsl(33, 85%, 40%)",
                    800: "hsl(33, 85%, 30%)",
                    900: "hsl(33, 85%, 20%)",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                // Existing animations
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },

                // New Landing Page Animations
                "fade-in": {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                "fade-in-up": {
                    "0%": {
                        opacity: "0",
                        transform: "translateY(20px)"
                    },
                    "100%": {
                        opacity: "1",
                        transform: "translateY(0)"
                    },
                },
                "fade-in-down": {
                    "0%": {
                        opacity: "0",
                        transform: "translateY(-20px)"
                    },
                    "100%": {
                        opacity: "1",
                        transform: "translateY(0)"
                    },
                },
                "fade-in-left": {
                    "0%": {
                        opacity: "0",
                        transform: "translateX(-20px)"
                    },
                    "100%": {
                        opacity: "1",
                        transform: "translateX(0)"
                    },
                },
                "fade-in-right": {
                    "0%": {
                        opacity: "0",
                        transform: "translateX(20px)"
                    },
                    "100%": {
                        opacity: "1",
                        transform: "translateX(0)"
                    },
                },
                "scale-in": {
                    "0%": {
                        opacity: "0",
                        transform: "scale(0.9)"
                    },
                    "100%": {
                        opacity: "1",
                        transform: "scale(1)"
                    },
                },
                "slide-in-bottom": {
                    "0%": {
                        transform: "translateY(100%)",
                        opacity: "0",
                    },
                    "100%": {
                        transform: "translateY(0)",
                        opacity: "1",
                    },
                },
                "bounce-subtle": {
                    "0%, 100%": {
                        transform: "translateY(0)"
                    },
                    "50%": {
                        transform: "translateY(-5px)"
                    },
                },
                "pulse-subtle": {
                    "0%, 100%": {
                        opacity: "1"
                    },
                    "50%": {
                        opacity: "0.8"
                    },
                },
                "shimmer": {
                    "0%": {
                        backgroundPosition: "-1000px 0",
                    },
                    "100%": {
                        backgroundPosition: "1000px 0",
                    },
                },
                "gradient-x": {
                    "0%, 100%": {
                        backgroundPosition: "0% 50%",
                    },
                    "50%": {
                        backgroundPosition: "100% 50%",
                    },
                },
                "gradient-y": {
                    "0%, 100%": {
                        backgroundPosition: "50% 0%",
                    },
                    "50%": {
                        backgroundPosition: "50% 100%",
                    },
                },
                "float": {
                    "0%, 100%": {
                        transform: "translateY(0px)"
                    },
                    "50%": {
                        transform: "translateY(-10px)"
                    },
                },
            },
            animation: {
                // Existing
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",

                // New animations
                "fade-in": "fade-in 0.5s ease-out",
                "fade-in-up": "fade-in-up 0.6s ease-out",
                "fade-in-down": "fade-in-down 0.6s ease-out",
                "fade-in-left": "fade-in-left 0.6s ease-out",
                "fade-in-right": "fade-in-right 0.6s ease-out",
                "scale-in": "scale-in 0.5s ease-out",
                "slide-in-bottom": "slide-in-bottom 0.6s ease-out",
                "bounce-subtle": "bounce-subtle 2s ease-in-out infinite",
                "pulse-subtle": "pulse-subtle 3s ease-in-out infinite",
                "shimmer": "shimmer 2s linear infinite",
                "gradient-x": "gradient-x 3s ease infinite",
                "gradient-y": "gradient-y 3s ease infinite",
                "float": "float 3s ease-in-out infinite",

                // Stagger delays for grid items
                "fade-in-up-delay-1": "fade-in-up 0.6s ease-out 0.1s both",
                "fade-in-up-delay-2": "fade-in-up 0.6s ease-out 0.2s both",
                "fade-in-up-delay-3": "fade-in-up 0.6s ease-out 0.3s both",
                "fade-in-up-delay-4": "fade-in-up 0.6s ease-out 0.4s both",
                "fade-in-up-delay-5": "fade-in-up 0.6s ease-out 0.5s both",
                "fade-in-up-delay-6": "fade-in-up 0.6s ease-out 0.6s both",
            },
            transitionTimingFunction: {
                "spring": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
                "smooth": "cubic-bezier(0.4, 0, 0.2, 1)",
            },
            transitionDuration: {
                "400": "400ms",
                "600": "600ms",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};