import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { User, Calendar, MapPin, Package } from "lucide-react"
import { formatPrice } from "@/lib/utils"

export default async function UserProfilePage({ params }: { params: { id: string } }) {
    const user = await prisma.user.findUnique({
        where: { id: params.id },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
            listings: {
                where: { status: "APPROVED" },
                orderBy: { createdAt: "desc" },
            },
        },
    })

    if (!user) notFound()

    return (
        <div className="min-h-screen bg-[#fbfbfd]">
            <div className="bg-white border-b border-black/[0.06]">
                <div className="max-w-[1200px] mx-auto px-6 py-10">
                    <div className="flex items-center gap-5">
                        {user.image ? (
                            <Image
                                src={user.image}
                                alt={user.name || "Użytkownik"}
                                width={72}
                                height={72}
                                className="rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-[72px] h-[72px] rounded-full bg-[#f5f5f7] flex items-center justify-center">
                                <User size={32} className="text-[#aeaeb2]" />
                            </div>
                        )}
                        <div>
                            <h1 className="text-[28px] font-bold tracking-tight text-[#1d1d1f]">
                                {user.name || "Użytkownik"}
                            </h1>
                            <p className="text-[13px] text-[#6e6e73] flex items-center gap-1.5 mt-1">
                                <Calendar size={13} />
                                Dołączył: {new Date(user.createdAt).toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" })}
                            </p>
                            <p className="text-[13px] text-[#aeaeb2] mt-0.5">{user.email}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-6 py-10">
                <div className="flex items-center gap-2 mb-5">
                    <Package size={18} className="text-[#1d1d1f]" />
                    <h2 className="text-[20px] font-bold tracking-tight text-[#1d1d1f]">
                        Ogłoszenia ({user.listings.length})
                    </h2>
                </div>

                {user.listings.length === 0 ? (
                    <div className="bg-white rounded-[24px] p-10 text-center border border-black/[0.04] shadow-apple-sm">
                        <p className="text-[#6e6e73] text-[14px]">Ten użytkownik nie ma jeszcze ogłoszeń</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {user.listings.map(listing => (
                            <Link
                                key={listing.id}
                                href={`/listings/${listing.id}`}
                                className="bg-white rounded-[20px] border border-black/[0.04] shadow-apple-sm overflow-hidden hover:shadow-apple-md transition-shadow"
                            >
                                <div className="relative h-48 bg-[#f5f5f7]">
                                    <Image
                                        src={(listing.images as string[])?.[0] || "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&q=80"}
                                        fill
                                        alt={listing.title}
                                        className="object-cover"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-[15px] text-[#1d1d1f] leading-snug">{listing.title}</h3>
                                    <p className="text-[13px] text-[#6e6e73] mt-1 flex items-center gap-1">
                                        <MapPin size={12} />
                                        {listing.location}
                                    </p>
                                    <p className="text-[15px] font-bold text-[#1d1d1f] mt-2">
                                        {formatPrice(listing.pricePerDay)}
                                        <span className="text-[12px] text-[#6e6e73] font-normal">/dzień</span>
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
