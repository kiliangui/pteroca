import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { GameLandingTemplate, type GameLandingContent } from "@/components/marketing/GameLandingTemplate";
import {
  buildSeoMetadata,
  buildStructuredData,
  getResolvedMarketingMetadata,
} from "@/lib/marketingMetadata";

const GAME_SLUG = "satisfactory";
const BACKGROUND_IMAGE = `/images/games/background/${GAME_SLUG}.png`;

type PageParams = {
  params: {
    locale: string;
  };
};

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const locale = params?.locale ?? "en";
  const marketingMetadata = await getResolvedMarketingMetadata(locale, GAME_SLUG);
  return buildSeoMetadata({
    locale,
    slug: GAME_SLUG,
    metadata: marketingMetadata,
  });
}

export default async function SatisfactoryLandingPage({ params }: PageParams) {
  const locale = params?.locale ?? "en";
  const t = await getTranslations({
    locale,
    namespace: `gameLanding.${GAME_SLUG}`,
  });

  const content: GameLandingContent = {
    hero: t.raw("hero") as GameLandingContent["hero"],
    stats: t.raw("stats") as GameLandingContent["stats"],
    features: t.raw("features") as GameLandingContent["features"],
    benefits: t.raw("benefits") as GameLandingContent["benefits"],
    cta: t.raw("cta") as GameLandingContent["cta"],
    faqs: t.raw("faqs") as GameLandingContent["faqs"],
  };

  const marketingMetadata = await getResolvedMarketingMetadata(locale, GAME_SLUG);
  const structuredData = buildStructuredData({
    locale,
    slug: GAME_SLUG,
    metadata: marketingMetadata,
  });

  return (
    <>
      <GameLandingTemplate
        locale={locale}
        gameSlug={GAME_SLUG}
        content={content}
        backgroundImage={BACKGROUND_IMAGE}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
}
