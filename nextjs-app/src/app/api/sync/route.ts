import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { pterodactylSyncService } from '@/lib/pterodactyl'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { type } = await request.json()

    switch (type) {
      case 'users':
        await pterodactylSyncService.syncUsers()
        break
      case 'servers':
        await pterodactylSyncService.syncServers()
        break
      case 'all':
      default:
        await pterodactylSyncService.syncAll()
        break
    }

    return NextResponse.json({ success: true, message: 'Sync completed successfully' })
  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json(
      { error: 'Failed to sync data' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Trigger full sync
    await pterodactylSyncService.syncAll()

    return NextResponse.json({ success: true, message: 'Full sync completed successfully' })
  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json(
      { error: 'Failed to sync data' },
      { status: 500 }
    )
  }
}