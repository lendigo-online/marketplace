"use client"

import { useEffect, useRef, useState } from "react"
import { Bell, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { pl } from "date-fns/locale"

type Notification = {
    id: string
    type: string
    title: string
    message: string
    link: string | null
    read: boolean
    createdAt: string
}

export default function NotificationBell() {
    const { status } = useSession()
    const [open, setOpen] = useState(false)
    const [items, setItems] = useState<Notification[]>([])
    const [unread, setUnread] = useState(0)
    const [loading, setLoading] = useState(false)
    const wrapRef = useRef<HTMLDivElement>(null)

    const fetchNotifications = async () => {
        if (status !== "authenticated") return
        try {
            const res = await fetch("/api/notifications", { cache: "no-store" })
            if (!res.ok) return
            const data = await res.json()
            setItems(data.items ?? [])
            setUnread(data.unreadCount ?? 0)
        } catch {}
    }

    useEffect(() => {
        if (status !== "authenticated") return
        fetchNotifications()
        const id = setInterval(fetchNotifications, 45000)
        return () => clearInterval(id)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status])

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [])

    const markAllRead = async () => {
        if (unread === 0) return
        setLoading(true)
        try {
            await fetch("/api/notifications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ all: true })
            })
            setItems(prev => prev.map(n => ({ ...n, read: true })))
            setUnread(0)
        } finally {
            setLoading(false)
        }
    }

    const markOneRead = async (id: string) => {
        setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
        setUnread(u => Math.max(0, u - 1))
        try {
            await fetch("/api/notifications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            })
        } catch {}
    }

    if (status !== "authenticated") return null

    return (
        <div className="relative" ref={wrapRef}>
            <button
                onClick={() => {
                    setOpen(v => !v)
                    if (!open) fetchNotifications()
                }}
                className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"
                aria-label="Powiadomienia"
            >
                <Bell size={18} className="text-[#1d1d1f]" />
                {unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-1 bg-[#ff3b30] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unread > 9 ? "9+" : unread}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-[44px] right-0 z-[100] w-[360px] max-w-[calc(100vw-24px)] bg-white rounded-[16px] shadow-2xl border border-black/[0.08] overflow-hidden"
                    >
                        <div className="flex items-center justify-between px-4 py-3 border-b border-black/[0.06]">
                            <h3 className="text-[14px] font-semibold text-[#1d1d1f]">Powiadomienia</h3>
                            {unread > 0 && (
                                <button
                                    onClick={markAllRead}
                                    disabled={loading}
                                    className="text-[12px] text-[#0071e3] hover:underline disabled:opacity-50"
                                >
                                    Oznacz wszystkie jako przeczytane
                                </button>
                            )}
                        </div>

                        <div className="max-h-[420px] overflow-y-auto">
                            {items.length === 0 ? (
                                <div className="px-4 py-10 text-center">
                                    <div className="w-12 h-12 bg-[#f5f5f7] rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Bell size={18} className="text-[#6e6e73]" />
                                    </div>
                                    <p className="text-[13px] text-[#6e6e73]">Brak powiadomień</p>
                                </div>
                            ) : (
                                items.map(n => {
                                    const content = (
                                        <div className={`flex items-start gap-3 px-4 py-3 border-b border-black/[0.04] last:border-0 transition-colors ${n.read ? "bg-white" : "bg-[#f0f7ff]"} hover:bg-[#f5f5f7] cursor-pointer`}>
                                            {!n.read && (
                                                <span className="mt-2 w-2 h-2 bg-[#0071e3] rounded-full flex-shrink-0" />
                                            )}
                                            <div className={`flex-1 min-w-0 ${n.read ? "pl-5" : ""}`}>
                                                <p className="text-[13px] font-semibold text-[#1d1d1f]">{n.title}</p>
                                                <p className="text-[12px] text-[#6e6e73] mt-0.5">{n.message}</p>
                                                <p className="text-[11px] text-[#a1a1a6] mt-1">
                                                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: pl })}
                                                </p>
                                            </div>
                                            {!n.read && (
                                                <button
                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); markOneRead(n.id) }}
                                                    className="text-[#6e6e73] hover:text-[#1d1d1f] mt-1"
                                                    aria-label="Oznacz jako przeczytane"
                                                >
                                                    <Check size={14} />
                                                </button>
                                            )}
                                        </div>
                                    )
                                    return n.link ? (
                                        <Link key={n.id} href={n.link} onClick={() => { setOpen(false); if (!n.read) markOneRead(n.id) }}>
                                            {content}
                                        </Link>
                                    ) : (
                                        <div key={n.id} onClick={() => { if (!n.read) markOneRead(n.id) }}>
                                            {content}
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
