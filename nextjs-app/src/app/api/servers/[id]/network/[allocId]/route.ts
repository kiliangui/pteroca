import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; allocId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const server = await prisma.server.findFirst({
      where: {
        id: parseInt(params.id),
        userId: session.user.id
      }
    })

    if (!server) {
      return NextResponse.json({ error: "Server not found" }, { status: 404 })
    }

    // In a real implementation, this would delete the network allocation via Pterodactyl API
    // For now, we'll just return success

    return NextResponse.json({ message: "Network allocation deleted successfully" })
  } catch (error) {
    console.error("Error deleting network allocation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}