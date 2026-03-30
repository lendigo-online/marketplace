import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { z } from "zod"
import prisma from "@/lib/prisma"

const schema = z.object({
    email: z.string().email(),
    name: z.string().min(2).max(64),
    password: z.string().min(8).max(128),
    code: z.string().length(6),
})

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const parsed = schema.safeParse(body)

        if (!parsed.success) {
            return new NextResponse("Invalid input", { status: 400 })
        }

        const { email, name, password, code } = parsed.data

        const verification = await prisma.emailVerification.findFirst({
            where: { email },
            orderBy: { createdAt: "desc" },
        })

        if (!verification) {
            return NextResponse.json({ error: "Wyślij najpierw kod weryfikacyjny" }, { status: 400 })
        }

        if (new Date() > verification.expiresAt) {
            await prisma.emailVerification.deleteMany({ where: { email } })
            return NextResponse.json({ error: "Kod wygasł. Wyślij nowy kod." }, { status: 400 })
        }

        if (verification.code !== code) {
            return NextResponse.json({ error: "Nieprawidłowy kod weryfikacyjny" }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        const user = await prisma.user.create({
            data: { email, name, hashedPassword },
            select: { id: true, email: true, name: true, createdAt: true }
        })

        await prisma.emailVerification.deleteMany({ where: { email } })

        return NextResponse.json(user)
    } catch (error: any) {
        if (error?.code === "P2002") {
            return new NextResponse("Email already in use", { status: 409 })
        }
        console.error(error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
