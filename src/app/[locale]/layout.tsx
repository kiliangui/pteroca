import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import "./globals.css";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/Footer";
import { prisma } from "@/lib/prisma";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export async function generateMetadata({ params }: { params}): Promise<Metadata> {
  //@ts-expect-error idk
  const t = await getTranslations('metadata', params.locale);

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params;
}>) {
  const messages = await getMessages({ locale: params.locale });
  //@ts-expect-error idk
  const t = await getTranslations('metadata', params.locale);
  const locale = params.locale;
  const siteName = await prisma.setting.findFirst({
    where:{
      name:"site_name"
    }
  })
  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <Header siteName={siteName?.value}/>

            {children}
            <Footer />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
