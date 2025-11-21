import type { Metadata } from "next";
import path from "path";
import { promises as fs } from "fs";
import { parseMarkdownWithFrontmatter } from "@/lib/md";

const CONTENT_BASE_PATH = path.join(process.cwd(), "content");

export const DEFAULT_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://HostChicken.com";
export const FALLBACK_SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "HostChicken";
export const SUPPORTED_LOCALES = ["en", "fr"] as const;
export const SOCIAL_IMAGE_PATH = "/logo.png";
const RAW_TWITTER_HANDLE = process.env.NEXT_PUBLIC_TWITTER_HANDLE ?? "@HostChicken";
export const TWITTER_HANDLE = RAW_TWITTER_HANDLE.startsWith("@")
  ? RAW_TWITTER_HANDLE
  : `@${RAW_TWITTER_HANDLE}`;
export const TWITTER_PROFILE_URL = `https://twitter.com/${TWITTER_HANDLE.replace(
  /^@/,
  ""
)}`;

export type MetadataFrontmatter = {
  title?: string;
  description?: string;
  keywords?: string[] | string;
  twitterTitle?: string;
  twitterDescription?: string;
  tagline?: string;
  productDescription?: string;
  supportEmail?: string;
  startingPrice?: string;
  startingCurrency?: string;
  modifiedAt?: string;
};

export type ResolvedMetadataContent = {
  title: string;
  description: string;
  keywords: string[];
  twitterTitle: string;
  twitterDescription: string;
  tagline: string;
  productDescription: string;
  supportEmail: string;
  startingPrice: string;
  startingCurrency: string;
  modifiedAt: string;
};

const DEFAULT_FALLBACK: ResolvedMetadataContent = {
  title: "HostChicken | Managed Game Server Hosting",
  description:
    "Deploy low-latency game servers with instant scaling, DDoS protection, and 24/7 gamer support.",
  keywords: [
    "game server hosting",
    "minecraft server hosting",
    "rust server hosting",
    "ark server hosting",
  ],
  twitterTitle: "Launch Lightning-Fast Game Servers | HostChicken",
  twitterDescription:
    "Spin up mod-ready Minecraft, Rust, and ARK servers with instant scaling and gamer-first support.",
  tagline: "Instant, DDoS-proof servers for your favorite games.",
  productDescription:
    "HostChicken delivers managed infrastructure, one-click modpacks, autoscaling resources, and real-time monitoring.",
  supportEmail: "support@HostChicken.com",
  startingPrice: "7.00",
  startingCurrency: "EUR",
  modifiedAt: "2024-11-07T00:00:00Z",
};

const safeString = (value: unknown, fallback: string): string => {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : fallback;
};

const toKeywordArray = (value: unknown): string[] | undefined => {
  if (Array.isArray(value)) {
    return value
      .filter((keyword): keyword is string => typeof keyword === "string")
      .map((keyword) => keyword.trim())
      .filter(Boolean);
  }

  if (typeof value === "string" && value.trim().length) {
    return [value.trim()];
  }

  return undefined;
};

const normalizeMetadata = (
  frontmatter: MetadataFrontmatter,
  fallback: ResolvedMetadataContent
): ResolvedMetadataContent => {
  return {
    title: safeString(frontmatter.title, fallback.title),
    description: safeString(frontmatter.description, fallback.description),
    keywords: toKeywordArray(frontmatter.keywords) ?? fallback.keywords,
    twitterTitle: safeString(
      frontmatter.twitterTitle,
      fallback.twitterTitle
    ),
    twitterDescription: safeString(
      frontmatter.twitterDescription,
      fallback.twitterDescription
    ),
    tagline: safeString(frontmatter.tagline, fallback.tagline),
    productDescription: safeString(
      frontmatter.productDescription,
      fallback.productDescription
    ),
    supportEmail: safeString(
      frontmatter.supportEmail,
      fallback.supportEmail
    ),
    startingPrice: safeString(
      frontmatter.startingPrice,
      fallback.startingPrice
    ),
    startingCurrency: safeString(
      frontmatter.startingCurrency,
      fallback.startingCurrency
    ),
    modifiedAt: safeString(frontmatter.modifiedAt, fallback.modifiedAt),
  };
};

