'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, DollarSign, Tag, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { format } from 'date-fns';

interface Transaction {
  id: string;
  type: 'payment' | 'adjustment';
  amount: number;
  originalAmount?: number;
  currency: string;
  status: string;
  createdAt: string;
  voucher?: {
    code: string;
    discount: string;
    type: string;
  };
  details?: string;
}

interface TransactionDisplayProps {
  transaction: Transaction;
  showDetails?: boolean;
}

export function TransactionDisplay({ transaction, showDetails = false }: TransactionDisplayProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <CreditCard className="h-4 w-4" />;
      case 'adjustment':
        return <DollarSign className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const formatAmount = (amount: number, currency: string = 'usd') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  const isPositive = transaction.amount >= 0;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-full">
              {getTypeIcon(transaction.type)}
            </div>
            <div>
              <div className="font-medium capitalize">{transaction.type}</div>
              <div className="text-sm text-muted-foreground">
                {format(new Date(transaction.createdAt), 'MMM dd, yyyy HH:mm')}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-lg font-bold flex items-center gap-1 ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {isPositive ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : (
                <ArrowDownRight className="h-4 w-4" />
              )}
              {formatAmount(Math.abs(transaction.amount), transaction.currency)}
            </div>
            {getStatusBadge(transaction.status)}
          </div>
        </div>

        {transaction.voucher && (
          <div className="mt-3 flex items-center gap-2">
            <Tag className="h-3 w-3 text-blue-600" />
            <span className="text-sm text-blue-600">
              Voucher: {transaction.voucher.code} ({transaction.voucher.discount}
              {transaction.voucher.type === 'percentage' ? '%' : '$'} off)
            </span>
          </div>
        )}

        {transaction.originalAmount && transaction.originalAmount !== transaction.amount && (
          <div className="mt-2 text-sm text-muted-foreground">
            Original: {formatAmount(transaction.originalAmount, transaction.currency)}
          </div>
        )}

        {showDetails && transaction.details && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-muted-foreground">
              {transaction.details}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}