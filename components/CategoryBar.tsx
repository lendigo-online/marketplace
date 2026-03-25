"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import {
    Laptop,
    Bike,
    Wrench,
    Camera,
    Music,
    Shirt,
    Tent,
    Car,
    Dog,
    Gamepad2,
    Waves,
    Dumbbell,
    LayoutGrid,
} from "lucide-react"

const categories = [
    { label: "Wszystkie", icon: LayoutGrid },
    { label: "Elektronika", icon: Laptop },
    { label: "Rowery", icon: Bike },
    { label: "Narzędzia", icon: Wrench },
    { label: "Foto/Video", icon: Camera },
    { label: "Muzyka", icon: Music },
    { label: "Odzież", icon: Shirt },
    { label: "Camping", icon: Tent },
    { label: "Samochody", icon: Car },
    { label: "Zwierzęta", icon: Dog },
    { label: "Gry", icon: Gamepad2 },
    { label: "Sporty wodne", icon: Waves },
    { label: "Fitness", icon: Dumbbell },
]

export default function CategoryBar() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const active = searchParams.get("category") || "Wszystkie"

    const handleClick = (label: string) => {
        const params = new URLSearchParams()
        const q = searchParams.get("q")
        const location = searchParams.get("location")
        const from = searchParams.get("from")
        const to = searchParams.get("to")
        if (q) params.set("q", q)
        if (location) params.set("location", location)
        if (from) params.set("from", from)
        if (to) params.set("to", to)
        if (label !== "Wszystkie") params.set("category", label)
        router.push(`/?${params.toString()}`)
    }

    return (
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }}
        >
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="flex flex-row items-center gap-1 overflow-x-auto no-scrollbar py-2">
                    {categories.map(({ label, icon: Icon }) => (
                        <button
                            key={label}
                            onClick={() => handleClick(label)}
                            className={`flex-shrink-0 flex flex-col items-center gap-1 px-4 py-2 rounded-full transition-all duration-200 group relative
                                ${active === label
                                    ? "text-[#1d1d1f]"
                                    : "text-[#6e6e73] hover:text-[#1d1d1f]"
                                }`}
                        >
                            <Icon
                                size={20}
                                strokeWidth={1.5}
                                className={`mb-0.5 transition-all duration-200 ${active === label ? "text-[#1d1d1f]" : "text-[#6e6e73] group-hover:text-[#1d1d1f]"}`}
                            />
                            <span className="text-[11px] font-medium whitespace-nowrap">{label}</span>
                            {active === label && (
                                <motion.div
                                    layoutId="category-underline"
                                    className="absolute -bottom-2 left-2 right-2 h-[2px] bg-[#1d1d1f] rounded-full"
                                />
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}
