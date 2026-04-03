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

export default function ForgotPasswordPage() {
    const router = useRouter()
    const [step, setStep] = useState<1 | 2 | 3>(1)
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [code, setCode] = useState(["", "", "", "", "", ""])
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [errors, setErrors] = useState<{ email?: string; code?: string; password?: string; confirmPassword?: string }>({})
    const [resendCooldown, setResendCooldown] = useState(0)
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    const startCooldown = () => {
        setResendCooldown(60)
        const interval = setInterval(() => {
            setResendCooldown(v => {
                if (v <= 1) { clearInterval(interval); return 0 }
                return v - 1
            })
        }, 1000)
    }

    // Step 1: send reset code
    const sendCode = async (e: React.FormEvent) => {
        e.preventDefault()
        const newErrors: typeof errors = {}
        if (!email.trim()) newErrors.email = "Adres email jest wymagany"
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Wpisz poprawny adres email"
        if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }

        setIsLoading(true)
        try {
            const res = await fetch("/api/send-reset-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })
            const data = await res.json().catch(() => ({}))
            if (!res.ok) {
                if (res.status === 404) setErrors(p => ({ ...p, email: data.error || "Nie znaleziono konta" }))
                else toast.error(data.error || "Błąd wysyłania kodu")
                return
            }
            setStep(2)
            toast.success(`Kod wysłany na ${email}`)
            startCooldown()
        } catch {
            toast.error("Coś poszło nie tak")
        } finally {
            setIsLoading(false)
        }
    }

    const resendCode = async () => {
        if (resendCooldown > 0) return
        setIsLoading(true)
        try {
            const res = await fetch("/api/send-reset-code", {
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

    // Step 2: verify code and proceed to step 3
    const verifyCode = (e: React.FormEvent) => {
        e.preventDefault()
        const fullCode = code.join("")
        if (fullCode.length < 6) {
            setErrors(p => ({ ...p, code: "Wpisz 6-cyfrowy kod" }))
            return
        }
        setStep(3)
    }

    // Step 3: set new password
    const resetPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        const newErrors: typeof errors = {}
        if (!password) newErrors.password = "Hasło jest wymagane"
        else if (password.length < 8) newErrors.password = "Hasło musi mieć co najmniej 8 znaków"
        if (!confirmPassword) newErrors.confirmPassword = "Potwierdź nowe hasło"
        else if (password !== confirmPassword) newErrors.confirmPassword = "Hasła nie są identyczne"
        if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }

        setIsLoading(true)
        try {
            const res = await fetch("/api/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code: code.join(""), password }),
            })
            const data = await res.json().catch(() => ({}))
            if (!res.ok) {
                if (data.error?.toLowerCase().includes("kod")) {
                    setErrors(p => ({ ...p, code: data.error }))
                    setStep(2)
                } else {
                    toast.error(data.error || "Błąd zmiany hasła")
                }
                return
            }
            toast.success("Hasło zostało zmienione! Zaloguj się.")
            router.push("/login")
        } catch {
            toast.error("Coś poszło nie tak")
        } finally {
            setIsLoading(false)
        }
    }

    const stepTitles = {
        1: "Resetuj hasło",
        2: "Wpisz kod",
        3: "Nowe hasło",
    }
    const stepDescriptions = {
        1: "Podaj email przypisany do konta",
        2: `Wpisz kod wysłany na ${email}`,
        3: "Ustaw nowe hasło do konta",
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
                        {stepTitles[step]}
                    </h1>
                    <p className="text-[14px] text-[#6e6e73] mt-1">
                        {stepDescriptions[step]}
                    </p>
                </div>

                {/* Step dots */}
                <div className="flex items-center justify-center gap-2 mb-6">
                    {([1, 2, 3] as const).map(s => (
                        <div
                            key={s}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                s === step ? "w-6 bg-[#0071e3]" : s < step ? "w-4 bg-[#0071e3]/40" : "w-4 bg-[#d2d2d7]"
                            }`}
                        />
                    ))}
                </div>

                <div className="bg-white rounded-[28px] shadow-apple-lg border border-black/[0.04] p-8">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.form
                                key="step1"
                                initial={{ opacity: 0, x: -16 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -16 }}
                                transition={{ duration: 0.2 }}
                                onSubmit={sendCode}
                                noValidate
                                className="flex flex-col gap-3"
                            >
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
                                        className={`apple-input ${errors.email ? "border-red-400 focus:border-red-400" : ""}`}
                                    />
                                    <FieldError msg={errors.email || ""} />
                                </div>

                                <button
                                    disabled={isLoading}
                                    type="submit"
                                    className="btn-apple-primary w-full mt-3 py-3.5 text-[15px] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? "Wysyłanie kodu..." : "Wyślij kod"}
                                </button>
                            </motion.form>
                        )}

                        {step === 2 && (
                            <motion.form
                                key="step2"
                                initial={{ opacity: 0, x: 16 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -16 }}
                                transition={{ duration: 0.2 }}
                                onSubmit={verifyCode}
                                className="flex flex-col gap-4"
                            >
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
                                    Dalej
                                </button>

                                <div className="flex items-center justify-between text-[13px]">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="text-[#6e6e73] hover:text-[#1d1d1f] transition-colors"
                                    >
                                        ← Zmień email
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

                        {step === 3 && (
                            <motion.form
                                key="step3"
                                initial={{ opacity: 0, x: 16 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 16 }}
                                transition={{ duration: 0.2 }}
                                onSubmit={resetPassword}
                                noValidate
                                className="flex flex-col gap-3"
                            >
                                <div>
                                    <label className="text-[12px] font-semibold text-[#6e6e73] uppercase tracking-wide mb-1.5 block">
                                        Nowe hasło
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="Minimum 8 znaków"
                                        disabled={isLoading}
                                        value={password}
                                        onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })) }}
                                        className={`apple-input ${errors.password ? "border-red-400 focus:border-red-400" : ""}`}
                                    />
                                    <FieldError msg={errors.password || ""} />
                                </div>

                                <div>
                                    <label className="text-[12px] font-semibold text-[#6e6e73] uppercase tracking-wide mb-1.5 block">
                                        Potwierdź nowe hasło
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="Powtórz hasło"
                                        disabled={isLoading}
                                        value={confirmPassword}
                                        onChange={e => { setConfirmPassword(e.target.value); setErrors(p => ({ ...p, confirmPassword: undefined })) }}
                                        className={`apple-input ${errors.confirmPassword ? "border-red-400 focus:border-red-400" : ""}`}
                                    />
                                    <FieldError msg={errors.confirmPassword || ""} />
                                </div>

                                <button
                                    disabled={isLoading}
                                    type="submit"
                                    className="btn-apple-primary w-full mt-3 py-3.5 text-[15px] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? "Zapisywanie..." : "Zmień hasło"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="text-[13px] text-[#6e6e73] hover:text-[#1d1d1f] transition-colors text-left"
                                >
                                    ← Wróć do kodu
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>

                <p className="text-center text-[13px] text-[#6e6e73] mt-5">
                    Pamiętasz hasło?{" "}
                    <Link href="/login" className="text-[#0071e3] font-semibold hover:underline">
                        Zaloguj się
                    </Link>
                </p>
            </motion.div>
        </div>
    )
}
