import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  request: NextRequest,
  { params }: { params: { priceId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const priceId = parseInt(params.priceId)
    if (isNaN(priceId)) {
      return NextResponse.json({ error: "Invalid price ID" }, { status: 400 })
    }

    await prisma.productPrice.delete({
      where: { id: priceId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting price:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}