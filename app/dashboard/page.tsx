import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { formatPrice } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { Plus, Package, Calendar, Heart } from "lucide-react"
import ProfileEditor from "./ProfileEditor"
import IncomingReservations from "./IncomingReservations"
import ListingWithCalendar from "./ListingWithCalendar"
import DashboardToast from "./DashboardToast"
import { IncomingReservation, SafeListing } from "@/types"
import { Suspense } from "react"

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
        redirect("/login")
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            listings: {
                include: {
                    reservations: {
                        include: { user: true },
                        orderBy: { createdAt: "desc" }
                    }
                }
            },
            reservations: {
                include: { listing: true },
                orderBy: { createdAt: "desc" }
            },
            favorites: {
                include: { listing: true },
                orderBy: { createdAt: "desc" }
            }
        }
    })

    if (!user) {
        redirect("/login")
    }

    const { listings, reservations } = user

    // Serializacja przychodzących rezerwacji (z ogłoszeń właściciela)
    const incomingReservations: IncomingReservation[] = listings
        .flatMap(listing =>
            listing.reservations.map(res => ({
                ...res,
                createdAt: res.createdAt.toISOString(),
                startDate: res.startDate.toISOString(),
                endDate: res.endDate.toISOString(),
                listing: {
                    ...listing,
                    createdAt: listing.createdAt.toISOString(),
                    updatedAt: listing.updatedAt.toISOString(),
                    promotedUntil: listing.promotedUntil?.toISOString() ?? null,
                } as SafeListing,
                user: {
                    id: res.user.id,
                    name: res.user.name,
                    email: res.user.email,
                    image: res.user.image,
                }
            }))
        )
        .sort((a, b) => {
            // PENDING first, then by date desc
            if (a.status === "PENDING" && b.status !== "PENDING") return -1
            if (a.status !== "PENDING" && b.status === "PENDING") return 1
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        })

    const pendingCount = incomingReservations.filter(r => r.status === "PENDING").length

    return (
        <div className="min-h-screen bg-[#fbfbfd]">
            <Suspense><DashboardToast /></Suspense>
            {/* Header */}
            <div className="bg-white border-b border-black/[0.06]">
                <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-10">
                    <p className="text-[13px] text-[#6e6e73] font-medium mb-1">Witaj z powrotem</p>
                    <h1 className="text-[36px] font-bold tracking-tighter text-[#1d1d1f]">
                        {user.name}
                    </h1>
                    <div className="flex items-center gap-6 mt-4 flex-wrap">
                        <div className="text-center">
                            <div className="text-[22px] font-bold text-[#1d1d1f]">{listings.length}</div>
                            <div className="text-[12px] text-[#6e6e73]">Ogłoszenia</div>
                        </div>
                        <div className="w-px h-8 bg-black/[0.08]" />
                        <div className="text-center">
                            <div className="text-[22px] font-bold text-[#1d1d1f]">{reservations.length}</div>
                            <div className="text-[12px] text-[#6e6e73]">Moje rezerwacje</div>
                        </div>
                        {pendingCount > 0 && (
                            <>
                                <div className="w-px h-8 bg-black/[0.08]" />
                                <div className="text-center">
                                    <div className="text-[22px] font-bold text-amber-500">{pendingCount}</div>
                                    <div className="text-[12px] text-[#6e6e73]">Oczekujące</div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-10">
                {/* Profile info */}
                <div className="mb-10 max-w-[480px]">
                    <ProfileEditor initialPhone={user.phone ?? null} initialWebsite={user.website ?? null} />
                </div>

                {/* Przychodzące rezerwacje */}
                <IncomingReservations reservations={incomingReservations} />

                {/* My Listings */}
                <section className="mb-14">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <Package size={18} className="text-[#1d1d1f]" />
                            <h2 className="text-[20px] font-bold tracking-tight text-[#1d1d1f]">Moje ogłoszenia</h2>
                        </div>
                        <Link
                            href="/listings/create"
                            className="flex items-center gap-1.5 text-[13px] font-medium text-[#0071e3] hover:underline"
                        >
                            <Plus size={14} />
                            Dodaj nowe
                        </Link>
                    </div>

                    {listings.length === 0 ? (
                        <div className="bg-white rounded-[24px] p-10 text-center border border-black/[0.04] shadow-apple-sm">
                            <div className="w-12 h-12 bg-[#f5f5f7] rounded-full flex items-center justify-center mx-auto mb-3">
                                <Package size={20} className="text-[#6e6e73]" />
                            </div>
                            <p className="text-[#1d1d1f] font-semibold">Brak ogłoszeń</p>
                            <p className="text-[13px] text-[#6e6e73] mt-1">Dodaj swój pierwszy przedmiot do wypożyczenia</p>
                            <Link href="/listings/create" className="btn-apple-primary mt-4 inline-flex">
                                Dodaj ogłoszenie
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {listings.map((listing, i) => (
                                <ListingWithCalendar
                                    key={listing.id}
                                    index={i}
                                    listing={{
                                        ...listing,
                                        createdAt: listing.createdAt.toISOString(),
                                        updatedAt: listing.updatedAt.toISOString(),
                                        promotedUntil: listing.promotedUntil?.toISOString() ?? null,
                                    } as SafeListing}
                                />
                            ))}
                        </div>
                    )}
                </section>

                {/* Polubione */}
                <section className="mb-14">
                    <div className="flex items-center gap-2 mb-5">
                        <Heart size={18} className="text-red-500" />
                        <h2 className="text-[20px] font-bold tracking-tight text-[#1d1d1f]">Polubione ogłoszenia</h2>
                        {user.favorites.length > 0 && (
                            <span className="text-[12px] text-[#6e6e73] font-medium">({user.favorites.length})</span>
                        )}
                    </div>

                    {user.favorites.length === 0 ? (
                        <div className="bg-white rounded-[24px] p-10 text-center border border-black/[0.04] shadow-apple-sm">
                            <div className="w-12 h-12 bg-[#f5f5f7] rounded-full flex items-center justify-center mx-auto mb-3">
                                <Heart size={20} className="text-[#6e6e73]" />
                            </div>
                            <p className="text-[#1d1d1f] font-semibold">Brak polubionych ogłoszeń</p>
                            <p className="text-[13px] text-[#6e6e73] mt-1">Kliknij serduszko na ogłoszeniu, żeby je zapisać</p>
                            <Link href="/" className="btn-apple-primary mt-4 inline-flex">
                                Przeglądaj ogłoszenia
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                            {user.favorites.map(fav => {
                                const listing = fav.listing
                                return (
                                    <Link
                                        key={fav.id}
                                        href={`/listings/${listing.id}`}
                                        className="bg-white rounded-[22px] overflow-hidden shadow-apple-sm border border-black/[0.04] hover:shadow-apple transition-all duration-300 group"
                                    >
                                        <div className="h-44 w-full relative">
                                            <Image
                                                src={listing.images?.[0] || "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&q=80"}
                                                fill
                                                alt={listing.title}
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90">
                                                <Heart size={13} className="fill-red-500 text-red-500" />
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-[14px] text-[#1d1d1f] truncate">{listing.title}</h3>
                                            <p className="text-[12px] text-[#6e6e73] truncate mt-0.5">{listing.location}</p>
                                            <p className="text-[13px] font-semibold text-[#1d1d1f] mt-2">
                                                {formatPrice(listing.pricePerDay)}<span className="font-normal text-[#6e6e73]">/dzień</span>
                                            </p>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </section>

                {/* My Reservations */}
                <section>
                    <div className="flex items-center gap-2 mb-5">
                        <Calendar size={18} className="text-[#1d1d1f]" />
                        <h2 className="text-[20px] font-bold tracking-tight text-[#1d1d1f]">Moje rezerwacje</h2>
                    </div>

                    {reservations.length === 0 ? (
                        <div className="bg-white rounded-[24px] p-10 text-center border border-black/[0.04] shadow-apple-sm">
                            <div className="w-12 h-12 bg-[#f5f5f7] rounded-full flex items-center justify-center mx-auto mb-3">
                                <Calendar size={20} className="text-[#6e6e73]" />
                            </div>
                            <p className="text-[#1d1d1f] font-semibold">Brak rezerwacji</p>
                            <p className="text-[13px] text-[#6e6e73] mt-1">Znajdź coś ciekawego do wypożyczenia!</p>
                            <Link href="/" className="btn-apple-primary mt-4 inline-flex">
                                Przeglądaj ogłoszenia
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {reservations.map(reservation => (
                                <Link
                                    key={reservation.id}
                                    href={`/listings/${reservation.listingId}`}
                                    className="bg-white rounded-[22px] overflow-hidden shadow-apple-sm border border-black/[0.04] hover:shadow-apple transition-all duration-300 group flex gap-4 p-4"
                                >
                                    <div className="h-20 w-20 relative rounded-[14px] overflow-hidden flex-shrink-0">
                                        <Image
                                            src={reservation.listing.images?.[0] || "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&q=80"}
                                            fill
                                            alt={reservation.listing.title}
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="flex flex-col justify-center min-w-0">
                                        <div className="font-semibold text-[14px] text-[#1d1d1f] truncate">{reservation.listing.title}</div>
                                        <div className="text-[12px] text-[#6e6e73] mt-0.5">
                                            {new Date(reservation.startDate).toLocaleDateString("pl-PL")} — {new Date(reservation.endDate).toLocaleDateString("pl-PL")}
                                        </div>
                                        <div className="text-[13px] font-semibold text-[#1d1d1f] mt-1.5">
                                            Razem: {formatPrice(reservation.totalPrice)}
                                        </div>
                                        <div className={`text-[10px] font-semibold uppercase tracking-wide mt-1
                                            ${reservation.status === "CONFIRMED" ? "text-green-600" :
                                                reservation.status === "CANCELLED" ? "text-red-500" :
                                                    "text-amber-600"}`}
                                        >
                                            {reservation.status === "CONFIRMED" ? "Potwierdzona" :
                                                reservation.status === "CANCELLED" ? "Anulowana" : "Oczekuje"}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}

