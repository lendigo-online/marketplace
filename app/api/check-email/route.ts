import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
        return NextResponse.json({ exists: false })
    }

    const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
    })

    return NextResponse.json({ exists: !!user })
}
