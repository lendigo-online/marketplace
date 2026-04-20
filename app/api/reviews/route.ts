import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { z } from "zod"
import { rateLimit, getClientIp, rateLimitResponse } from "@/lib/rateLimit"

const schema = z.object({
    listingId: z.string().min(1).max(128),
    rating: z.coerce.number().int().min(1).max(5),
    comment: z.string().min(3).max(2000),
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

        const ip = getClientIp()
        const ipLimit = await rateLimit({ key: `reviews:ip:${ip}`, limit: 20, windowSeconds: 3600 })
        if (!ipLimit.ok) return rateLimitResponse(ipLimit.retryAfter)

        const userLimit = await rateLimit({ key: `reviews:user:${currentUser.id}`, limit: 10, windowSeconds: 3600 })
        if (!userLimit.ok) return rateLimitResponse(userLimit.retryAfter)

        const body = await request.json().catch(() => null)
        const parsed = schema.safeParse(body)
        if (!parsed.success) {
            return new NextResponse("Invalid input", { status: 400 })
        }

        const { listingId, rating, comment } = parsed.data

        const reservation = await prisma.reservation.findFirst({
            where: {
                userId: currentUser.id,
                listingId,
                status: "CONFIRMED",
                endDate: { lt: new Date() },
            },
            select: { id: true }
        })

        if (!reservation) {
            return new NextResponse("You can only review items you have rented", { status: 403 })
        }

        const existing = await prisma.review.findFirst({
            where: { userId: currentUser.id, listingId },
            select: { id: true }
        })

        if (existing) {
            return new NextResponse("Already reviewed", { status: 409 })
        }

        const review = await prisma.review.create({
            data: {
                userId: currentUser.id,
                listingId,
                rating,
                comment,
            }
        })

        return NextResponse.json(review)
    } catch (error) {
        console.error(error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
