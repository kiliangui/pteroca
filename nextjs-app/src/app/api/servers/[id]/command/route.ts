import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
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
      },
      include: {
        user: true
      }
    })

    if (!server) {
      return NextResponse.json({ error: "Server not found" }, { status: 404 })
    }

    const { command } = await request.json()

    if (!command || typeof command !== "string") {
      return NextResponse.json({ error: "Command is required" }, { status: 400 })
    }

    // Send command to Pterodactyl API
    const pterodactylUrl = process.env.pterodactyl_panel_url
    const pterodactylApiKey = process.env.PTERODACTYL_API_KEY

    if (!pterodactylUrl || !pterodactylApiKey) {
      return NextResponse.json({ error: "Pterodactyl configuration missing" }, { status: 500 })
    }

    try {
      const response = await fetch(`${pterodactylUrl}/api/client/servers/${server.pterodactylServerIdentifier}/command`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${server.user.pterodactylUserApiKey || pterodactylApiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ command })
      })

      if (!response.ok) {
        throw new Error(`Pterodactyl API error: ${response.status}`)
      }

      return NextResponse.json({ message: "Command sent successfully" })
    } catch (error) {
      console.error("Error sending command to Pterodactyl:", error)
      return NextResponse.json({ error: "Failed to send command" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error sending command:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}