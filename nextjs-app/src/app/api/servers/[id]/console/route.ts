import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
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

    // Get console logs from Pterodactyl API
    const pterodactylUrl = process.env.pterodactyl_panel_url
    const pterodactylApiKey = process.env.PTERODACTYL_API_KEY

    if (!pterodactylUrl || !pterodactylApiKey) {
      return NextResponse.json({ error: "Pterodactyl configuration missing" }, { status: 500 })
    }

    try {
      const response = await fetch(`${pterodactylUrl}/api/client/servers/${server.pterodactylServerIdentifier}/console`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${server.user.pterodactylUserApiKey || pterodactylApiKey}`,
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Pterodactyl API error: ${response.status}`)
      }

      const data = await response.json()
      return NextResponse.json(data)
    } catch (error) {
      console.error("Error fetching console logs:", error)
      return NextResponse.json({ error: "Failed to fetch console logs" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in console route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}