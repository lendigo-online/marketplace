"use client"

import { useState } from "react"
import { Zap, Crown, Check } from "lucide-react"
import { PROMOTION_TIERS } from "@/lib/promotion-tiers"
import { motion } from "framer-motion"
import toast from "react-hot-toast"

interface Props {
    listingId: string
    promotedUntil: string | null
}

export default function PromotionPanel({ listingId, promotedUntil }: Props) {
    const [selected, setSelected] = useState(14)
    const [loading, setLoading] = useState(false)

    const isActive = promotedUntil && new Date(promotedUntil) > new Date()
    const remainingDays = isActive
        ? Math.ceil((new Date(promotedUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : 0

    const selectedTier = PROMOTION_TIERS.find(t => t.days === selected)!

    const handlePromote = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/promote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ listingId, tierDays: selected }),
            })

            if (!res.ok) {
                const data = await res.json().catch(() => null)
                throw new Error(data?.error || "Błąd płatności")
            }

            const { url } = await res.json()
            window.location.href = url
        } catch (err: any) {
            toast.error(err.message || "Nie udało się rozpocząć płatności")
            setLoading(false)
        }
    }

    return (
        <div className="pt-5">
            {isActive && (
                <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 mb-4 px-3 py-2.5 rounded-2xl bg-[#fffbea] border border-[#ffde59]/40"
                >
                    <Crown size={14} className="text-[#a07800]" />
                    <span className="text-[13px] font-medium text-[#a07800]">
                        Wyróżnione jeszcze {remainingDays} {remainingDays === 1 ? "dzień" : remainingDays < 5 ? "dni" : "dni"}
                        <span className="text-[#c9a500] font-normal"> · do {new Date(promotedUntil).toLocaleDateString("pl-PL")}</span>
                    </span>
                </motion.div>
            )}

            <div className="grid grid-cols-3 gap-3">
                {PROMOTION_TIERS.map((tier, i) => {
                    const isSelected = selected === tier.days
                    const isPopular = i === 1
                    const perDay = (tier.pricePLN / tier.days).toFixed(2)

                    return (
                        <motion.button
                            key={tier.days}
                            onClick={() => setSelected(tier.days)}
                            whileTap={{ scale: 0.97 }}
                            className={`relative flex flex-col items-center p-4 rounded-[18px] border-2 transition-all duration-200 ${
                                isSelected
                                    ? "border-[#ffde59] bg-[#fffbea] shadow-md"
                                    : "border-black/[0.06] bg-white hover:border-[#ffde59]/50"
                            }`}
                        >
                            {isPopular && (
                                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider bg-[#ffde59] text-[#1d1d1f] px-2.5 py-0.5 rounded-full">
                                    Popularne
                                </span>
                            )}

                            {isSelected && (
                                <div className="absolute top-2 right-2">
                                    <Check size={14} className="text-[#a07800]" />
                                </div>
                            )}

                            <span className="text-[22px] font-bold text-[#1d1d1f] mt-1">{tier.days}</span>
                            <span className="text-[12px] text-[#6e6e73]">dni</span>

                            <div className="mt-3 mb-1">
                                <span className="text-[18px] font-bold text-[#1d1d1f]">{tier.pricePLN.toFixed(2).replace(".", ",")}</span>
                                <span className="text-[12px] text-[#6e6e73] ml-0.5">zł</span>
                            </div>

                            <span className="text-[11px] text-[#aeaeb2]">{perDay.replace(".", ",")} zł/dzień</span>
                        </motion.button>
                    )
                })}
            </div>

            <motion.button
                onClick={handlePromote}
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 rounded-full text-[14px] font-semibold bg-gradient-to-r from-[#ffde59] to-[#ffc800] text-[#1d1d1f] hover:shadow-lg hover:shadow-[#ffde59]/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Zap size={15} className="fill-[#1d1d1f]" />
                {loading
                    ? "Przekierowuję..."
                    : isActive
                        ? `Przedłuż za ${selectedTier.pricePLN.toFixed(2).replace(".", ",")} zł`
                        : `Wyróżnij za ${selectedTier.pricePLN.toFixed(2).replace(".", ",")} zł`
                }
            </motion.button>
        </div>
    )
}
