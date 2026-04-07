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

        const listing = await prisma.listing.findUnique({ where: { id: params.id } })
        if (!listing) return new NextResponse("Not found", { status: 404 })
        if (listing.ownerId !== currentUser.id) return new NextResponse("Forbidden", { status: 403 })

        const { discountRules } = await request.json()
        if (!Array.isArray(discountRules)) {
            return new NextResponse("Invalid data", { status: 400 })
        }

        const updated = await prisma.listing.update({
            where: { id: params.id },
            data: { discountRules }
        })

        return NextResponse.json({ discountRules: updated.discountRules })
    } catch (error) {
        console.error(error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
