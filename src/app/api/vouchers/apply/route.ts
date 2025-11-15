import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST /api/vouchers/apply - Apply voucher to calculate discounted amount
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { code, amount } = await request.json();

    if (!code || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Invalid voucher code or amount' }, { status: 400 });
    }

    const voucher = await prisma.voucher.findUnique({
      where: { code },
    });

    if (!voucher) {
      return NextResponse.json({ error: 'Voucher not found' }, { status: 404 });
    }

    if (!voucher.isActive) {
      return NextResponse.json({ error: 'Voucher is not active' }, { status: 400 });
    }

    if (voucher.maxUses && voucher.uses >= voucher.maxUses) {
      return NextResponse.json({ error: 'Voucher has reached maximum uses' }, { status: 400 });
    }

    if (voucher.expiresAt && voucher.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Voucher has expired' }, { status: 400 });
    }

    let discountedAmount = amount;

    if (voucher.type === 'percentage') {
      discountedAmount = amount * (1 - parseFloat(voucher.discount) / 100);
    } else {
      discountedAmount = Math.max(0, amount - parseFloat(voucher.discount));
    }

    return NextResponse.json({
      voucher: {
        code: voucher.code,
        discount: voucher.discount,
        type: voucher.type,
        expiresAt: voucher.expiresAt,
      },
      originalAmount: amount,
      discountedAmount: Math.round(discountedAmount * 100) / 100, // Round to 2 decimal places
      savings: Math.round((amount - discountedAmount) * 100) / 100,
    });
  } catch (error) {
    console.error('Error applying voucher:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}