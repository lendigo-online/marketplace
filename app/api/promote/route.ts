import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { stripe } from "@/lib/stripe"
import prisma from "@/lib/prisma"
import { PROMOTION_TIERS } from "@/lib/promotion-tiers"

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        })
        if (!user) return new NextResponse("Unauthorized", { status: 401 })

        const { listingId, tierDays } = await request.json()

        if (!listingId || !tierDays) {
            return NextResponse.json({ error: "Missing listingId or tierDays" }, { status: 400 })
        }

        const tier = PROMOTION_TIERS.find(t => t.days === tierDays)
        if (!tier) {
            return NextResponse.json({ error: "Invalid tier" }, { status: 400 })
        }

        const listing = await prisma.listing.findUnique({
            where: { id: listingId },
        })
        if (!listing) {
            return NextResponse.json({ error: "Listing not found" }, { status: 404 })
        }
        if (listing.ownerId !== user.id) {
            return NextResponse.json({ error: "Not your listing" }, { status: 403 })
        }

        const stripeSession = await stripe.checkout.sessions.create({
            success_url: `${process.env.NEXTAUTH_URL}/dashboard?promoted=1`,
            cancel_url: `${process.env.NEXTAUTH_URL}/dashboard`,
            client_reference_id: user.id,
            mode: "payment",
            locale: "pl",
            automatic_payment_methods: { enabled: true },
            line_items: [
                {
                    price_data: {
                        currency: "pln",
                        product_data: {
                            name: `Wyróżnienie: ${listing.title}`,
                            description: `Promocja ogłoszenia na ${tier.days} dni`,
                        },
                        unit_amount: tier.amountGrosze,
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                type: "promotion",
                listingId,
                tierDays: String(tier.days),
                userId: user.id,
            },
        })

        return NextResponse.json({ url: stripeSession.url })
    } catch (error) {
        console.error("[PROMOTE_CHECKOUT]", error)
        return new NextResponse("Internal server error", { status: 500 })
    }
}
