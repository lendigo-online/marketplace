"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import toast from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"

function FieldError({ msg }: { msg: string }) {
    return (
        <AnimatePresence>
            {msg && (
                <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="text-[12px] text-red-500 mt-1 flex items-center gap-1"
                >
                    <span className="inline-block w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0">!</span>
                    {msg}
                </motion.p>
            )}
        </AnimatePresence>
    )
}

export default function RegisterPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [accepted, setAccepted] = useState(false)
    const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; accepted?: string }>({})

    const validate = () => {
        const e: typeof errors = {}
        if (!name.trim() || name.trim().length < 2) e.name = "Imię i nazwisko musi mieć co najmniej 2 znaki"
        if (!email.trim()) e.email = "Adres email jest wymagany"
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Wpisz poprawny adres email"
        if (!password) e.password = "Hasło jest wymagane"
        else if (password.length < 8) e.password = "Hasło musi mieć co najmniej 8 znaków"
        if (!accepted) e.accepted = "Musisz zaakceptować warunki korzystania"
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return
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
                const data = await response.json().catch(() => ({}))
                toast.error(data.error || "Coś poszło nie tak")
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
                    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3">
                        <div>
                            <label className="text-[12px] font-semibold text-[#6e6e73] uppercase tracking-wide mb-1.5 block">
                                Imię i nazwisko
                            </label>
                            <input
                                id="name"
                                placeholder="Jan Kowalski"
                                disabled={isLoading}
                                value={name}
                                onChange={(e) => { setName(e.target.value); setErrors(p => ({ ...p, name: undefined })) }}
                                className={`apple-input ${errors.name ? "border-red-400" : ""}`}
                            />
                            <FieldError msg={errors.name || ""} />
                        </div>

                        <div>
                            <label className="text-[12px] font-semibold text-[#6e6e73] uppercase tracking-wide mb-1.5 block">
                                Adres email
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="ty@example.com"
                                disabled={isLoading}
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })) }}
                                className={`apple-input ${errors.email ? "border-red-400" : ""}`}
                            />
                            <FieldError msg={errors.email || ""} />
                        </div>

                        <div>
                            <label className="text-[12px] font-semibold text-[#6e6e73] uppercase tracking-wide mb-1.5 block">
                                Hasło
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Minimum 8 znaków"
                                disabled={isLoading}
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })) }}
                                className={`apple-input ${errors.password ? "border-red-400" : ""}`}
                            />
                            <FieldError msg={errors.password || ""} />
                        </div>

                        {/* Terms checkbox */}
                        <div className="mt-1">
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={accepted}
                                    onChange={e => { setAccepted(e.target.checked); setErrors(p => ({ ...p, accepted: undefined })) }}
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
                            <FieldError msg={errors.accepted || ""} />
                        </div>

                        <button
                            disabled={isLoading}
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
