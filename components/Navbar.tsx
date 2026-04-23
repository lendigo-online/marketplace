"use client"

import Link from "next/link"
import UserMenu from "./UserMenu"
import NotificationBell from "./NotificationBell"
import CategoryBar from "./CategoryBar"
import { motion } from "framer-motion"
import {
    Search, MapPin, CalendarDays, X, SlidersHorizontal, ChevronDown,
    LayoutGrid, Laptop, Bike, Wrench, Camera, Music, Shirt, Tent, Car, Gamepad2, Waves,
    Truck, HardHat,
} from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { format } from "date-fns"
import { pl } from "date-fns/locale"
import { usePathname } from "next/navigation"
import { DayPicker, DateRange } from "react-day-picker"
import "react-day-picker/dist/style.css"

const categories = [
    { label: "Wszystkie", icon: LayoutGrid },
    { label: "Elektronika", icon: Laptop },
    { label: "Narzędzia", icon: Wrench },
    { label: "Samochody", icon: Car },
    { label: "Rowery", icon: Bike },
    { label: "Foto/Video", icon: Camera },
    { label: "Camping", icon: Tent },
    { label: "Muzyka", icon: Music },
    { label: "Sporty wodne", icon: Waves },
    { label: "Odzież", icon: Shirt },
    { label: "Gry", icon: Gamepad2 },
    { label: "Przyczepy", icon: Truck },
    { label: "Maszyny budowlane", icon: HardHat },
]

const categorySpecificFilters: Record<string, Array<{ key: string; label: string; options?: string[]; type?: string; keyMin?: string; keyMax?: string }>> = {
    "Samochody": [
        { key: "paliwo", label: "Paliwo", options: ["Benzyna", "Diesel", "Elektryczny", "Hybryda", "LPG"] },
        { key: "skrzynia", label: "Skrzynia biegów", options: ["Manualna", "Automatyczna"] },
        { key: "moc", label: "Moc silnika (KM)", type: "range", keyMin: "mocMin", keyMax: "mocMax" },
    ],
    "Elektronika": [
        { key: "typ", label: "Typ urządzenia", options: ["Laptop", "Tablet", "Smartfon", "Monitor", "Inne"] },
    ],
    "Rowery": [
        { key: "typ_roweru", label: "Typ roweru", options: ["Górski", "Szosowy", "Miejski", "Elektryczny", "Trekkingowy", "BMX"] },
    ],
    "Narzędzia": [
        { key: "typ_narzedzi", label: "Typ", options: ["Elektryczne", "Ręczne", "Ogrodowe", "Budowlane", "Pneumatyczne"] },
    ],
    "Foto/Video": [
        { key: "typ_foto", label: "Typ sprzętu", options: ["Aparat", "Kamera", "Obiektyw", "Drone", "Statyw", "Oświetlenie"] },
    ],
    "Muzyka": [
        { key: "typ_muzyka", label: "Typ sprzętu", options: ["Gitara", "Klawisze", "Perkusja", "Wzmacniacz", "Mikrofon", "DJ"] },
    ],
    "Fitness": [
        { key: "typ_fitness", label: "Typ sprzętu", options: ["Siłownia", "Cardio", "Joga", "Rower stacjonarny", "Bieżnia"] },
    ],
    "Camping": [
        { key: "typ_camping", label: "Typ sprzętu", options: ["Namiot", "Śpiwór", "Kuchnia turystyczna", "Plecak", "Latarka"] },
    ],
    "Odzież": [
        { key: "plec", label: "Płeć", options: ["Damska", "Męska", "Unisex"] },
        { key: "rozmiar", label: "Rozmiar", options: ["XS", "S", "M", "L", "XL", "XXL"] },
    ],
    "Przyczepy": [
        { key: "typ_przyczepy", label: "Typ przyczepy", options: ["Laweta", "Towarowa", "Kempingowa", "Przyczepa lekka", "Przyczepa ciężka"] },
    ],
    "Maszyny budowlane": [
        { key: "typ_maszyny", label: "Typ maszyny", options: ["Koparka", "Ładowarka", "Koparko-ładowarka", "Walec", "Dźwig", "Rusztowanie", "Betoniarka", "Inne"] },
    ],
}

