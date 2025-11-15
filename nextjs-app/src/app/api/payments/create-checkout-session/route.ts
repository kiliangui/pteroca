import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import Stripe from 'stripe';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, voucherCode } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let finalAmount = amount;
    let usedVoucherId: number | null = null;

    // Apply voucher if provided
    if (voucherCode) {
      const voucher = await prisma.voucher.findUnique({
        where: { code: voucherCode },
      });

      if (!voucher || !voucher.isActive || (voucher.maxUses && voucher.uses >= voucher.maxUses) || (voucher.expiresAt && voucher.expiresAt < new Date())) {
        return NextResponse.json({ error: 'Invalid or expired voucher' }, { status: 400 });
      }

      if (voucher.type === 'percentage') {
        finalAmount = amount * (1 - parseFloat(voucher.discount) / 100);
      } else {
        finalAmount = Math.max(0, amount - parseFloat(voucher.discount));
      }

      usedVoucherId = voucher.id;
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        sessionId: '', // Will be updated after Stripe session creation
        amount: amount.toString(),
        currency: 'usd',
        balanceAmount: finalAmount.toString(),
        userId: session.user.id,
        usedVoucherId,
        createdAt: new Date(),
      },
    });

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Balance Top-up',
              description: `Add $${finalAmount.toFixed(2)} to your account balance`,
            },
            unit_amount: Math.round(finalAmount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/dashboard/balance?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/balance?canceled=true`,
      metadata: {
        paymentId: payment.id.toString(),
        userId: session.user.id,
      },
    });

    // Update payment with session ID
    await prisma.payment.update({
      where: { id: payment.id },
      data: { sessionId: checkoutSession.id },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}