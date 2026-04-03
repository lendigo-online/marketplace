"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Inbox, Check, X } from "lucide-react"
import toast from "react-hot-toast"
import { motion } from "framer-motion"
import { formatPrice } from "@/lib/utils"
import { IncomingReservation } from "@/types"

interface Props {
    reservations: IncomingReservation[]
}

export default function IncomingReservations({ reservations }: Props) {
    const router = useRouter()
    const [loadingId, setLoadingId] = useState<string | null>(null)

    const handleAction = async (id: string, action: "CONFIRMED" | "CANCELLED") => {
        setLoadingId(id)
        try {
            const res = await fetch(`/api/reservations/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: action })
            })
            if (res.ok) {
                toast.success(action === "CONFIRMED" ? "Rezerwacja potwierdzona!" : "Rezerwacja odrzucona")
                router.refresh()
            } else {
                toast.error(await res.text())
            }
        } catch {
            toast.error("Coś poszło nie tak")
        } finally {
            setLoadingId(null)
        }
    }

    const statusBadge = (status: string) => {
        if (status === "CONFIRMED") return <span className="text-[10px] font-semibold uppercase tracking-wide text-green-600">Potwierdzona</span>
        if (status === "CANCELLED") return <span className="text-[10px] font-semibold uppercase tracking-wide text-red-500">Odrzucona</span>
        return <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-600">Oczekuje</span>
    }

    return (
        <section className="mb-14">
            <div className="flex items-center gap-2 mb-5">
                <Inbox size={18} className="text-[#1d1d1f]" />
                <h2 className="text-[20px] font-bold tracking-tight text-[#1d1d1f]">Przychodzące rezerwacje</h2>
                {reservations.filter(r => r.status === "PENDING").length > 0 && (
                    <span className="ml-1 bg-amber-500 text-white text-[11px] font-bold rounded-full px-2 py-0.5">
                        {reservations.filter(r => r.status === "PENDING").length}
                    </span>
                )}
            </div>

            {reservations.length === 0 ? (
                <div className="bg-white rounded-[24px] p-10 text-center border border-black/[0.04] shadow-apple-sm">
                    <div className="w-12 h-12 bg-[#f5f5f7] rounded-full flex items-center justify-center mx-auto mb-3">
                        <Inbox size={20} className="text-[#6e6e73]" />
                    </div>
                    <p className="text-[#1d1d1f] font-semibold">Brak przychodzących rezerwacji</p>
                    <p className="text-[13px] text-[#6e6e73] mt-1">Gdy ktoś zarezerwuje Twój przedmiot, pojawi się tutaj</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reservations.map(res => (
                        <motion.div
                            key={res.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`bg-white rounded-[22px] border shadow-apple-sm p-4 flex gap-4 ${
                                res.status === "CANCELLED" ? "opacity-60 border-black/[0.04]" : "border-black/[0.04]"
                            }`}
                        >
                            {/* Miniatura ogłoszenia */}
                            <Link href={`/listings/${res.listingId}`} className="flex-shrink-0">
                                <div className="h-20 w-20 relative rounded-[14px] overflow-hidden bg-[#f5f5f7]">
                                    <Image
                                        src={res.listing.images?.[0] || "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&q=80"}
                                        fill
                                        alt={res.listing.title}
                                        className="object-cover"
                                    />
                                </div>
                            </Link>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <Link href={`/listings/${res.listingId}`} className="font-semibold text-[14px] text-[#1d1d1f] truncate hover:underline">
                                        {res.listing.title}
                                    </Link>
                                    {statusBadge(res.status)}
                                </div>

                                {/* Najemca */}
                                <div className="flex items-center gap-2 mt-1.5">
                                    <div className="w-5 h-5 rounded-full bg-[#1d1d1f] flex items-center justify-center flex-shrink-0">
                                        <span className="text-white text-[9px] font-bold">
                                            {res.user.name?.charAt(0).toUpperCase() || "?"}
                                        </span>
                                    </div>
                                    <span className="text-[12px] text-[#6e6e73] truncate">
                                        {res.user.name || res.user.email || "Nieznany użytkownik"}
                                    </span>
                                </div>

                                {/* Daty */}
                                <div className="text-[12px] text-[#6e6e73] mt-1">
                                    {new Date(res.startDate).toLocaleDateString("pl-PL")} — {new Date(res.endDate).toLocaleDateString("pl-PL")}
                                </div>

                                {/* Cena */}
                                <div className="text-[13px] font-semibold text-[#1d1d1f] mt-1">
                                    {formatPrice(res.totalPrice)}
                                </div>

                                {/* Przyciski — tylko dla PENDING */}
                                {res.status === "PENDING" && (
                                    <div className="flex items-center gap-2 mt-3">
                                        <button
                                            onClick={() => handleAction(res.id, "CONFIRMED")}
                                            disabled={loadingId === res.id}
                                            className="flex items-center gap-1.5 bg-[#00bf63] text-white text-[12px] font-semibold px-3 py-1.5 rounded-full hover:bg-[#00a855] transition-colors disabled:opacity-50"
                                        >
                                            <Check size={12} strokeWidth={3} />
                                            Potwierdź
                                        </button>
                                        <button
                                            onClick={() => handleAction(res.id, "CANCELLED")}
                                            disabled={loadingId === res.id}
                                            className="flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-full border border-red-300 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                                        >
                                            <X size={12} strokeWidth={3} />
                                            Odrzuć
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </section>
    )
}
