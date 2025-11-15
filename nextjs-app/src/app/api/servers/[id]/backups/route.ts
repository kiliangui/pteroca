import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { pterodactylServerService } from "@/lib/pterodactyl"

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await context.params

    const server = await prisma.server.findFirst({
      where: {
        id: parseInt(id),
        userId: session.user.id
      }
    })

    if (!server) {
      return NextResponse.json({ error: "Server not found" }, { status: 404 })
    }

    if (!server.pterodactylServerIdentifier) {
      return NextResponse.json({ error: "Server not linked to Pterodactyl" }, { status: 400 })
    }

    // Fetch backups from Pterodactyl API
    const pterodactylBackups = await pterodactylServerService.getServerBackups(server.pterodactylServerIdentifier)

    // Transform to our API format
    const backups = pterodactylBackups.map(backup => ({
      id: backup.uuid,
      name: backup.name,
      size: backup.bytes ? `${(backup.bytes / (1024 * 1024 * 1024)).toFixed(2)} GB` : 'Unknown',
      createdAt: backup.created_at,
      status: backup.is_successful ? 'completed' : backup.completed_at ? 'failed' : 'pending'
    }))

    return NextResponse.json({ backups })
  } catch (error) {
    console.error("Error fetching backups:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await context.params

    const server = await prisma.server.findFirst({
      where: {
        id: parseInt(id),
        userId: session.user.id
      }
    })

    if (!server) {
      return NextResponse.json({ error: "Server not found" }, { status: 404 })
    }

    if (!server.pterodactylServerIdentifier) {
      return NextResponse.json({ error: "Server not linked to Pterodactyl" }, { status: 400 })
    }

    const { name, ignoredFiles, isLocked } = await request.json()

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Backup name is required" }, { status: 400 })
    }

    // Create backup via Pterodactyl API
    const backup = await pterodactylServerService.createServerBackup(
      server.pterodactylServerIdentifier,
      name,
      ignoredFiles,
      isLocked || false
    )

    return NextResponse.json({
      message: "Backup creation initiated",
      backup: {
        id: backup.uuid,
        name: backup.name,
        status: backup.is_successful ? 'completed' : 'pending'
      }
    })
  } catch (error) {
    console.error("Error creating backup:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}