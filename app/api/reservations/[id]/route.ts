import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
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
        const { status } = body

        if (!["CONFIRMED", "CANCELLED"].includes(status)) {
            return new NextResponse("Invalid status", { status: 400 })
        }

        const reservation = await prisma.reservation.findUnique({
            where: { id: params.id },
            include: { listing: true }
        })

        if (!reservation) return new NextResponse("Not found", { status: 404 })

        if (reservation.listing.ownerId !== currentUser.id) {
            return new NextResponse("Forbidden", { status: 403 })
        }

        if (reservation.status !== "PENDING") {
            return new NextResponse("Reservation is not pending", { status: 409 })
        }

        const updated = await prisma.reservation.update({
            where: { id: params.id },
            data: { status }
        })

        return NextResponse.json(updated)
    } catch (error) {
        console.error(error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
