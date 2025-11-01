import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { pterodactylServerService, pterodactylAccountService } from "@/lib/pterodactyl"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const parameters = await params;
    const id = parseInt(parameters.id);

    const server = await prisma.server.findFirst({
      where: {
        id: id,
        userId: session.user.id
      },
      include: {
        user: {
          select: {
            pterodactylUserId: true
          }
        }
      }
    })

    if (!server) {
      return NextResponse.json({ error: "Server not found" }, { status: 404 })
    }

    // Check if server is suspended
    if (server.isSuspended) {
      return NextResponse.json({ error: "Cannot restart suspended server" }, { status: 400 })
    }

    // Check if server has expired
    if (server.expiresAt && new Date() > server.expiresAt) {
      return NextResponse.json({ error: "Server has expired" }, { status: 400 })
    }

    try {
      // Ensure user has an API key for server management
      const userApiKey = await pterodactylAccountService.ensureUserApiKey(server.user.pterodactylUserId!)

      // Restart the server via Pterodactyl API using user's API key
      await pterodactylServerService.restartServer(server.pterodactylServerIdentifier, userApiKey)

      // Create log entry
      await prisma.log.create({
        data: {
          actionId: 'server_restarted',
          details: `Server "${server.name}" restarted successfully`,
          userId: session.user.id,
          createdAt: new Date(),
        },
      })

      return NextResponse.json({ message: "Server restart initiated successfully" })
    } catch (pterodactylError) {
      console.error('Pterodactyl API error:', pterodactylError)

      // Create log entry for failed restart
      await prisma.log.create({
        data: {
          actionId: 'server_restart_failed',
          details: `Failed to restart server "${server.name}": ${pterodactylError instanceof Error ? pterodactylError.message : 'Unknown error'}`,
          userId: session.user.id,
          createdAt: new Date(),
        },
      })

      return NextResponse.json({
        error: "Failed to restart server",
        details: pterodactylError instanceof Error ? pterodactylError.message : "Unknown error"
      }, { status: 500 })
    }
  } catch (error) {
    console.error("Error restarting server:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}