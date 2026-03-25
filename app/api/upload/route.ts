import { NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import path from "path"
import crypto from "crypto"
import sharp from "sharp"

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const file = formData.get("file") as File | null

        if (!file) {
            return NextResponse.json({ error: "File is required." }, { status: 400 })
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
