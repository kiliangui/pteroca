import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import axios from 'axios'

export async function DELETE(
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

    // Call PHP backend to delete server
    try {
      await axios.delete(`${process.env.PHP_BACKEND_URL}/api/servers/${server.id}`, {
        headers: {
          'Authorization': `Bearer ${process.env.PHP_BACKEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
      })

      // Soft delete in local database (mark as deleted)
      await prisma.server.update({
        where: { id: server.id },
        data: {
          deletedAt: new Date(),
          isSuspended: true
        }
      })

      // Create log entry
      await prisma.log.create({
        data: {
          actionId: 'server_deleted',
          details: `Server "${server.name || `Server ${server.id}`}" deleted`,
          userId: session.user.id,
        },
      })

      return NextResponse.json({ message: "Server deleted successfully" })
    } catch (backendError) {
      console.error('Backend deletion error:', backendError)
      return NextResponse.json({ error: "Failed to delete server" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error deleting server:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}