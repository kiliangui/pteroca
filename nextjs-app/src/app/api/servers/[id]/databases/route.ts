import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { pterodactylServerService } from "@/lib/pterodactyl"

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
      }
    })

    if (!server) {
      return NextResponse.json({ error: "Server not found" }, { status: 404 })
    }

    // Fetch databases from Pterodactyl API
    const pterodactylDatabases = await pterodactylServerService.getServerDatabases(server.pterodactylServerIdentifier)

    // Transform to our API format
    const databases = pterodactylDatabases.map(database => ({
      id: database.id,
      name: database.database,
      username: database.username,
      host: database.remote,
      maxConnections: database.max_connections,
      createdAt: database.created_at
    }))

    return NextResponse.json({ databases })
  } catch (error) {
    console.error("Error fetching databases:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

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
      }
    })

    if (!server) {
      return NextResponse.json({ error: "Server not found" }, { status: 404 })
    }

    const { database, remote } = await request.json()

    if (!database || typeof database !== "string") {
      return NextResponse.json({ error: "Database name is required" }, { status: 400 })
    }

    // Create database via Pterodactyl API
    const createdDatabase = await pterodactylServerService.createServerDatabase(
      server.pterodactylServerIdentifier,
      database,
      remote || '%'
    )

    return NextResponse.json({
      message: "Database created successfully",
      database: {
        id: createdDatabase.id,
        name: createdDatabase.database,
        username: createdDatabase.username,
        host: createdDatabase.remote,
        maxConnections: createdDatabase.max_connections,
        createdAt: createdDatabase.created_at
      }
    })
  } catch (error) {
    console.error("Error creating database:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}