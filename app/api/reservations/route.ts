import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { z } from "zod"

const schema = z.object({
    listingId: z.string().min(1),
    startDate: z.string().min(1),
    endDate: z.string().min(1),
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

        const body = await request.json()
        const parsed = schema.safeParse(body)
        if (!parsed.success) {
            return new NextResponse("Missing criteria", { status: 400 })
        }

        const { listingId, startDate, endDate } = parsed.data

        const start = new Date(startDate)
        const end = new Date(endDate)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return new NextResponse("Invalid dates", { status: 400 })
        }

        if (start < today) {
            return new NextResponse("Start date cannot be in the past", { status: 400 })
        }

        if (end <= start) {
            return new NextResponse("End date must be after start date", { status: 400 })
        }

        const listing = await prisma.listing.findUnique({
            where: { id: listingId },
            select: { id: true, pricePerDay: true, ownerId: true, status: true }
        })

        if (!listing) {
            return new NextResponse("Listing not found", { status: 404 })
        }

        if (listing.status !== "APPROVED") {
            return new NextResponse("Listing is not available", { status: 400 })
        }

        if (listing.ownerId === currentUser.id) {
            return new NextResponse("Cannot reserve your own listing", { status: 400 })
        }

        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
        const totalPrice = Math.round(listing.pricePerDay * days * 100) / 100

        const listingAndReservation = await prisma.listing.update({
            where: { id: listingId },
            data: {
                reservations: {
                    create: {
                        userId: currentUser.id,
                        startDate: start,
                        endDate: end,
                        totalPrice
                    }
                }
            }
        })

        return NextResponse.json(listingAndReservation)
    } catch (error) {
        console.error(error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
