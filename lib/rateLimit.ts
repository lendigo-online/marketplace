import prisma from "@/lib/prisma"
import { headers } from "next/headers"

export async function rateLimit(opts: {
    key: string
    limit: number
    windowSeconds: number
}): Promise<{ ok: boolean; remaining: number; retryAfter: number }> {
    const { key, limit, windowSeconds } = opts
    const now = new Date()
    const windowStart = new Date(now.getTime() - windowSeconds * 1000)

    await prisma.rateLimit.deleteMany({
        where: { createdAt: { lt: windowStart } }
    })

    const count = await prisma.rateLimit.count({
        where: { key, createdAt: { gte: windowStart } }
    })

    if (count >= limit) {
        const oldest = await prisma.rateLimit.findFirst({
            where: { key, createdAt: { gte: windowStart } },
            orderBy: { createdAt: "asc" }
        })
        const retryAfter = oldest
            ? Math.max(1, windowSeconds - Math.floor((now.getTime() - oldest.createdAt.getTime()) / 1000))
            : windowSeconds
        return { ok: false, remaining: 0, retryAfter }
    }

    await prisma.rateLimit.create({ data: { key } })
    return { ok: true, remaining: limit - count - 1, retryAfter: 0 }
}

export function getClientIp(): string {
    const h = headers()
    const forwarded = h.get("x-forwarded-for")
    if (forwarded) return forwarded.split(",")[0].trim()
    const real = h.get("x-real-ip")
    if (real) return real.trim()
    return "unknown"
}

export function rateLimitResponse(retryAfter: number) {
    return new Response("Too Many Requests", {
        status: 429,
        headers: { "Retry-After": String(retryAfter) }
    })
}
