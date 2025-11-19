import {
  DEFAULT_URL,
  SUPPORTED_LOCALES,
  getResolvedMarketingMetadata,
} from "@/lib/marketingMetadata";
import { showcaseGames } from "@/lib/gameData";
import { prisma } from "@/lib/prisma";

const baseUrlRes = await prisma.setting.findFirst({
  where:{
    name:"site_url"
  }
})
const baseUrl =baseUrlRes?.value.endsWith("/") ? baseUrlRes?.value.slice(0,-1) : baseUrlRes?.value
const lastModified = new Date().toISOString();

const buildLocaleLinks = (path = "") =>
  SUPPORTED_LOCALES.map((locale) => ({
    lang: locale,
    url: `${baseUrl}/${locale}${path}`,
  }));

export default async function sitemap() {
  const routes = [];
  const rootMetadata = await getResolvedMarketingMetadata("en", "page");
//@ts-expect-error oui
  routes.push({
    url: baseUrl,
    lastModified: rootMetadata.modifiedAt,
    links: buildLocaleLinks(),
  });

  for (const locale of SUPPORTED_LOCALES) {
    const metadata = await getResolvedMarketingMetadata(locale, "page");
//@ts-expect-error oui
    routes.push({
      url: `${baseUrl}/${locale}`,
      lastModified: metadata.modifiedAt,
      links: buildLocaleLinks(),
    });
  }

  const gameSlugs = showcaseGames.map((game) => game.value);
  for (const slug of gameSlugs) {
    for (const locale of SUPPORTED_LOCALES) {
      const metadata = await getResolvedMarketingMetadata(locale, slug);
//@ts-expect-error oui
      routes.push({
        url: `${baseUrl}/${locale}/${slug}`,
        lastModified: metadata.modifiedAt,
        links: buildLocaleLinks(`/${slug}`),
      });
    }
  }

  return routes;
}
