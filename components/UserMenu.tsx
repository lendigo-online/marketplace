"use client"

import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Menu, Shield } from "lucide-react"
import { useCallback, useRef, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

export default function UserMenu() {
    const { data: session } = useSession()
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    const toggleOpen = useCallback(() => setIsOpen((prev) => !prev), [])

    const handleAction = (path: string) => {
        setIsOpen(false)
        router.push(path)
    }

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={toggleOpen}
                className="flex flex-row items-center gap-2 border border-[#d2d2d7] rounded-full px-2 py-1.5 bg-white hover:shadow-apple transition-all duration-200 cursor-pointer"
            >
                <Menu className="h-4 w-4 text-[#1d1d1f] ml-1" strokeWidth={1.5} />
                <div>
                    <Avatar className="h-7 w-7">
                        <AvatarImage src={session?.user?.image || undefined} />
                        <AvatarFallback className="bg-[#1d1d1f] text-white text-xs font-medium">
                            {session?.user?.name?.charAt(0).toUpperCase() || "G"}
                        </AvatarFallback>
                    </Avatar>
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: -8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: -8 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute right-0 top-12 w-56 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-apple-lg border border-black/[0.06] overflow-hidden z-50"
                    >
                        {session ? (
                            <>
                                <div className="px-4 pt-3 pb-2">
                                    <p className="text-[11px] text-[#6e6e73] font-medium uppercase tracking-wide">Konto</p>
                                    <p className="text-[13px] font-semibold text-[#1d1d1f] mt-0.5 truncate">{session.user?.name}</p>
                                </div>
                                <div className="h-px bg-black/[0.06] mx-3" />
                                <div className="py-1">
                                    {(session.user as any)?.role === "ADMIN" && (
                                        <button
                                            onClick={() => handleAction("/admin")}
                                            className="w-full text-left px-4 py-2.5 text-[13px] text-[#0071e3] font-semibold hover:bg-[#f0f7ff] transition-colors flex items-center gap-2"
                                        >
                                            <Shield size={13} />
                                            Panel admina
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleAction("/dashboard")}
                                        className="w-full text-left px-4 py-2.5 text-[13px] text-[#1d1d1f] font-medium hover:bg-[#f5f5f7] transition-colors"
                                    >
                                        Panel użytkownika
                                    </button>
                                    <button
                                        onClick={() => handleAction("/listings/create")}
                                        className="w-full text-left px-4 py-2.5 text-[13px] text-[#1d1d1f] font-medium hover:bg-[#f5f5f7] transition-colors"
                                    >
                                        Dodaj ogłoszenie
                                    </button>
                                </div>
                                <div className="h-px bg-black/[0.06] mx-3" />
                                <div className="py-1 pb-2">
                                    <button
                                        onClick={() => signOut()}
                                        className="w-full text-left px-4 py-2.5 text-[13px] text-red-500 font-medium hover:bg-[#f5f5f7] transition-colors"
                                    >
                                        Wyloguj się
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="py-1">
                                <button
                                    onClick={() => handleAction("/login")}
                                    className="w-full text-left px-4 py-3 text-[13px] text-[#1d1d1f] font-semibold hover:bg-[#f5f5f7] transition-colors"
                                >
                                    Zaloguj się
                                </button>
                                <button
                                    onClick={() => handleAction("/register")}
                                    className="w-full text-left px-4 py-3 text-[13px] text-[#1d1d1f] font-medium hover:bg-[#f5f5f7] transition-colors border-t border-black/[0.06]"
                                >
                                    Utwórz konto
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
