"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export type ShowcaseGame = {
  value: string
  title: string
  description: string
  image: string
  highlights: string[]
}

export const showcaseGames: ShowcaseGame[] = [
  {
    value: "minecraft",
    title: "Minecraft",
    description: "Creative communities, modded adventures and limitless worlds running 24/7.",
    image: "/images/games/background/minecraft.png",
    highlights: ["Java + Bedrock", "Unlimited mods", "Instant backups"],
  },
  {
    value: "rust",
    title: "Rust",
    description: "Fast respawns, intense raids and low latency for survival clans.",
    image: "/images/games/background/rust.png",
    highlights: ["DDoS protection", "Region choice", "Priority support"],
  },
  {
    value: "ark",
    title: "ARK: Survival",
    description: "Tame dinosaurs, build mega-bases and conquer islands with friends.",
    image: "/images/games/background/ark.png",
    highlights: ["Cross-platform", "Auto saves", "Mod-friendly"],
  },{
    value: "satisfactory",
    title: "Satisfactory",
    description: "Create complete factory and automate anything.",
    image: "/images/games/background/satisfactory.png",
    highlights: ["Cross-platform", "Auto saves", "Mod-friendly"],
  },
]

type AuthGameShowcaseProps = {
  badgeLabel: string
  game: ShowcaseGame
  className?: string
  noBorder?: boolean
}

export function AuthGameShowcase({ badgeLabel, game, className, noBorder }: AuthGameShowcaseProps) {
  return (
    <div
      className={cn(
        "relative min-h-[520px] overflow-hidden rounded-[32px] bg-slate-900/40 shadow-[0_35px_90px_rgba(2,6,23,0.9)]",
        noBorder ? "border-0" : "border border-white/20",
        className
      )}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={game.value}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9 }}
          className="pointer-events-none absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${game.image})` }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-900/40 to-indigo-950/80" />
      <div className="relative z-10 flex h-full flex-col justify-between p-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-slate-200/80">
            <Sparkles className="h-4 w-4 text-emerald-300" />
            <span>{badgeLabel}</span>
          </div>
          <div>
            <h3 className="text-3xl font-black text-white sm:text-4xl">{game.title}</h3>
            <p className="mt-3 max-w-xl text-sm text-white/80">{game.description}</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-white/80">
          {game.highlights.map((highlight) => (
            <span
              key={highlight}
              className="rounded-full border border-white/30 bg-white/10 px-3 py-1"
            >
              {highlight}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
