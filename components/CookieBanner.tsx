"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Cookie } from "lucide-react"

export default function CookieBanner() {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        if (!localStorage.getItem("cookie-consent")) {
            setVisible(true)
        }
    }, [])

    const accept = () => {
        localStorage.setItem("cookie-consent", "accepted")
        setVisible(false)
    }

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 40 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] w-[calc(100%-32px)] max-w-[640px]"
                >
                    <div className="bg-white/95 backdrop-blur-xl rounded-[20px] shadow-apple-xl border border-black/[0.07] px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-[#f5f5f7] flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Cookie size={15} className="text-[#1d1d1f]" />
                            </div>
                            <p className="text-[13px] text-[#6e6e73] leading-relaxed">
                                Używamy niezbędnych plików cookie do obsługi sesji. Korzystając z serwisu, akceptujesz naszą{" "}
                                <Link href="/polityka" className="text-[#1d1d1f] font-medium underline underline-offset-2 hover:text-[#0071e3] transition-colors">
                                    Politykę prywatności
                                </Link>
                                {" "}i{" "}
                                <Link href="/warunki" className="text-[#1d1d1f] font-medium underline underline-offset-2 hover:text-[#0071e3] transition-colors">
                                    Warunki korzystania
                                </Link>.
                            </p>
                        </div>
                        <button
                            onClick={accept}
                            className="flex-shrink-0 bg-[#1d1d1f] text-white text-[13px] font-semibold px-5 py-2.5 rounded-full hover:bg-black transition-colors whitespace-nowrap"
                        >
                            Rozumiem
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
