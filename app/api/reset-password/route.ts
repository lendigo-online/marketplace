import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { z } from "zod"
import prisma from "@/lib/prisma"

const schema = z.object({
    email: z.string().email(),
    code: z.string().length(6),
    password: z.string().min(8).max(128),
})

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const parsed = schema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json({ error: "Nieprawidłowe dane" }, { status: 400 })
        }

        const { email, code, password } = parsed.data

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

        if (verification.code !== code) {
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
