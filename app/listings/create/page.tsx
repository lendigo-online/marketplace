"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { motion } from "framer-motion"
import { CheckCircle2, Tag, MapPin, DollarSign, Image as ImageIcon, AlignLeft } from "lucide-react"
import dynamic from "next/dynamic"

const MapPicker = dynamic(() => import("@/components/MapPicker"), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-black/[0.04] rounded-2xl animate-pulse" />
})

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
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!imageFile) {
            toast.error("Wybierz zdjęcie przedmiotu.")
            return
        }
        setIsLoading(true)

        try {
            // Upload image first
            const fileData = new FormData()
            fileData.append("file", imageFile)
            const uploadRes = await fetch("/api/upload", {
                method: "POST",
                body: fileData
            })
            
            if (!uploadRes.ok) {
                toast.error("Nie udało się przesłać zdjęcia.")
                setIsLoading(false)
                return
            }
            
            const uploadData = await uploadRes.json()
            const imageSrc = uploadData.url

            // Create listing
            const response = await fetch("/api/listings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    imageSrc,
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
            type: "text", placeholder: "np. Warszawa, Mokotów",
            description: "Miasto lub dzielnica"
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
                            {id === "location" && (
                                <div className="mt-4">
                                    <MapPicker 
                                        value={formData.location}
                                        onChange={(val) => setFormData(prev => ({ ...prev, location: val }))}
                                    />
                                </div>
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
                        <p className="text-[11px] text-[#6e6e73] mb-3">Wybierz zdjęcie ze swojego urządzenia</p>
                        <input
                            type="file"
                            accept="image/*"
                            disabled={isLoading}
                            onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                    setImageFile(file)
                                    setImagePreview(URL.createObjectURL(file))
                                }
                            }}
                            className="block w-full text-sm text-[#6e6e73]
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-[#1d1d1f] file:text-white
                                hover:file:bg-black transition-colors cursor-pointer"
                        />
                        {imagePreview && (
                            <div className="mt-4 rounded-xl overflow-hidden border border-black/[0.04]">
                                <img src={imagePreview} alt="Preview" className="w-full h-auto object-cover max-h-[300px]" />
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
