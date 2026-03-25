"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { motion } from "framer-motion"
import { CheckCircle2, Tag, MapPin, DollarSign, Image as ImageIcon, AlignLeft } from "lucide-react"
import LocationSearch from "@/components/LocationSearch"

const categories = [
    "Elektronika", "Rowery", "Narzędzia", "Foto/Video",
    "Muzyka", "Odzież", "Camping", "Samochody",
    "Gry", "Sporty wodne", "Fitness", "Inne"
]

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
    const [imageFiles, setImageFiles] = useState<File[]>([])
    const [imagePreviews, setImagePreviews] = useState<string[]>([])

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (imageFiles.length === 0) {
            toast.error("Dodaj przynajmniej jedno zdjęcie.")
            return
        }
        setIsLoading(true)

        try {
            // Upload all images
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

            // Create listing
            const response = await fetch("/api/listings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    images,
                    pricePerDay: parseFloat(formData.pricePerDay)
                })
            })

            if (response.ok) {
                toast.success("Ogłoszenie zostało dodane!")
                router.push("/")
                router.refresh()
            } else {
                toast.error("Nie udało się dodać ogłoszenia.")
            }
        } catch (error) {
            toast.error("Coś poszło nie tak.")
        } finally {
            setIsLoading(false)
        }
    }

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
                {/* Header */}
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
                                    onClick={() => setFormData(prev => ({ ...prev, category: cat }))}
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
