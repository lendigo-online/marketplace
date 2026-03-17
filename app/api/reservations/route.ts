import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

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
        const { listingId, startDate, endDate, totalPrice } = body

        if (!listingId || !startDate || !endDate || !totalPrice) {
            return new NextResponse("Missing criteria", { status: 400 })
        }

        const listingAndReservation = await prisma.listing.update({
            where: { id: listingId },
            data: {
                reservations: {
                    create: {
                        userId: currentUser.id,
                        startDate,
                        endDate,
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
