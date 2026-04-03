"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
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

export default function LoginPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

    const validate = () => {
        const e: { email?: string; password?: string } = {}
        if (!email.trim()) e.email = "Adres email jest wymagany"
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Wpisz poprawny adres email"
        if (!password) e.password = "Hasło jest wymagane"
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return
        setIsLoading(true)

        const callback = await signIn("credentials", {
            email,
            password,
            redirect: false,
        })
        setIsLoading(false)
        if (callback?.ok) {
            toast.success("Zalogowano pomyślnie")
            router.push("/")
            router.refresh()
        }
        if (callback?.error) {
            try {
                const res = await fetch(`/api/check-email?email=${encodeURIComponent(email)}`)
                const { exists } = await res.json()
                if (!exists) {
                    router.push(`/register?email=${encodeURIComponent(email)}`)
                } else {
                    toast.error("Nieprawidłowy email lub hasło")
                }
            } catch {
                toast.error("Nieprawidłowy email lub hasło")
            }
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
                        Zaloguj się
                    </h1>
                    <p className="text-[14px] text-[#6e6e73] mt-1">
                        Wpisz swoje dane, aby kontynuować
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-[28px] shadow-apple-lg border border-black/[0.04] p-8">
                    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3">
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
                                className={`apple-input ${errors.email ? "border-red-400 focus:border-red-400" : ""}`}
                            />
                            <FieldError msg={errors.email || ""} />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="text-[12px] font-semibold text-[#6e6e73] uppercase tracking-wide">
                                    Hasło
                                </label>
                                <Link href="/forgot-password" className="text-[12px] text-[#0071e3] hover:underline">
                                    Zapomniałem hasła
                                </Link>
                            </div>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                disabled={isLoading}
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })) }}
                                className={`apple-input ${errors.password ? "border-red-400 focus:border-red-400" : ""}`}
                            />
                            <FieldError msg={errors.password || ""} />
                        </div>

                        <button
                            disabled={isLoading}
                            type="submit"
                            className="btn-apple-primary w-full mt-3 py-3.5 text-[15px] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Logowanie..." : "Kontynuuj"}
                        </button>
                    </form>
                </div>

                {/* Footer link */}
                <p className="text-center text-[13px] text-[#6e6e73] mt-5">
                    Nie masz konta?{" "}
                    <Link href="/register" className="text-[#0071e3] font-semibold hover:underline">
                        Zarejestruj się
                    </Link>
                </p>
            </motion.div>
        </div>
    )
}
