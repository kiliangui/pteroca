'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CreditCard, DollarSign, Tag, FileText, Calendar, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BalanceData {
  balance: number;
  invoices?: any[];
  subscriptions?: any[];
  manageUrl?: string;
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

export default function BalancePage() {
  const { data: session } = useSession();
  const [balance, setBalance] = useState<number>(0);
  const [manageUrl, setManageUrl] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [invoices, setInvoices] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [voucherCode, setVoucherCode] = useState<string>('');
  const [voucherResult, setVoucherResult] = useState<VoucherResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const response = await fetch('/api/user/balance');
      if (response.ok) {
        const data: BalanceData = await response.json();
        setBalance(data.balance);
        setSubscriptions(data?.subscriptions || []);
        setManageUrl(data?.manageUrl || "")
        setInvoices(data?.invoices || []);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const applyVoucher = async () => {
    if (!voucherCode.trim() || !amount) return;

    setIsApplyingVoucher(true);
    setError(null);

    try {
      const response = await fetch('/api/vouchers/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: voucherCode.trim(),
          amount: parseFloat(amount),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setVoucherResult(data);
      } else {
        setError(data.error);
        setVoucherResult(null);
      }
    } catch (error) {
      setError('Failed to apply voucher');
      setVoucherResult(null);
    } finally {
      setIsApplyingVoucher(false);
    }
  };

  const handlePayment = async () => {
    const paymentAmount = voucherResult ? voucherResult.discountedAmount : parseFloat(amount);

    if (!paymentAmount || paymentAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/payments/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          voucherCode: voucherCode.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Failed to create payment session');
    } finally {
      setIsLoading(false);
    }
  };

  const clearVoucher = () => {
    setVoucherCode('');
    setVoucherResult(null);
    setError(null);
  };

  // Check for success/cancel parameters in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      setSuccess('Payment successful! Your balance has been updated.');
      fetchBalance();
      // Clear URL parameters
      window.history.replaceState({}, '', window.location.pathname);
    } else if (urlParams.get('canceled') === 'true') {
      setError('Payment was canceled.');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const finalAmount = voucherResult ? voucherResult.discountedAmount : parseFloat(amount) || 0;

  const getStatusBadge = (status: string) => {
    const statusColors = {
      active: 'bg-green-100 text-green-800',
      canceled: 'bg-red-100 text-red-800',
      past_due: 'bg-yellow-100 text-yellow-800',
      unpaid: 'bg-red-100 text-red-800',
      paid: 'bg-green-100 text-green-800',
      draft: 'bg-gray-100 text-gray-800',
      open: 'bg-blue-100 text-blue-800',
    };

    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Balance & Billing</h1>
        <p className="text-muted-foreground mt-2">Manage your account balance, subscriptions, and billing history</p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <Alert className="border-green-200 bg-green-50 mb-6">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Balance & Top-up */}
        <div className="space-y-6">
          {/* Current Balance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Current Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                ${balance.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          {/* Top-up Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Top Up Balance
              </CardTitle>
              <CardDescription>
                Add funds to your account using Stripe payment processing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    if (voucherResult) {
                      clearVoucher();
                    }
                  }}
                  min="1"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="voucher">Voucher Code (Optional)</Label>
                <div className="flex gap-2">
                  <Input
                    id="voucher"
                    placeholder="Enter voucher code"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={applyVoucher}
                    disabled={isApplyingVoucher || !voucherCode.trim() || !amount}
                  >
                    {isApplyingVoucher ? 'Applying...' : 'Apply'}
                  </Button>
                </div>
              </div>

              {voucherResult && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800">Voucher Applied</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={clearVoucher}>
                      Remove
                    </Button>
                  </div>
                  <div className="mt-2 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Original Amount:</span>
                      <span>${voucherResult.originalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>Discount ({voucherResult.voucher.discount}{voucherResult.voucher.type === 'percentage' ? '%' : '$'}):</span>
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
                onClick={handlePayment}
                disabled={isLoading || !amount || parseFloat(amount) <= 0}
                className="w-full"
                size="lg"
              >
                {isLoading ? 'Processing...' : 'Proceed to Payment'}
              </Button>
            </CardContent>
          </Card>

          {/* Quick Amount Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Amounts</CardTitle>
              <CardDescription>Choose from preset amounts for quick top-up</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {[10, 25, 50, 100, 250, 500].map((quickAmount) => (
                  <Button
                    key={quickAmount}
                    variant="outline"
                    onClick={() => {
                      setAmount(quickAmount.toString());
                      if (voucherResult) {
                        clearVoucher();
                      }
                    }}
                  >
                    ${quickAmount}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Subscriptions & Invoices */}
        <div className="space-y-6">
          {/* Subscriptions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Subscriptions
              </CardTitle>
              <CardDescription>
                Your active and past subscriptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {subscriptions && subscriptions.length > 0 ? (
                <div className="space-y-4">
                  {subscriptions.map((subscription, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">
                          {subscription?.plan?.name || 'Subscription'}
                        </h3>
                        {getStatusBadge(subscription?.status || 'unknown')}
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex justify-between">
                          <span>Amount:</span>
                          <span>${(subscription?.plan.amount/100).toString() || '0.00'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Current Period:</span>
                          <span>
                            {subscription?.current_period_start && new Date(subscription.current_period_start * 1000).toLocaleDateString()} - 
                            {subscription?.current_period_end && new Date(subscription.current_period_end * 1000).toLocaleDateString()}
                          </span>
                        </div>
                        {subscription?.canceled_at && (
                          <div className="flex justify-between text-red-600">
                            <span>Canceled:</span>
                            <span>{new Date(subscription.canceled_at * 1000).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button onClick={()=>{
                    window.location.href = manageUrl
                  }}>Manage Subscriptions</Button>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No subscriptions found</p>
                  <p className="text-sm">Your active subscriptions will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Invoices */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Invoices
              </CardTitle>
              <CardDescription>
                Your billing history and invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              {invoices && invoices.length > 0 ? (
                <div className="space-y-4">
                  {invoices.map((invoice, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">
                          Invoice #{invoice?.number || `INV-${index + 1}`}
                        </h3>
                        {getStatusBadge(invoice?.status || 'unknown')}
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex justify-between">
                          <span>Amount:</span>
                          <span>${(invoice?.amount_due/100 || 0 / 100).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Date:</span>
                          <span>{invoice?.created && new Date(invoice.created * 1000).toLocaleDateString()}</span>
                        </div>
                        {invoice?.due_date && (
                          <div className="flex justify-between">
                            <span>Due Date:</span>
                            <span>{new Date(invoice.due_date * 1000).toLocaleDateString()}</span>
                          </div>
                        )}
                        {invoice?.hosted_invoice_url && (
                          <div className="mt-2">
                            <Button variant="outline" size="sm" asChild>
                              <a href={invoice.hosted_invoice_url} target="_blank" rel="noopener noreferrer">
                                View Invoice
                              </a>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No invoices found</p>
                  <p className="text-sm">Your invoice history will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}