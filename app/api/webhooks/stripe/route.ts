import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
    const body = await request.text()
    const sig = request.headers.get("stripe-signature")

    if (!sig) {
        return NextResponse.json({ error: "Missing signature" }, { status: 400 })
    }

    let event
    try {
        event = stripe.webhooks.constructEvent(
            body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (err: any) {
        console.error("[STRIPE_WEBHOOK] Signature verification failed:", err.message)
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object
        const metadata = session.metadata

        if (metadata?.type === "promotion") {
            const { listingId, tierDays } = metadata
            const days = parseInt(tierDays)

            if (listingId && !isNaN(days)) {
                const listing = await prisma.listing.findUnique({
                    where: { id: listingId },
                    select: { promotedUntil: true },
                })

                // Jeśli listing ma aktywną promocję, przedłuż od istniejącej daty
                const now = new Date()
                const baseDate = listing?.promotedUntil && listing.promotedUntil > now
                    ? listing.promotedUntil
                    : now

                const promotedUntil = new Date(baseDate.getTime() + days * 24 * 60 * 60 * 1000)

                await prisma.listing.update({
                    where: { id: listingId },
                    data: { promotedUntil },
                })

                console.log(`[STRIPE_WEBHOOK] Listing ${listingId} promoted until ${promotedUntil.toISOString()}`)
            }
        }
    }

    return NextResponse.json({ received: true })
}
