import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(
    request: Request
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
        const {
            title,
            description,
            pricePerDay,
            location,
            images,
            category
        } = body

        if (!title || !description || !pricePerDay || !location || !category) {
            return new NextResponse("Missing criteria", { status: 400 })
        }

        const listing = await prisma.listing.create({
            data: {
                title,
                description,
                pricePerDay: parseFloat(pricePerDay),
                location,
                images: images || [],
                category,
                ownerId: currentUser.id
            }
        })

        return NextResponse.json(listing)
    } catch (error) {
        console.error(error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
