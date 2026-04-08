import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

async function getAdmin() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return null
    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user || user.role !== "ADMIN") return null
    return user
}

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    if (!await getAdmin()) return new NextResponse("Forbidden", { status: 403 })

    const { status } = await request.json()
    if (!["APPROVED", "REJECTED"].includes(status)) {
        return new NextResponse("Invalid status", { status: 400 })
    }

    const listing = await prisma.listing.update({
        where: { id: params.id },
        data: { status }
    })

    return NextResponse.json(listing)
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    if (!await getAdmin()) return new NextResponse("Forbidden", { status: 403 })

    await prisma.listing.delete({ where: { id: params.id } })

    return NextResponse.json({ success: true })
}
