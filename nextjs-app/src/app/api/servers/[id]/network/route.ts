import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const server = await prisma.server.findFirst({
      where: {
        id: parseInt(id),
        userId: session.user.id
      }
    })

    if (!server) {
      return NextResponse.json({ error: "Server not found" }, { status: 404 })
    }

    // In a real implementation, this would fetch network allocations from Pterodactyl API
    // For now, we'll return mock data
    const allocations = [
      {
        id: "alloc-1",
        ip: "192.168.1.100",
        port: 25565,
        protocol: "tcp",
        status: "active",
        description: "Minecraft Server Port"
      },
      {
        id: "alloc-2",
        ip: "192.168.1.100",
        port: 25566,
        protocol: "udp",
        status: "active",
        description: "Minecraft Query Port"
      }
    ]

    return NextResponse.json({ allocations })
  } catch (error) {
    console.error("Error fetching network allocations:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const server = await prisma.server.findFirst({
      where: {
        id: parseInt(id),
        userId: session.user.id
      }
    })

    if (!server) {
      return NextResponse.json({ error: "Server not found" }, { status: 404 })
    }

    const { port, protocol, description } = await request.json()

    if (!port || !protocol || typeof port !== "number" || typeof protocol !== "string") {
      return NextResponse.json({ error: "Port and protocol are required" }, { status: 400 })
    }

    // In a real implementation, this would create a network allocation via Pterodactyl API
    // For now, we'll just return success

    return NextResponse.json({ message: "Network allocation created successfully" })
  } catch (error) {
    console.error("Error creating network allocation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}