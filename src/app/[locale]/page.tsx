'use client';

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations, useLocale } from 'next-intl';

export const dynamic = "force-dynamic";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Server,
  Shield,
  Zap,
  Users,
  Egg,
  Rocket,
  Flame,
  Gamepad2,
  Check,
  Star,
  ArrowRight,
  Clock,
  Globe,
  Award,
  MessageSquare,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Header } from "@/components/navigation/Header";
import { showcaseGames } from "@/components/auth/GameShowcase";

export default function Home() {
  const t = useTranslations();
  const [selectedGame, setSelectedGame] = useState<string>("");
  const [currentGameIndex, setCurrentGameIndex] = useState();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const games = [
    { value: "minecraft", label: t('games.minecraft'), image: "https://static.wikia.nocookie.net/minecraft_gamepedia/images/9/93/Grass_Block_JE7_BE6.png",zoom:"1" },
    { value: "bedrock", label: t('games.bedrock'), image: "/images/games/bedrock_block.png",zoom:"1" },
    { value: "rust", label: t('games.rust'), image: "https://logos-world.net/wp-content/uploads/2021/02/Rust-Logo.png",zoom:"2" },
    { value: "ark", label: t('games.ark'), image: "/images/games/ark.png", zoom:"2" },
  ];

  const statItems = [
    { label: t('socialProof.stats.activeServers'), value: "50K+" },
    { label: t('socialProof.stats.uptime'), value: "99.9%" },
    { label: t('socialProof.stats.hoursPlayed'), value: "2M+" },
    { label: t('socialProof.stats.support'), value: "24/7" },
  ];

  const planPrices: Record<string, { monthly: string; yearly: string }> = {
    starter: { monthly: "7€", yearly: "49€" },
    pro: { monthly: "14€", yearly: "98€" },
    enterprise: { monthly: "20€", yearly: "14€" },
  };

  useEffect(() => {
    if (selectedGame) return; // Stop cycling if a game is selected

    //const interval = setInterval(() => {
    //  setCurrentGameIndex((prev) => (prev + 1) % games.length);
    //}, 3000); // Change every 3 seconds

    //return () => clearInterval(interval);
  }, [selectedGame, games.length]);

  const displayedGame = selectedGame && games.find(g => g.value === selectedGame) ;
  //const displayedGame = selectedGame ? games.find(g => g.value === selectedGame) : games[currentGameIndex] ;
  const planFeatureGroups = (t.raw('pricing.planFeatures') as Record<string, string[]> | undefined) ?? {};
  const locale = useLocale();
  const localizedShowcase = showcaseGames.map((game) => ({
    ...game,
    title: t(`gameLanding.${game.value}.hero.title`),
    description: t(`gameLanding.${game.value}.hero.description`),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950 opacity-90"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent_40%),radial-gradient(circle_at_bottom,rgba(147,51,234,0.2),transparent_45%)] dark:bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.25),transparent_40%),radial-gradient(circle_at_bottom,rgba(147,51,234,0.35),transparent_45%)]"></div>
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div className="space-y-10">
            <div className="inline-flex items-center gap-3 rounded-full border border-gray-200/70 bg-white/70 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm backdrop-blur dark:border-gray-700/50 dark:bg-gray-900/60 dark:text-gray-200">
              🚀 {t('hero.badge')}
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            </div>
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white leading-tight">
                {t('hero.title')}
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  {t('hero.highlight')}
                </span>
              </h1>
              <p className="text-lg md:text-2xl text-gray-700 dark:text-gray-300 max-w-2xl leading-relaxed">
                {t('hero.subtitle')}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="w-full sm:w-auto px-8 py-4 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-xl hover:shadow-2xl transition-all" asChild>
                <Link href={selectedGame ? `/create/${selectedGame}` : "/create"}>
                  {t('hero.startServer')} <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-4 text-lg border-gray-300 text-gray-800 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800" asChild>
                <Link href="/dashboard">
                  {t('cta.loginDashboard')}
                </Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              {["freeTrial","noSetupFees","support","instantDeployment"].map((badge) => (
                <span key={badge} className="inline-flex items-center gap-2 rounded-full bg-white/80 dark:bg-gray-900/60 border border-gray-200/70 dark:border-gray-700/60 px-4 py-2 text-gray-600 dark:text-gray-300">
                  <Check className="text-emerald-500 h-4 w-4" />
                  {t(`hero.trustBadges.${badge}`)}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>
            <div className="relative bg-white dark:bg-gray-900 border border-gray-200/70 dark:border-gray-800 rounded-3xl shadow-2xl p-6 space-y-5">
              <p className="text-sm uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">{t('hero.chooseGame')}</p>
              <div className="grid gap-4">
                {games.map((game, index) => {
                  const active = (selectedGame || (displayedGame&& displayedGame?.value)) === game.value || ((!selectedGame && displayedGame)&& displayedGame.value === game.value)
                  return (
                    <button
                      key={game.value}
                      onClick={() => setSelectedGame(game.value)}
                      className={cn(
                        "relative flex items-center gap-4 rounded-2xl border px-4 py-3 transition-all",
                        active
                          ? "border-blue-500 bg-gradient-to-r from-blue-500/10 to-purple-500/10 shadow-lg"
                          : "border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700"
                      )}
                    >
                      <img src={game.image} alt={game.label} className="h-12 w-12 object-contain" />
                      <div className="flex-1 text-left">
                        <p className="text-base font-semibold text-gray-900 dark:text-white">{game.label}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('hero.readyToDeploy')}</p>
                      </div>
                      {active && <Check className="text-blue-600 dark:text-blue-400 h-5 w-5" />}
                    </button>
                  )
                })}
                {selectedGame&&
               <Button size="lg" className="w-full sm:w-auto px-8 py-8 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-xl hover:shadow-2xl transition-all" asChild>
                <Link href={"/create/"+selectedGame}>
                  {t('hero.startServer')}
                </Link>
              </Button>
}
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-12">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
            {statItems.map((stat, i) => (
              <div key={stat.label} className="rounded-2xl border bg-white/80 dark:bg-gray-900/80 border-gray-200 dark:border-gray-800 p-4 shadow-sm backdrop-blur">
                <p className="text-3xl font-black text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-gray-100 dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-200 mb-4">{t('socialProof.title')}</h2>
            <p className="text-gray-600">{t('socialProof.subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "50,000+", label: t('socialProof.stats.activeServers') },
              { number: "99.9%", label: t('socialProof.stats.uptime') },
              { number: "2M+", label: t('socialProof.stats.hoursPlayed') },
              { number: "24/7", label: t('socialProof.stats.support') },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl lg:text-4xl font-black text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-sm uppercase tracking-wide">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Game showcase */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
                {t('gamesShowcase.subtitle')}
              </p>
              <h2 className="mt-3 text-4xl font-black text-gray-900 dark:text-white">
                {t('gamesShowcase.title')}
              </h2>
              <p className="mt-3 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                {t('gamesShowcase.description')}
              </p>
            </div>
            <Link
              href={`/${locale}/create`}
              className="inline-flex items-center rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
            >
              {t('gamesShowcase.cta')}
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {localizedShowcase.map((game) => (
              <Link
                href={`/${locale}/${game.value}`}
                key={game.value}
                className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-gray-900 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${game.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/70 to-slate-900/90" />
                <div className="relative z-10 flex h-full flex-col gap-3 p-6 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/70">{game.title}</p>
                  <h3 className="text-2xl font-black">{game.title}</h3>
                  <p className="text-sm text-white/70">{game.description}</p>
                  <div className="mt-auto flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.4em] text-white/70">
                    <span>View</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid lg:grid-cols-[1fr_1.2fr] gap-10 items-start"
          >
            <div className="space-y-6">
              <p className="inline-flex items-center gap-3 rounded-full bg-white text-sm font-semibold text-gray-600 px-4 py-2 border border-gray-200 shadow-sm dark:bg-gray-900 dark:text-gray-200 dark:border-gray-800">
                <Sparkles className="h-4 w-4 text-amber-500" />
                {t('features.title')}
              </p>
              <h2 className="text-4xl font-black text-gray-900 dark:text-white">
                {t('features.subtitle')}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                HostChicken condenses the most-requested features from pro server owners into a plug-and-play platform. No scripts, no guesswork—just fast deployment and outrageous stability.
              </p>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-3"><Check className="text-emerald-500" />One-click modpack + panel setup</li>
                <li className="flex items-center gap-3"><Check className="text-emerald-500" />Global edge network for sub-40ms ping</li>
                <li className="flex items-center gap-3"><Check className="text-emerald-500" />Predictive autoscaling so your world never lags</li>
              </ul>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: Rocket, title: t('features.items.lightningFast.title'), desc: t('features.items.lightningFast.desc'), accent: "from-blue-500 to-cyan-500" },
                { icon: Shield, title: t('features.items.enterpriseSecurity.title'), desc: t('features.items.enterpriseSecurity.desc'), accent: "from-green-500 to-emerald-500" },
                { icon: Globe, title: t('features.items.globalNetwork.title'), desc: t('features.items.globalNetwork.desc'), accent: "from-purple-500 to-pink-500" },
                { icon: Award, title: t('features.items.awardWinning.title'), desc: t('features.items.awardWinning.desc'), accent: "from-amber-500 to-orange-500" },
                { icon: Users, title: t('features.items.communityFirst.title'), desc: t('features.items.communityFirst.desc'), accent: "from-indigo-500 to-purple-500" },
                { icon: Clock, title: t('features.items.alwaysOnline.title'), desc: t('features.items.alwaysOnline.desc'), accent: "from-slate-500 to-slate-800" },
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="relative rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/70 p-5 shadow hover:shadow-lg transition-all"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.accent} flex items-center justify-center mb-4`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">{t('pricing.title')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">{t('pricing.subtitle')}</p>
            <div className="mt-6 inline-flex rounded-full border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-1">
              {(["monthly","yearly"] as const).map((cycle) => (
                <button
                  key={cycle}
                  onClick={() => setBillingCycle(cycle)}
                  className={cn(
                    "px-6 py-2 rounded-full text-sm font-semibold transition-colors",
                    billingCycle === cycle
                      ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow"
                      : "text-gray-500 dark:text-gray-400"
                  )}
                >
                  {cycle === "monthly" ? "Monthly" : "Yearly (save 2 months)"}
                </button>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              {
                key: "starter",
                name: t('pricing.plans.starter.name'),
                desc: t('pricing.plans.starter.desc'),
                features: planFeatureGroups.starter ?? [],
                popular: false,
                getStarted: t('pricing.plans.starter.getStarted')
              },
              {
                key: "pro",
                name: t('pricing.plans.pro.name'),
                desc: t('pricing.plans.pro.desc'),
                features: planFeatureGroups.pro ?? [],
                popular: true,
                popularText: t('pricing.plans.pro.popular'),
                getStarted: t('pricing.plans.pro.getStarted')
              },
              {
                key: "enterprise",
                name: t('pricing.plans.enterprise.name'),
                desc: t('pricing.plans.enterprise.desc'),
                features: planFeatureGroups.enterprise ?? [],
                popular: false,
                getStarted: t('pricing.plans.enterprise.getStarted')
              },
            ].map((plan) => {
              const price = planPrices[plan.key]?.[billingCycle] ?? "—"
              const suffix = billingCycle === "monthly" ? "/mo" : "/yr"
              return (
                <Card key={plan.key} className={cn(
                  "relative border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/70 shadow-sm",
                  plan.popular && "ring-2 ring-blue-500 shadow-xl scale-[1.02]"
                )}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-xs font-bold">
                        {plan.popularText}
                      </span>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">{plan.name}</CardTitle>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">{plan.desc}</p>
                    <div className="mt-6 flex items-end justify-center gap-1">
                      <span className="text-4xl font-black text-gray-900 dark:text-white">{price}</span>
                      <span className="text-gray-500 dark:text-gray-400">{suffix}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                          <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className={cn(
                      "w-full font-semibold",
                      plan.popular
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
                    )} asChild>
                      <Link href="/create">{plan.getStarted}</Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black text-gray-900 mb-4">{t('testimonials.title')}</h2>
            <p className="text-xl text-gray-600">{t('testimonials.subtitle')}</p>
          </motion.div>

          <div className="overflow-x-auto pb-4">
            <div className="flex gap-6 min-w-full">
              {t.raw('testimonials.items').map((testimonial, i) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="min-w-[260px] flex-1"
                >
                  <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 h-full shadow-md">
                    <CardContent className="pt-6 flex flex-col gap-4">
                      <div className="flex">
                        {[...Array(testimonial.rating)].map((_, j) => (
                          <Star key={j} className="w-5 h-5 text-yellow-500 fill-current" />
                        ))}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 italic">{testimonial.content}</p>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                        <div className="text-gray-600 dark:text-gray-400 text-sm">{testimonial.role}</div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black text-gray-900 mb-4">{t('faq.title')}</h2>
            <p className="text-xl text-gray-600">{t('faq.subtitle')}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                question: t('faq.questions.deployment.question'),
                answer: t('faq.questions.deployment.answer'),
              },
              {
                question: t('faq.questions.upgrade.question'),
                answer: t('faq.questions.upgrade.answer'),
              },
              {
                question: t('faq.questions.games.question'),
                answer: t('faq.questions.games.answer'),
              },
              {
                question: t('faq.questions.refunds.question'),
                answer: t('faq.questions.refunds.answer'),
              },
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card className="bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-800">
                  <CardContent className="pt-6">
                    <details className="group">
                      <summary className="flex justify-between items-center cursor-pointer text-gray-900 font-semibold text-lg">
                        {faq.question}
                        <ChevronDown className="w-5 h-5 group-open:rotate-180 transition-transform" />
                      </summary>
                      <p className="text-gray-600 dark:text-gray-300 mt-4 leading-relaxed">{faq.answer}</p>
                    </details>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              {t('cta.loginDashboard')} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-900/30 dark:to-purple-900/30">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto px-4"
        >
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8 py-4 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-lg hover:shadow-xl transition-all" asChild>
              <Link href="/create">
                {t('cta.startTrial')} <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-gray-300 text-gray-700 hover:bg-gray-50" asChild>
              <Link href="/auth/login">{t('cta.loginDashboard')}</Link>
            </Button>
          </div>
          <p className="text-gray-500 text-sm mt-6">
            {t('cta.footer')}
          </p>
        </motion.div>
      </section>

      <div className="md:hidden fixed bottom-4 left-4 right-4 z-40">
        <Button className="w-full text-lg py-4 bg-black text-white shadow-2xl" asChild>
          <Link href="/create">{t('cta.startTrial')}</Link>
        </Button>
      </div>

    </div>
  );
}
