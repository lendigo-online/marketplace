"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format, parse } from "date-fns"
import { pl } from "date-fns/locale"
import { DayPicker } from "react-day-picker"
import { CalendarX, Check, Trash2 } from "lucide-react"
import toast from "react-hot-toast"
import "react-day-picker/dist/style.css"

interface Props {
    listingId: string
    initialBlockedDates: string[]
}

const parseDates = (strs: string[]): Date[] =>
    strs.map(s => parse(s, "yyyy-MM-dd", new Date()))

const formatDates = (dates: Date[]): string[] =>
    dates.map(d => format(d, "yyyy-MM-dd"))

export default function BlockedDatesEditor({ listingId, initialBlockedDates }: Props) {
    const router = useRouter()
    const [selected, setSelected] = useState<Date[]>(parseDates(initialBlockedDates))
    const [isDirty, setIsDirty] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const handleSelect = (dates: Date[] | undefined) => {
        setSelected(dates || [])
        setIsDirty(true)
    }

    const handleClear = () => {
        setSelected([])
        setIsDirty(true)
    }

    const handleSave = async () => {
        setIsLoading(true)
        try {
            const res = await fetch(`/api/listings/${listingId}/blocked-dates`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ blockedDates: formatDates(selected) })
            })
            if (res.ok) {
                toast.success("Terminarz zapisany!")
                setIsDirty(false)
                router.refresh()
            } else {
                toast.error(await res.text())
            }
        } catch {
            toast.error("Coś poszło nie tak")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="mt-4 border-t border-black/[0.06] pt-4">
            <div className="flex items-center gap-2 mb-3">
                <CalendarX size={14} className="text-[#6e6e73]" />
                <p className="text-[13px] font-semibold text-[#1d1d1f]">Zablokowane dni</p>
                {selected.length > 0 && (
                    <span className="text-[11px] bg-[#f5f5f7] text-[#6e6e73] rounded-full px-2 py-0.5 font-medium">
                        {selected.length} {selected.length === 1 ? "dzień" : "dni"}
                    </span>
                )}
            </div>

            <p className="text-[12px] text-[#6e6e73] mb-3">
                Kliknij dni, w których przedmiot jest niedostępny (np. na naprawie, w użyciu). Klienci nie będą mogli rezerwować tych terminów.
            </p>

            <div className="overflow-x-auto flex justify-center">
                <DayPicker
                    mode="multiple"
                    selected={selected}
                    onSelect={handleSelect}
                    fromDate={today}
                    locale={pl}
                    numberOfMonths={3}
                />
            </div>

            <div className="flex items-center gap-2 mt-3">
                {isDirty && (
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="flex items-center gap-1.5 bg-[#1d1d1f] text-white text-[12px] font-semibold px-4 py-2 rounded-full hover:bg-black transition-colors disabled:opacity-50"
                    >
                        <Check size={12} strokeWidth={3} />
                        {isLoading ? "Zapisywanie..." : "Zapisz"}
                    </button>
                )}
                {selected.length > 0 && (
                    <button
                        onClick={handleClear}
                        disabled={isLoading}
                        className="flex items-center gap-1.5 text-[12px] font-medium text-[#6e6e73] hover:text-red-500 px-3 py-2 rounded-full hover:bg-red-50 transition-colors"
                    >
                        <Trash2 size={12} />
                        Wyczyść wszystkie
                    </button>
                )}
            </div>
        </div>
    )
}
