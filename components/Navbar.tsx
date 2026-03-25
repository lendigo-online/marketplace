"use client"

import Link from "next/link"
import UserMenu from "./UserMenu"
import CategoryBar from "./CategoryBar"
import { motion } from "framer-motion"
import { Search, MapPin, CalendarDays, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { format } from "date-fns"
import { pl } from "date-fns/locale"
import { usePathname } from "next/navigation"
import { DayPicker, DateRange } from "react-day-picker"
import "react-day-picker/dist/style.css"

export default function Navbar() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()

    const hideCategoryBar = pathname === "/dashboard" || pathname === "/listings/create"

    const [query, setQuery] = useState(searchParams.get("q") || "")
    const [location, setLocation] = useState(searchParams.get("location") || "")
    const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
        const from = searchParams.get("from")
        const to = searchParams.get("to")
        if (from && to) return { from: new Date(from), to: new Date(to) }
        if (from) return { from: new Date(from), to: undefined }
        return undefined
    })
    const [showCalendar, setShowCalendar] = useState(false)
    const [showLocationSuggestions, setShowLocationSuggestions] = useState(false)
    const [locationSuggestions, setLocationSuggestions] = useState<string[]>([])
    const locationDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const searchBarRef = useRef<HTMLDivElement>(null)

    // Sync state when URL changes (e.g. category click)
    useEffect(() => {
        setQuery(searchParams.get("q") || "")
        setLocation(searchParams.get("location") || "")
        const from = searchParams.get("from")
        const to = searchParams.get("to")
        if (from && to) setDateRange({ from: new Date(from), to: new Date(to) })
        else if (from) setDateRange({ from: new Date(from), to: undefined })
        else setDateRange(undefined)
    }, [searchParams])

    // Close popovers on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (searchBarRef.current && !searchBarRef.current.contains(e.target as Node)) {
                setShowCalendar(false)
                setShowLocationSuggestions(false)
            }
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [])

    const searchLocation = (q: string) => {
        if (locationDebounceRef.current) clearTimeout(locationDebounceRef.current)
        if (!q.trim()) { setLocationSuggestions([]); setShowLocationSuggestions(false); return }
        locationDebounceRef.current = setTimeout(async () => {
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5&addressdetails=1`,
                    { headers: { "Accept-Language": "pl" } }
                )
                const data = await res.json()
                const results: string[] = data
                    .filter((item: any) => item.address)
                    .map((item: any) => {
                        const city = item.address.city || item.address.town || item.address.village || item.address.municipality || item.address.county || ""
                        const country = item.address.country || ""
                        return city ? `${city}, ${country}` : country
                    })
                    .filter((s: string, i: number, arr: string[]) => s && arr.indexOf(s) === i)
                setLocationSuggestions(results)
                setShowLocationSuggestions(results.length > 0)
            } catch { setLocationSuggestions([]) }
        }, 300)
    }

    const handleSearch = () => {
        const params = new URLSearchParams()
        if (query.trim()) params.set("q", query.trim())
        if (location.trim()) params.set("location", location.trim())
        const category = searchParams.get("category")
        if (category) params.set("category", category)
        if (dateRange?.from) params.set("from", format(dateRange.from, "yyyy-MM-dd"))
        if (dateRange?.to) params.set("to", format(dateRange.to, "yyyy-MM-dd"))
        router.push(`/?${params.toString()}`)
        setShowCalendar(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSearch()
    }

    const clearDates = (e: React.MouseEvent) => {
        e.stopPropagation()
        setDateRange(undefined)
    }

    const dateLabel = dateRange?.from
        ? dateRange.to
            ? `${format(dateRange.from, "d MMM", { locale: pl })} – ${format(dateRange.to, "d MMM", { locale: pl })}`
            : format(dateRange.from, "d MMM", { locale: pl })
        : null

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return (
        <>
            {/* Main nav bar */}
            <motion.div
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 120, damping: 22 }}
                className="fixed w-full z-50 top-0 glass"
            >
                <div className="max-w-[1400px] mx-auto px-6 h-[56px] flex flex-row items-center justify-between gap-4">

                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0">
                        <div className="text-[17px] font-semibold tracking-tight text-[#1d1d1f] select-none">
                            Lend<span className="text-[#6e6e73] font-light">igo</span>
                        </div>
                    </Link>

                    {/* Search Bar */}
                    <div className="hidden md:flex flex-1 absolute left-1/2 -translate-x-1/2 max-w-2xl justify-center z-10" ref={searchBarRef}>
                        <div className="w-full flex flex-row items-center border border-[#d2d2d7] rounded-full bg-white shadow-sm hover:shadow-md transition-shadow duration-200 overflow-visible h-[40px]">

                            {/* Query input */}
                            <input
                                type="text"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Szukaj rzeczy..."
                                className="w-[160px] text-xs text-[#1d1d1f] placeholder-[#6e6e73] px-4 outline-none bg-transparent"
                            />

                            {/* Location input */}
                            <div className="flex items-center border-l border-[#d2d2d7] px-3 gap-1.5 h-full relative cursor-text">
                                <MapPin size={11} className="text-[#6e6e73] flex-shrink-0" />
                                <input
                                    type="text"
                                    value={location}
                                    onChange={e => {
                                        setLocation(e.target.value)
                                        setShowCalendar(false)
                                        searchLocation(e.target.value)
                                    }}
                                    onKeyDown={handleKeyDown}
                                    onFocus={() => locationSuggestions.length > 0 && setShowLocationSuggestions(true)}
                                    placeholder="Lokalizacja"
                                    className="w-[90px] text-xs text-[#1d1d1f] placeholder-[#6e6e73] outline-none bg-transparent"
                                    autoComplete="off"
                                />
                            </div>

                            {/* Date picker trigger */}
                            <div
                                className="flex items-center border-l border-[#d2d2d7] px-3 gap-1.5 h-full cursor-pointer group"
                                onClick={() => {
                                    setShowCalendar(v => !v)
                                    setShowLocationSuggestions(false)
                                }}
                            >
                                <CalendarDays size={11} className="text-[#6e6e73] flex-shrink-0" />
                                <span className={`text-xs whitespace-nowrap ${dateLabel ? "text-[#1d1d1f] font-medium" : "text-[#6e6e73]"}`}>
                                    {dateLabel ?? "Termin"}
                                </span>
                                {dateLabel && (
                                    <button
                                        onClick={clearDates}
                                        className="ml-1 text-[#6e6e73] hover:text-[#1d1d1f]"
                                    >
                                        <X size={10} />
                                    </button>
                                )}
                            </div>

                            {/* Search button */}
                            <button
                                onClick={handleSearch}
                                className="bg-[#1d1d1f] rounded-full p-[7px] mr-1.5 flex-shrink-0 hover:bg-[#3a3a3c] transition-colors"
                            >
                                <Search size={10} strokeWidth={3} className="text-white" />
                            </button>
                        </div>

                        {/* Floating calendar popover */}
                        {showCalendar && (
                            <motion.div
                                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.15 }}
                                className="absolute top-[48px] left-1/2 -translate-x-1/2 z-[100] bg-white rounded-[20px] shadow-2xl border border-black/[0.08] p-3"
                            >
                                <DayPicker
                                    mode="range"
                                    selected={dateRange}
                                    onSelect={setDateRange}
                                    numberOfMonths={2}
                                    fromDate={today}
                                    disabled={{ before: today }}
                                    locale={pl}
                                />
                                <div className="flex items-center justify-between px-2 pt-2 border-t border-black/[0.06]">
                                    <button
                                        onClick={() => setDateRange(undefined)}
                                        className="text-[12px] text-[#6e6e73] hover:text-[#1d1d1f] underline"
                                    >
                                        Wyczyść
                                    </button>
                                    <button
                                        onClick={handleSearch}
                                        className="bg-[#1d1d1f] text-white text-[12px] font-semibold px-4 py-1.5 rounded-full hover:bg-black transition-colors"
                                    >
                                        Zastosuj
                                    </button>
                                </div>
                            </motion.div>
                        )}
                        
                        {/* Location suggestions dropdown */}
                        {showLocationSuggestions && locationSuggestions.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.15 }}
                                className="absolute top-[48px] left-1/3 z-[100] w-[280px] bg-white rounded-[16px] shadow-2xl border border-black/[0.08] overflow-hidden"
                            >
                                {locationSuggestions.map((s, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onMouseDown={() => {
                                            setLocation(s)
                                            setLocationSuggestions([])
                                            setShowLocationSuggestions(false)
                                        }}
                                        className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-[#f5f5f7] transition-colors text-[13px] text-[#1d1d1f] border-b border-black/[0.04] last:border-0"
                                    >
                                        <MapPin size={13} className="text-[#6e6e73] shrink-0" />
                                        {s}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-3 flex-shrink-0 relative z-20 ml-auto">
                        <Link
                            href="/listings/create"
                            className="hidden md:block text-[13px] font-medium text-[#1d1d1f] hover:text-[#6e6e73] transition-colors px-3 py-1.5 rounded-full hover:bg-black/5"
                        >
                            Dodaj ogłoszenie
                        </Link>
                        <UserMenu />
                    </div>
                </div>
            </motion.div>

            {/* Category Bar */}
            {!hideCategoryBar && (
                <div className="fixed w-full z-40 top-[56px]">
                    <CategoryBar />
                </div>
            )}
        </>
    )
}
