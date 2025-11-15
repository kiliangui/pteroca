'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tag, X } from 'lucide-react';

interface VoucherInputProps {
  amount: number;
  onVoucherApplied: (result: VoucherResult | null) => void;
  voucherResult: VoucherResult | null;
  disabled?: boolean;
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

export function VoucherInput({ amount, onVoucherApplied, voucherResult, disabled }: VoucherInputProps) {
  const [voucherCode, setVoucherCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applyVoucher = async () => {
    if (!voucherCode.trim() || !amount) return;

    setIsApplying(true);
    setError(null);

    try {
      const response = await fetch('/api/vouchers/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: voucherCode.trim(),
          amount,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onVoucherApplied(data);
      } else {
        setError(data.error);
        onVoucherApplied(null);
      }
    } catch (error) {
      setError('Failed to apply voucher');
      onVoucherApplied(null);
    } finally {
      setIsApplying(false);
    }
  };

  const removeVoucher = () => {
    setVoucherCode('');
    setError(null);
    onVoucherApplied(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      applyVoucher();
    }
  };

  if (voucherResult) {
    return (
      <div className="space-y-2">
        <Label>Voucher Applied</Label>
        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-green-600" />
            <div>
              <div className="font-medium text-green-800">{voucherResult.voucher.code}</div>
              <div className="text-sm text-green-600">
                {voucherResult.voucher.discount}
                {voucherResult.voucher.type === 'percentage' ? '%' : '$'} off
              </div>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={removeVoucher}
            className="text-green-600 hover:text-green-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="voucher-code">Voucher Code (Optional)</Label>
      <div className="flex gap-2">
        <Input
          id="voucher-code"
          placeholder="Enter voucher code"
          value={voucherCode}
          onChange={(e) => setVoucherCode(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled || isApplying}
        />
        <Button
          type="button"
          variant="outline"
          onClick={applyVoucher}
          disabled={disabled || isApplying || !voucherCode.trim() || !amount}
        >
          {isApplying ? 'Applying...' : 'Apply'}
        </Button>
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}