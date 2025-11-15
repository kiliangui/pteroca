import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { pterodactylAccountService } from "@/lib/pterodactyl"

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await context.params
    const userId = id
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.pterodactylUserId) {
      return NextResponse.json({ error: "User already has a Pterodactyl account" }, { status: 400 })
    }

    console.log(user.email,
      user.email.split('@')[0], // username from email
      user.name || user.email.split('@')[0],
      user.surname || user.email.split('@')[0],
      // generate password
      crypto.randomUUID())
    // Create Pterodactyl user
    const pteroUser = await pterodactylAccountService.createUser(
      user.email,
      user.email.split('@')[0], // username from email
      user.name || user.email.split('@')[0],
      user.surname || user.email.split('@')[0],
      // generate password
      crypto.randomUUID().split("-")[0]
    )

    // Update local user with pterodactylUserId
    await prisma.user.update({
      where: { id: userId },
      data: {
        pterodactylUserId: pteroUser.id
      }
    })

    return NextResponse.json({ success: true, pterodactylUserId: pteroUser.id })
  } catch (error) {
    console.error("Error creating Pterodactyl user:", error)
    if (error instanceof Error && error.message === 'Unauthorized: Admin access required') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json(
      { error: "Failed to create Pterodactyl user" },
      { status: 500 }
    )
  }
}