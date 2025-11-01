import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/servers/[id] - Get specific server details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const server = await prisma.server.findFirst({
      where: {
        id: parseInt(params.id),
        userId: session.user.id,
        deletedAt: null,
      },
      include: {
        serverProduct: {
          include: {
            originalProduct: true,
            prices: true,
          },
        },
        logs: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
        subusers: true,
      },
    });

    if (!server) {
      return NextResponse.json({ error: 'Server not found' }, { status: 404 });
    }

    return NextResponse.json({ server });
  } catch (error) {
    console.error('Error fetching server:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}