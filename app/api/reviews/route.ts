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
        const { listingId, rating, comment } = body

        if (!listingId || !rating || !comment) {
            return new NextResponse("Missing criteria", { status: 400 })
        }

        const parsedRating = parseInt(rating)
        if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
            return new NextResponse("Rating must be between 1 and 5", { status: 400 })
        }

        const review = await prisma.review.create({
            data: {
                userId: currentUser.id,
                listingId,
                rating: parsedRating,
                comment
            }
        })

        return NextResponse.json(review)
    } catch (error) {
        console.error(error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
