import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ClientProvider } from "@/providers/ClientProvider"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-inter",
})

export const metadata: Metadata = {
    title: "Lendigo — Rent Anything, Anywhere",
    description: "Discover and rent unique items from people around you. Electronics, tools, sports gear, and more.",
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
                    <Navbar />
                    <main className="min-h-screen pt-[120px] pb-12">
                        {children}
                    </main>
                    <Footer />
                </ClientProvider>
            </body>
        </html>
    )
}
