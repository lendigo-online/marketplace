import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { z } from "zod"

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
    })
    if (!user) return new NextResponse("Unauthorized", { status: 401 })

    const [items, unreadCount] = await Promise.all([
        prisma.notification.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
            take: 30,
        }),
        prisma.notification.count({
            where: { userId: user.id, read: false }
        })
    ])

    return NextResponse.json({ items, unreadCount })
}

const patchSchema = z.object({
    id: z.string().min(1).optional(),
    all: z.boolean().optional(),
}).refine(d => d.id || d.all, { message: "id or all required" })

export async function PATCH(request: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
    })
    if (!user) return new NextResponse("Unauthorized", { status: 401 })

    const body = await request.json().catch(() => null)
    const parsed = patchSchema.safeParse(body)
    if (!parsed.success) {
        return new NextResponse("Invalid body", { status: 400 })
    }

    if (parsed.data.all) {
        await prisma.notification.updateMany({
            where: { userId: user.id, read: false },
            data: { read: true }
        })
    } else if (parsed.data.id) {
        await prisma.notification.updateMany({
            where: { id: parsed.data.id, userId: user.id },
            data: { read: true }
        })
    }

    return NextResponse.json({ success: true })
}
