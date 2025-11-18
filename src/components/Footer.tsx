"use client";

import Link from "next/link";
import { Egg } from "lucide-react";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");
  return (
    <footer className="bg-gray-950 text-slate-200 py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-xl">
                <Egg className="text-white w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-black tracking-tight text-white">{t("description")}</p>
                <p className="text-sm text-slate-300 max-w-xs">{t("product")}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-3">{t("product")}</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li><Link href="/create" className="hover:text-white transition-colors">{t("createServer")}</Link></li>
                  <li><Link href="/pricing" className="hover:text-white transition-colors">{t("pricing")}</Link></li>
                  <li><Link href="/features" className="hover:text-white transition-colors">{t("features")}</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-3">{t("support")}</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li><Link href="/help" className="hover:text-white transition-colors">{t("helpCenter")}</Link></li>
                  <li><Link href="/contact" className="hover:text-white transition-colors">{t("contact")}</Link></li>
                  <li><Link href="/status" className="hover:text-white transition-colors">{t("status")}</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-3">{t("company")}</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li><Link href="/about" className="hover:text-white transition-colors">{t("about")}</Link></li>
                  <li><Link href="/blog" className="hover:text-white transition-colors">{t("blog")}</Link></li>
                  <li><Link href="/careers" className="hover:text-white transition-colors">{t("careers")}</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 border-t border-slate-800 pt-4 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>{t("copyright")}</p>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-[0.3em] text-slate-500">Follow</span>
              <div className="flex items-center gap-3 text-slate-300">
                <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
                <Link href="/about" className="hover:text-white transition-colors">News</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
