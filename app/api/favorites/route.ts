import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// POST /api/favorites — toggle (add or remove)
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

        const { listingId } = await request.json()
        if (!listingId) return new NextResponse("Missing listingId", { status: 400 })

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
