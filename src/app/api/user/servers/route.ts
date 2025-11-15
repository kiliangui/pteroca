import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const servers = await prisma.server.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        name: true,
        pterodactylServerIdentifier: true,
        isSuspended: true,
        expiresAt: true,
        installed:true,
        productId: true,
        createdAt: true
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json({ servers })
  } catch (error) {
    console.error("Error fetching user servers:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}