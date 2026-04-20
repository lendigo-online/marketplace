import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { z } from "zod"
import { CATEGORIES } from "@/lib/categories"

const ALLOWED_IMAGE_HOSTS = [
    "images.unsplash.com",
    "res.cloudinary.com",
    "avatars.githubusercontent.com",
    "lh3.googleusercontent.com",
]

const imageUrl = z.string().url().max(2048).refine((u) => {
    try {
        const url = new URL(u)
        if (url.protocol !== "https:") return false
        if (url.hostname.endsWith(".public.blob.vercel-storage.com")) return true
        if (url.hostname.endsWith(".private.blob.vercel-storage.com")) return true
        return ALLOWED_IMAGE_HOSTS.includes(url.hostname)
    } catch {
        return false
    }
}, "Disallowed image host")

const discountRule = z.object({
    minDays: z.number().int().min(1).max(365),
    percent: z.number().min(0).max(90),
})

const schema = z.object({
    title: z.string().min(3).max(120),
    description: z.string().min(10).max(5000),
    pricePerDay: z.coerce.number().positive().max(100000),
    location: z.string().min(2).max(200),
    category: z.enum(CATEGORIES),
    images: z.array(imageUrl).max(12).default([]),
    discountRules: z.array(discountRule).max(10).optional().default([]),
})

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

        const body = await request.json().catch(() => null)
        const parsed = schema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 })
        }

        const { title, description, pricePerDay, location, category, images, discountRules } = parsed.data

        const listing = await prisma.listing.create({
            data: {
                title,
                description,
                pricePerDay,
                location,
                images,
                category,
                discountRules,
                ownerId: currentUser.id
            }
        })

        return NextResponse.json(listing)
    } catch (error) {
        console.error(error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
