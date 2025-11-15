import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { pterodactylAccountService } from "@/lib/pterodactyl"
import { requireAdmin } from "@/lib/auth"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()

    const { id } = await params
    const formData = await request.formData()
    const email = formData.get("email") as string
    const name = formData.get("name") as string
    const surname = formData.get("surname") as string
    const balance = formData.get("balance") as string
    const isVerified = formData.get("isVerified") === "on"
    const isBlocked = formData.get("isBlocked") === "on"

    const user = await prisma.user.update({
      where: { id },
      data: {
        email,
        name: name || null,
        surname: surname || null,
        balance,
        isVerified,
        isBlocked,
      },
      select: {
        id: true,
        email: true,
        name: true,
        surname: true,
        balance: true,
        isVerified: true,
        isBlocked: true,
        createdAt: true,
        roles: true,
      },
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Error updating user:", error)
    if (error instanceof Error && error.message === 'Unauthorized: Admin access required') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()

    const { id } = await params

    // Get user to check if they have a Pterodactyl account
    const user = await prisma.user.findUnique({
      where: { id },
      select: { pterodactylUserId: true }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Delete from Pterodactyl if user exists there
    if (user.pterodactylUserId) {
      try {
        await pterodactylAccountService.deleteUser(user.pterodactylUserId)
        console.log(`Deleted Pterodactyl user ${user.pterodactylUserId}`)
      } catch (pteroError) {
        console.error("Error deleting Pterodactyl user:", pteroError)
        // Continue with local deletion even if Pterodactyl deletion fails
      }
    }

    // Delete from local database
    await prisma.user.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting user:", error)
    if (error instanceof Error && error.message === 'Unauthorized: Admin access required') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}