'use client';

import axios from "axios";

interface SubscribeButtonProps {
  stripePriceId?: string;
  productPriceId?: number;
  content:any,
  game?:string
}

export default function SubscribeButton({ stripePriceId, productPriceId,content,game }: SubscribeButtonProps) {
  const handleSubscribe = async () => {
    if (stripePriceId=="freetrial"){
      const res = await axios.post("/api/servers/create/freetrial",{
        game:game
      })
      if (res.status==200) window.location.href = "/dashboard"

    }else{
      const res = await fetch("/api/create-checkout-session", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              stripePriceId,
              productPriceId,
              game:game
            }),
          });
          const { url } = await res.json();
          if (url) window.location.href = url;
    }
   
  };

  return (
    <button
      onClick={handleSubscribe}
      className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
    >
      {content}
    </button>
  );
}