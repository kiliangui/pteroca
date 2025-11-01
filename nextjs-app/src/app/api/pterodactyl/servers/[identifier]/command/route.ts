import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { identifier: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user API key
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { pterodactylUserApiKey: true }
    })

    if (!user?.pterodactylUserApiKey) {
      return NextResponse.json({ error: 'API key not found' }, { status: 400 })
    }

    // Get Pterodactyl URL from settings
    const pterodactylUrlSetting = await prisma.setting.findUnique({
      where: { name: 'pterodactyl_panel_url' }
    })

    if (!pterodactylUrlSetting?.value) {
      return NextResponse.json({ error: 'Pterodactyl URL not configured' }, { status: 500 })
    }

    const body = await request.json()
    const { command } = body

    if (!command || typeof command !== 'string') {
      return NextResponse.json({ error: 'Command is required' }, { status: 400 })
    }

    // Proxy the request to Pterodactyl
    const pterodactylUrl = pterodactylUrlSetting.value
    const response = await fetch(`${pterodactylUrl}/api/client/servers/${params.identifier}/command`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${user.pterodactylUserApiKey}`,
        'Accept': 'Application/vnd.pterodactyl.v1+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ command })
    })

    if (response.ok) {
      return NextResponse.json({ success: true }, { status: 200 })
    } else {
      const errorData = await response.json()
      return NextResponse.json(errorData, { status: response.status })
    }
  } catch (error) {
    console.error('Error proxying command request:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}