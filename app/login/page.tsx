"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import toast from "react-hot-toast"
import { motion } from "framer-motion"

export default function LoginPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        signIn("credentials", {
            email,
            password,
            redirect: false,
        }).then((callback) => {
            setIsLoading(false)

            if (callback?.ok) {
                toast.success("Zalogowano pomyślnie")
                router.push("/")
                router.refresh()
            }

            if (callback?.error) {
                toast.error("Nieprawidłowy email lub hasło")
            }
        })
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
                    <form onSubmit={onSubmit} className="flex flex-col gap-3">
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
                                placeholder="••••••••"
                                required
                                disabled={isLoading}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="apple-input"
                            />
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
