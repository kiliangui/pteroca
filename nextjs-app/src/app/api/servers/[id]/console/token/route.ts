import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import jwt from "jsonwebtoken"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const paramsA = await params;
    const id = parseInt(paramsA.id)
    if (!id) return NextResponse.json({error:"No id provided"},{status:404})

    const server = await prisma.server.findFirst({
      where: {
        id: id,
        userId: session.user.id
      }
    })

    if (!server) {
      return NextResponse.json({ error: "Server not found" }, { status: 404 })
    }

    // Create JWT token for WebSocket authentication
    const token = jwt.sign(
      {
        serverId: server.id,
        userId: session.user.id,
        type: 'console'
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '1h' }
    )

    return NextResponse.json({ token })
  } catch (error) {
    console.error("Error generating console token:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}