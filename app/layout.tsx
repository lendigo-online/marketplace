import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"
import { ClientProvider } from "@/providers/ClientProvider"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import CookieBanner from "@/components/CookieBanner"

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-inter",
})

export const metadata: Metadata = {
    title: {
        default: "Lendigo — Wypożycz cokolwiek w Polsce",
        template: "%s | Lendigo",
    },
    description: "Wypożycz elektronikę, narzędzia, rowery, samochody i setki innych rzeczy od osób w Twoim mieście. Bezpiecznie, prosto, bez zobowiązań.",
    metadataBase: new URL("https://www.lendigo.online"),
    alternates: {
        canonical: "/",
        languages: {
            pl: "https://www.lendigo.online/",
            "x-default": "https://www.lendigo.online/",
        },
    },
    openGraph: {
        type: "website",
        locale: "pl_PL",
        url: "https://www.lendigo.online/",
        siteName: "Lendigo",
        title: "Lendigo — Wypożycz cokolwiek w Polsce",
        description: "Wypożycz elektronikę, narzędzia, rowery, samochody i setki innych rzeczy od osób w Twoim mieście.",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Lendigo — platforma wypożyczania",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Lendigo — Wypożycz cokolwiek w Polsce",
        description: "Wypożycz elektronikę, narzędzia, rowery i setki innych rzeczy od osób w Twoim mieście.",
        images: ["/og-image.png"],
    },
    icons: {
        icon: "/favicon.svg",
        shortcut: "/favicon.svg",
    },
}

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="pl" className={inter.variable}>
            <body className={`${inter.className} antialiased`}>
                <ClientProvider>
                    <Suspense fallback={null}>
                        <Navbar />
                    </Suspense>
                    <main className="min-h-screen pt-[168px] md:pt-[120px] pb-12">
                        {children}
                    </main>
                    <Footer />
                    <CookieBanner />
                </ClientProvider>
            </body>
        </html>
    )
}
