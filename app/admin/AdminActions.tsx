"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { Check, X, Trash2 } from "lucide-react"

interface Props {
    listingId: string
    currentStatus: string
}

export default function AdminActions({ listingId, currentStatus }: Props) {
    const router = useRouter()
    const [loading, setLoading] = useState<string | null>(null)

    const action = async (type: "approve" | "reject" | "delete") => {
        setLoading(type)
        try {
            if (type === "delete") {
                const res = await fetch(`/api/admin/listings/${listingId}`, { method: "DELETE" })
                if (!res.ok) throw new Error()
                toast.success("Ogłoszenie usunięte")
            } else {
                const status = type === "approve" ? "APPROVED" : "REJECTED"
                const res = await fetch(`/api/admin/listings/${listingId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status })
                })
                if (!res.ok) throw new Error()
                toast.success(type === "approve" ? "Ogłoszenie zatwierdzone" : "Ogłoszenie odrzucone")
            }
            router.refresh()
        } catch {
            toast.error("Błąd operacji")
        } finally {
            setLoading(null)
        }
    }

    const [showConfirm, setShowConfirm] = useState(false)

    return (
        <div className="flex items-center gap-2 flex-wrap mt-auto">
            {currentStatus !== "APPROVED" && (
                <button
                    onClick={() => action("approve")}
                    disabled={!!loading}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#00bf63] text-white text-[13px] font-semibold rounded-full hover:bg-[#00a855] transition-colors disabled:opacity-50"
                >
                    <Check size={14} />
                    {loading === "approve" ? "..." : "Zatwierdź"}
                </button>
            )}

            {currentStatus !== "REJECTED" && (
                <button
                    onClick={() => action("reject")}
                    disabled={!!loading}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white text-[#6e6e73] border border-[#d2d2d7] text-[13px] font-semibold rounded-full hover:border-red-400 hover:text-red-500 transition-colors disabled:opacity-50"
                >
                    <X size={14} />
                    {loading === "reject" ? "..." : "Odrzuć"}
                </button>
            )}

            {!showConfirm ? (
                <button
                    onClick={() => setShowConfirm(true)}
                    disabled={!!loading}
                    className="flex items-center gap-1.5 px-4 py-2 text-red-500 border border-red-200 bg-red-50 text-[13px] font-semibold rounded-full hover:bg-red-100 transition-colors disabled:opacity-50 ml-auto"
                >
                    <Trash2 size={13} />
                    Usuń
                </button>
            ) : (
                <div className="flex items-center gap-2 ml-auto">
                    <span className="text-[12px] text-[#6e6e73]">Na pewno?</span>
                    <button
                        onClick={() => action("delete")}
                        disabled={!!loading}
                        className="px-3 py-1.5 bg-red-500 text-white text-[12px] font-semibold rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                        {loading === "delete" ? "..." : "Tak, usuń"}
                    </button>
                    <button
                        onClick={() => setShowConfirm(false)}
                        className="px-3 py-1.5 border border-[#d2d2d7] text-[12px] font-semibold rounded-full hover:bg-[#f5f5f7] transition-colors"
                    >
                        Anuluj
                    </button>
                </div>
            )}
        </div>
    )
}
