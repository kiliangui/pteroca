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

    try {
      // Ensure user has an API key for server management
      const userApiKey = await pterodactylAccountService.ensureUserApiKey(server.user.pterodactylUserId!)

      // Stop the server via Pterodactyl API using user's API key
      await pterodactylServerService.stopServer(server.pterodactylServerIdentifier, userApiKey)

      // Create log entry
      await prisma.log.create({
        data: {
          actionId: 'server_stopped',
          details: `Server "${server.name}" stopped successfully`,
          userId: session.user.id,
          createdAt: new Date(),
        },
      })

      return NextResponse.json({ message: "Server stop initiated successfully" })
    } catch (pterodactylError) {
      console.error('Pterodactyl API error:', pterodactylError)

      // Create log entry for failed stop
      await prisma.log.create({
        data: {
          actionId: 'server_stop_failed',
          details: `Failed to stop server "${server.name}": ${pterodactylError instanceof Error ? pterodactylError.message : 'Unknown error'}`,
          userId: session.user.id,
          createdAt: new Date(),
        },
      })

      return NextResponse.json({
        error: "Failed to stop server",
        details: pterodactylError instanceof Error ? pterodactylError.message : "Unknown error"
      }, { status: 500 })
    }
  } catch (error) {
    console.error("Error stopping server:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}