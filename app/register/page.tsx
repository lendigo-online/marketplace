"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import toast from "react-hot-toast"
import { motion } from "framer-motion"

export default function RegisterPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [accepted, setAccepted] = useState(false)

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            })

            if (response.ok) {
                toast.success("Konto zostało utworzone! Zaloguj się.")
                router.push("/login")
            } else {
                toast.error("Coś poszło nie tak")
            }
        } catch (error) {
            toast.error("Coś poszło nie tak")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-[85vh] flex items-center justify-center px-6 bg-[#fbfbfd]">
            <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-[400px]"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="text-[22px] font-semibold tracking-tight text-[#1d1d1f] mb-1">
                        Lend<span className="text-[#6e6e73] font-light">igo</span>
                    </div>
                    <h1 className="text-[28px] font-bold tracking-tight text-[#1d1d1f]">
                        Utwórz konto
                    </h1>
                    <p className="text-[14px] text-[#6e6e73] mt-1">
                        Dołącz do tysięcy użytkowników Lendigo
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-[28px] shadow-apple-lg border border-black/[0.04] p-8">
                    <form onSubmit={onSubmit} className="flex flex-col gap-3">
                        <div>
                            <label className="text-[12px] font-semibold text-[#6e6e73] uppercase tracking-wide mb-1.5 block">
                                Imię i nazwisko
                            </label>
                            <input
                                id="name"
                                placeholder="Jan Kowalski"
                                required
                                disabled={isLoading}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="apple-input"
                            />
                        </div>

                        <div>
                            <label className="text-[12px] font-semibold text-[#6e6e73] uppercase tracking-wide mb-1.5 block">
                                Adres email
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="ty@example.com"
                                required
                                disabled={isLoading}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="apple-input"
                            />
                        </div>

                        <div>
                            <label className="text-[12px] font-semibold text-[#6e6e73] uppercase tracking-wide mb-1.5 block">
                                Hasło
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Minimum 8 znaków"
                                required
                                disabled={isLoading}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="apple-input"
                            />
                        </div>

                        {/* Terms checkbox */}
                        <label className="flex items-start gap-3 cursor-pointer mt-1">
                            <input
                                type="checkbox"
                                required
                                checked={accepted}
                                onChange={e => setAccepted(e.target.checked)}
                                className="mt-0.5 w-4 h-4 accent-[#1d1d1f] flex-shrink-0 cursor-pointer"
                            />
                            <span className="text-[12px] text-[#6e6e73] leading-relaxed">
                                Akceptuję{" "}
                                <Link href="/warunki" target="_blank" className="text-[#0071e3] hover:underline font-medium">
                                    Warunki korzystania
                                </Link>{" "}
                                oraz{" "}
                                <Link href="/polityka" target="_blank" className="text-[#0071e3] hover:underline font-medium">
                                    Politykę prywatności
                                </Link>
                            </span>
                        </label>

                        <button
                            disabled={isLoading || !accepted}
                            type="submit"
                            className="btn-apple-primary w-full mt-3 py-3.5 text-[15px] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Tworzenie konta..." : "Utwórz konto"}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-[13px] text-[#6e6e73] mt-5">
                    Masz już konto?{" "}
                    <Link href="/login" className="text-[#0071e3] font-semibold hover:underline">
                        Zaloguj się
                    </Link>
                </p>
            </motion.div>
        </div>
    )
}
