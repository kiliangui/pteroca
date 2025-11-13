declare module '@/components/Checkout' {
  import type React from 'react';

  export type CheckoutProps = {
    stripePriceId?: string;
    productPriceId?: number;
  };

  const Checkout: React.FC<CheckoutProps>;
  export default Checkout;
}