import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { redirectPath } = await request.json();

    // Get user pterodactyl ID and settings from database

    const [user, settings] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { pterodactylUserId: true }
      }),
      prisma.setting.findMany({
        where: {
          name: {
            in: ['site_url', 'pterodactyl_panel_url', 'pterodactyl_sso_secret']
          }
        },
        select: {
          name: true,
          value: true
        }
      })
    ]);

    if (!user?.pterodactylUserId) {
      return NextResponse.json({ error: 'Pterodactyl user ID not found' }, { status: 400 });
    }

    const settingsMap = settings.reduce((acc, setting) => {
      acc[setting.name] = setting.value;
      return acc;
    }, {} as Record<string, string>);

    const siteUrl = settingsMap.site_url || process.env.SITE_URL;
    const pterodactylUrl = settingsMap.pterodactyl_panel_url || process.env.PTERODACTYL_PANEL_URL;
    const ssoSecret = settingsMap.pterodactyl_sso_secret || process.env.PTERODACTYL_SSO_SECRET;

    console.log('SSO Debug Info:', {
      siteUrl,
      pterodactylUrl,
      ssoSecret: ssoSecret ? '[REDACTED]' : 'NOT SET',
      hasSecret: !!ssoSecret,
      userId: user?.pterodactylUserId
    });

    if (!ssoSecret) {
      return NextResponse.json({ error: 'SSO not configured' }, { status: 500 });
    }

    const now = Math.floor(Date.now()/1000);
    const payload = {
      iss: siteUrl,
      aud: pterodactylUrl,
      iat: now - 15, // Set 10 seconds in the past to account for clock skew
      exp: now + 300, // 5 minutes for debugging
      user: {
        id: user.pterodactylUserId,
      },
    };

    console.log('SSO Payload:', {
      iss: payload.iss,
      aud: payload.aud,
      iat: payload.iat,
      exp: payload.exp,
      userId: payload.user.id
    });

    const token = jwt.sign(payload, ssoSecret, { algorithm: 'HS256' });

    console.log("DECODED TOKEN = ", jwt.decode(token,{ complete:true }))

    return NextResponse.json({
      token,
      redirectUrl: `${pterodactylUrl}/HostChicken/authorize`,
      redirectPath: redirectPath || '/',
    });
  } catch (error) {
    console.error('SSO token generation error:', error);
    return NextResponse.json({ error: 'Failed to generate SSO token' }, { status: 500 });
  }
}