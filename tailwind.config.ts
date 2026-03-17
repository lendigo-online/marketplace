// tailwind.config.ts
import type { Config } from "tailwindcss"

const config = {
    darkMode: ["class"],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            fontFamily: {
                sans: [
                    "Inter",
                    "-apple-system",
                    "BlinkMacSystemFont",
                    "SF Pro Display",
                    "SF Pro Text",
                    "Helvetica Neue",
                    "Arial",
                    "sans-serif"
                ],
            },
            letterSpacing: {
                tightest: "-0.04em",
                tighter: "-0.03em",
                tight: "-0.02em",
                snug: "-0.01em",
                normal: "0",
            },
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                apple: {
                    blue: "#0071e3",
                    text: "#1d1d1f",
                    secondary: "#6e6e73",
                    bg: "#fbfbfd",
                    surface: "#f5f5f7",
                },
            },
            borderRadius: {
                none: "0",
                sm: "8px",
                DEFAULT: "12px",
                md: "14px",
                lg: "18px",
                xl: "22px",
                "2xl": "28px",
                "3xl": "36px",
                full: "9999px",
            },
            boxShadow: {
                "apple-sm": "0 2px 8px rgba(0,0,0,0.06)",
                "apple": "0 4px 20px rgba(0,0,0,0.08)",
                "apple-lg": "0 8px 40px rgba(0,0,0,0.12)",
                "apple-xl": "0 20px 60px rgba(0,0,0,0.18)",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                "fade-up": {
                    from: { opacity: "0", transform: "translateY(16px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
                "fade-in": {
                    from: { opacity: "0" },
                    to: { opacity: "1" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "fade-up": "fade-up 0.5s ease forwards",
                "fade-in": "fade-in 0.4s ease forwards",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
