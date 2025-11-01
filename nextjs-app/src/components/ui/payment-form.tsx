'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CreditCard, DollarSign } from 'lucide-react';
import { VoucherInput } from './voucher-input';

interface PaymentFormProps {
  onPayment: (amount: number, voucherCode?: string) => Promise<void>;
  isLoading?: boolean;
}

interface VoucherResult {
  voucher: {
    code: string;
    discount: string;
    type: string;
    expiresAt: string | null;
  };
  originalAmount: number;
  discountedAmount: number;
  savings: number;
}

export function PaymentForm({ onPayment, isLoading = false }: PaymentFormProps) {
  const [amount, setAmount] = useState<string>('');
  const [voucherResult, setVoucherResult] = useState<VoucherResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const paymentAmount = parseFloat(amount);
    if (!paymentAmount || paymentAmount <= 0) {
      return;
    }

    await onPayment(paymentAmount, voucherResult?.voucher.code);
  };

  const finalAmount = voucherResult ? voucherResult.discountedAmount : parseFloat(amount) || 0;

  const quickAmounts = [10, 25, 50, 100];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Add Balance
        </CardTitle>
        <CardDescription>
          Top up your account balance securely with Stripe
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              step="0.01"
              required
            />
          </div>

          <VoucherInput
            amount={parseFloat(amount) || 0}
            onVoucherApplied={setVoucherResult}
            voucherResult={voucherResult}
            disabled={isLoading}
          />

          {voucherResult && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Original Amount:</span>
                  <span>${voucherResult.originalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Discount:</span>
                  <span>-${voucherResult.savings.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Final Amount:</span>
                  <span>${voucherResult.discountedAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="font-medium">Total to Pay:</span>
              <span className="text-2xl font-bold text-blue-600">
                ${finalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading || !amount || parseFloat(amount) <= 0}
            className="w-full"
            size="lg"
          >
            {isLoading ? 'Processing...' : 'Proceed to Payment'}
          </Button>
        </form>

        <div className="mt-6">
          <Label className="text-sm font-medium">Quick Amounts</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {quickAmounts.map((quickAmount) => (
              <Button
                key={quickAmount}
                type="button"
                variant="outline"
                onClick={() => setAmount(quickAmount.toString())}
                disabled={isLoading}
              >
                ${quickAmount}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}