import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { pterodactylServerService } from "@/lib/pterodactyl"

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; databaseId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, databaseId } = await params

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
      return NextResponse.json({ error: "Server identifier not found" }, { status: 404 })
    }

    const databaseIdNum = parseInt(databaseId)

    if (isNaN(databaseIdNum)) {
      return NextResponse.json({ error: "Invalid database ID" }, { status: 400 })
    }

    // Delete database via Pterodactyl API
    await pterodactylServerService.deleteServerDatabase(server.pterodactylServerIdentifier, databaseIdNum)

    return NextResponse.json({ message: "Database deleted successfully" })
  } catch (error) {
    console.error("Error deleting database:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; databaseId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, databaseId } = await params

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
      return NextResponse.json({ error: "Server identifier not found" }, { status: 404 })
    }

    const databaseIdNum = parseInt(databaseId)

    if (isNaN(databaseIdNum)) {
      return NextResponse.json({ error: "Invalid database ID" }, { status: 400 })
    }

    const body = await request.json()
    const { password } = body

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 })
    }

    // Reset database password via Pterodactyl API
    await pterodactylServerService.resetServerDatabasePassword(server.pterodactylServerIdentifier, databaseIdNum, password)

    return NextResponse.json({ message: "Database password reset successfully" })
  } catch (error) {
    console.error("Error resetting database password:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}