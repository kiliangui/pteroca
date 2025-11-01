import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const {id} = await params;

    const server = await prisma.server.findFirst({
      where: {
        id: parseInt(id),
        userId: session.user.id
      }
    })

    if (!server) {
      return NextResponse.json({ error: "Server not found" }, { status: 404 })
    }

    // In a real implementation, this would check the actual server status
    // For now, we'll return a mock status
    const isRunning = Math.random() > 0.5

    return NextResponse.json({ isRunning })
  } catch (error) {
    console.error("Error fetching server status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}