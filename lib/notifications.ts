import prisma from "@/lib/prisma"

export type NotificationType =
    | "LISTING_PENDING"
    | "LISTING_APPROVED"
    | "LISTING_REJECTED"
    | "RESERVATION_MADE"
    | "RESERVATION_RECEIVED"

export async function createNotification(opts: {
    userId: string
    type: NotificationType
    title: string
    message: string
    link?: string
}) {
    try {
        await prisma.notification.create({
            data: {
                userId: opts.userId,
                type: opts.type,
                title: opts.title,
                message: opts.message,
                link: opts.link ?? null,
            }
        })
    } catch (err) {
        console.error("[createNotification]", err)
    }
}
