import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import Image from "next/image"
import { formatPrice } from "@/lib/utils"
import AdminActions from "./AdminActions"
import { Shield } from "lucide-react"

export default async function AdminPage() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) redirect("/login")

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user || user.role !== "ADMIN") redirect("/")

    const pending = await prisma.listing.findMany({
        where: { status: "PENDING" },
        include: { owner: true },
        orderBy: { createdAt: "desc" }
    })

    const all = await prisma.listing.findMany({
        where: { status: { not: "PENDING" } },
        include: { owner: true },
        orderBy: { createdAt: "desc" }
    })

    return (
        <div className="min-h-screen bg-[#fbfbfd]">
            <div className="bg-white border-b border-black/[0.06]">
                <div className="max-w-[1200px] mx-auto px-6 py-10">
                    <div className="flex items-center gap-3 mb-1">
                        <Shield size={20} className="text-[#0071e3]" />
                        <p className="text-[13px] text-[#0071e3] font-semibold uppercase tracking-wide">Panel administratora</p>
                    </div>
                    <h1 className="text-[36px] font-bold tracking-tighter text-[#1d1d1f]">Moderacja ogłoszeń</h1>
                    <div className="flex items-center gap-6 mt-4">
                        <div className="text-center">
                            <div className="text-[22px] font-bold text-amber-500">{pending.length}</div>
                            <div className="text-[12px] text-[#6e6e73]">Oczekujące</div>
                        </div>
                        <div className="w-px h-8 bg-black/[0.08]" />
                        <div className="text-center">
                            <div className="text-[22px] font-bold text-[#1d1d1f]">{all.length}</div>
                            <div className="text-[12px] text-[#6e6e73]">Zatwierdzone / Odrzucone</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-6 py-10 space-y-14">
                {/* Oczekujące */}
                <section>
                    <h2 className="text-[20px] font-bold tracking-tight text-[#1d1d1f] mb-5">
                        Oczekujące na zatwierdzenie
                        {pending.length > 0 && (
                            <span className="ml-2 text-[14px] font-semibold text-amber-500 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                                {pending.length}
                            </span>
                        )}
                    </h2>

                    {pending.length === 0 ? (
                        <div className="bg-white rounded-[24px] p-10 text-center border border-black/[0.04] shadow-apple-sm">
                            <p className="text-[#1d1d1f] font-semibold">Brak oczekujących ogłoszeń</p>
                            <p className="text-[13px] text-[#6e6e73] mt-1">Wszystkie ogłoszenia zostały już sprawdzone</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {pending.map(listing => (
                                <AdminListingCard key={listing.id} listing={listing} highlight />
                            ))}
                        </div>
                    )}
                </section>

                {/* Pozostałe */}
                <section>
                    <h2 className="text-[20px] font-bold tracking-tight text-[#1d1d1f] mb-5">Wszystkie ogłoszenia</h2>
                    {all.length === 0 ? (
                        <p className="text-[#6e6e73] text-[14px]">Brak ogłoszeń</p>
                    ) : (
                        <div className="space-y-4">
                            {all.map(listing => (
                                <AdminListingCard key={listing.id} listing={listing} />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}

function AdminListingCard({ listing, highlight }: { listing: any; highlight?: boolean }) {
    const statusColors: Record<string, string> = {
        APPROVED: "bg-green-50 text-green-700 border-green-200",
        REJECTED: "bg-red-50 text-red-600 border-red-200",
        PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    }
    const statusLabels: Record<string, string> = {
        APPROVED: "Zatwierdzone",
        REJECTED: "Odrzucone",
        PENDING: "Oczekuje",
    }

    return (
        <div className={`bg-white rounded-[22px] border shadow-apple-sm overflow-hidden ${highlight ? "border-amber-200" : "border-black/[0.04]"}`}>
            <div className="flex flex-col sm:flex-row">
                {/* Zdjęcie */}
                <div className="relative h-44 sm:h-auto sm:w-48 flex-shrink-0 bg-[#f5f5f7]">
                    <Image
                        src={listing.images?.[0] || "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&q=80"}
                        fill
                        alt={listing.title}
                        className="object-cover"
                    />
                </div>

                {/* Treść */}
                <div className="flex flex-col flex-1 p-5 gap-3">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h3 className="font-bold text-[17px] text-[#1d1d1f] leading-snug">{listing.title}</h3>
                            <p className="text-[13px] text-[#6e6e73] mt-0.5">{listing.location} · {listing.category}</p>
                            <p className="text-[13px] text-[#6e6e73] mt-0.5">
                                Wystawił: <span className="font-medium text-[#1d1d1f]">{listing.owner?.name}</span>
                                <span className="text-[#aeaeb2]"> ({listing.owner?.email})</span>
                            </p>
                        </div>
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                            <span className={`text-[11px] font-semibold border rounded-full px-2.5 py-1 ${statusColors[listing.status]}`}>
                                {statusLabels[listing.status]}
                            </span>
                            <span className="text-[15px] font-bold text-[#1d1d1f]">{formatPrice(listing.pricePerDay)}<span className="text-[#6e6e73] font-normal text-[12px]">/dzień</span></span>
                        </div>
                    </div>

                    <p className="text-[13px] text-[#6e6e73] line-clamp-2 leading-relaxed">{listing.description}</p>

                    <AdminActions listingId={listing.id} currentStatus={listing.status} />
                </div>
            </div>
        </div>
    )
}
