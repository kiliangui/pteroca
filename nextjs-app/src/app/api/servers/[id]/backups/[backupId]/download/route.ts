import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { pterodactylServerService } from "@/lib/pterodactyl"

export async function GET(
  request: Request,
  { params }: { params: { id: string; backupId: string } }
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

    // Get download URL from Pterodactyl API
    const downloadUrl = await pterodactylServerService.getBackupDownloadUrl(
      server.pterodactylServerIdentifier,
      params.backupId
    )

    // Redirect to the actual download URL
    return NextResponse.redirect(downloadUrl)
  } catch (error) {
    console.error("Error downloading backup:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}