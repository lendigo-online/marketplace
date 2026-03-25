import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { z } from "zod"

const schema = z.object({
    phone: z.string().max(20).optional().or(z.literal("")),
    website: z.string().url("Nieprawidłowy adres URL").max(200).optional().or(z.literal("")),
})

export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
    }

    const { phone, website } = parsed.data

    await prisma.$executeRaw`
        UPDATE "User"
        SET phone = ${phone || null}, website = ${website || null}
        WHERE email = ${session.user.email}
    `

    return NextResponse.json({ ok: true })
}
