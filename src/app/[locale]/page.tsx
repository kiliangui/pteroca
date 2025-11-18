'use client';

import { Button } from "@/components/ui/button";
import { useTranslations } from 'next-intl';

export const dynamic = "force-dynamic";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Header } from "@/components/navigation/Header";

export default function Home() {
  const t = useTranslations();
  const [selectedGame, setSelectedGame] = useState<string>("");
  const [currentGameIndex, setCurrentGameIndex] = useState(0);

  const games = [
    { value: "minecraft", label: t('games.minecraft'), image: "https://static.wikia.nocookie.net/minecraft_gamepedia/images/9/93/Grass_Block_JE7_BE6.png",zoom:"1" },
    { value: "bedrock", label: t('games.bedrock'), image: "/images/games/bedrock_block.png",zoom:"1" },
    { value: "rust", label: t('games.rust'), image: "https://logos-world.net/wp-content/uploads/2021/02/Rust-Logo.png",zoom:"2" },
    { value: "ark", label: t('games.ark'), image: "/images/games/ark.png", zoom:"2" },
  ];

  useEffect(() => {
    if (selectedGame) return; // Stop cycling if a game is selected

    const interval = setInterval(() => {
      setCurrentGameIndex((prev) => (prev + 1) % games.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [selectedGame, games.length]);

  const displayedGame = selectedGame ? games.find(g => g.value === selectedGame) : games[currentGameIndex];
  const planFeatureGroups = (t.raw('pricing.planFeatures') as Record<string, string[]> | undefined) ?? {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[length:50px_50px]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-block px-4 py-2 bg-blue-100 border border-blue-200 rounded-full text-blue-700 text-sm font-medium mb-6"
            >
              🚀 {t('hero.badge')}
            </motion.div>

            <h1 className="text-5xl lg:text-6xl font-black mb-6 text-gray-900 leading-tight">
              {t('hero.title')}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"> {t('hero.highlight')}</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 max-w-2xl mb-10 leading-relaxed">
              {t('hero.subtitle')}
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <Select value={selectedGame} onValueChange={setSelectedGame}>
                <SelectTrigger className="w-full sm:w-64 bg-white border border-gray-300 text-gray-900">
                  <SelectValue placeholder={t('hero.chooseGame')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minecraft">{t('games.minecraft')}</SelectItem>
                  <SelectItem value="bedrock">{t('games.bedrock')}</SelectItem>
                  <SelectItem value="csgo">{t('games.csgo')}</SelectItem>
                  <SelectItem value="tf2">{t('games.tf2')}</SelectItem>
                  <SelectItem value="rust">{t('games.rust')}</SelectItem>
                  <SelectItem value="ark">{t('games.ark')}</SelectItem>
                </SelectContent>
              </Select>
              <Button size="lg" className="px-8 py-4 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-lg hover:shadow-xl transition-all" asChild>
                <Link href={selectedGame != ``? `/create/${selectedGame}`:"/create"}>
                  {t('hero.startServer')} <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-6 text-gray-600 text-sm"
            >
              <span className="flex items-center gap-2"><Check className="text-green-600 w-4 h-4" /> {t('hero.trustBadges.freeTrial')}</span>
              <span className="flex items-center gap-2"><Check className="text-green-600 w-4 h-4" /> {t('hero.trustBadges.noSetupFees')}</span>
              <span className="flex items-center gap-2"><Check className="text-green-600 w-4 h-4" /> {t('hero.trustBadges.support')}</span>
              <span className="flex items-center gap-2"><Check className="text-green-600 w-4 h-4" /> {t('hero.trustBadges.instantDeployment')}</span>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-md h-96">
              <AnimatePresence mode="wait">
                <motion.div
                  key={displayedGame?.value}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 bg-white border border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center shadow-lg"
                >
                  <motion.img
                    src={displayedGame?.image}
                    alt={displayedGame?.label}
                    
                    className={"w-32 h-32 object-contain mb-6  " }
                    initial={{ scale: 0 }}
                    animate={{ scale: displayedGame?.zoom === "2"? 2: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  />
                  <motion.h3
                    className="text-2xl font-bold text-gray-900 text-center mb-2"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    {displayedGame?.label}
                  </motion.h3>
                  <motion.p
                    className="text-gray-600 text-center"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    {t('hero.readyToDeploy')}
                  </motion.p>
                </motion.div>
              </AnimatePresence>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute top-1/2 -left-8 w-4 h-4 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('socialProof.title')}</h2>
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

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black text-gray-900 mb-4">{t('features.title')}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('features.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Rocket,
                title: t('features.items.lightningFast.title'),
                desc: t('features.items.lightningFast.desc'),
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: Shield,
                title: t('features.items.enterpriseSecurity.title'),
                desc: t('features.items.enterpriseSecurity.desc'),
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: Globe,
                title: t('features.items.globalNetwork.title'),
                desc: t('features.items.globalNetwork.desc'),
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: Users,
                title: t('features.items.communityFirst.title'),
                desc: t('features.items.communityFirst.desc'),
                color: "from-orange-500 to-red-500"
              },
              {
                icon: Clock,
                title: t('features.items.alwaysOnline.title'),
                desc: t('features.items.alwaysOnline.desc'),
                color: "from-yellow-500 to-orange-500"
              },
              {
                icon: Award,
                title: t('features.items.awardWinning.title'),
                desc: t('features.items.awardWinning.desc'),
                color: "from-indigo-500 to-purple-500"
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-gray-900 text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black text-gray-900 mb-4">{t('pricing.title')}</h2>
            <p className="text-xl text-gray-600">{t('pricing.subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                key: "starter",
                name: t('pricing.plans.starter.name'),
                price: "7€",
                period: "/month",
                desc: t('pricing.plans.starter.desc'),
                features: planFeatureGroups.starter ?? [],
                popular: false,
                getStarted: t('pricing.plans.starter.getStarted')
              },
              {
                key: "pro",
                name: t('pricing.plans.pro.name'),
                price: "14€",
                period: "/month",
                desc: t('pricing.plans.pro.desc'),
                features: planFeatureGroups.pro ?? [],
                popular: true,
                popularText: t('pricing.plans.pro.popular'),
                getStarted: t('pricing.plans.pro.getStarted')
              },
              {
                key: "enterprise",
                name: t('pricing.plans.enterprise.name'),
                price: "20€",
                period: "/month",
                desc: t('pricing.plans.enterprise.desc'),
                features: planFeatureGroups.enterprise ?? [],
                popular: false,
                getStarted: t('pricing.plans.enterprise.getStarted')
              },
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card className={`relative bg-white border-gray-200 hover:shadow-lg transition-all duration-300 ${plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                        {plan.popularText}
                      </span>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-gray-900 text-2xl">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-black text-gray-900">{plan.price}</span>
                      <span className="text-gray-600">{plan.period}</span>
                    </div>
                    <p className="text-gray-600 mt-2">{plan.desc}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-3 text-gray-600">
                          <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full ${plan.popular ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}
                      asChild
                    >
                      <Link href="/create">{plan.getStarted}</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.raw('testimonials.items').map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card className="bg-white border-gray-200 hover:shadow-lg transition-all">
                  <CardContent className="pt-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, j) => (
                        <Star key={j} className="w-5 h-5 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-4 italic">{'"'}{testimonial.content}{'"'}</p>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-gray-600 text-sm">{testimonial.role}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black text-gray-900 mb-4">{t('faq.title')}</h2>
            <p className="text-xl text-gray-600">{t('faq.subtitle')}</p>
          </motion.div>

          <div className="space-y-6">
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
                <Card className="bg-white border-gray-200">
                  <CardContent className="pt-6">
                    <details className="group">
                      <summary className="flex justify-between items-center cursor-pointer text-gray-900 font-semibold text-lg">
                        {faq.question}
                        <ChevronDown className="w-5 h-5 group-open:rotate-180 transition-transform" />
                      </summary>
                      <p className="text-gray-600 mt-4 leading-relaxed">{faq.answer}</p>
                    </details>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
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

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Egg className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-bold text-gray-900">HostChicken</span>
              </div>
              <p className="text-gray-600 text-sm">
                {t('footer.description')}
              </p>
            </div>
            <div>
              <h3 className="text-gray-900 font-semibold mb-4">{t('footer.product')}</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><Link href="/create" className="hover:text-gray-900 transition-colors">{t('footer.createServer')}</Link></li>
                <li><Link href="/pricing" className="hover:text-gray-900 transition-colors">{t('footer.pricing')}</Link></li>
                <li><Link href="/features" className="hover:text-gray-900 transition-colors">{t('footer.features')}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-gray-900 font-semibold mb-4">{t('footer.support')}</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><Link href="/help" className="hover:text-gray-900 transition-colors">{t('footer.helpCenter')}</Link></li>
                <li><Link href="/contact" className="hover:text-gray-900 transition-colors">{t('footer.contact')}</Link></li>
                <li><Link href="/status" className="hover:text-gray-900 transition-colors">{t('footer.status')}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-gray-900 font-semibold mb-4">{t('footer.company')}</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><Link href="/about" className="hover:text-gray-900 transition-colors">{t('footer.about')}</Link></li>
                <li><Link href="/blog" className="hover:text-gray-900 transition-colors">{t('footer.blog')}</Link></li>
                <li><Link href="/careers" className="hover:text-gray-900 transition-colors">{t('footer.careers')}</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>{t('footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
