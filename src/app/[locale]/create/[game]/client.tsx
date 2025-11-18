"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";

import SubscribeButton from "@/components/SubscribeButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ProductPrice } from "@prisma/client";

type Offer = {
  id: number;
  name: string;
  memory: number;
  cpu: number;
  diskSpace: number;
  recommended?: boolean;
  prices: ProductPrice[];
};

const heroBackgrounds: Record<string, string> = {
  minecraft: "/images/games/minecraft.jpg",
  "minecraft-bedrock": "/images/games/bedrock.jpg",
  rust: "/images/games/rust.jpg",
  ark: "/images/games/ark.jpg",
  default: "/images/games/minecraft.jpg",
};

export function GameClient({ offers, game }: { offers: Offer[]; game: string }) {
  const t = useTranslations("create");
  const [offer, setOffer] = useState(() => offers?.[0]?.name ?? "");
  const [periodName, setPeriodName] = useState<"month" | "year">("month");
  const [period, setPeriod] = useState(1);
  const [priceId, setPriceId] = useState("");
  const [productId, setProductId] = useState("");

  useEffect(() => {
    const currentOffer = offers.find((ofr) => ofr.name === offer);
    if (offer === "freetrial") {
      setPriceId("freetrial");
      return;
    }
    if (currentOffer) {
      const price = currentOffer.prices.find(
        (price) => price.type === periodName && price.value === period
      );
      if (price?.stripePriceId) setPriceId(price.stripePriceId);
      if (currentOffer.id) setProductId(String(currentOffer.id));
    }
  }, [offer, offers, period, periodName]);

  const selectedOffer = offers.find((ofr) => ofr.name === offer);
  const recommendedLabel = t("flow.recommended");
  const durationChoices = useMemo(
    () => [
      { id: "month-1", label: t("flow.duration.monthly"), badge: null, type: "month" as const, value: 1 },
      { id: "month-3", label: t("flow.duration.quarterly"), badge: "-33%", type: "month" as const, value: 3 },
      { id: "year-1", label: t("flow.duration.yearly"), badge: "-43%", type: "year" as const, value: 1 },
    ],
    [t]
  );

  const currentPrice = useMemo(() => {
    if (!selectedOffer || offer === "freetrial") return { value: 0, label: t("flow.freeTrialCard") };
    const price = selectedOffer.prices.find(
      (price) => price.type === periodName && price.value === period
    );
    if (!price) return { value: 0, label: "" };
    const numericValue = Number(price.price);
    const label =
      periodName === "year"
        ? t("flow.duration.yearly")
        : period === 3
        ? t("flow.duration.quarterly")
        : t("flow.duration.monthly");
    return { value: numericValue, label };
  }, [offer, selectedOffer, periodName, period, t]);

  const formatDisplayPrice = (price: number) => {
    if (periodName === "year") return `${price}€/an`;
    if (period === 3 && periodName === "month") return `${price}€/3mo`;
    return `${price}€/mo`;
  };

  const summaryPerMonth =
    periodName === "year"
      ? currentPrice.value / 12
      : period === 3 && periodName === "month"
      ? currentPrice.value / 3
      : null;

  const normalizedKey = game.toLowerCase().replace(/\s+/g, "-");
  const heroImage = heroBackgrounds[normalizedKey] ?? heroBackgrounds.default;
  const selectedBaseMonthly =
    offer === "freetrial"
      ? 0
      : Number(
          selectedOffer?.prices.find((price) => price.type === "month" && price.value === 1)?.price ?? 0
        );

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">
      <Card className="relative overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-800">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
        <div className="relative z-10 flex flex-col gap-6 p-6 text-white">
          <div className="flex flex-col gap-3">
            <Link href="/create" className="inline-flex items-center gap-2 text-sm text-white/80">
              <ArrowLeft className="h-4 w-4" />
              {t("filters.all")}
            </Link>
            <div className="flex flex-col gap-2">
              <p className="text-sm uppercase tracking-[0.3em] text-white/70">{t("heroIntro")}</p>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight">{game}</h1>
              <p className="text-base text-white/80 max-w-2xl">{t("heroSubtitle")}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
              <Sparkles className="h-3 w-3" />
              {t("flow.offerDescription")}
            </span>
          </div>
        </div>
      </Card>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 md:p-6 shadow-sm">
        <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-4">
          {t("flow.duration.monthly")}
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {durationChoices.map((option) => {
            const isActive = periodName === option.type && period === option.value;
            return (
              <button
                key={option.id}
                onClick={() => {
                  setPeriodName(option.type);
                  setPeriod(option.value);
                }}
                className={cn(
                  "rounded-2xl border px-4 py-3 text-left transition-all",
                  isActive
                    ? "border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-300"
                    : "border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-300"
                )}
              >
                <p className="font-semibold">{option.label}</p>
                {option.badge && (
                  <span className="text-xs font-bold text-emerald-500">{option.badge}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {periodName === "month" && period === 1 && (
        <div
          className={cn(
            "rounded-2xl border px-6 py-4 flex items-center justify-between",
            offer === "freetrial"
              ? "border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-200"
              : "border-gray-200 dark:border-gray-800"
          )}
        >
          <div>
            <p className="text-lg font-semibold">{t("flow.freeTrialCard")}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t("flow.checkout")}</p>
          </div>
          <Button variant="outline" onClick={() => setOffer("freetrial")}>
            {t("flow.startFreeTrial")}
          </Button>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        {offers.map((current) => {
          const ram = Math.ceil(current.memory / 1024);
          const storage = Math.ceil(current.diskSpace / 1024);
          const cpu = current.cpu / 100;
          const basePrice = current.prices.find((price) => price.type === "month" && price.value === 1);
          const activePrice = current.prices.find(
            (price) => price.type === periodName && price.value === period
          );
          const baseValue = Number(basePrice?.price ?? 0);
          const activeValue = Number(activePrice?.price ?? baseValue);
          const normalizedPrice =
            periodName === "year"
              ? activeValue || baseValue
              : period === 3 && periodName === "month"
              ? activeValue
              : activeValue || baseValue;
          const perMonthValue =
            periodName === "year"
              ? normalizedPrice / 12
              : period === 3 && periodName === "month"
              ? normalizedPrice / 3
              : null;

          const isActive = offer === current.name;

          return (
            <OfferCard
              key={current.id}
              title={current.name}
              ram={ram}
              cpu={cpu}
              storage={storage}
              basePrice={baseValue}
              currentPrice={normalizedPrice ?? 0}
              billingLabel={
                periodName === "year"
                  ? t("flow.duration.yearly")
                  : period === 3
                  ? t("flow.duration.quarterly")
                  : t("flow.duration.monthly")
              }
              perMonthLabel={
                perMonthValue ? t("flow.perMonthApprox", { price: perMonthValue.toFixed(2) }) : null
              }
              savingsLabel={
                perMonthValue && baseValue > perMonthValue
                  ? t("flow.savingsLabel", { amount: (baseValue - perMonthValue).toFixed(2) })
                  : null
              }
              recommended={current.recommended}
              active={isActive}
              recommendedLabel={recommendedLabel}
              onSelect={() => setOffer(current.name)}
            />
          );
        })}
      </div>

      <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 flex flex-col gap-4 rounded-2xl shadow-sm">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
            {offer === "freetrial" ? t("flow.freeTrialCard") : t("flow.selectedPlan", { offer })}
          </p>
          <p className="text-3xl font-black text-gray-900 dark:text-white">
            {offer === "freetrial"
              ? t("flow.startFreeTrial")
              : formatDisplayPrice(currentPrice.value)}
          </p>
          {offer !== "freetrial" && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{currentPrice.label}</p>
          )}
          {summaryPerMonth && offer !== "freetrial" && (
            <div className="flex flex-col gap-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("flow.perMonthApprox", { price: summaryPerMonth.toFixed(2) })}
              </p>
              {selectedBaseMonthly > summaryPerMonth && (
                <p className="text-sm font-semibold text-emerald-500">
                  {t("flow.savingsLabel", {
                    amount: (selectedBaseMonthly - summaryPerMonth).toFixed(2),
                  })}
                </p>
              )}
            </div>
          )}
        </div>
        <SubscribeButton
          stripePriceId={priceId.toString()}
          productPriceId={Number(productId)}
          game={game}
          content={offer === "freetrial" ? t("flow.startFreeTrial") : t("flow.payNow")}
        />
      </Card>
    </div>
  );
}

function OfferCard({
  title,
  ram,
  cpu,
  storage,
  basePrice,
  currentPrice,
  billingLabel,
  perMonthLabel,
  savingsLabel,
  recommended,
  active,
  recommendedLabel,
  onSelect,
}: {
  title: string;
  ram: number;
  cpu: number;
  storage: number;
  basePrice: number;
  currentPrice: number;
  billingLabel: string;
  perMonthLabel: string | null;
  savingsLabel: string | null;
  recommended?: boolean;
  active: boolean;
  recommendedLabel: string;
  onSelect: () => void;
}) {
  const hasDiscount = currentPrice < basePrice;
  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full rounded-3xl border text-left p-6 transition-all",
        active
          ? recommended
            ? "border-purple-500 shadow-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10"
            : "border-blue-500 shadow-xl bg-gradient-to-br from-blue-500/5 to-purple-500/5"
          : recommended
          ? "border-purple-500 bg-gradient-to-br from-purple-500/5 to-pink-500/5 shadow"
          : "border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700"
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-xl font-bold text-gray-900 dark:text-white">{title}</p>
        {recommended && (
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-300">
            {recommendedLabel}
          </span>
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-300">
        <Badge>{ram}GB RAM</Badge>
        <Badge>{cpu} vCPU</Badge>
        <Badge>{storage}GB SSD</Badge>
      </div>
      <div className="mt-6 flex items-end gap-3">
        <p className="text-3xl font-black text-gray-900 dark:text-white">{currentPrice}€</p>
        <span className="text-sm text-gray-500 dark:text-gray-400">{billingLabel}</span>
      </div>
      {hasDiscount && (
        <p className="text-sm text-gray-500 line-through mt-1">{basePrice}€/mo</p>
      )}
      {perMonthLabel && (
        <div className="mt-2 space-y-1">
          <p className="text-sm text-gray-600 dark:text-gray-400">{perMonthLabel}</p>
          {savingsLabel && (
            <p className="text-sm font-semibold text-emerald-500">{savingsLabel}</p>
          )}
        </div>
      )}
    </button>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 px-3 py-1 text-xs font-semibold">
      {children}
    </span>
  );
}
