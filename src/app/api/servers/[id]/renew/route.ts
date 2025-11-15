import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import axios from 'axios';

interface RenewServerRequest {
  priceId: number;
  voucherCode?: string;
  paymentMethod: 'balance' | 'stripe';
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: RenewServerRequest = await request.json();
    const { priceId, voucherCode, paymentMethod } = body;

    const { id } = await params;

    // Get server
    const server = await prisma.server.findFirst({
      where: {
        id: parseInt(id),
        userId: session.user.id
      },
      include: {
        product: {
          include: {
            prices: true
          }
        },
        productPrice: true
      }
    });

    if (!server) {
      return NextResponse.json({ error: 'Server not found' }, { status: 404 });
    }

    // Validate selected price
    const selectedPrice = server.product?.prices.find(price => price.id === priceId);
    if (!selectedPrice) {
      return NextResponse.json({ error: 'Invalid price selected' }, { status: 400 });
    }

    // Calculate renewal price
    let finalPrice = parseFloat(selectedPrice.price);

    // Apply voucher if provided
    let appliedVoucher: any = null;
    if (voucherCode) {
      const voucher = await prisma.voucher.findUnique({
        where: { code: voucherCode },
      });

      if (!voucher || !voucher.isActive || (voucher.maxUses && voucher.uses >= voucher.maxUses) || (voucher.expiresAt && voucher.expiresAt < new Date())) {
        return NextResponse.json({ error: 'Invalid or expired voucher' }, { status: 400 });
      }

      if (voucher.type === 'percentage') {
        finalPrice = finalPrice * (1 - parseFloat(voucher.discount) / 100);
      } else {
        finalPrice = Math.max(0, finalPrice - parseFloat(voucher.discount));
      }

      appliedVoucher = voucher;
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Handle payment
    if (paymentMethod === 'balance') {
      const userBalance = parseFloat(user.balance || '0');
      if (userBalance < finalPrice) {
        return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
      }

      // Deduct from balance
      await prisma.user.update({
        where: { id: user.id },
        data: { balance: (userBalance - finalPrice).toString() },
      });

      // Create payment record
      await prisma.payment.create({
        data: {
          sessionId: `renew-${Date.now()}`,
          status: 'completed',
          amount: selectedPrice.price,
          currency: 'usd',
          balanceAmount: finalPrice.toString(),
          userId: user.id,
          usedVoucherId: appliedVoucher?.id,
          createdAt: new Date(),
        },
      });

      // Update voucher usage
      if (appliedVoucher) {
        await prisma.voucher.update({
          where: { id: appliedVoucher.id },
          data: { uses: { increment: 1 } },
        });
      }
    } else if (paymentMethod === 'stripe') {
      return NextResponse.json({ error: 'Stripe payment not implemented yet' }, { status: 501 });
    }

    // Call PHP backend to renew server
    try {
      await axios.post(`${process.env.PHP_BACKEND_URL}/api/servers/${server.id}/renew`, {
        priceId,
        voucherCode,
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.PHP_BACKEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      // Create log entry
      await prisma.log.create({
        data: {
          actionId: 'server_renewed',
          details: `Server "${server.name || `Server ${server.id}`}" renewed for $${finalPrice.toFixed(2)}`,
          userId: session.user.id,
          createdAt: new Date(),
        },
      });

      return NextResponse.json({ message: 'Server renewed successfully' });
    } catch (backendError) {
      console.error('Backend renewal error:', backendError);

      // Refund balance if renewal failed
      if (paymentMethod === 'balance') {
        const userBalance = parseFloat(user.balance || '0');
        await prisma.user.update({
          where: { id: user.id },
          data: { balance: (userBalance + finalPrice).toString() },
        });
      }

      return NextResponse.json({ error: 'Failed to renew server' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error renewing server:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}