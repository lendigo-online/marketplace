import { NextResponse } from "next/server"
import { Resend } from "resend"
import prisma from "@/lib/prisma"
import { buildVerificationEmail } from "@/emails/verification"

const resend = new Resend(process.env.RESEND_API_KEY)

function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: Request) {
    try {
        const { email } = await request.json()

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json({ error: "Nieprawidłowy adres email" }, { status: 400 })
        }

        const existing = await prisma.user.findUnique({ where: { email } })
        if (existing) {
            return NextResponse.json({ error: "Ten adres email jest już zajęty" }, { status: 409 })
        }

        const code = generateCode()
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minut

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
