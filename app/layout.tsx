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
    title: "Lendigo — Rent Anything, Anywhere",
    description: "Discover and rent unique items from people around you. Electronics, tools, sports gear, and more.",
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
