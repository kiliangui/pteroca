'use client';

import { Button } from "@/components/ui/button";
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

export default function Home() {
  const [selectedGame, setSelectedGame] = useState<string>("");
  const [currentGameIndex, setCurrentGameIndex] = useState(0);

  const games = [
    { value: "minecraft", label: "Minecraft Java", image: "https://static.wikia.nocookie.net/minecraft_gamepedia/images/9/93/Grass_Block_JE7_BE6.png",zoom:"1" },
    { value: "bedrock", label: "Minecraft Bedrock", image: "/images/games/bedrock_block.png",zoom:"1" },
    { value: "csgo", label: "Counter-Strike 2", image: "https://logos-world.net/imageup/CSGO_21022023/CSGO_logo_PNG_(10).png",zoom:"1" },
    { value: "rust", label: "Rust", image: "https://logos-world.net/wp-content/uploads/2021/02/Rust-Logo.png",zoom:"2" },
    { value: "ark", label: "ARK: Survival Evolved", image: "/images/games/ark.png", zoom:"2" },
  ];

  useEffect(() => {
    if (selectedGame) return; // Stop cycling if a game is selected

    const interval = setInterval(() => {
      setCurrentGameIndex((prev) => (prev + 1) % games.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [selectedGame, games.length]);

  const displayedGame = selectedGame ? games.find(g => g.value === selectedGame) : games[currentGameIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <motion.div
              initial={{ rotate: -20, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 flex items-center justify-center"
            >
              <img src="/logo.png" alt="SiteLogo" className="w-10 h-10" />
            </motion.div>
            <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
              HostChicken
            </span>
          </Link>

          <div className="flex gap-4">
            <Button variant="ghost" className="text-gray-700 hover:bg-gray-100" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg" asChild>
              <Link href="/auth/register">Start Free Trial</Link>
            </Button>
          </div>
        </div>
      </header>

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
              🚀 Now with 50% faster server deployment
            </motion.div>

            <h1 className="text-5xl lg:text-6xl font-black mb-6 text-gray-900 leading-tight">
              Game Servers That
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"> Just Work</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 max-w-2xl mb-10 leading-relaxed">
              Launch professional game servers in seconds. No technical headaches, just pure gaming freedom.
              Join 50,000+ gamers who trust HostChicken.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <Select value={selectedGame} onValueChange={setSelectedGame}>
                <SelectTrigger className="w-full sm:w-64 bg-white border border-gray-300 text-gray-900">
                  <SelectValue placeholder="Choose your game" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minecraft">Minecraft Java</SelectItem>
                  <SelectItem value="bedrock">Minecraft Bedrock</SelectItem>
                  <SelectItem value="csgo">Counter-Strike 2</SelectItem>
                  <SelectItem value="tf2">Team Fortress 2</SelectItem>
                  <SelectItem value="rust">Rust</SelectItem>
                  <SelectItem value="ark">ARK: Survival Evolved</SelectItem>
                </SelectContent>
              </Select>
              <Button size="lg" className="px-8 py-4 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-lg hover:shadow-xl transition-all" asChild>
                <Link href={selectedGame != ``? `/create/${selectedGame}`:"/create"}>
                  Start Your Server <ArrowRight className="ml-2 w-5 h-5" />
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
              <span className="flex items-center gap-2"><Check className="text-green-600 w-4 h-4" /> Free 7-day trial</span>
              <span className="flex items-center gap-2"><Check className="text-green-600 w-4 h-4" /> No setup fees</span>
              <span className="flex items-center gap-2"><Check className="text-green-600 w-4 h-4" /> 24/7 support</span>
              <span className="flex items-center gap-2"><Check className="text-green-600 w-4 h-4" /> Instant deployment</span>
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
                    Ready to deploy in seconds
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Gamers Worldwide</h2>
            <p className="text-gray-600">Real numbers from real gamers</p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "50,000+", label: "Active Servers" },
              { number: "99.9%", label: "Uptime" },
              { number: "2M+", label: "Hours Played" },
              { number: "24/7", label: "Support" },
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
            <h2 className="text-4xl font-black text-gray-900 mb-4">Why Choose HostChicken?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need for the perfect gaming experience, simplified.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Rocket,
                title: "Lightning Fast",
                desc: "Deploy servers in under 30 seconds with our optimized infrastructure.",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: Shield,
                title: "Enterprise Security",
                desc: "DDoS protection, automatic backups, and 256-bit encryption.",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: Globe,
                title: "Global Network",
                desc: "Choose from 15+ data centers worldwide for optimal latency.",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: Users,
                title: "Community First",
                desc: "Built by gamers, for gamers. Join our active Discord community.",
                color: "from-orange-500 to-red-500"
              },
              {
                icon: Clock,
                title: "Always Online",
                desc: "99.9% uptime guarantee with automatic failover systems.",
                color: "from-yellow-500 to-orange-500"
              },
              {
                icon: Award,
                title: "Award Winning",
                desc: "Recognized as the best game hosting platform 3 years running.",
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
            <h2 className="text-4xl font-black text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">Start free, scale as you grow</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                price: "$4.99",
                period: "/month",
                desc: "Perfect for small communities",
                features: ["2GB RAM", "10 Player Slots", "Basic Support", "Daily Backups"],
                popular: false,
              },
              {
                name: "Pro",
                price: "$9.99",
                period: "/month",
                desc: "Most popular choice",
                features: ["8GB RAM", "50 Player Slots", "Priority Support", "Hourly Backups", "Custom Plugins"],
                popular: true,
              },
              {
                name: "Enterprise",
                price: "$19.99",
                period: "/month",
                desc: "For large servers",
                features: ["16GB RAM", "Unlimited Players", "24/7 Support", "Real-time Backups", "Dedicated IP"],
                popular: false,
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
                        Most Popular
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
                      <Link href="/create">Get Started</Link>
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
            <h2 className="text-4xl font-black text-gray-900 mb-4">What Gamers Say</h2>
            <p className="text-xl text-gray-600">Real reviews from real players</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Alex Chen",
                role: "Minecraft Server Owner",
                content: "HostChicken made setting up my server so easy. Within minutes, I had a fully configured Minecraft server running smoothly.",
                rating: 5,
              },
              {
                name: "Sarah Johnson",
                role: "Rust Community Manager",
                content: "The performance is incredible. Our server handles 100+ players without any lag. Support is always there when needed.",
                rating: 5,
              },
              {
                name: "Mike Rodriguez",
                role: "CS2 Team Captain",
                content: "Finally found a hosting service that understands competitive gaming. Low ping and reliable uptime every time.",
                rating: 5,
              },
            ].map((testimonial, i) => (
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
            <h2 className="text-4xl font-black text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know</p>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                question: "How quickly can I get my server running?",
                answer: "Most servers are deployed within 30 seconds of payment confirmation. You'll receive login details immediately.",
              },
              {
                question: "Can I upgrade or downgrade my plan anytime?",
                answer: "Yes! You can change your plan at any time. Upgrades take effect immediately, downgrades at the next billing cycle.",
              },
              {
                question: "What games do you support?",
                answer: "We support all major games including Minecraft, Rust, ARK, Counter-Strike, Team Fortress 2, and many more.",
              },
              {
                question: "Do you offer refunds?",
                answer: "We offer a 7-day money-back guarantee. If you're not satisfied, contact support for a full refund.",
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
            Ready to Start Gaming?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of gamers who have already made the switch. Your perfect server is just one click away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8 py-4 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-lg hover:shadow-xl transition-all" asChild>
              <Link href="/create">
                Start Your Free Trial <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-gray-300 text-gray-700 hover:bg-gray-50" asChild>
              <Link href="/auth/login">Login to Dashboard</Link>
            </Button>
          </div>
          <p className="text-gray-500 text-sm mt-6">
            No credit card required • 7-day free trial • Cancel anytime
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
                The easiest way to host game servers. Built for gamers, by gamers.
              </p>
            </div>
            <div>
              <h3 className="text-gray-900 font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><Link href="/create" className="hover:text-gray-900 transition-colors">Create Server</Link></li>
                <li><Link href="/pricing" className="hover:text-gray-900 transition-colors">Pricing</Link></li>
                <li><Link href="/features" className="hover:text-gray-900 transition-colors">Features</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-gray-900 font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><Link href="/help" className="hover:text-gray-900 transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-gray-900 transition-colors">Contact Us</Link></li>
                <li><Link href="/status" className="hover:text-gray-900 transition-colors">Server Status</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-gray-900 font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><Link href="/about" className="hover:text-gray-900 transition-colors">About</Link></li>
                <li><Link href="/blog" className="hover:text-gray-900 transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-gray-900 transition-colors">Careers</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; 2024 HostChicken. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}