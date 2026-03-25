import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { z } from "zod"
import prisma from "@/lib/prisma"

const schema = z.object({
    email: z.string().email(),
    name: z.string().min(2).max(64),
    password: z.string().min(8).max(128),
})

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const parsed = schema.safeParse(body)

        if (!parsed.success) {
            return new NextResponse("Invalid input", { status: 400 })
        }

        const { email, name, password } = parsed.data

        const hashedPassword = await bcrypt.hash(password, 12)

        const user = await prisma.user.create({
            data: { email, name, hashedPassword },
            select: { id: true, email: true, name: true, createdAt: true }
        })

        return NextResponse.json(user)
    } catch (error: any) {
        if (error?.code === 'P2002') {
            return new NextResponse("Email already in use", { status: 409 })
        }
        console.error(error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
