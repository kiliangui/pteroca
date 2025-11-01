import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const sig = headersList.get('stripe-signature');

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, sig!, endpointSecret);
    } catch (err) {
      console.error(`Webhook signature verification failed.`, (err as Error).message);
      return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;

        // Find the payment record
        const payment = await prisma.payment.findUnique({
          where: { sessionId: session.id },
          include: { user: true, usedVoucher: true },
        });

        if (!payment) {
          console.error('Payment not found for session:', session.id);
          return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
        }

        // Update payment status
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: 'completed' },
        });

        // Update user balance
        const currentBalance = parseFloat(payment.user.balance || '0');
        const balanceAmount = parseFloat(payment.balanceAmount);
        const newBalance = currentBalance + balanceAmount;

        await prisma.user.update({
          where: { id: payment.userId },
          data: { balance: newBalance.toString() },
        });

        // Update voucher usage if voucher was used
        if (payment.usedVoucherId) {
          await prisma.voucher.update({
            where: { id: payment.usedVoucherId },
            data: { uses: { increment: 1 } },
          });
        }

        // Create log entry
        await prisma.log.create({
          data: {
            actionId: 'payment_completed',
            details: `Payment of $${balanceAmount.toFixed(2)} completed. New balance: $${newBalance.toFixed(2)}`,
            userId: payment.userId,
          },
        });

        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}