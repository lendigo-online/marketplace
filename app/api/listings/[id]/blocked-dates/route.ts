import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function PUT(
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
        const { blockedDates } = body

        if (!Array.isArray(blockedDates)) {
            return new NextResponse("Invalid data", { status: 400 })
        }

        const isValidFormat = (d: string) => /^\d{4}-\d{2}-\d{2}$/.test(d)
        if (!blockedDates.every(isValidFormat)) {
            return new NextResponse("Invalid date format", { status: 400 })
        }

        const listing = await prisma.listing.findUnique({
            where: { id: params.id }
        })

        if (!listing) return new NextResponse("Not found", { status: 404 })

        if (listing.ownerId !== currentUser.id) {
            return new NextResponse("Forbidden", { status: 403 })
        }

        const updated = await prisma.listing.update({
            where: { id: params.id },
            data: { blockedDates }
        })

        return NextResponse.json({ blockedDates: updated.blockedDates })
    } catch (error) {
        console.error(error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