const readMetadataFrontmatter = async (
  locale: string,
  slug: string
): Promise<MetadataFrontmatter | null> => {
  const filePath = path.join(CONTENT_BASE_PATH, locale, `${slug}.md`);
  try {
    const source = await fs.readFile(filePath, "utf8");
    const { frontmatter } = parseMarkdownWithFrontmatter(source);
    return frontmatter as MetadataFrontmatter;
  } catch {
    return null;
  }
};

export const getResolvedMarketingMetadata = async (
  locale: string,
  slug = "page"
): Promise<ResolvedMetadataContent> => {
  const baseFrontmatter =
    (await readMetadataFrontmatter("en", slug)) ?? undefined;
  const baseMetadata = baseFrontmatter
    ? normalizeMetadata(baseFrontmatter, DEFAULT_FALLBACK)
    : DEFAULT_FALLBACK;

  if (locale === "en") {
    return baseMetadata;
  }

  const localizedFrontmatter =
    (await readMetadataFrontmatter(locale, slug)) ?? undefined;

  if (!localizedFrontmatter) {
    return baseMetadata;
  }

  return normalizeMetadata(localizedFrontmatter, baseMetadata);
};

export const getLocalePath = (locale: string): string => {
  return SUPPORTED_LOCALES.includes(locale as (typeof SUPPORTED_LOCALES)[number])
    ? `/${locale}`
    : "/en";
};

export const getPagePath = (locale: string, slug = "page"): string => {
  const basePath = getLocalePath(locale);
  if (slug === "page") {
    return basePath;
  }
  return `${basePath}/${slug}`;
};

const buildLanguageAlternates = (slug = "page"): Record<string, string> => {
  return SUPPORTED_LOCALES.reduce<Record<string, string>>(
    (acc, lang) => {
      const base = `/${lang}`;
      acc[lang] = slug === "page" ? base : `${base}/${slug}`;
      return acc;
    },
    {
      "x-default": slug === "page" ? "/en" : `/en/${slug}`,
    }
  );
};

type BuildSeoMetadataOptions = {
  locale: string;
  slug?: string;
  metadata: ResolvedMetadataContent;
};

export const buildSeoMetadata = ({
  locale,
  slug = "page",
  metadata,
}: BuildSeoMetadataOptions): Metadata => {
  const pagePath = getPagePath(locale, slug);
  const languages = buildLanguageAlternates(slug);
  return {
    metadataBase: new URL(DEFAULT_URL),
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    alternates: {
      canonical: pagePath,
      languages,
    },
    openGraph: {
      type: "website",
      url: `${DEFAULT_URL}${pagePath}`,
      title: metadata.twitterTitle,
      description: metadata.twitterDescription,
      locale,
      siteName: FALLBACK_SITE_NAME,
      images: [
        {
          url: `${DEFAULT_URL}${SOCIAL_IMAGE_PATH}`,
          width: 512,
          height: 512,
          alt: metadata.twitterTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
      title: metadata.twitterTitle,
      description: metadata.twitterDescription,
      images: [`${DEFAULT_URL}${SOCIAL_IMAGE_PATH}`],
    },
  };
};

type BuildStructuredDataOptions = {
  locale: string;
  slug?: string;
  metadata: ResolvedMetadataContent;
  siteName?: string;
};

export const buildStructuredData = ({
  locale,
  slug = "page",
  metadata,
  siteName = FALLBACK_SITE_NAME,
}: BuildStructuredDataOptions) => {
  const keywords =
    metadata.keywords.length > 0 ? metadata.keywords.join(", ") : undefined;
  const pagePath = getPagePath(locale, slug);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: siteName,
        url: `${DEFAULT_URL}${pagePath}`,
        logo: `${DEFAULT_URL}${SOCIAL_IMAGE_PATH}`,
        description: metadata.description,
        sameAs: [TWITTER_PROFILE_URL],
        contactPoint: [
          {
            "@type": "ContactPoint",
            email: metadata.supportEmail,
            contactType: "customer support",
            availableLanguage: SUPPORTED_LOCALES,
          },
        ],
        slogan: metadata.tagline,
      },
      {
        "@type": "Product",
        name: metadata.title,
        description: metadata.productDescription,
        brand: siteName,
        dateModified: metadata.modifiedAt,
        ...(keywords ? { keywords } : {}),
        offers: {
          "@type": "Offer",
          price: metadata.startingPrice,
          priceCurrency: metadata.startingCurrency,
          availability: "https://schema.org/InStock",
          url: `${DEFAULT_URL}/create${
            slug !== "page" ? `/${slug}` : ""
          }`,
        },
      },
    ],
  };
};
