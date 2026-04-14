import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { stripe } from "@/lib/stripe"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) return new NextResponse("Unauthorized", { status: 401 })

        const { listingId, startDate, endDate } = await request.json()

        if (!listingId || !startDate || !endDate) {
            return new NextResponse("Missing criteria", { status: 400 })
        }

        const start = new Date(startDate)
        const end = new Date(endDate)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return new NextResponse("Invalid dates", { status: 400 })
        }

        if (start < today || end <= start) {
            return new NextResponse("Invalid date range", { status: 400 })
        }

        const listing = await prisma.listing.findUnique({
            where: { id: listingId }
        })

        if (!listing) return new NextResponse("Listing not found", { status: 404 })

        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
        const totalPrice = listing.pricePerDay * days

        const stripeSession = await stripe.checkout.sessions.create({
            success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=1`,
            cancel_url: `${process.env.NEXTAUTH_URL}/listings/${listingId}?canceled=1`,
            client_reference_id: user.id,
            mode: "payment",
            payment_method_types: ["card", "blik", "p24"],
            line_items: [
                {
                    price_data: {
                        currency: "pln",
                        product_data: {
                            name: listing.title,
                            description: `Rezerwacja od ${start.toLocaleDateString('pl-PL')} do ${end.toLocaleDateString('pl-PL')} (${days} dni)`,
                        },
                        unit_amount: Math.round(totalPrice * 100),
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                listingId,
                startDate: start.toISOString(),
                endDate: end.toISOString(),
                userId: user.id
            }
        })

        return NextResponse.json({ url: stripeSession.url })
    } catch (error) {
        console.error("[STRIPE_CHECKOUT]", error)
        return new NextResponse("Internal server error", { status: 500 })
    }
}
