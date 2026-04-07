"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Tag, MapPin, DollarSign, Image as ImageIcon, AlignLeft, SlidersHorizontal, Percent, Plus, Trash2 } from "lucide-react"
import LocationSearch from "@/components/LocationSearch"

const categories = [
    "Elektronika", "Narzędzia", "Samochody", "Rowery",
    "Foto/Video", "Camping", "Muzyka",
    "Sporty wodne", "Odzież", "Gry", "Inne"
]

const categorySpecificFilters: Record<string, Array<{ key: string; label: string; options?: string[]; type?: string; unit?: string }>> = {
    "Samochody": [
        { key: "paliwo", label: "Paliwo", options: ["Benzyna", "Diesel", "Elektryczny", "Hybryda", "LPG"] },
        { key: "skrzynia", label: "Skrzynia biegów", options: ["Manualna", "Automatyczna"] },
        { key: "moc", label: "Moc silnika", type: "number", unit: "KM" },
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
}

export default function CreateListingPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        pricePerDay: "",
        location: "",
        category: ""
    })
    const [categoryFilters, setCategoryFilters] = useState<Record<string, string>>({})
    const [imageFiles, setImageFiles] = useState<File[]>([])
    const [imagePreviews, setImagePreviews] = useState<string[]>([])
    const [discountRules, setDiscountRules] = useState<{ minDays: string; discountPercent: string }[]>([])

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const selectCategory = (cat: string) => {
        setFormData(prev => ({ ...prev, category: cat }))
        setCategoryFilters({})
    }

    const toggleFilter = (key: string, option: string) => {
        setCategoryFilters(prev => ({
            ...prev,
            [key]: prev[key] === option ? "" : option,
        }))
    }

    const buildDescription = () => {
        const activeFilters = Object.values(categoryFilters).filter(Boolean)
        if (activeFilters.length === 0) return formData.description
        const filterLine = activeFilters.join(" | ")
        return formData.description
            ? `${formData.description}\n\n${filterLine}`
            : filterLine
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (imageFiles.length === 0) {
            toast.error("Dodaj przynajmniej jedno zdjęcie.")
            return
        }
        setIsLoading(true)

        try {
            const images: string[] = []
            for (const file of imageFiles) {
                const fileData = new FormData()
                fileData.append("file", file)
                const uploadRes = await fetch("/api/upload", { method: "POST", body: fileData })
                if (!uploadRes.ok) {
                    toast.error("Nie udało się przesłać zdjęcia.")
                    setIsLoading(false)
                    return
                }
                const { url } = await uploadRes.json()
                images.push(url)
            }

            const validRules = discountRules
                .filter(r => r.minDays && r.discountPercent)
                .map(r => ({ minDays: parseInt(r.minDays), discountPercent: parseFloat(r.discountPercent) }))

            const response = await fetch("/api/listings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    description: buildDescription(),
                    images,
                    pricePerDay: parseFloat(formData.pricePerDay),
                    discountRules: validRules
                })
            })

            if (response.ok) {
                toast.success("Ogłoszenie zostało dodane!")
                router.push("/")
                router.refresh()
            } else {
                toast.error("Nie udało się dodać ogłoszenia.")
            }
        } catch {
            toast.error("Coś poszło nie tak.")
        } finally {
            setIsLoading(false)
        }
    }

    const currentCategoryFilters = categorySpecificFilters[formData.category] ?? []

    const fields = [
        {
            id: "title", label: "Tytuł ogłoszenia", icon: Tag,
            type: "text", placeholder: "np. Aparat Canon EOS R6",
            description: "Podaj krótką, chwytliwą nazwę"
        },
        {
            id: "description", label: "Opis", icon: AlignLeft,
            type: "textarea", placeholder: "Opisz swój przedmiot — stan, co zawiera zestaw, wymagania...",
            description: "Im więcej szczegółów, tym lepiej"
        },
        {
            id: "location", label: "Lokalizacja", icon: MapPin,
            type: "location", placeholder: "np. Warszawa, Mokotów",
            description: "Wyszukaj miasto lub dzielnicę"
        },
        {
            id: "pricePerDay", label: "Cena za dzień (PLN)", icon: DollarSign,
            type: "number", placeholder: "np. 50",
            description: "Cena w złotych"
        }
    ]

    return (
        <div className="min-h-screen bg-[#fbfbfd] py-12 px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="max-w-[680px] mx-auto"
            >
                <div className="mb-10">
                    <h1 className="text-[36px] font-bold tracking-tighter text-[#1d1d1f]">
                        Dodaj ogłoszenie
                    </h1>
                    <p className="text-[15px] text-[#6e6e73] mt-2">
                        Wypełnij formularz i zacznij zarabiać na swoich rzeczach
                    </p>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                    {/* Category picker */}
                    <div className="bg-white rounded-[24px] p-6 shadow-apple-sm border border-black/[0.04]">
                        <label className="text-[12px] font-semibold text-[#6e6e73] uppercase tracking-wide mb-3 block">
                            Kategoria
                        </label>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => selectCategory(cat)}
                                    className={`px-3 py-2 rounded-xl text-[12px] font-medium transition-all duration-150 text-left
                                        ${formData.category === cat
                                            ? "bg-[#1d1d1f] text-white"
                                            : "bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed]"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Category-specific filters */}
                    <AnimatePresence>
                        {currentCategoryFilters.length > 0 && (
                            <motion.div
                                key={formData.category}
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.2 }}
                                className="bg-white rounded-[24px] p-6 shadow-apple-sm border border-black/[0.04]"
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <SlidersHorizontal size={14} className="text-[#6e6e73]" />
                                    <span className="text-[12px] font-semibold text-[#6e6e73] uppercase tracking-wide">
                                        Szczegóły: {formData.category}
                                    </span>
                                </div>
                                <div className="space-y-5">
                                    {currentCategoryFilters.map(filter => (
                                        <div key={filter.key}>
                                            <p className="text-[11px] font-medium text-[#6e6e73] uppercase tracking-wide mb-2">
                                                {filter.label}
                                            </p>
                                            {filter.type === "number" ? (
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        placeholder="np. 150"
                                                        value={categoryFilters[filter.key] ? categoryFilters[filter.key].replace(/[^\d]/g, "") : ""}
                                                        onChange={e => setCategoryFilters(prev => ({
                                                            ...prev,
                                                            [filter.key]: e.target.value ? `${e.target.value} ${filter.unit}` : ""
                                                        }))}
                                                        className="w-[120px] border border-[#d2d2d7] rounded-[10px] px-3 py-2 text-[13px] text-[#1d1d1f] outline-none focus:border-[#1d1d1f] transition-colors"
                                                    />
                                                    {filter.unit && (
                                                        <span className="text-[13px] text-[#6e6e73]">{filter.unit}</span>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex flex-wrap gap-2">
                                                    {filter.options?.map(option => (
                                                        <button
                                                            key={option}
                                                            type="button"
                                                            onClick={() => toggleFilter(filter.key, option)}
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
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Fields */}
                    {fields.map(({ id, label, icon: Icon, type, placeholder, description }) => (
                        <div key={id} className="bg-white rounded-[24px] p-6 shadow-apple-sm border border-black/[0.04]">
                            <div className="flex items-center gap-2 mb-1">
                                <Icon size={14} className="text-[#6e6e73]" />
                                <label htmlFor={id} className="text-[12px] font-semibold text-[#6e6e73] uppercase tracking-wide">
                                    {label}
                                </label>
                            </div>
                            <p className="text-[11px] text-[#6e6e73] mb-3">{description}</p>
                            {type === "textarea" ? (
                                <textarea
                                    id={id}
                                    name={id}
                                    value={formData[id as keyof typeof formData]}
                                    onChange={onChange}
                                    required
                                    disabled={isLoading}
                                    placeholder={placeholder}
                                    rows={4}
                                    className="apple-input resize-none"
                                />
                            ) : type === "location" ? (
                                <LocationSearch
                                    value={formData.location}
                                    onChange={(val) => setFormData(prev => ({ ...prev, location: val }))}
                                    placeholder={placeholder}
                                />
                            ) : (
                                <input
                                    id={id}
                                    name={id}
                                    type={type}
                                    value={formData[id as keyof typeof formData]}
                                    onChange={onChange}
                                    required={id !== "imageSrc"}
                                    disabled={isLoading}
                                    min={type === "number" ? "0" : undefined}
                                    step={type === "number" ? "0.01" : undefined}
                                    placeholder={placeholder}
                                    className="apple-input"
                                />
                            )}
                        </div>
                    ))}

                    {/* Image Upload */}
                    <div className="bg-white rounded-[24px] p-6 shadow-apple-sm border border-black/[0.04]">
                        <div className="flex items-center gap-2 mb-1">
                            <ImageIcon size={14} className="text-[#6e6e73]" />
                            <label className="text-[12px] font-semibold text-[#6e6e73] uppercase tracking-wide">
                                Zdjęcie
                            </label>
                        </div>
                        <p className="text-[11px] text-[#6e6e73] mb-3">Możesz dodać do 8 zdjęć</p>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            disabled={isLoading}
                            onChange={(e) => {
                                const files = Array.from(e.target.files || []).slice(0, 8)
                                setImageFiles(files)
                                setImagePreviews(files.map(f => URL.createObjectURL(f)))
                            }}
                            className="block w-full text-sm text-[#6e6e73]
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-[#1d1d1f] file:text-white
                                hover:file:bg-black transition-colors cursor-pointer"
                        />
                        {imagePreviews.length > 0 && (
                            <div className="mt-4 grid grid-cols-3 gap-2">
                                {imagePreviews.map((src, i) => (
                                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-black/[0.04]">
                                        <img src={src} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                                        {i === 0 && (
                                            <span className="absolute top-1.5 left-1.5 text-[9px] font-semibold bg-black/60 text-white px-1.5 py-0.5 rounded-full">
                                                Główne
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Rabaty za długi wynajem */}
                    <div className="bg-white rounded-[24px] p-6 shadow-apple-sm border border-black/[0.04]">
                        <div className="flex items-center gap-2 mb-1">
                            <Percent size={14} className="text-[#6e6e73]" />
                            <span className="text-[12px] font-semibold text-[#6e6e73] uppercase tracking-wide">
                                Rabaty za długi wynajem
                            </span>
                        </div>
                        <p className="text-[11px] text-[#6e6e73] mb-4">
                            Ustaw zniżki dla klientów wypożyczających na więcej dni
                        </p>

                        <div className="space-y-3">
                            {discountRules.map((rule, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-2"
                                >
                                    <div className="flex items-center gap-2 flex-1 bg-[#f5f5f7] rounded-2xl px-4 py-2.5">
                                        <span className="text-[12px] text-[#6e6e73] whitespace-nowrap">Powyżej</span>
                                        <input
                                            type="number"
                                            min={1}
                                            placeholder="7"
                                            value={rule.minDays}
                                            onChange={e => setDiscountRules(prev => prev.map((r, j) => j === i ? { ...r, minDays: e.target.value } : r))}
                                            className="w-14 bg-white border border-[#d2d2d7] rounded-lg px-2 py-1 text-[13px] text-center outline-none focus:border-[#1d1d1f] transition-colors"
                                        />
                                        <span className="text-[12px] text-[#6e6e73] whitespace-nowrap">dni →</span>
                                        <input
                                            type="number"
                                            min={1}
                                            max={99}
                                            placeholder="10"
                                            value={rule.discountPercent}
                                            onChange={e => setDiscountRules(prev => prev.map((r, j) => j === i ? { ...r, discountPercent: e.target.value } : r))}
                                            className="w-14 bg-white border border-[#d2d2d7] rounded-lg px-2 py-1 text-[13px] text-center outline-none focus:border-[#1d1d1f] transition-colors"
                                        />
                                        <span className="text-[12px] text-[#6e6e73]">% taniej</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setDiscountRules(prev => prev.filter((_, j) => j !== i))}
                                        className="p-2 rounded-xl text-[#6e6e73] hover:text-red-500 hover:bg-red-50 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </motion.div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={() => setDiscountRules(prev => [...prev, { minDays: "", discountPercent: "" }])}
                            className="mt-3 flex items-center gap-1.5 text-[13px] font-medium text-[#0071e3] hover:underline"
                        >
                            <Plus size={14} />
                            Dodaj regułę rabatu
                        </button>
                    </div>

                    {/* Submit */}
                    <button
                        disabled={isLoading}
                        type="submit"
                        className="btn-apple-dark w-full py-4 text-[15px] rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Dodawanie..." : "Opublikuj ogłoszenie"}
                    </button>
                </form>
            </motion.div>
        </div>
    )
}
