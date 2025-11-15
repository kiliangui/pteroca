import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, Tag, Share2, Heart, BookOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAllSlugs, getArticleBySlug, getAllArticles, markdownToBasicHtml } from "@/lib/md";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}


export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const article = await getArticleBySlug(params.slug);
  if (!article) {
    notFound();
  }

  const related = (await getAllArticles())
    .filter((a) => a.slug !== article.meta.slug)
    .slice(0, 3);

  const primaryAuthor = article.meta.authors?.[0];

  return (
    <div className="min-h-screen bg-slate-950" id="hero">

      {/* Article Content */}
      <article className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Back Button */}
          <Link href="/blog" className="inline-flex items-center text-indigo-400 hover:text-indigo-300 mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Guides
          </Link>

          {/* Article Header */}
          <header className="mb-12">
            {article.meta.category && (
              <Badge className="mb-4 bg-indigo-500 text-white">{article.meta.category}</Badge>
            )}
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
              {article.meta.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-slate-300 mb-8">
              {primaryAuthor && (
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{primaryAuthor}</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>{article.meta.date ? new Date(article.meta.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : ""}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>{article.meta.readTime}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {article.meta.tags?.map((tag: string) => (
                <Badge key={tag} variant="outline" className="border-indigo-500 text-indigo-300">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="border-indigo-500 text-indigo-300 hover:bg-indigo-500/10">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" className="border-indigo-500 text-indigo-300 hover:bg-indigo-500/10">
                <Heart className="h-4 w-4 mr-2" />
                Like
              </Button>
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <div
              className="text-slate-200 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: markdownToBasicHtml(article.body) }}
            />
          </div>

          {/* Author Bio */}
          {primaryAuthor && (
            <Card className="mt-12 border-indigo-500/20 bg-slate-900/50">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-fuchsia-600 rounded-full flex items-center justify-center">
                    <span className="text-2xl">👤</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">About {primaryAuthor}</h3>
                    <p className="text-slate-300 mb-4">
                      {primaryAuthor} contributes to the HostChicken guides, helping gamers master their servers.
                    </p>
                    <Button variant="outline" className="border-indigo-500 text-indigo-300 hover:bg-indigo-500/10">
                      Follow Author
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </article>

      {/* Related Articles */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">Related Guides</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {related.map((relatedArticle) => (
              <Card key={relatedArticle.slug} className="border-indigo-500/20 bg-slate-900/50 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 h-32 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-fuchsia-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <BookOpen className="h-6 w-6 text-white" />
                      </div>
                      {relatedArticle.category && (
                        <Badge className="bg-indigo-500 text-white text-xs">{relatedArticle.category}</Badge>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-lg text-white line-clamp-2">{relatedArticle.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 text-sm text-slate-400 mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{relatedArticle.readTime}</span>
                    </div>
                  </div>
                  <Link href={`/blog/${relatedArticle.slug}`}>
                    <Button variant="outline" className="w-full border-indigo-500 text-indigo-300 hover:bg-indigo-500/10">
                      Read Guide
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
            <h2 className="text-3xl font-bold mb-4">Enjoyed This Guide?</h2>
            <p className="text-lg mb-6 opacity-90">
              Subscribe to get more Minecraft server tips and tutorials delivered to your inbox.
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
                <img src="/icon.png" alt="HostChicken" width={32} height={32} className="rounded" />
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