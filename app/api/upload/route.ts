import { NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import path from "path"
import crypto from "crypto"

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const file = formData.get("file") as File | null

        if (!file) {
            return NextResponse.json({ error: "File is required." }, { status: 400 })
        }

        const buffer = Buffer.from(await file.arrayBuffer())
        const filename = `${crypto.randomUUID()}-${file.name.replace(/\s/g, "_")}`
        const publicDir = path.join(process.cwd(), "public", "uploads")
        
        await writeFile(path.join(publicDir, filename), buffer)

        return NextResponse.json({ url: `/uploads/${filename}` })
    } catch (error) {
        console.error("Upload error:", error)
        return NextResponse.json({ error: "Upload failed." }, { status: 500 })
    }
}
