import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { pterodactylServerService } from "@/lib/pterodactyl"

export async function POST(
  request: Request,
  { params }: { params: { id: string; backupId: string } }
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

    const { truncate } = await request.json()

    // Restore backup via Pterodactyl API
    await pterodactylServerService.restoreServerBackup(
      server.pterodactylServerIdentifier,
      params.backupId,
      truncate || false
    )

    return NextResponse.json({ message: "Backup restoration initiated" })
  } catch (error) {
    console.error("Error restoring backup:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}