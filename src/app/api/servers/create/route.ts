import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { pterodactylSyncService } from '@/lib/pterodactyl';
import axios from 'axios';

interface CreateServerRequest {
  productId: number;
  eggId: number;
  priceId: number;
  serverName: string;
  autoRenewal: boolean;
  voucherCode?: string;
  slots?: number;
  paymentMethod: 'balance' | 'stripe';
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: CreateServerRequest = await request.json();
    const { productId, eggId, priceId, serverName, autoRenewal, voucherCode, slots, paymentMethod } = body;

    // Validate required fields
    if (!productId || !eggId || !priceId || !serverName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get product with prices
    const product = await prisma.product.findUnique({
      where: { id: productId, isActive: true },
      include: { prices: true },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Validate selected price
    const selectedPrice = product.prices.find((price) => price.id === priceId);
    if (!selectedPrice) {
      return NextResponse.json({ error: 'Invalid price selected' }, { status: 400 });
    }

    // Calculate base price
    let finalPrice = parseFloat(selectedPrice.price);

    // Apply voucher if provided
    let appliedVoucher;
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
          sessionId: `balance-${Date.now()}`,
          status: 'completed',
          amount: selectedPrice.price,
          currency: 'usd',
          balanceAmount: finalPrice.toString(),
          userId: user.id,
          usedVoucherId: appliedVoucher ? appliedVoucher?.id : null ,
          createdAt: new Date()
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
      // For Stripe, we'd create a checkout session, but for now we'll assume balance payment
      // In a full implementation, this would redirect to Stripe
      return NextResponse.json({ error: 'Stripe payment not implemented yet' }, { status: 501 });
    }

    // Call PHP backend to create server
    try {
      const phpResponse = await axios.post(`${process.env.PHP_BACKEND_URL}/api/servers/create`, {
        userId: user.id,
        productId,
        eggId,
        priceId,
        serverName,
        autoRenewal,
        voucherCode,
        slots,
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.PHP_BACKEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      const { server } = phpResponse.data;

      // Create log entry
      await prisma.log.create({
        data: {
          actionId: 'server_created',
          details: `Server "${serverName}" created successfully. Product: ${product.name}, Price: $${finalPrice.toFixed(2)}`,
          userId: user.id,
          createdAt:new Date()
        },
      });

      // Sync server status after creation
      try {
        await pterodactylSyncService.syncServerStatus(server.id);
      } catch (syncError) {
        console.error('Failed to sync server status after creation:', syncError);
        // Don't fail the request if sync fails
      }

      return NextResponse.json({
        message: 'Server created successfully',
        server: {
          id: server.id,
          pterodactylServerId: server.pterodactylServerId,
          pterodactylServerIdentifier: server.pterodactylServerIdentifier,
          name: server.name,
          expiresAt: server.expiresAt,
          autoRenewal: server.autoRenewal,
        },
      });

    } catch (phpError) {
      console.error('PHP backend error:', phpError);

      // Refund balance if server creation failed
      if (paymentMethod === 'balance') {
        const userBalance = parseFloat(user.balance || '0');
        await prisma.user.update({
          where: { id: user.id },
          data: { balance: (userBalance + finalPrice).toString() },
        });
      }

      return NextResponse.json({
        error: 'Failed to create server',
        details: 'Server creation failed on backend'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error creating server:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}