import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ identifier: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Await params to get the actual values
    const { identifier } = await params

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

    const url = new URL(request.url)
    const file = url.searchParams.get('file')

    if (!file) {
      return NextResponse.json({ error: 'File parameter is required' }, { status: 400 })
    }

    // Get the raw text content from request body
    const content = await request.text()

    // Create form data for Pterodactyl API
    const formData = new FormData()
    formData.append('file', file)
    formData.append('contents', content)

    // Proxy the request to Pterodactyl
    const pterodactylUrl = pterodactylUrlSetting.value
    const response = await fetch(`${pterodactylUrl}/api/client/servers/${identifier}/files/write`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${user.pterodactylUserApiKey}`,
        'Accept': 'Application/vnd.pterodactyl.v1+json'
      },
      body: formData
    })

    console.log('Pterodactyl response status:', response.status)
    const responseText = await response.text()
    console.log('Pterodactyl response:', responseText)

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Error proxying file write request:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}