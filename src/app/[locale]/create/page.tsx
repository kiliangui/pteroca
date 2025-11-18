"use client";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";

type GameCardConfig = {
  slug: string;
  name: string;
  background: string;
  freeTrial: boolean;
  features: string[];
};

export default function CreatePage() {
  const t = useTranslations("create");
  const games = t.raw("games") as GameCardConfig[];

  return (
    <div className="max-w-2/3 m-auto flex flex-col items-center">
      <h1 className="text-5xl font-bold text-gray-900 pt-12 dark:text-white mb-6 text-center w-full">
        {t("pageTitle")}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 w-full py-12">
        {games.map((game) => (
          <GameCard key={game.slug} game={game} freeTrialLabel={t("freeTrialBadge")} />
        ))}
      </div>
    </div>
  );
}

function GameCard({
  game,
  freeTrialLabel,
}: {
  game: GameCardConfig;
  freeTrialLabel: string;
}) {
  return (
    <Card
      onClick={() => {
        window.location.href = `/create/${game.slug}`;
      }}
      className="relative overflow-hidden text-white cursor-pointer h-64 pt-0"
    >
      <div
        className="h-full w-full absolute"
        style={{
          backgroundImage: `url(${game.background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
      </div>

      <div className="flex flex-col p-4">
        <CardHeader className="flex items-center justify-between" style={{ zIndex: "2" }}>
          <CardTitle className="text-4xl font-black">{game.name}</CardTitle>
          <CardDescription className="text-nowrap">
            {game.freeTrial && (
              <span className="text-lg text-white bg-green-600 py-1 px-2 rounded-xl font-bold">
                {freeTrialLabel}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <div className="px-4 pb-4" style={{ zIndex: "2" }}>
          <ul className="list-disc list-inside mb-4">
            {game.features.map((feature, index) => (
              <li key={index} className="text-md font-bold text-gray-200 dark:text-gray-300">
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}
