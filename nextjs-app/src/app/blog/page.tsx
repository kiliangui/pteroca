import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, Clock, User, Tag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getAllArticles } from "@/lib/md";

export const dynamic = "force-static";

async function loadArticles() {
  const all = await getAllArticles();
  // Mark the first item as featured for display purposes
  const [first, ...rest] = all;
  return { featured: first ? [first] : [], others: rest };
}

const categories = ["All", "Tutorial", "Performance", "Security", "Business", "WordPress"];

export default async function BlogPage() {
  const { featured, others } = await loadArticles();
  return (
    <div className="min-h-screen bg-slate-950" id="hero">

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1 text-sm font-semibold uppercase tracking-wide text-indigo-200">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/40">
              📚
            </span>
            Server guides
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 mt-6 text-white">
            Minecraft Server Guides
          </h1>
          <p className="text-xl text-slate-200 max-w-2xl mx-auto mb-8">
            Master your Minecraft server with our comprehensive tutorials, modding guides, and optimization tips!
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={category === "All" ? "default" : "outline"}
                className={`cursor-pointer transition-colors ${
                  category === "All"
                    ? "bg-indigo-500 text-white hover:bg-indigo-600"
                    : "border-indigo-500 text-indigo-300 hover:bg-indigo-500/10"
                }`}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">Featured Guide</h2>
          {featured.map((article) => (
            <Card key={article.slug} className="border-indigo-500/20 bg-slate-900/50 hover:shadow-xl transition-shadow mb-8">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 p-8 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-fuchsia-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl">📚</span>
                    </div>
                    {article.category && (
                      <Badge className="bg-indigo-500 text-white mb-2">{article.category}</Badge>
                    )}
                  </div>
                </div>
                <CardContent className="p-8">
                  <CardTitle className="text-2xl mb-4 text-white">{article.title}</CardTitle>
                  <CardDescription className="text-lg mb-6 text-slate-300">
                    {article.description}
                  </CardDescription>
                  <div className="flex items-center space-x-4 text-sm text-slate-400 mb-6">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{article.date ? new Date(article.date).toLocaleDateString() : ""}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                  <Link href={`/blog/${article.slug}`}>
                    <Button className="bg-gradient-to-r from-indigo-500 to-fuchsia-600 hover:from-indigo-600 hover:to-fuchsia-700 text-white">
                      Read Guide
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* All Articles */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">All Server Guides</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {others.map((article) => (
              <Card key={article.slug} className="border-indigo-500/20 bg-slate-900/50 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 h-48 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-fuchsia-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-2xl">📖</span>
                      </div>
                      {article.category && (
                        <Badge className="bg-indigo-500 text-white">{article.category}</Badge>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-xl text-white line-clamp-2">{article.title}</CardTitle>
                  <CardDescription className="text-slate-300 line-clamp-3">
                    {article.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 text-sm text-slate-400 mb-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{article.date ? new Date(article.date).toLocaleDateString() : ""}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                  <Link href={`/blog/${article.slug}`}>
                    <Button variant="outline" className="w-full border-indigo-500 text-indigo-300 hover:bg-indigo-500/10">
                      Read Guide
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-2xl mx-auto bg-gradient-to-r from-indigo-500 to-fuchsia-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Stay Updated!</h2>
            <p className="text-lg mb-6 opacity-90">
              Get the latest Minecraft server tips, tutorials, and modding guides delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-slate-800 border-slate-700 text-white placeholder-slate-400"
              />
              <Button className="bg-white text-indigo-600 hover:bg-gray-100 px-6 py-3">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src="/logo.png" alt="SiteLogo" width={32} height={32} className="rounded" />
                <span className="text-2xl font-bold">HostChicken</span>
              </div>
              <p className="text-slate-400">
                Making Minecraft hosting epic and accessible for every gamer!
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Product</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/pricing" className="hover:text-indigo-300 transition-colors">Pricing</Link></li>
                <li><Link href="/blog" className="hover:text-indigo-300 transition-colors">Server Guides</Link></li>
                <li><Link href="/contact" className="hover:text-indigo-300 transition-colors">Support</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Resources</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/blog" className="hover:text-indigo-300 transition-colors">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-indigo-300 transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-indigo-300 transition-colors">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Community</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/blog" className="hover:text-indigo-300 transition-colors">Tutorials</Link></li>
                <li><Link href="/contact" className="hover:text-indigo-300 transition-colors">Discord</Link></li>
                <li><Link href="/blog" className="hover:text-indigo-300 transition-colors">Mod Packs</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 HostChicken. All rights reserved. Made with ❤️ for the Minecraft community.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}