export const ALL_CATEGORY_FILTER_KEYS = Object.values(categorySpecificFilters).flatMap(f =>
    f.flatMap(x => x.type === "range" ? [x.keyMin!, x.keyMax!] : [x.key])
)

export default function Navbar() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()

    const hideCategoryBar = pathname === "/dashboard" || pathname === "/listings/create"

    const [query, setQuery] = useState(searchParams.get("q") || "")
    const [location, setLocation] = useState(searchParams.get("location") || "")
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "Wszystkie")
    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "")
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "")
    const [categoryFilters, setCategoryFilters] = useState<Record<string, string>>(() => {
        const obj: Record<string, string> = {}
        ALL_CATEGORY_FILTER_KEYS.forEach(key => {
            const val = searchParams.get(key)
            if (val) obj[key] = val
        })
        return obj
    })
    const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
        const from = searchParams.get("from")
        const to = searchParams.get("to")
        if (from && to) return { from: new Date(from), to: new Date(to) }
        if (from) return { from: new Date(from), to: undefined }
        return undefined
    })

    const [showCalendar, setShowCalendar] = useState(false)
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
    const [showFilterPanel, setShowFilterPanel] = useState(false)
    const [showLocationSuggestions, setShowLocationSuggestions] = useState(false)
    const [locationSuggestions, setLocationSuggestions] = useState<{ label: string; sub: string }[]>([])
    const locationDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const searchBarRef = useRef<HTMLDivElement>(null)
    const mobileSearchRef = useRef<HTMLDivElement>(null)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768)
        check()
        window.addEventListener("resize", check)
        return () => window.removeEventListener("resize", check)
    }, [])

    useEffect(() => {
        setQuery(searchParams.get("q") || "")
        setLocation(searchParams.get("location") || "")
        setSelectedCategory(searchParams.get("category") || "Wszystkie")
        setMinPrice(searchParams.get("minPrice") || "")
        setMaxPrice(searchParams.get("maxPrice") || "")
        const from = searchParams.get("from")
        const to = searchParams.get("to")
        if (from && to) setDateRange({ from: new Date(from), to: new Date(to) })
        else if (from) setDateRange({ from: new Date(from), to: undefined })
        else setDateRange(undefined)
        const obj: Record<string, string> = {}
        ALL_CATEGORY_FILTER_KEYS.forEach(key => {
            const val = searchParams.get(key)
            if (val) obj[key] = val
        })
        setCategoryFilters(obj)
    }, [searchParams])

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            const inDesktop = searchBarRef.current?.contains(e.target as Node)
            const inMobile = mobileSearchRef.current?.contains(e.target as Node)
            if (!inDesktop && !inMobile) {
                setShowCalendar(false)
                setShowLocationSuggestions(false)
                setShowCategoryDropdown(false)
                setShowFilterPanel(false)
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
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=10&addressdetails=1&countrycodes=pl`,
                    { headers: { "Accept-Language": "pl" } }
                )
                const data = await res.json()
                const seen = new Set<string>()
                const results: { label: string; sub: string }[] = []

                for (const item of data) {
                    if (!item.address) continue
                    if (item.class !== "place" && item.class !== "boundary") continue

                    const addr = item.address
                    const city =
                        addr.city || addr.town || addr.village ||
                        addr.municipality || addr.hamlet || addr.suburb || ""
                    if (!city) continue
                    if (seen.has(city.toLowerCase())) continue
                    seen.add(city.toLowerCase())

                    const sub = addr.state || addr.county || ""

                    results.push({ label: city, sub })
                    if (results.length >= 6) break
                }

                setLocationSuggestions(results)
                setShowLocationSuggestions(results.length > 0)
            } catch { setLocationSuggestions([]) }
        }, 300)
    }

    const buildParams = () => {
        const params = new URLSearchParams()
        if (query.trim()) params.set("q", query.trim())
        if (location.trim()) params.set("location", location.trim())
        if (selectedCategory && selectedCategory !== "Wszystkie") params.set("category", selectedCategory)
        if (dateRange?.from) params.set("from", format(dateRange.from, "yyyy-MM-dd"))
        if (dateRange?.to) params.set("to", format(dateRange.to, "yyyy-MM-dd"))
        if (minPrice) params.set("minPrice", minPrice)
        if (maxPrice) params.set("maxPrice", maxPrice)
        Object.entries(categoryFilters).forEach(([key, val]) => {
            if (val) params.set(key, val)
        })
        return params
    }

    const handleSearch = () => {
        router.push(`/?${buildParams().toString()}`)
        setShowCalendar(false)
        setShowFilterPanel(false)
        setShowCategoryDropdown(false)
        setShowLocationSuggestions(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSearch()
    }

    const clearDates = (e: React.MouseEvent) => {
        e.stopPropagation()
        setDateRange(undefined)
    }

    const toggleCategoryFilter = (key: string, option: string) => {
        setCategoryFilters(prev => ({
            ...prev,
            [key]: prev[key] === option ? "" : option,
        }))
    }

    const dateLabel = dateRange?.from
        ? dateRange.to
            ? `${format(dateRange.from, "d MMM", { locale: pl })} – ${format(dateRange.to, "d MMM", { locale: pl })}`
            : format(dateRange.from, "d MMM", { locale: pl })
        : null

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const activeCatEntry = categories.find(c => c.label === selectedCategory)
    const CatIcon = activeCatEntry?.icon ?? LayoutGrid

    const activeFiltersCount = [minPrice, maxPrice, location, ...Object.values(categoryFilters).filter(Boolean)].filter(Boolean).length + (dateRange?.from ? 1 : 0)

    const currentCategoryFilters = categorySpecificFilters[selectedCategory] ?? []

    /* ── shared dropdown JSX pieces ── */
    const categoryDropdownJSX = (
        <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.15 }}
            className="absolute top-[48px] left-0 z-[100] w-[200px] bg-white rounded-[16px] shadow-2xl border border-black/[0.08] overflow-hidden"
        >
            {categories.map(({ label, icon: Icon }) => (
                <button
                    key={label}
                    onMouseDown={() => {
                        setSelectedCategory(label)
                        setCategoryFilters({})
                        setShowCategoryDropdown(false)
                    }}
                    className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-left hover:bg-[#f5f5f7] transition-colors text-[13px] border-b border-black/[0.04] last:border-0 ${selectedCategory === label ? "text-[#1d1d1f] font-medium" : "text-[#6e6e73]"}`}
                >
                    <Icon size={14} className={selectedCategory === label ? "text-[#1d1d1f]" : "text-[#6e6e73]"} />
                    {label}
                    {selectedCategory === label && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#1d1d1f]" />
                    )}
                </button>
            ))}
        </motion.div>
    )

    const filterPanelJSX = (mobile = false) => (
        <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.15 }}
            className={`absolute top-[48px] z-[100] bg-white rounded-[20px] shadow-2xl border border-black/[0.08] overflow-hidden ${
                mobile ? "left-0 right-0 w-full" : "left-1/2 -translate-x-1/2 w-[400px]"
            }`}
        >
            <div className="p-5 max-h-[70vh] overflow-y-auto">
                {/* Location — shown only in mobile filter panel */}
                {mobile && (
                    <div className="mb-5">
                        <h3 className="text-[13px] font-semibold text-[#1d1d1f] mb-3">Lokalizacja</h3>
                        <div className="relative">
                            <div className="flex items-center border border-[#d2d2d7] rounded-[8px] px-3 py-2 gap-2">
                                <MapPin size={13} className="text-[#6e6e73] flex-shrink-0" />
                                <input
                                    type="text"
                                    value={location}
                                    onChange={e => {
                                        setLocation(e.target.value)
                                        searchLocation(e.target.value)
                                    }}
                                    placeholder="Miasto lub region"
                                    className="flex-1 text-[13px] text-[#1d1d1f] placeholder-[#6e6e73] outline-none bg-transparent"
                                    autoComplete="off"
                                />
                                {location && (
                                    <button onClick={() => { setLocation(""); setLocationSuggestions([]); setShowLocationSuggestions(false) }} className="text-[#6e6e73]">
                                        <X size={13} />
                                    </button>
                                )}
                            </div>
                            {showLocationSuggestions && locationSuggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-1 z-[110] bg-white rounded-[12px] shadow-xl border border-black/[0.08] overflow-hidden">
                                    {locationSuggestions.map((s, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onMouseDown={() => {
                                                setLocation(s.label)
                                                setLocationSuggestions([])
                                                setShowLocationSuggestions(false)
                                            }}
                                            className="flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-[#f5f5f7] transition-colors border-b border-black/[0.04] last:border-0"
                                        >
                                            <MapPin size={13} className="text-[#6e6e73] shrink-0" />
                                            <div>
                                                <p className="text-[13px] text-[#1d1d1f]">{s.label}</p>
                                                {s.sub && <p className="text-[11px] text-[#6e6e73]">{s.sub}</p>}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Date range — shown only in mobile filter panel */}
                {mobile && (
                    <div className="mb-5 border-t border-black/[0.06] pt-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-[13px] font-semibold text-[#1d1d1f]">Termin wynajmu</h3>
                            {dateLabel && (
                                <button onClick={() => setDateRange(undefined)} className="text-[12px] text-[#6e6e73] hover:text-[#1d1d1f] underline">
                                    Wyczyść
                                </button>
                            )}
                        </div>
                        {dateLabel && (
                            <p className="text-[13px] text-[#1d1d1f] font-medium mb-3">{dateLabel}</p>
                        )}
                        <div className="overflow-x-auto -mx-2 px-2">
                            <DayPicker
                                mode="range"
                                selected={dateRange}
                                onSelect={setDateRange}
                                numberOfMonths={1}
                                fromDate={today}
                                disabled={{ before: today }}
                                locale={pl}
                            />
                        </div>
                    </div>
                )}

                {/* Price range */}
                <div className={mobile ? "border-t border-black/[0.06] pt-4 mb-5" : "mb-5"}>
                    <h3 className="text-[13px] font-semibold text-[#1d1d1f] mb-3">Zakres cenowy (zł/dzień)</h3>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            min={0}
                            value={minPrice}
                            onChange={e => setMinPrice(e.target.value)}
                            placeholder="Od"
                            className="w-0 flex-1 min-w-0 border border-[#d2d2d7] rounded-[8px] px-2 py-1 text-[11px] text-[#1d1d1f] outline-none focus:border-[#1d1d1f] transition-colors"
                        />
                        <span className="text-[#6e6e73] text-[11px] shrink-0">–</span>
                        <input
                            type="number"
                            min={0}
                            value={maxPrice}
                            onChange={e => setMaxPrice(e.target.value)}
                            placeholder="Do"
                            className="w-0 flex-1 min-w-0 border border-[#d2d2d7] rounded-[8px] px-2 py-1 text-[11px] text-[#1d1d1f] outline-none focus:border-[#1d1d1f] transition-colors"
                        />
                        {(minPrice || maxPrice) && (
                            <button onClick={() => { setMinPrice(""); setMaxPrice("") }} className="text-[#6e6e73] hover:text-[#1d1d1f]">
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Category-specific filters */}
                {currentCategoryFilters.length > 0 && (
                    <div className="border-t border-black/[0.06] pt-4 space-y-4">
                        <h3 className="text-[13px] font-semibold text-[#1d1d1f]">
                            Filtry: {selectedCategory}
                        </h3>
                        {currentCategoryFilters.map(filter => (
                            <div key={filter.key}>
                                <p className="text-[11px] font-medium text-[#6e6e73] uppercase tracking-wide mb-2">
                                    {filter.label}
                                </p>
                                {filter.type === "range" ? (
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="number"
                                            min={0}
                                            placeholder="Od"
                                            value={categoryFilters[filter.keyMin!] || ""}
                                            onChange={e => setCategoryFilters(prev => ({ ...prev, [filter.keyMin!]: e.target.value }))}
                                            className="w-[90px] border border-[#d2d2d7] rounded-[8px] px-2 py-1 text-[11px] text-[#1d1d1f] outline-none focus:border-[#1d1d1f] transition-colors"
                                        />
                                        <span className="text-[#6e6e73] text-[11px]">–</span>
                                        <input
                                            type="number"
                                            min={0}
                                            placeholder="Do"
                                            value={categoryFilters[filter.keyMax!] || ""}
                                            onChange={e => setCategoryFilters(prev => ({ ...prev, [filter.keyMax!]: e.target.value }))}
                                            className="w-[90px] border border-[#d2d2d7] rounded-[8px] px-2 py-1 text-[11px] text-[#1d1d1f] outline-none focus:border-[#1d1d1f] transition-colors"
                                        />
                                        <span className="text-[11px] text-[#6e6e73]">KM</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {filter.options?.map(option => (
                                            <button
                                                key={option}
                                                onClick={() => toggleCategoryFilter(filter.key, option)}
                                                className={`px-3 py-1.5 rounded-full text-[12px] border transition-all duration-150 ${
                                                    categoryFilters[filter.key] === option
                                                        ? "bg-[#1d1d1f] text-white border-[#1d1d1f]"
                                                        : "bg-white text-[#1d1d1f] border-[#d2d2d7] hover:border-[#1d1d1f]"
                                                }`}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {currentCategoryFilters.length === 0 && !mobile && (
                    <p className="text-[12px] text-[#6e6e73] border-t border-black/[0.06] pt-4">
                        Wybierz kategorię, aby zobaczyć dodatkowe filtry.
                    </p>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-black/[0.06]">
                    <button
                        onClick={() => { setMinPrice(""); setMaxPrice(""); setCategoryFilters({}); if (mobile) { setLocation(""); setDateRange(undefined) } }}
                        className="text-[12px] text-[#6e6e73] hover:text-[#1d1d1f] underline"
                    >
                        Wyczyść filtry
                    </button>
                    <button
                        onClick={handleSearch}
                        className="bg-[#1d1d1f] text-white text-[12px] font-semibold px-4 py-1.5 rounded-full hover:bg-black transition-colors"
                    >
                        Zastosuj
                    </button>
                </div>
            </div>
        </motion.div>
    )

    return (
        <>
            <motion.div
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 120, damping: 22 }}
                className="fixed w-full z-50 top-0 bg-white/95 backdrop-blur-xl border-b border-black/[0.06] shadow-sm"
            >
                <div className="max-w-[1400px] mx-auto px-4 md:px-6">

                    {/* ── Top row ── */}
                    <div className="h-[56px] flex flex-row items-center justify-between gap-4 relative">

                        {/* Logo */}
                        <Link href="/" className="flex-shrink-0" onClick={() => setQuery("")}>
                            <div className="text-[17px] font-semibold tracking-tight text-[#1d1d1f] select-none">
                                Lend<span className="text-[#6e6e73] font-light">igo</span>
                            </div>
                        </Link>

                        {/* Desktop Search Bar */}
                        <div className="hidden md:flex flex-1 absolute left-1/2 -translate-x-1/2 w-[620px] justify-center z-10" ref={searchBarRef}>
                            <div className="w-full flex flex-row items-center border border-[#d2d2d7] rounded-full bg-white shadow-sm hover:shadow-md transition-shadow duration-200 overflow-visible h-[40px]">

                                {/* Category selector */}
                                <button
                                    onClick={() => {
                                        setShowCategoryDropdown(v => !v)
                                        setShowCalendar(false)
                                        setShowFilterPanel(false)
                                        setShowLocationSuggestions(false)
                                    }}
                                    className="flex items-center gap-1.5 px-3 h-full border-r border-[#d2d2d7] hover:bg-[#f5f5f7] rounded-l-full transition-colors flex-shrink-0 group"
                                >
                                    <CatIcon size={12} className="text-[#6e6e73] group-hover:text-[#1d1d1f] transition-colors flex-shrink-0" />
                                    <span className="text-xs text-[#1d1d1f] font-medium max-w-[80px] truncate">
                                        {selectedCategory === "Wszystkie" ? "Kategoria" : selectedCategory}
                                    </span>
                                    <ChevronDown size={10} className="text-[#6e6e73] flex-shrink-0" />
                                </button>

                                {/* Query input */}
                                <input
                                    type="text"
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Szukaj rzeczy..."
                                    className="flex-1 min-w-0 text-xs text-[#1d1d1f] placeholder-[#6e6e73] px-4 outline-none bg-transparent"
                                />

                                {/* Location input */}
                                <div className="flex items-center border-l border-[#d2d2d7] px-3 gap-1.5 h-full relative cursor-text flex-shrink-0">
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
                                        className="w-[80px] text-xs text-[#1d1d1f] placeholder-[#6e6e73] outline-none bg-transparent"
                                        autoComplete="off"
                                    />
                                </div>

                                {/* Date picker trigger */}
                                <div
                                    className="flex items-center border-l border-[#d2d2d7] px-3 gap-1.5 h-full cursor-pointer group flex-shrink-0"
                                    onClick={() => {
                                        setShowCalendar(v => !v)
                                        setShowLocationSuggestions(false)
                                        setShowCategoryDropdown(false)
                                        setShowFilterPanel(false)
                                    }}
                                >
                                    <CalendarDays size={11} className="text-[#6e6e73] flex-shrink-0" />
                                    <span className={`text-xs whitespace-nowrap ${dateLabel ? "text-[#1d1d1f] font-medium" : "text-[#6e6e73]"}`}>
                                        {dateLabel ?? "Termin"}
                                    </span>
                                    {dateLabel && (
                                        <button onClick={clearDates} className="ml-1 text-[#6e6e73] hover:text-[#1d1d1f]">
                                            <X size={10} />
                                        </button>
                                    )}
                                </div>

                                {/* Filter button */}
                                <button
                                    onClick={() => {
                                        setShowFilterPanel(v => !v)
                                        setShowCalendar(false)
                                        setShowCategoryDropdown(false)
                                        setShowLocationSuggestions(false)
                                    }}
                                    className={`flex items-center gap-1.5 border-l border-[#d2d2d7] px-3 h-full transition-colors flex-shrink-0 relative ${showFilterPanel ? "bg-[#f5f5f7]" : "hover:bg-[#f5f5f7]"}`}
                                >
                                    <SlidersHorizontal size={11} className="text-[#6e6e73] flex-shrink-0" />
                                    <span className="text-xs text-[#6e6e73]">Filtry</span>
                                    {activeFiltersCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#1d1d1f] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                                            {activeFiltersCount}
                                        </span>
                                    )}
                                </button>

                                {/* Search button */}
                                <button
                                    onClick={handleSearch}
                                    className="bg-[#1d1d1f] rounded-full p-[7px] mr-1.5 ml-1.5 flex-shrink-0 hover:bg-[#3a3a3c] transition-colors"
                                >
                                    <Search size={10} strokeWidth={3} className="text-white" />
                                </button>
                            </div>

                            {/* Desktop dropdowns */}
                            {showCategoryDropdown && categoryDropdownJSX}
                            {showFilterPanel && filterPanelJSX(false)}

                            {/* Desktop Calendar */}
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
                                        <button onClick={() => setDateRange(undefined)} className="text-[12px] text-[#6e6e73] hover:text-[#1d1d1f] underline">
                                            Wyczyść
                                        </button>
                                        <button onClick={handleSearch} className="bg-[#1d1d1f] text-white text-[12px] font-semibold px-4 py-1.5 rounded-full hover:bg-black transition-colors">
                                            Zastosuj
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Desktop Location suggestions */}
                            {showLocationSuggestions && locationSuggestions.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute top-[48px] left-1/3 z-[100] w-[260px] bg-white rounded-[16px] shadow-2xl border border-black/[0.08] overflow-hidden"
                                >
                                    {locationSuggestions.map((s, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onMouseDown={() => {
                                                setLocation(s.label)
                                                setLocationSuggestions([])
                                                setShowLocationSuggestions(false)
                                            }}
                                            className="flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-[#f5f5f7] transition-colors border-b border-black/[0.04] last:border-0"
                                        >
                                            <MapPin size={13} className="text-[#6e6e73] shrink-0" />
                                            <div>
                                                <p className="text-[13px] text-[#1d1d1f]">{s.label}</p>
                                                {s.sub && <p className="text-[11px] text-[#6e6e73]">{s.sub}</p>}
                                            </div>
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
                            <NotificationBell />
                            <UserMenu />
                        </div>
                    </div>

                    {/* ── Mobile Search Row ── */}
                    <div className="flex md:hidden pb-3" ref={mobileSearchRef}>
                        <div className="relative w-full">
                            <div className="w-full flex items-center border border-[#d2d2d7] rounded-full bg-white shadow-sm h-[42px] overflow-visible">

                                {/* Category */}
                                <button
                                    onClick={() => {
                                        setShowCategoryDropdown(v => !v)
                                        setShowCalendar(false)
                                        setShowFilterPanel(false)
                                        setShowLocationSuggestions(false)
                                    }}
                                    className="flex items-center gap-1 px-3 h-full border-r border-[#d2d2d7] hover:bg-[#f5f5f7] rounded-l-full transition-colors flex-shrink-0"
                                >
                                    <CatIcon size={14} className="text-[#6e6e73]" />
                                    <ChevronDown size={11} className="text-[#6e6e73]" />
                                </button>

                                {/* Query input */}
                                <input
                                    type="search"
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Szukaj rzeczy..."
                                    className="flex-1 min-w-0 text-[13px] text-[#1d1d1f] placeholder-[#6e6e73] px-3 outline-none bg-transparent"
                                    autoComplete="off"
                                />

                                {/* Filter button (includes location + date on mobile) */}
                                <button
                                    onClick={() => {
                                        setShowFilterPanel(v => !v)
                                        setShowCalendar(false)
                                        setShowCategoryDropdown(false)
                                        setShowLocationSuggestions(false)
                                    }}
                                    className={`flex items-center gap-1 border-l border-[#d2d2d7] px-3 h-full flex-shrink-0 relative transition-colors ${showFilterPanel ? "bg-[#f5f5f7]" : "hover:bg-[#f5f5f7]"}`}
                                >
                                    <SlidersHorizontal size={14} className="text-[#6e6e73]" />
                                    <span className="text-[12px] text-[#6e6e73]">Filtry</span>
                                    {activeFiltersCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#1d1d1f] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                                            {activeFiltersCount}
                                        </span>
                                    )}
                                </button>

                                {/* Search button */}
                                <button
                                    onClick={handleSearch}
                                    className="bg-[#1d1d1f] rounded-full p-[8px] mr-1.5 ml-1.5 flex-shrink-0 hover:bg-[#3a3a3c] transition-colors"
                                >
                                    <Search size={12} strokeWidth={3} className="text-white" />
                                </button>
                            </div>

                            {/* Mobile Category Dropdown */}
                            {showCategoryDropdown && categoryDropdownJSX}

                            {/* Mobile Filter Panel (includes location + date) */}
                            {showFilterPanel && filterPanelJSX(true)}
                        </div>
                    </div>

                </div>
            </motion.div>

            {/* Category Bar */}
            {!hideCategoryBar && (
                <div className="fixed w-full z-40 top-[101px] md:top-[56px] bg-white/95 backdrop-blur-xl border-b border-black/[0.06]">
                    <CategoryBar />
                </div>
            )}
        </>
    )
}
