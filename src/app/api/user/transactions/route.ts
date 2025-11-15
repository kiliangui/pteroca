import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/user/transactions - Get user transaction history
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Get payments
    const payments = await prisma.payment.findMany({
      where: { userId: session.user.id },
      include: {
        usedVoucher: {
          select: { code: true, discount: true, type: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    });

    // Get logs related to balance changes
    const balanceLogs = await prisma.log.findMany({
      where: {
        userId: session.user.id,
        actionId: { in: ['payment_completed', 'balance_updated'] },
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    });

    // Combine and sort transactions
    const transactions = [
      ...payments.map(payment => ({
        id: payment.id,
        type: 'payment' as const,
        amount: parseFloat(payment.balanceAmount),
        originalAmount: parseFloat(payment.amount),
        currency: payment.currency,
        status: payment.status,
        createdAt: payment.createdAt,
        voucher: payment.usedVoucher ? {
          code: payment.usedVoucher.code,
          discount: payment.usedVoucher.discount,
          type: payment.usedVoucher.type,
        } : null,
      })),
      ...balanceLogs.map(log => ({
        id: log.id,
        type: 'adjustment' as const,
        amount: 0, // Will be parsed from details
        currency: 'usd',
        status: 'completed',
        createdAt: log.createdAt,
        details: log.details,
      })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Get total count for pagination
    const totalPayments = await prisma.payment.count({
      where: { userId: session.user.id },
    });

    const totalLogs = await prisma.log.count({
      where: {
        userId: session.user.id,
        actionId: { in: ['payment_completed', 'balance_updated'] },
      },
    });

    const total = totalPayments + totalLogs;

    return NextResponse.json({
      transactions: transactions.slice(0, limit),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}