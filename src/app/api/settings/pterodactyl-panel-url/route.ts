import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    await requireAdmin()

    const setting = await prisma.setting.findUnique({
      where: { name: 'pterodactyl_panel_url' }
    })

    return NextResponse.json({ value: setting?.value || null })
  } catch (error) {
    console.error("Error fetching Pterodactyl panel URL:", error)
    if (error instanceof Error && error.message === 'Unauthorized: Admin access required') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
