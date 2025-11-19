import Link from "next/link";
import { Button } from "@/components/ui/button";

export type StatItem = { label: string; value: string };
export type FeatureItem = { title: string; description: string };
export type BenefitItem = { title: string; description: string };
export type FaqItem = { question: string; answer: string };

export type GameLandingContent = {
  hero: {
    badge: string;
    title: string;
    highlight: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
  };
  stats: StatItem[];
  features: FeatureItem[];
  benefits: {
    title: string;
    description: string;
    items: BenefitItem[];
  };
  cta: {
    title: string;
    description: string;
    primary: string;
    secondary: string;
  };
  faqs?: FaqItem[];
};

type GameLandingTemplateProps = {
  locale: string;
  gameSlug: string;
  content: GameLandingContent;
  backgroundImage: string;
};

export function GameLandingTemplate({
  locale,
  gameSlug,
  content,
  backgroundImage,
}: GameLandingTemplateProps) {
  const primaryHref = `/${locale}/create/${gameSlug}`;
  const secondaryHref = `/${locale}/create`;
  const heroBackgroundStyle = {
    backgroundImage: `linear-gradient(135deg, rgba(15,23,42,0.85), rgba(2,6,23,0.65)), url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <section
        className="relative overflow-hidden py-24 text-white"
        style={heroBackgroundStyle}
      >
        <div className="relative mx-auto max-w-6xl px-4">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
            <div className="space-y-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-bold uppercase tracking-wide text-white/90 backdrop-blur">
                {content.hero.badge}
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              </span>
              <div className="space-y-5">
                <h1 className="text-4xl font-black leading-tight text-white md:text-5xl">
                  {content.hero.title}
                  <span className="block bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                    {content.hero.highlight}
                  </span>
                </h1>
                <p className="text-lg text-white/85 md:text-xl">
                  {content.hero.description}
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white/95 text-slate-900 shadow-xl shadow-sky-500/20 transition duration-200 hover:-translate-y-0.5"
                  asChild
                >
                  <Link href={primaryHref}>{content.hero.primaryCta}</Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full border border-white/60 text-white/90 hover:bg-white/20 sm:w-auto"
                  asChild
                >
                  <Link href={secondaryHref}>{content.hero.secondaryCta}</Link>
                </Button>
              </div>
              <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
                <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1">
                  Instant setup
                </span>
                <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1">
                  DDoS protected
                </span>
                <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1">
                  24/7 support
                </span>
              </div>
              <div className="grid gap-3 text-sm text-white/80 sm:grid-cols-3">
                {content.features.slice(0, 3).map((feature) => (
                  <p key={feature.title} className="rounded-2xl border border-white/20 bg-white/10 p-3">
                    {feature.title}
                  </p>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="min-h-[320px] rounded-3xl border border-white/30 bg-white/10 p-6 shadow-[0_20px_45px_rgba(2,6,23,0.65)] backdrop-blur-lg">
                <p className="text-sm font-semibold uppercase tracking-widest text-white/70">
                  Performance Snapshot
                </p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {content.stats.map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-white/20 bg-white/5 p-4 shadow-inner">
                      <div className="text-3xl font-bold text-white">
                        {stat.value}
                      </div>
                      <p className="mt-1 text-sm text-white/60">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-xs uppercase tracking-[0.3em] text-white/50">
                  Built for reliable communities
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {content.features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-slate-100 bg-white/90 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/80"
            >
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-10 rounded-3xl border border-slate-100 bg-white/90 p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900/80 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-sky-600 dark:text-sky-400">
              {content.benefits.title}
            </p>
            <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
              {content.hero.highlight}
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-300">
              {content.benefits.description}
            </p>
            <div className="mt-6 space-y-4">
              {content.benefits.items.map((item) => (
                <div key={item.title} className="rounded-2xl bg-slate-50/80 p-4 dark:bg-slate-800/60">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg dark:border-slate-700 dark:bg-slate-900/70">
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
              {content.cta.title}
            </h3>
            <p className="mt-3 text-slate-600 dark:text-slate-300">
              {content.cta.description}
            </p>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row">
              <Button className="w-full sm:w-auto" asChild>
                <Link href={primaryHref}>{content.cta.primary}</Link>
              </Button>
              <Button
                variant="outline"
                className="w-full border-slate-200 text-slate-700 hover:bg-white sm:w-auto dark:border-slate-700 dark:text-white"
                asChild
              >
                <Link href={secondaryHref}>{content.cta.secondary}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {content.faqs && content.faqs.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-20">
          <div className="rounded-3xl border border-slate-100 bg-white/90 p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900/80">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              FAQ
            </h2>
            <div className="mt-6 space-y-4">
              {content.faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-2xl border border-slate-100 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-900/70"
                >
                  <summary className="cursor-pointer text-lg font-semibold text-slate-900 outline-none transition group-open:text-sky-600 dark:text-white dark:group-open:text-sky-400">
                    {faq.question}
                  </summary>
                  <p className="mt-3 text-slate-600 dark:text-slate-300">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="rounded-[32px] bg-gradient-to-br from-sky-600 via-indigo-600 to-purple-600 p-8 text-white shadow-2xl shadow-sky-500/40">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
                Ready when you are
              </p>
              <h3 className="mt-2 text-3xl font-bold leading-tight">
                {content.cta.title}
              </h3>
              <p className="mt-2 max-w-xl text-base text-white/90">
                {content.cta.description}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button className="w-full rounded-[20px] bg-white px-8 py-3 text-base font-semibold text-slate-900 shadow-xl transition hover:-translate-y-0.5 sm:w-auto" asChild>
                <Link href={primaryHref}>{content.cta.primary}</Link>
              </Button>
              <Button
                variant="outline"
                className="w-full rounded-[20px] border-white/70 px-8 py-3 text-base font-semibold text-white/90 transition hover:bg-white/20 sm:w-auto"
                asChild
              >
                <Link href={secondaryHref}>{content.cta.secondary}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
