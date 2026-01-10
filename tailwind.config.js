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
                    700: "hsl(213, 50%, 30%)",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
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

                // Success colors
                success: {
                    DEFAULT: "hsl(var(--success))",
                    foreground: "hsl(var(--success-foreground))",
                },

                // Warning colors
                warning: {
                    DEFAULT: "hsl(var(--warning))",
                    foreground: "hsl(var(--warning-foreground))",
                },

                // NEW: Info colors
                info: {
                    DEFAULT: "hsl(var(--info))",
                    foreground: "hsl(var(--info-foreground))",
                },

                // Severity colors for proctoring
                severity: {
                    high: "hsl(var(--severity-high))",
                    medium: "hsl(var(--severity-medium))",
                    low: "hsl(var(--severity-low))",
                },

                // Rating stars
                rating: {
                    DEFAULT: "hsl(var(--rating))",
                    foreground: "hsl(var(--rating-foreground))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                // Shadcn/ui required
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },

                // Landing page animations
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
                "pulse-subtle": {
                    "0%, 100%": {
                        opacity: "1"
                    },
                    "50%": {
                        opacity: "0.8"
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
                "float": {
                    "0%, 100%": {
                        transform: "translateY(0px)"
                    },
                    "50%": {
                        transform: "translateY(-10px)"
                    },
                },

                // Real-time monitoring animations
                "pulse": {
                    "0%, 100%": {
                        opacity: "1"
                    },
                    "50%": {
                        opacity: "0.5"
                    }
                },
                "ping": {
                    "75%, 100%": {
                        transform: "scale(2)",
                        opacity: "0"
                    }
                },
                "blink": {
                    "0%, 100%": {
                        opacity: "1"
                    },
                    "50%": {
                        opacity: "0"
                    }
                },
                "shake": {
                    "0%, 100%": {
                        transform: "translateX(0)"
                    },
                    "10%, 30%, 50%, 70%, 90%": {
                        transform: "translateX(-4px)"
                    },
                    "20%, 40%, 60%, 80%": {
                        transform: "translateX(4px)"
                    }
                },

                // Simple fade-in animations (CSS-only, no JS)
                "fade-in": {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                "fade-in-up": {
                    "0%": { opacity: "0", transform: "translateY(20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                "fade-in-down": {
                    "0%": { opacity: "0", transform: "translateY(-20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                "fade-in-left": {
                    "0%": { opacity: "0", transform: "translateX(20px)" },
                    "100%": { opacity: "1", transform: "translateX(0)" },
                },
                "fade-in-right": {
                    "0%": { opacity: "0", transform: "translateX(-20px)" },
                    "100%": { opacity: "1", transform: "translateX(0)" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "slide-in-bottom": "slide-in-bottom 0.6s ease-out",
                "pulse-subtle": "pulse-subtle 3s ease-in-out infinite",
                "gradient-x": "gradient-x 3s ease infinite",
                "float": "float 3s ease-in-out infinite",

                // Real-time animations
                "pulse": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                "ping": "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
                "blink": "blink 1s ease-in-out infinite",
                "shake": "shake 0.5s ease-in-out",

                // FIXED: Added 100ms base delay for paint time
                "fade-in": "fade-in 0.5s ease-out 0.1s both",
                "fade-in-up": "fade-in-up 0.5s ease-out 0.1s both",
                "fade-in-down": "fade-in-down 0.5s ease-out 0.1s both",
                "fade-in-left": "fade-in-left 0.5s ease-out 0.1s both",
                "fade-in-right": "fade-in-right 0.5s ease-out 0.1s both",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};