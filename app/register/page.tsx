"use client"

import { useState, useRef } from "react"
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
    const [step, setStep] = useState<"form" | "verify">("form")
    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [accepted, setAccepted] = useState(false)
    const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; accepted?: string; code?: string }>({})
    const [code, setCode] = useState(["", "", "", "", "", ""])
    const [resendCooldown, setResendCooldown] = useState(0)
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

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

    const sendCode = async () => {
        if (!validate()) return
        setIsLoading(true)
        try {
            const res = await fetch("/api/send-verification", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })
            const data = await res.json().catch(() => ({}))
            if (!res.ok) {
                if (res.status === 409) setErrors(p => ({ ...p, email: "Ten adres email jest już zajęty" }))
                else toast.error(data.error || "Błąd wysyłania kodu")
                return
            }
            setStep("verify")
            toast.success(`Kod wysłany na ${email}`)
            startCooldown()
        } catch {
            toast.error("Coś poszło nie tak")
        } finally {
            setIsLoading(false)
        }
    }

    const startCooldown = () => {
        setResendCooldown(60)
        const interval = setInterval(() => {
            setResendCooldown(v => {
                if (v <= 1) { clearInterval(interval); return 0 }
                return v - 1
            })
        }, 1000)
    }

    const resendCode = async () => {
        if (resendCooldown > 0) return
        setIsLoading(true)
        try {
            const res = await fetch("/api/send-verification", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })
            if (res.ok) {
                toast.success("Nowy kod wysłany")
                startCooldown()
                setCode(["", "", "", "", "", ""])
                inputRefs.current[0]?.focus()
            } else {
                const data = await res.json().catch(() => ({}))
                toast.error(data.error || "Błąd wysyłania kodu")
            }
        } catch {
            toast.error("Coś poszło nie tak")
        } finally {
            setIsLoading(false)
        }
    }

    const handleCodeInput = (index: number, value: string) => {
        const digit = value.replace(/\D/g, "").slice(-1)
        const newCode = [...code]
        newCode[index] = digit
        setCode(newCode)
        setErrors(p => ({ ...p, code: undefined }))
        if (digit && index < 5) inputRefs.current[index + 1]?.focus()
    }

    const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handleCodePaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
        if (!pasted) return
        const newCode = [...code]
        pasted.split("").forEach((d, i) => { newCode[i] = d })
        setCode(newCode)
        inputRefs.current[Math.min(pasted.length, 5)]?.focus()
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const fullCode = code.join("")
        if (fullCode.length < 6) {
            setErrors(p => ({ ...p, code: "Wpisz 6-cyfrowy kod" }))
            return
        }
        setIsLoading(true)
        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, code: fullCode }),
            })
            if (res.ok) {
                toast.success("Konto zostało utworzone! Zaloguj się.")
                router.push("/login")
            } else {
                const data = await res.json().catch(() => ({}))
                if (data.error?.includes("kod") || data.error?.includes("Kod")) {
                    setErrors(p => ({ ...p, code: data.error }))
                } else {
                    toast.error(data.error || "Coś poszło nie tak")
                }
            }
        } catch {
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
                        {step === "form" ? "Utwórz konto" : "Weryfikacja email"}
                    </h1>
                    <p className="text-[14px] text-[#6e6e73] mt-1">
                        {step === "form"
                            ? "Dołącz do tysięcy użytkowników Lendigo"
                            : `Wpisz kod wysłany na ${email}`}
                    </p>
                </div>

                <div className="bg-white rounded-[28px] shadow-apple-lg border border-black/[0.04] p-8">
                    <AnimatePresence mode="wait">
                        {step === "form" ? (
                            <motion.form
                                key="form"
                                initial={{ opacity: 0, x: -16 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -16 }}
                                transition={{ duration: 0.2 }}
                                onSubmit={e => { e.preventDefault(); sendCode() }}
                                noValidate
                                className="flex flex-col gap-3"
                            >
                                <div>
                                    <label className="text-[12px] font-semibold text-[#6e6e73] uppercase tracking-wide mb-1.5 block">
                                        Imię i nazwisko
                                    </label>
                                    <input
                                        placeholder="Jan Kowalski"
                                        disabled={isLoading}
                                        value={name}
                                        onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: undefined })) }}
                                        className={`apple-input ${errors.name ? "border-red-400" : ""}`}
                                    />
                                    <FieldError msg={errors.name || ""} />
                                </div>

                                <div>
                                    <label className="text-[12px] font-semibold text-[#6e6e73] uppercase tracking-wide mb-1.5 block">
                                        Adres email
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="ty@example.com"
                                        disabled={isLoading}
                                        value={email}
                                        onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })) }}
                                        className={`apple-input ${errors.email ? "border-red-400" : ""}`}
                                    />
                                    <FieldError msg={errors.email || ""} />
                                </div>

                                <div>
                                    <label className="text-[12px] font-semibold text-[#6e6e73] uppercase tracking-wide mb-1.5 block">
                                        Hasło
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="Minimum 8 znaków"
                                        disabled={isLoading}
                                        value={password}
                                        onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })) }}
                                        className={`apple-input ${errors.password ? "border-red-400" : ""}`}
                                    />
                                    <FieldError msg={errors.password || ""} />
                                </div>

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
                                    {isLoading ? "Wysyłanie kodu..." : "Wyślij kod weryfikacyjny"}
                                </button>
                            </motion.form>
                        ) : (
                            <motion.form
                                key="verify"
                                initial={{ opacity: 0, x: 16 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 16 }}
                                transition={{ duration: 0.2 }}
                                onSubmit={onSubmit}
                                className="flex flex-col gap-4"
                            >
                                {/* 6-digit code inputs */}
                                <div>
                                    <div className="flex gap-2 justify-center" onPaste={handleCodePaste}>
                                        {code.map((digit, i) => (
                                            <input
                                                key={i}
                                                ref={el => { inputRefs.current[i] = el }}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={1}
                                                value={digit}
                                                onChange={e => handleCodeInput(i, e.target.value)}
                                                onKeyDown={e => handleCodeKeyDown(i, e)}
                                                disabled={isLoading}
                                                className={`w-11 h-14 text-center text-[22px] font-bold border rounded-[12px] outline-none transition-colors bg-[#f5f5f7]
                                                    ${errors.code ? "border-red-400" : "border-[#d2d2d7] focus:border-[#1d1d1f]"}`}
                                            />
                                        ))}
                                    </div>
                                    <FieldError msg={errors.code || ""} />
                                </div>

                                <button
                                    disabled={isLoading}
                                    type="submit"
                                    className="btn-apple-primary w-full py-3.5 text-[15px] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? "Tworzenie konta..." : "Zweryfikuj i utwórz konto"}
                                </button>

                                <div className="flex items-center justify-between text-[13px]">
                                    <button
                                        type="button"
                                        onClick={() => setStep("form")}
                                        className="text-[#6e6e73] hover:text-[#1d1d1f] transition-colors"
                                    >
                                        ← Zmień dane
                                    </button>
                                    <button
                                        type="button"
                                        onClick={resendCode}
                                        disabled={resendCooldown > 0 || isLoading}
                                        className="text-[#0071e3] hover:underline disabled:opacity-40 disabled:no-underline disabled:cursor-not-allowed"
                                    >
                                        {resendCooldown > 0 ? `Wyślij ponownie (${resendCooldown}s)` : "Wyślij ponownie"}
                                    </button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>

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
