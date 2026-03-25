"use client"

import { useState } from "react"
import { Phone, Globe, Pencil, Check, X } from "lucide-react"
import toast from "react-hot-toast"

interface Props {
    initialPhone: string | null
    initialWebsite: string | null
}

export default function ProfileEditor({ initialPhone, initialWebsite }: Props) {
    const [editing, setEditing] = useState(false)
    const [phone, setPhone] = useState(initialPhone || "")
    const [website, setWebsite] = useState(initialWebsite || "")
    const [loading, setLoading] = useState(false)

    const save = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/user", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone, website }),
            })
            const data = await res.json()
            if (!res.ok) {
                toast.error(data.error || "Coś poszło nie tak")
                return
            }
            toast.success("Zapisano!")
            setEditing(false)
        } catch {
            toast.error("Coś poszło nie tak")
        } finally {
            setLoading(false)
        }
    }

    const cancel = () => {
        setPhone(initialPhone || "")
        setWebsite(initialWebsite || "")
        setEditing(false)
    }

    return (
        <div className="bg-white rounded-[24px] border border-black/[0.04] shadow-apple-sm p-6">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-[16px] font-bold text-[#1d1d1f]">Dane kontaktowe</h2>
                {!editing && (
                    <button
                        onClick={() => setEditing(true)}
                        className="flex items-center gap-1.5 text-[12px] font-medium text-[#6e6e73] hover:text-[#1d1d1f] transition-colors px-3 py-1.5 rounded-full hover:bg-[#f5f5f7]"
                    >
                        <Pencil size={13} />
                        Edytuj
                    </button>
                )}
            </div>

            <div className="flex flex-col gap-4">
                {/* Phone */}
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#f5f5f7] flex items-center justify-center flex-shrink-0">
                        <Phone size={15} className="text-[#6e6e73]" />
                    </div>
                    {editing ? (
                        <input
                            type="tel"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            placeholder="+48 000 000 000"
                            className="apple-input flex-1 text-[14px]"
                        />
                    ) : (
                        <span className="text-[14px] text-[#1d1d1f]">
                            {phone || <span className="text-[#6e6e73]">Brak numeru telefonu</span>}
                        </span>
                    )}
                </div>

                {/* Website */}
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#f5f5f7] flex items-center justify-center flex-shrink-0">
                        <Globe size={15} className="text-[#6e6e73]" />
                    </div>
                    {editing ? (
                        <input
                            type="url"
                            value={website}
                            onChange={e => setWebsite(e.target.value)}
                            placeholder="https://twoja-strona.pl"
                            className="apple-input flex-1 text-[14px]"
                        />
                    ) : (
                        <span className="text-[14px]">
                            {website
                                ? <a href={website} target="_blank" rel="noopener noreferrer" className="text-[#0071e3] hover:underline">{website}</a>
                                : <span className="text-[#6e6e73]">Brak strony internetowej</span>
                            }
                        </span>
                    )}
                </div>
            </div>

            {editing && (
                <div className="flex items-center gap-2 mt-5 pt-4 border-t border-black/[0.06]">
                    <button
                        onClick={save}
                        disabled={loading}
                        className="flex items-center gap-1.5 bg-[#1d1d1f] text-white text-[13px] font-semibold px-4 py-2 rounded-full hover:bg-black transition-colors disabled:opacity-50"
                    >
                        <Check size={13} />
                        {loading ? "Zapisywanie..." : "Zapisz"}
                    </button>
                    <button
                        onClick={cancel}
                        disabled={loading}
                        className="flex items-center gap-1.5 text-[13px] font-medium text-[#6e6e73] hover:text-[#1d1d1f] px-4 py-2 rounded-full hover:bg-[#f5f5f7] transition-colors"
                    >
                        <X size={13} />
                        Anuluj
                    </button>
                </div>
            )}
        </div>
    )
}
