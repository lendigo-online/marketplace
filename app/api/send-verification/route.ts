import { NextResponse } from "next/server"
import { Resend } from "resend"
import crypto from "crypto"
import prisma from "@/lib/prisma"
import { buildVerificationEmail } from "@/emails/verification"
import { rateLimit, getClientIp, rateLimitResponse } from "@/lib/rateLimit"

const resend = new Resend(process.env.RESEND_API_KEY)

function generateCode() {
    return crypto.randomInt(100000, 1000000).toString()
}

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => null)
        const email = typeof body?.email === "string" ? body.email.toLowerCase().trim() : ""

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
            return NextResponse.json({ error: "Nieprawidłowy adres email" }, { status: 400 })
        }

        const ip = getClientIp()
        const ipLimit = await rateLimit({ key: `send-verification:ip:${ip}`, limit: 10, windowSeconds: 3600 })
        if (!ipLimit.ok) return rateLimitResponse(ipLimit.retryAfter)

        const emailLimit = await rateLimit({ key: `send-verification:email:${email}`, limit: 5, windowSeconds: 3600 })
        if (!emailLimit.ok) return rateLimitResponse(emailLimit.retryAfter)

        const existing = await prisma.user.findUnique({ where: { email } })
        if (existing) {
            return NextResponse.json({ error: "Ten adres email jest już zajęty" }, { status: 409 })
        }

        const code = generateCode()
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

        await prisma.emailVerification.deleteMany({ where: { email } })
        await prisma.emailVerification.create({ data: { email, code, expiresAt } })

        await resend.emails.send({
            from: process.env.RESEND_FROM!,
            to: email,
            subject: "Kod weryfikacyjny Lendigo",
            html: buildVerificationEmail(code),
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Błąd wysyłania emaila" }, { status: 500 })
    }
}
