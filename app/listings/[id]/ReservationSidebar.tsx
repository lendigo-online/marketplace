"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { DateRange } from "react-day-picker"
import { differenceInDays, eachDayOfInterval, parse } from "date-fns"
import toast from "react-hot-toast"
import { motion } from "framer-motion"
import { AlertCircle, Phone } from "lucide-react"

import { formatPrice } from "@/lib/utils"
import { SafeListing, SafeReservation, SafeUser, DiscountRule } from "@/types"
import { DatePickerWithRange } from "@/components/ui/date-picker"

interface ReservationSidebarProps {
    listing: SafeListing
    reservations: SafeReservation[]
    currentUser?: SafeUser | null
    ownerPhone?: string | null
    ownerName?: string | null
}

export default function ReservationSidebar({
    listing,
    reservations,
    currentUser,
    ownerPhone,
    ownerName,
}: ReservationSidebarProps) {
    const router = useRouter()
    const [date, setDate] = useState<DateRange | undefined>()
    const [isLoading, setIsLoading] = useState(false)

    // Build array of all booked dates from active reservations
    const disabledDates = useMemo(() => {
        let dates: Date[] = []
        reservations.forEach((res) => {
            if (res.status === "CANCELLED") return
            const range = eachDayOfInterval({
                start: new Date(res.startDate),
                end: new Date(res.endDate)
            })
            dates = [...dates, ...range]
        })
        if (listing.blockedDates?.length) {
            const blocked = listing.blockedDates.map(s => parse(s, "yyyy-MM-dd", new Date()))
            dates = [...dates, ...blocked]
        }
        return dates
    }, [reservations, listing.blockedDates])

    const isDateInvalid = useMemo(() => {
        if (!date?.from || !date?.to) return false
        const range = eachDayOfInterval({ start: date.from, end: date.to })
        return range.some(d =>
            disabledDates.some(disabled => disabled.getTime() === d.getTime())
        )
    }, [date, disabledDates])

    const dayCount = useMemo(() => {
        if (!date?.from || !date?.to) return 0
        return Math.max(1, differenceInDays(date.to, date.from))
    }, [date])

    const activeDiscount = useMemo(() => {
        const rules = (listing.discountRules ?? []) as DiscountRule[]
        if (!rules.length || !dayCount) return null
        const applicable = rules
            .filter(r => dayCount >= Number(r.minDays))
            .sort((a, b) => Number(b.minDays) - Number(a.minDays))
        return applicable[0] ?? null
    }, [dayCount, listing.discountRules])

    const totalPrice = useMemo(() => {
        const base = dayCount * listing.pricePerDay
        if (!activeDiscount) return base
        return base * (1 - activeDiscount.discountPercent / 100)
    }, [dayCount, listing.pricePerDay, activeDiscount])

    const onReserve = async () => {
        if (!currentUser) return router.push("/login")
        if (!date?.from || !date?.to) return toast.error("Wybierz daty wypożyczenia")
        if (isDateInvalid) return toast.error("Wybrane daty są niedostępne")

        setIsLoading(true)

        try {
            const response = await fetch("/api/reservations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    listingId: listing.id,
                    startDate: date.from,
                    endDate: date.to,
                    totalPrice
                })
            })

            if (response.ok) {
                toast.success("Rezerwacja złożona! Czeka na potwierdzenie właściciela.")
                setDate(undefined)
                router.refresh()
            } else {
                const text = await response.text()
                toast.error(text || "Nie udało się dokonać rezerwacji")
            }
        } catch (error) {
            toast.error("Coś poszło nie tak")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="sticky top-[130px]">
            <div className="bg-white/90 backdrop-blur-xl rounded-[28px] shadow-apple-xl border border-black/[0.06] p-6">
                {/* Price */}
                <div className="flex items-baseline gap-1.5 mb-6">
                    <span className="text-[28px] font-bold tracking-tight text-[#1d1d1f]">
                        {formatPrice(listing.pricePerDay)}
                    </span>
                    <span className="text-[15px] text-[#6e6e73] font-light">/ dzień</span>
                </div>

                {/* Availability indicator */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-[12px] text-[#6e6e73]">
                        {disabledDates.length === 0
                            ? "Dostępny w każdym terminie"
                            : "Sprawdź dostępność w kalendarzu"}
                    </span>
                </div>

                {/* Date picker */}
                <div className="mb-5">
                    <label className="text-[12px] font-semibold text-[#6e6e73] uppercase tracking-wide mb-2 block">
                        Wybierz termin
                    </label>
                    <DatePickerWithRange
                        date={date}
                        setDate={setDate}
                        disabledDates={disabledDates}
                    />
                </div>

                {/* Conflict warning */}
                {isDateInvalid && (
                    <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-4"
                    >
                        <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
                        <p className="text-[12px] text-red-600">
                            Wybrane daty kolidują z istniejącą rezerwacją. Wybierz inny termin.
                        </p>
                    </motion.div>
                )}

                {/* Reserve button */}
                <button
                    disabled={isLoading || !date?.from || !date?.to || isDateInvalid}
                    onClick={onReserve}
                    className="w-full py-4 bg-[#1d1d1f] text-white text-[15px] font-semibold rounded-2xl 
                               hover:bg-black transition-all duration-200 
                               disabled:opacity-40 disabled:cursor-not-allowed
                               focus:outline-none focus:ring-2 focus:ring-[#1d1d1f] focus:ring-offset-2"
                >
                    {isLoading ? "Rezerwowanie..." : "Zarezerwuj"}
                </button>

                {/* Total price breakdown */}
                {dayCount > 0 && !isDateInvalid && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-5 pt-5 border-t border-black/[0.06] space-y-2"
                    >
                        <div className="flex items-center justify-between text-[14px] text-[#6e6e73]">
                            <span>{formatPrice(listing.pricePerDay)} × {dayCount} {dayCount === 1 ? "dzień" : "dni"}</span>
                            <span>{formatPrice(dayCount * listing.pricePerDay)}</span>
                        </div>
                        {activeDiscount && (
                            <motion.div
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center justify-between text-[13px] text-[#00bf63] font-medium"
                            >
                                <span>Rabat {activeDiscount.discountPercent}% (≥{activeDiscount.minDays} dni)</span>
                                <span>−{formatPrice(dayCount * listing.pricePerDay * activeDiscount.discountPercent / 100)}</span>
                            </motion.div>
                        )}
                        <div className="flex items-center justify-between text-[15px] font-semibold text-[#1d1d1f] pt-2 border-t border-black/[0.06]">
                            <span>Razem</span>
                            <span>{formatPrice(totalPrice)}</span>
                        </div>
                    </motion.div>
                )}

                {/* Note */}
                <p className="text-[12px] text-[#6e6e73] text-center mt-4">
                    Nie zostanie pobrana opłata przed potwierdzeniem
                </p>

                {/* Call owner */}
                {ownerPhone && (
                    <div className="mt-5 pt-5 border-t border-black/[0.06]">
                        <p className="text-[11px] font-semibold text-[#6e6e73] uppercase tracking-wide mb-3">
                            Kontakt z właścicielem
                        </p>
                        <a
                            href={`tel:${ownerPhone.replace(/\s/g, "")}`}
                            className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl border-2 border-[#00bf63] text-[#00bf63] text-[14px] font-semibold hover:bg-[#00bf63] hover:text-white transition-all duration-200"
                        >
                            <Phone size={15} strokeWidth={2.5} />
                            Zadzwoń{ownerName ? ` do ${ownerName}` : ""}
                        </a>
                        <p className="text-[11px] text-[#6e6e73] text-center mt-2">{ownerPhone}</p>
                    </div>
                )}
            </div>
        </div>
    )
}
