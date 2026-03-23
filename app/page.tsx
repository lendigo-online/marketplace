import prisma from "@/lib/prisma"
import ListingCard from "@/components/ListingCard"
import { SafeListing } from "@/types"
import Link from "next/link"
import { ArrowRight, Tag } from "lucide-react"
import Typewriter from "@/components/Typewriter"

export const revalidate = 0

interface HomeProps {
    searchParams: {
        category?: string
        q?: string
        location?: string
        from?: string
        to?: string
    }
}

export default async function Home({ searchParams }: HomeProps) {
    const { category, q, location, from, to } = searchParams

    const fromDate = from ? new Date(from) : undefined
    const toDate = to ? new Date(to) : undefined

    const listings = await prisma.listing.findMany({
        where: {
            ...(category && category !== "Wszystkie" ? { category } : {}),
            ...(q ? { title: { contains: q } } : {}),
            ...(location ? { location: { contains: location } } : {}),
            // Exclude listings with conflicting reservations in the date range
            ...(fromDate && toDate ? {
                reservations: {
                    none: {
                        AND: [
                            { startDate: { lte: toDate } },
                            { endDate: { gte: fromDate } },
                            { status: { not: "CANCELLED" } }
                        ]
                    }
                }
            } : {}),
        },
        orderBy: { createdAt: "desc" }
    })

    const safeListings: SafeListing[] = listings.map((listing) => ({
        ...listing,
        createdAt: listing.createdAt.toISOString(),
        updatedAt: listing.updatedAt.toISOString(),
    }))

    return (
        <div className="min-h-screen bg-[#fbfbfd]">
            {/* ── Hero Section ── */}
            <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#f5f5f7] to-[#fbfbfd] pt-10 pb-20 px-6">
                {/* Decorative gradient blobs */}
                <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-purple-100/30 rounded-full blur-3xl pointer-events-none" />

                <div className="relative max-w-[980px] mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-[#1d1d1f]/[0.06] rounded-full px-4 py-1.5 mb-8">
                        <Tag size={12} className="text-[#6e6e73]" />
                        <span className="text-[12px] font-medium text-[#6e6e73]">Wypożycz cokolwiek — płać tylko za czas</span>
                    </div>

                    <Typewriter />

                    <p className="text-[19px] md:text-[21px] text-[#6e6e73] font-light leading-relaxed max-w-[600px] mx-auto mb-10">
                        Odkryj setki przedmiotów wypożyczanych przez ludzi w Twojej okolicy. Bezpiecznie, prosto, bez zobowiązań.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link
                            href="#listings"
                            className="btn-apple-primary text-base px-8 py-3.5 shadow-apple"
                        >
                            Przeglądaj ogłoszenia
                        </Link>
                        <Link
                            href="/listings/create"
                            className="group inline-flex items-center gap-2 text-[#0071e3] text-base font-semibold hover:gap-3 transition-all duration-200"
                        >
                            Dodaj swoje ogłoszenie
                            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    </div>
                </div>


            </section>

            {/* ── Listings Grid ── */}
            <section id="listings" className="max-w-[1400px] mx-auto px-6 py-12">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h2 className="text-[28px] font-bold tracking-tight text-[#1d1d1f]">
                            {category && category !== "Wszystkie" ? `Kategoria: ${category}` : "Dostępne ogłoszenia"}
                        </h2>
                        <p className="text-[15px] text-[#6e6e73] mt-1">
                            {safeListings.length} {safeListings.length === 1 ? "przedmiot" : "przedmiotów"} gotowych do wypożyczenia
                            {(q || location) && ` · ${[q && `"${q}"`, location && `w ${location}`].filter(Boolean).join(", ")}`}
                        </p>
                    </div>
                    {(category || q || location) && (
                        <Link href="/" className="text-[13px] text-[#0071e3] hover:underline">
                            Wyczyść filtry
                        </Link>
                    )}
                </div>

                {safeListings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="w-16 h-16 bg-[#f5f5f7] rounded-full flex items-center justify-center mb-4">
                            <Tag size={24} className="text-[#6e6e73]" />
                        </div>
                        <h2 className="text-[22px] font-semibold text-[#1d1d1f]">
                            {(category || q || location) ? "Brak wyników" : "Brak ogłoszeń"}
                        </h2>
                        <p className="text-[#6e6e73] mt-2 text-[15px]">
                            {(category || q || location)
                                ? "Spróbuj zmienić filtry lub wyszukaj coś innego."
                                : "Bądź pierwszy — dodaj swoje ogłoszenie!"}
                        </p>
                        {!(category || q || location) && (
                            <Link href="/listings/create" className="btn-apple-primary mt-6">
                                Dodaj ogłoszenie
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                        {safeListings.map((listing) => (
                            <ListingCard key={listing.id} data={listing} />
                        ))}
                    </div>
                )}
            </section>

        </div>
    )
}
