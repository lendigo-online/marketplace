import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import crypto from "crypto"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { rateLimit, getClientIp, rateLimitResponse } from "@/lib/rateLimit"

const schema = z.object({
    email: z.string().email().max(254),
    code: z.string().length(6),
    password: z.string().min(8).max(128),
})

function timingSafeEqual(a: string, b: string) {
    const bufA = Buffer.from(a)
    const bufB = Buffer.from(b)
    if (bufA.length !== bufB.length) return false
    return crypto.timingSafeEqual(bufA, bufB)
}

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => null)
        const parsed = schema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json({ error: "Nieprawidłowe dane" }, { status: 400 })
        }

        const email = parsed.data.email.toLowerCase().trim()
        const { code, password } = parsed.data

        const ip = getClientIp()
        const ipLimit = await rateLimit({ key: `reset-password:ip:${ip}`, limit: 20, windowSeconds: 3600 })
        if (!ipLimit.ok) return rateLimitResponse(ipLimit.retryAfter)

        const emailLimit = await rateLimit({ key: `reset-password:email:${email}`, limit: 10, windowSeconds: 3600 })
        if (!emailLimit.ok) return rateLimitResponse(emailLimit.retryAfter)

        const verification = await prisma.emailVerification.findFirst({
            where: { email },
            orderBy: { createdAt: "desc" },
        })

        if (!verification) {
            return NextResponse.json({ error: "Wyślij najpierw kod do zmiany hasła" }, { status: 400 })
        }

        if (new Date() > verification.expiresAt) {
            await prisma.emailVerification.deleteMany({ where: { email } })
            return NextResponse.json({ error: "Kod wygasł. Wyślij nowy kod." }, { status: 400 })
        }

        if (!timingSafeEqual(verification.code, code)) {
            return NextResponse.json({ error: "Nieprawidłowy kod" }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        await prisma.user.update({
            where: { email },
            data: { hashedPassword },
        })

        await prisma.emailVerification.deleteMany({ where: { email } })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Błąd serwera" }, { status: 500 })
    }
}
