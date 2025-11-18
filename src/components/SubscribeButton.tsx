'use client';

import axios from "axios";
import { ArrowRight, Check } from "lucide-react";
import { useState } from "react";

interface SubscribeButtonProps {
  stripePriceId?: string;
  productPriceId?: number;
  content:any,
  game?:string
}

export default function SubscribeButton({ stripePriceId, productPriceId,content,game }: SubscribeButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

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
   
    setIsSubmitting(false);
  };

  const Icon = isSubmitting ? Check : ArrowRight;

  return (
    <button
      onClick={handleSubscribe}
      className={`group w-full sm:w-auto min-w-[320px] px-10 py-5 text-xl font-bold text-white rounded-xl transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer ${
        isSubmitting
          ? "bg-emerald-500 shadow-[0_15px_35px_rgba(16,185,129,0.4)]"
          : "bg-slate-900 shadow-[0_15px_35px_rgba(15,23,42,0.35)] hover:bg-black hover:shadow-[0_20px_45px_rgba(15,23,42,0.5)] active:scale-[0.99]"
      }`}
      disabled={isSubmitting}
    >
      <span>{isSubmitting ? "Redirection..." : content}</span>
      <Icon
        size={28}
        className={`transition-transform duration-300 ${
          isSubmitting ? "" : "group-hover:translate-x-1"
        }`}
      />
    </button>
  );
}
