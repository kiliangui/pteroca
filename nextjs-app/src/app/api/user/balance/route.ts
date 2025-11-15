import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

// GET /api/user/balance - Get user balance
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { balance: true,stripeId:true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const stripeSecretKey = await prisma.setting.findUnique({
          where: { name: "stripe_secret_key" },
        });
    if (!user.stripeId ||!stripeSecretKey ) return NextResponse.json({
      balance: parseFloat(user.balance || '0'),
    });
    const stripe = new Stripe(stripeSecretKey.value);
    const stripeSubscriptions = await stripe.subscriptions.list({
      customer:user.stripeId
    })
    const stripeInvoices = await stripe.invoices.list({
      customer:user.stripeId
    })

    return NextResponse.json({
      balance: parseFloat(user.balance || '0'),
      subscriptions:stripeSubscriptions.data,
      invoices:stripeInvoices.data
    });
  } catch (error) {
    console.error('Error fetching balance:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/user/balance - Update user balance (admin only or for specific operations)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, reason } = await request.json();

    if (typeof amount !== 'number' || amount < 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const currentBalance = parseFloat(user.balance || '0');
    const newBalance = currentBalance + amount;

    await prisma.user.update({
      where: { id: session.user.id },
      data: { balance: newBalance.toString() },
    });

    // Create log entry
    await prisma.log.create({
      data: {
        actionId: 'balance_updated',
        details: `Balance updated by $${amount.toFixed(2)}. New balance: $${newBalance.toFixed(2)}. Reason: ${reason || 'Manual adjustment'}`,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      balance: newBalance,
      message: 'Balance updated successfully',
    });
  } catch (error) {
    console.error('Error updating balance:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}