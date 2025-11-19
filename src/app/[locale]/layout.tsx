import type {  Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "./globals.css";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import {
  buildSeoMetadata,
  buildStructuredData,
  getResolvedMarketingMetadata,
  FALLBACK_SITE_NAME,
} from "@/lib/marketingMetadata";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type LayoutParams = {
  params: {
    locale: string;
  };
};

export async function generateMetadata({
  params,
}: LayoutParams): Promise<Metadata> {
  const locale = params?.locale ?? "en";
  const resolvedMetadata = await getResolvedMarketingMetadata(locale, "page");
  return buildSeoMetadata({
    locale,
    slug: "page",
    metadata: resolvedMetadata,
  });
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  //@ts-expect-error oui
  const locale = params?.locale ?? "en";
  const messages = await getMessages({ locale });
  const resolvedMetadata = await getResolvedMarketingMetadata(locale, "page");
  const siteName = await prisma.setting.findFirst({
    where: {
      name: "site_name",
    },
  });
  const resolvedSiteName = siteName?.value ?? FALLBACK_SITE_NAME;
  const structuredData = buildStructuredData({
    locale,
    slug: "page",
    metadata: resolvedMetadata,
    siteName: resolvedSiteName,
  });

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <Header siteName={resolvedSiteName} />

            {children}
            <Footer />
          </Providers>
        </NextIntlClientProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
