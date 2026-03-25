"use client"

import { useState, useRef, useEffect } from "react"
import { MapPin, Search } from "lucide-react"

interface Suggestion {
    display: string
    full: string
}

interface LocationSearchProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

export default function LocationSearch({ value, onChange, placeholder = "Szukaj miasta..." }: LocationSearchProps) {
    const [query, setQuery] = useState(value)
    const [suggestions, setSuggestions] = useState<Suggestion[]>([])
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setQuery(value)
    }, [value])

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const search = (q: string) => {
        if (debounceRef.current) clearTimeout(debounceRef.current)
        if (!q.trim()) {
            setSuggestions([])
            setOpen(false)
            return
        }
        debounceRef.current = setTimeout(async () => {
            setLoading(true)
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=6&addressdetails=1&featuretype=city`,
                    { headers: { "Accept-Language": "pl" } }
                )
                const data = await res.json()
                const results: Suggestion[] = data
                    .filter((item: any) => item.address)
                    .map((item: any) => {
                        const city =
                            item.address.city ||
                            item.address.town ||
                            item.address.village ||
                            item.address.municipality ||
                            item.address.county ||
                            ""
                        const country = item.address.country || ""
                        const display = city ? `${city}, ${country}` : country
                        return { display, full: display }
                    })
                    .filter((s: Suggestion, i: number, arr: Suggestion[]) =>
                        s.display && arr.findIndex(x => x.display === s.display) === i
                    )
                setSuggestions(results)
                setOpen(results.length > 0)
            } catch {
                setSuggestions([])
            } finally {
                setLoading(false)
            }
        }, 300)
    }

    const select = (s: Suggestion) => {
        setQuery(s.display)
        onChange(s.full)
        setSuggestions([])
        setOpen(false)
    }

    return (
        <div ref={containerRef} className="relative">
            <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6e6e73] pointer-events-none" />
                <input
                    type="text"
                    value={query}
                    onChange={e => {
                        setQuery(e.target.value)
                        onChange(e.target.value)
                        search(e.target.value)
                    }}
                    onFocus={() => suggestions.length > 0 && setOpen(true)}
                    placeholder={placeholder}
                    className="apple-input pl-9"
                    autoComplete="off"
                />
                {loading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-[#6e6e73]/30 border-t-[#6e6e73] rounded-full animate-spin" />
                )}
            </div>

            {open && suggestions.length > 0 && (
                <div className="absolute z-50 mt-1 w-full bg-white rounded-2xl shadow-apple border border-black/[0.06] overflow-hidden">
                    {suggestions.map((s, i) => (
                        <button
                            key={i}
                            type="button"
                            onMouseDown={() => select(s)}
                            className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-[#f5f5f7] transition-colors text-[13px] text-[#1d1d1f] border-b border-black/[0.04] last:border-0"
                        >
                            <MapPin size={14} className="text-[#6e6e73] shrink-0" />
                            {s.display}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
