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

        const { listingId, startDate, endDate, totalPrice } = await request.json()

        const listing = await prisma.listing.findUnique({
            where: { id: listingId }
        })

        if (!listing) return new NextResponse("Listing not found", { status: 404 })

        const stripeSession = await stripe.checkout.sessions.create({
            success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=1`,
            cancel_url: `${process.env.NEXTAUTH_URL}/listings/${listingId}?canceled=1`,
            client_reference_id: user.id,
            mode: "payment",
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: listing.title,
                            description: `Reservation from ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`,
                        },
                        unit_amount: Math.round(totalPrice * 100), // Stripe expects cents
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                listingId,
                startDate: new Date(startDate).toISOString(),
                endDate: new Date(endDate).toISOString(),
                userId: user.id
            }
        })

        return NextResponse.json({ url: stripeSession.url })
    } catch (error) {
        console.log("[STRIPE_CHECKOUT]", error)
        return new NextResponse("Internal server error", { status: 500 })
    }
}
