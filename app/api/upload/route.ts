import { NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import path from "path"
import crypto from "crypto"
import sharp from "sharp"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

const MAX_SIZE = 10 * 1024 * 1024 // 10 MB

export async function POST(request: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const formData = await request.formData()
        const file = formData.get("file") as File | null

        if (!file) {
            return NextResponse.json({ error: "File is required." }, { status: 400 })
        }

        if (file.size > MAX_SIZE) {
            return NextResponse.json({ error: "File too large. Max 10 MB." }, { status: 413 })
        }

        const buffer = Buffer.from(await file.arrayBuffer())

        const compressed = await sharp(buffer)
            .resize({ width: 1200, height: 900, fit: "inside", withoutEnlargement: true })
            .jpeg({ quality: 80 })
            .toBuffer()

        const filename = `${crypto.randomUUID()}.jpg`
        const publicDir = path.join(process.cwd(), "public", "uploads")

        await writeFile(path.join(publicDir, filename), compressed)

        return NextResponse.json({ url: `/uploads/${filename}` })
    } catch (error) {
        console.error("Upload error:", error)
        return NextResponse.json({ error: "Upload failed." }, { status: 500 })
    }
}
