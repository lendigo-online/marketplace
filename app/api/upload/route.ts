import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import crypto from "crypto"
import sharp from "sharp"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { rateLimit, rateLimitResponse } from "@/lib/rateLimit"

const MAX_SIZE = 10 * 1024 * 1024 // 10 MB
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"])

export async function POST(request: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    const currentUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
    })
    if (!currentUser) return new NextResponse("Unauthorized", { status: 401 })

    const userLimit = await rateLimit({ key: `upload:user:${currentUser.id}`, limit: 30, windowSeconds: 3600 })
    if (!userLimit.ok) return rateLimitResponse(userLimit.retryAfter)

    try {
        const formData = await request.formData()
        const file = formData.get("file") as File | null

        if (!file) {
            return NextResponse.json({ error: "File is required." }, { status: 400 })
        }

        if (file.size > MAX_SIZE) {
            return NextResponse.json({ error: "File too large. Max 10 MB." }, { status: 413 })
        }

        if (!ALLOWED_MIME.has(file.type)) {
            return NextResponse.json({ error: "Unsupported file type." }, { status: 415 })
        }

        const buffer = Buffer.from(await file.arrayBuffer())

        const meta = await sharp(buffer).metadata().catch(() => null)
        if (!meta || !meta.format) {
            return NextResponse.json({ error: "Invalid image." }, { status: 400 })
        }

        const compressed = await sharp(buffer)
            .rotate()
            .resize({ width: 1200, height: 900, fit: "inside", withoutEnlargement: true })
            .jpeg({ quality: 80 })
            .toBuffer()

        const filename = `listings/${crypto.randomUUID()}.jpg`

        const blob = await put(filename, compressed, {
            access: "public",
            contentType: "image/jpeg",
        })

        return NextResponse.json({ url: blob.url })
    } catch (error) {
        console.error("Upload error:", error)
        return NextResponse.json({ error: "Upload failed." }, { status: 500 })
    }
}
