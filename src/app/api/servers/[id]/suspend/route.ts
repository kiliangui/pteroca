import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { pterodactylSyncService } from "@/lib/pterodactyl"
import axios from 'axios'

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

    if (server.isSuspended) {
      return NextResponse.json({ error: "Server is already suspended" }, { status: 400 })
    }

    // Call PHP backend to suspend server
    try {
      await axios.post(`${process.env.PHP_BACKEND_URL}/api/servers/${server.id}/suspend`, {}, {
        headers: {
          'Authorization': `Bearer ${process.env.PHP_BACKEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
      })

      // Update local database
      await prisma.server.update({
        where: { id: server.id },
        data: { isSuspended: true }
      })

      // Sync server status after suspension
      try {
        await pterodactylSyncService.syncServerStatus(server.id);
      } catch (syncError) {
        console.error('Failed to sync server status after suspension:', syncError);
        // Don't fail the request if sync fails
      }

      // Create log entry
      await prisma.log.create({
        data: {
          actionId: 'server_suspended',
          details: `Server "${server.name || `Server ${server.id}`}" suspended`,
          userId: session.user.id,
          createdAt: new Date(),
        },
      })

      return NextResponse.json({ message: "Server suspended successfully" })
    } catch (backendError) {
      console.error('Backend suspension error:', backendError)
      return NextResponse.json({ error: "Failed to suspend server" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error suspending server:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}