'use client';

import Link from "next/link";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const CONVERSION_STORAGE_KEY = "conversionPushed";
const GTAG_ID = "AW-313446119";

export default function Page() {
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get("session_id") ?? null;

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    const conversionAlreadyPushed = window.localStorage.getItem(
      CONVERSION_STORAGE_KEY,
    );
    if (conversionAlreadyPushed) {
      return;
    }

    const sendConversion = () => {
      const gtag = (window as typeof window & {
        gtag?: (...args: unknown[]) => void;
        dataLayer?: Array<Record<string, unknown>>;
      }).gtag;

      if (typeof gtag === "function") {
        gtag("event", "subscription_created", {
          send_to: GTAG_ID,
          transaction_id: sessionId,
        });
      } else {
        //@ts-expect-error Datalayer on layout
        window?.dataLayer = window.dataLayer || [];
        //@ts-expect-error Datalayer on layout
        window?.dataLayer.push({
          event: "subscription_created",
          send_to: GTAG_ID,
          transaction_id: sessionId,
        });
      }

      window.localStorage.setItem(CONVERSION_STORAGE_KEY, "true");
    };

    sendConversion();
  }, [sessionId]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12 text-center">
      <h1 className="text-3xl font-semibold text-slate-900">
        Thank you for your payment!
      </h1>
      <p className="mt-3 text-base text-slate-600">
        We are processing your subscription. You can return to your dashboard to
        review the details.
      </p>
      {sessionId ? (
        <p className="mt-4 text-sm text-slate-500">
          Session ID: <span className="font-mono">{sessionId}</span>
        </p>
      ) : (
        <p className="mt-4 text-sm text-slate-500">
          No Stripe session detected.
        </p>
      )}
      <Link
        href="/dashboard"
        className="mt-8 inline-flex items-center justify-center rounded-full border border-transparent bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900"
      >
        Go to dashboard
      </Link>
    </div>
  );
}
