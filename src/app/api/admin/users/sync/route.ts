import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { pterodactylSyncService } from '@/lib/pterodactyl'
import { authOptions } from '@/lib/auth'

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await pterodactylSyncService.syncUsers()

    return NextResponse.json({ success: true, message: 'Users synced successfully' })
  } catch (error) {
    console.error('Users sync error:', error)
    return NextResponse.json(
      { error: 'Failed to sync users' },
      { status: 500 }
    )
  }
}