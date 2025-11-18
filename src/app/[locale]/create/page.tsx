"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type GameCardConfig = {
  slug: string;
  name: string;
  background: string;
  freeTrial: boolean;
  features: string[];
};

type Filter = "all" | "trial" | "premium";

export default function CreatePage() {
  const createT = useTranslations("create");
  const rootT = useTranslations();
  const games = createT.raw("games") as GameCardConfig[];
  const readyLabel = rootT("hero.readyToDeploy");
  const [filter, setFilter] = useState<Filter>("all");

  const filteredGames = useMemo(() => {
    if (filter === "trial") return games.filter((game) => game.freeTrial);
    if (filter === "premium") return games.filter((game) => !game.freeTrial);
    return games;
  }, [games, filter]);

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: createT("filters.all") },
    { id: "trial", label: createT("filters.trial") },
    { id: "premium", label: createT("filters.premium") },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <section className="max-w-6xl mx-auto px-4 py-16 space-y-10">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-500/20 dark:to-purple-500/20 px-4 py-2 text-sm font-semibold text-blue-700 dark:text-blue-200">
            <Sparkles className="h-4 w-4" />
            {createT("heroIntro")}
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">
              {createT("pageTitle")}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {createT("heroSubtitle")}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {filters.map((chip) => (
            <button
              key={chip.id}
              onClick={() => setFilter(chip.id)}
              className={cn(
                "px-5 py-2 rounded-full border text-sm font-semibold transition-all",
                filter === chip.id
                  ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                  : "border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-500"
              )}
            >
              {chip.label}
            </button>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {filteredGames.map((game, index) => (
            <motion.div
              key={game.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
            >
              <GameCard
                game={game}
                freeTrialLabel={createT("freeTrialBadge")}
                readyLabel={readyLabel}
                ctaLabel={createT("cardCta")}
              />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

function GameCard({
  game,
  freeTrialLabel,
  readyLabel,
  ctaLabel,
}: {
  game: GameCardConfig;
  freeTrialLabel: string;
  readyLabel: string;
  ctaLabel: string;
}) {
  return (
    <Link href={`/create/${game.slug}`} className="group">
      <Card className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gray-900 text-white shadow-lg transition-transform group-hover:-translate-y-1 dark:border-gray-800">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${game.background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="relative z-10 flex h-full flex-col justify-between p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-black tracking-tight">{game.name}</h3>
            {game.freeTrial && (
              <span className="inline-flex items-center rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                {freeTrialLabel}
              </span>
            )}
          </div>
          <div className="space-y-4">
            <p className="text-sm text-white/80">{readyLabel}</p>
            <div className="flex flex-wrap gap-2">
              {game.features.slice(0, 4).map((feature) => (
                <span
                  key={feature}
                  className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-white/10 backdrop-blur px-4 py-3 text-sm font-semibold">
            <span>{game.freeTrial ? freeTrialLabel : ctaLabel}</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </Card>
    </Link>
  );
}
