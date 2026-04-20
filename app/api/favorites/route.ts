import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { z } from "zod"
import { rateLimit, rateLimitResponse } from "@/lib/rateLimit"

const schema = z.object({
    listingId: z.string().min(1).max(128),
})

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email }
        })
        if (!currentUser) return new NextResponse("Unauthorized", { status: 401 })

        const userLimit = await rateLimit({ key: `favorites:user:${currentUser.id}`, limit: 60, windowSeconds: 60 })
        if (!userLimit.ok) return rateLimitResponse(userLimit.retryAfter)

        const body = await request.json().catch(() => null)
        const parsed = schema.safeParse(body)
        if (!parsed.success) return new NextResponse("Missing listingId", { status: 400 })

        const { listingId } = parsed.data

        const listing = await prisma.listing.findUnique({ where: { id: listingId }, select: { id: true } })
        if (!listing) return new NextResponse("Listing not found", { status: 404 })

        const existing = await prisma.favorite.findUnique({
            where: { userId_listingId: { userId: currentUser.id, listingId } }
        })

        if (existing) {
            await prisma.favorite.delete({
                where: { userId_listingId: { userId: currentUser.id, listingId } }
            })
            return NextResponse.json({ liked: false })
        } else {
            await prisma.favorite.create({
                data: { userId: currentUser.id, listingId }
            })
            return NextResponse.json({ liked: true })
        }
    } catch (error) {
        console.error(error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
