"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { Percent, Plus, Trash2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { DiscountRule } from "@/types"

interface Props {
    listingId: string
    initialRules: DiscountRule[]
}

export default function DiscountRulesEditor({ listingId, initialRules }: Props) {
    const router = useRouter()
    const [rules, setRules] = useState<{ minDays: string; discountPercent: string }[]>(
        initialRules.map(r => ({ minDays: String(r.minDays), discountPercent: String(r.discountPercent) }))
    )
    const [isLoading, setIsLoading] = useState(false)
    const [isDirty, setIsDirty] = useState(false)

    const update = (i: number, field: "minDays" | "discountPercent", value: string) => {
        setRules(prev => prev.map((r, j) => j === i ? { ...r, [field]: value } : r))
        setIsDirty(true)
    }

    const addRule = () => {
        setRules(prev => [...prev, { minDays: "", discountPercent: "" }])
        setIsDirty(true)
    }

    const removeRule = (i: number) => {
        setRules(prev => prev.filter((_, j) => j !== i))
        setIsDirty(true)
    }

    const save = async () => {
        const validRules = rules
            .filter(r => r.minDays && r.discountPercent)
            .map(r => ({ minDays: parseInt(r.minDays), discountPercent: parseFloat(r.discountPercent) }))
            .sort((a, b) => a.minDays - b.minDays)

        setIsLoading(true)
        try {
            const res = await fetch(`/api/listings/${listingId}/discount-rules`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ discountRules: validRules }),
            })
            if (!res.ok) throw new Error()
            toast.success("Rabaty zapisane")
            setIsDirty(false)
            router.refresh()
        } catch {
            toast.error("Błąd zapisywania")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="pt-4">
            <div className="flex items-center gap-2 mb-3">
                <Percent size={13} className="text-[#6e6e73]" />
                <span className="text-[12px] font-semibold text-[#6e6e73] uppercase tracking-wide">
                    Rabaty za długi wynajem
                </span>
            </div>

            <div className="space-y-2">
                <AnimatePresence>
                    {rules.map((rule, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="flex items-center gap-2"
                        >
                            <div className="flex items-center gap-2 flex-1 bg-[#f5f5f7] rounded-2xl px-4 py-2.5">
                                <span className="text-[12px] text-[#6e6e73] whitespace-nowrap">Powyżej</span>
                                <input
                                    type="number"
                                    min={1}
                                    placeholder="7"
                                    value={rule.minDays}
                                    onChange={e => update(i, "minDays", e.target.value)}
                                    className="w-14 bg-white border border-[#d2d2d7] rounded-lg px-2 py-1 text-[13px] text-center outline-none focus:border-[#1d1d1f] transition-colors"
                                />
                                <span className="text-[12px] text-[#6e6e73] whitespace-nowrap">dni →</span>
                                <input
                                    type="number"
                                    min={1}
                                    max={99}
                                    placeholder="10"
                                    value={rule.discountPercent}
                                    onChange={e => update(i, "discountPercent", e.target.value)}
                                    className="w-14 bg-white border border-[#d2d2d7] rounded-lg px-2 py-1 text-[13px] text-center outline-none focus:border-[#1d1d1f] transition-colors"
                                />
                                <span className="text-[12px] text-[#6e6e73]">% taniej</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeRule(i)}
                                className="p-2 rounded-xl text-[#6e6e73] hover:text-red-500 hover:bg-red-50 transition-colors"
                            >
                                <Trash2 size={14} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="flex items-center gap-3 mt-3">
                <button
                    type="button"
                    onClick={addRule}
                    className="flex items-center gap-1.5 text-[13px] font-medium text-[#0071e3] hover:underline"
                >
                    <Plus size={14} />
                    Dodaj regułę
                </button>

                {isDirty && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        type="button"
                        onClick={save}
                        disabled={isLoading}
                        className="ml-auto px-4 py-1.5 bg-[#00bf63] text-white text-[13px] font-semibold rounded-full hover:bg-[#00a855] transition-colors disabled:opacity-50"
                    >
                        {isLoading ? "Zapisywanie..." : "Zapisz"}
                    </motion.button>
                )}
            </div>
        </div>
    )
}
