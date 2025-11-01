import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { pterodactylServerService } from "@/lib/pterodactyl"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()

    const { id } = await params

    // Get user's servers from database
    const servers = await prisma.server.findMany({
      where: { userId: id },
      select: {
        id: true,
        pterodactylServerId: true,
        pterodactylServerIdentifier: true,
        name: true,
        isSuspended: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Check if servers exist on Pterodactyl panel
    const serversWithPanelStatus = await Promise.all(
      servers.map(async (server) => {
        let existsOnPanel = false
        try {
          await pterodactylServerService.getServer(server.pterodactylServerId)
          existsOnPanel = true
        } catch (error) {
          // Server doesn't exist on panel or API error
          existsOnPanel = false
        }

        return {
          ...server,
          existsOnPanel,
        }
      })
    )

    return NextResponse.json({ servers: serversWithPanelStatus })
  } catch (error) {
    console.error("Error fetching user servers:", error)
    if (error instanceof Error && error.message === 'Unauthorized: Admin access required') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}