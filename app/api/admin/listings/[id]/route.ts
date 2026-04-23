import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { createNotification } from "@/lib/notifications"

async function getAdmin() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return null
    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user || user.role !== "ADMIN") return null
    return user
}

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    if (!await getAdmin()) return new NextResponse("Forbidden", { status: 403 })

    const { status } = await request.json()
    if (!["APPROVED", "REJECTED"].includes(status)) {
        return new NextResponse("Invalid status", { status: 400 })
    }

    const listing = await prisma.listing.update({
        where: { id: params.id },
        data: { status }
    })

    if (status === "APPROVED") {
        await createNotification({
            userId: listing.ownerId,
            type: "LISTING_APPROVED",
            title: "Ogłoszenie zatwierdzone",
            message: `Twoje ogłoszenie "${listing.title}" jest już widoczne dla wszystkich.`,
            link: `/listings/${listing.id}`,
        })
    } else {
        await createNotification({
            userId: listing.ownerId,
            type: "LISTING_REJECTED",
            title: "Ogłoszenie odrzucone",
            message: `Twoje ogłoszenie "${listing.title}" nie zostało zaakceptowane.`,
            link: "/dashboard",
        })
    }

    return NextResponse.json(listing)
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    if (!await getAdmin()) return new NextResponse("Forbidden", { status: 403 })

    await prisma.listing.delete({ where: { id: params.id } })

    return NextResponse.json({ success: true })
}
