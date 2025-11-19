export type ShowcaseGame = {
  value: string;
  title: string;
  description: string;
  image: string;
  highlights: string[];
};

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
  },
  {
    value: "satisfactory",
    title: "Satisfactory",
    description: "Create complete factory and automate anything.",
    image: "/images/games/background/satisfactory.png",
    highlights: ["Cross-platform", "Auto saves", "Mod-friendly"],
  },
];
