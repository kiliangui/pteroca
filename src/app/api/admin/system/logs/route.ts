import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Get recent logs from various sources
    const userLogs = await prisma.log.findMany({
      take: 50,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    })

    const serverLogs = await prisma.serverLog.findMany({
      take: 50,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
        server: {
          select: {
            name: true,
            pterodactylServerIdentifier: true,
          },
        },
      },
    })

    // Combine and format logs
    const logs = [
      ...userLogs.map(log => ({
        id: `user-${log.id}`,
        timestamp: log.createdAt.toISOString(),
        level: "info" as const,
        message: log.details || `User action: ${log.actionId}`,
        source: `User: ${log.user.email}`,
      })),
      ...serverLogs.map(log => ({
        id: `server-${log.id}`,
        timestamp: log.createdAt.toISOString(),
        level: "info" as const,
        message: log.details || `Server action: ${log.actionId}`,
        source: `Server: ${log.server.name || log.server.pterodactylServerIdentifier}`,
      })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return NextResponse.json({ logs })
  } catch (error) {
    console.error("Error fetching system logs:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}