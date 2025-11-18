import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function ContactPage() {
  const t = useTranslations("contact");
  return (
    <div className="min-h-screen bg-slate-950" id="hero">

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1 text-sm font-semibold uppercase tracking-wide text-indigo-200">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/40">
              💬
            </span>
            {t("hero.badge")}
          </span>
          <h1 className="text-5xl font-bold mb-4 mt-6 text-white">{t("hero.title")}</h1>
          <p className="text-lg text-slate-200">{t("hero.subtitle")}</p>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 px-4">
        <div className="container mx-auto grid md:grid-cols-2 gap-8 max-w-5xl">
          <Card className="border-indigo-500/20 bg-slate-900/50">
            <CardHeader>
              <CardTitle className="text-white">{t("form.title")}</CardTitle>
              <CardDescription className="text-slate-300">{t("form.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input placeholder={t("form.firstName")} className="bg-slate-800 border-slate-700 text-white placeholder-slate-400" />
                  <Input placeholder={t("form.lastName")} className="bg-slate-800 border-slate-700 text-white placeholder-slate-400" />
                </div>
                <Input type="email" placeholder={t("form.email")} className="bg-slate-800 border-slate-700 text-white placeholder-slate-400" />
                <Input placeholder={t("form.subject")} className="bg-slate-800 border-slate-700 text-white placeholder-slate-400" />
                <Textarea placeholder={t("form.message")} rows={6} className="bg-slate-800 border-slate-700 text-white placeholder-slate-400" />
                <Button className="bg-gradient-to-r from-indigo-500 to-fuchsia-600 text-white hover:from-indigo-600 hover:to-fuchsia-700">
                  {t("form.submit")}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-indigo-500/20 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-white">{t("support.title")}</CardTitle>
                <CardDescription className="text-slate-300">{t("support.description")}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-4">{t("support.details")}</p>
                <div className="flex gap-3">
                  <Link href="/blog">
                    <Button variant="outline" className="border-indigo-500 text-indigo-300 hover:bg-indigo-500/10">{t("support.guides")}</Button>
                  </Link>
                  <Link href="/contact">
                    <Button variant="outline" className="border-indigo-500 text-indigo-300 hover:bg-indigo-500/10">{t("support.live")}</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="border-indigo-500/20 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-white">{t("enterprise.title")}</CardTitle>
                <CardDescription className="text-slate-300">{t("enterprise.description")}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-4">{t("enterprise.details")}</p>
                <Link href="/pricing">
                  <Button className="bg-gradient-to-r from-indigo-500 to-fuchsia-600 text-white hover:from-indigo-600 hover:to-fuchsia-700">{t("enterprise.cta")}</Button>
                </Link>
              </CardContent>
            </Card>
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
              <p className="text-slate-400">{t("footer.tagline")}</p>
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

