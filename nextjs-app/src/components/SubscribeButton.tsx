'use client';

interface SubscribeButtonProps {
  stripePriceId?: string;
  productPriceId?: number;
  customerId?: string;
}

export default function SubscribeButton({ stripePriceId, productPriceId,customerId }: SubscribeButtonProps) {
  const handleSubscribe = async () => {
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        stripePriceId,
        productPriceId,
        customerId,
      }),
    });
    const { url } = await res.json();
    if (url) window.location.href = url;
  };

  return (
    <button
      onClick={handleSubscribe}
      className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
    >
      Subscribe
    </button>
  );
}