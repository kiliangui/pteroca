import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

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
      },
      include: {
        product: true
      }
    })

    if (!server) {
      return NextResponse.json({ error: "Server not found" }, { status: 404 })
    }

    // In a real implementation, this would fetch settings from Pterodactyl API
    // For now, we'll return mock data based on the server data
    const settings = {
      name: server.name || `Server ${server.id}`,
      autoRenewal: server.autoRenewal,
      egg: server.product?.eggs || "minecraft",
      startupCommand: "java -Xmx1024M -Xms1024M -jar server.jar",
      environment: {
        "SERVER_JARFILE": "server.jar",
        "VERSION": "latest"
      }
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error("Error fetching server settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(
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

    const { name, autoRenewal, egg, startupCommand, environment } = await request.json()

    // In a real implementation, this would update settings via Pterodactyl API
    // For now, we'll update the database
    await prisma.server.update({
      where: { id: server.id },
      data: {
        name: name || server.name,
        autoRenewal: autoRenewal ?? server.autoRenewal
      }
    })

    return NextResponse.json({ message: "Settings updated successfully" })
  } catch (error) {
    console.error("Error updating server settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}