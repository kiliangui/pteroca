import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { pterodactylSyncService } from '@/lib/pterodactyl'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const serverId = parseInt(params.id)
    if (isNaN(serverId)) {
      return NextResponse.json({ error: 'Invalid server ID' }, { status: 400 })
    }

    // Check if user owns the server or is admin
    const server = await prisma.server.findUnique({
      where: { id: serverId },
      select: { userId: true }
    })

    if (!server) {
      return NextResponse.json({ error: 'Server not found' }, { status: 404 })
    }

    if (server.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await pterodactylSyncService.syncServerStatus(serverId)

    return NextResponse.json({ success: true, message: 'Server status synced successfully' })
  } catch (error) {
    console.error('Server sync error:', error)
    return NextResponse.json(
      { error: 'Failed to sync server status' },
      { status: 500 }
    )
  }
}