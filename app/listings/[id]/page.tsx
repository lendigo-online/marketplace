import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { MapPin, Tag, User } from "lucide-react"
import ImageGallery from "@/components/ImageGallery"

import { formatPrice } from "@/lib/utils"
import ReservationSidebar from "./ReservationSidebar"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { SafeListing, SafeReservation, SafeUser } from "@/types"

interface IParams {
    id?: string
}

export default async function ListingPage({ params }: { params: IParams }) {
    const session = await getServerSession(authOptions)
    let currentUser: SafeUser | null = null

    if (session?.user?.email) {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })
        if (user) {
            currentUser = {
                ...user,
                createdAt: user.createdAt.toISOString(),
                updatedAt: user.updatedAt.toISOString(),
                emailVerified: user.emailVerified?.toISOString() || null
            }
        }
    }

    const listing = await prisma.listing.findUnique({
        where: { id: params.id },
        include: {
            owner: true,
            reservations: true
        }
    })

    if (!listing) return notFound()

    const safeListing: SafeListing = {
        ...listing,
        createdAt: listing.createdAt.toISOString(),
        updatedAt: listing.updatedAt.toISOString(),
    }

    const safeReservations: SafeReservation[] = listing.reservations.map(res => ({
        ...res,
        createdAt: res.createdAt.toISOString(),
        startDate: res.startDate.toISOString(),
        endDate: res.endDate.toISOString(),
        listing: safeListing
    }))

    return (
        <div className="min-h-screen bg-[#fbfbfd]">
            <ImageGallery images={listing.images} title={listing.title} />

            <div className="max-w-[1100px] mx-auto px-6 -mt-8 relative z-10">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-[12px] text-[#6e6e73] mb-4">
                    <Tag size={11} />
                    <span>{listing.category}</span>
                    <span>·</span>
                    <MapPin size={11} />
                    <span>{listing.location}</span>
                </div>

                {/* Title */}
                <h1 className="text-[36px] md:text-[44px] font-bold tracking-tighter text-[#1d1d1f] leading-tight mb-2">
                    {listing.title}
                </h1>

                {/* Host line */}
                <div className="flex items-center gap-2 mb-10">
                    <div className="w-7 h-7 rounded-full bg-[#1d1d1f] flex items-center justify-center">
                        <User size={14} className="text-white" />
                    </div>
                    <span className="text-[14px] text-[#6e6e73]">
                        Oferuje <span className="text-[#1d1d1f] font-semibold">{listing.owner.name}</span>
                    </span>
                </div>

                {/* Content grid */}
                <div className="grid grid-cols-1 md:grid-cols-7 gap-10 pb-20">
                    {/* Left – Description */}
                    <div className="md:col-span-4 space-y-8">
                        <div className="h-px bg-black/[0.06]" />

                        <div>
                            <h2 className="text-[19px] font-semibold text-[#1d1d1f] mb-3">O przedmiocie</h2>
                            <p className="text-[16px] text-[#6e6e73] leading-relaxed font-light">
                                {listing.description}
                            </p>
                        </div>

                        <div className="h-px bg-black/[0.06]" />

                        {/* Details pills */}
                        <div>
                            <h2 className="text-[19px] font-semibold text-[#1d1d1f] mb-4">Szczegóły</h2>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { label: "Kategoria", value: listing.category },
                                    { label: "Lokalizacja", value: listing.location },
                                    { label: "Cena", value: `${formatPrice(listing.pricePerDay)} / dzień` },
                                ].map(({ label, value }) => (
                                    <div key={label} className="bg-[#f5f5f7] rounded-2xl px-4 py-3 flex flex-col">
                                        <span className="text-[11px] text-[#6e6e73] font-medium uppercase tracking-wide">{label}</span>
                                        <span className="text-[14px] font-semibold text-[#1d1d1f] mt-0.5">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right – Reservation Sidebar */}
                    <div className="md:col-span-3">
                        <ReservationSidebar
                            listing={safeListing}
                            reservations={safeReservations}
                            currentUser={currentUser}
                            ownerPhone={listing.owner.phone}
                            ownerName={listing.owner.name}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
