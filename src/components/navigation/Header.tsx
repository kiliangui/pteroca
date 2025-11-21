"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { useTranslations, useLocale } from 'next-intl'
import { cn } from "@/lib/utils"
import {
  Home,
  Server,
  ShoppingCart,
  Wallet,
  Shield,
  User,
  LogOut,
  Menu,
  X,
  LogIn,
  ChevronDown,
  Sun,
  Moon,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"

export function Header({siteName="HostChicken"}) {
  const t = useTranslations('header')
  const pathname = usePathname()
  const router = useRouter()
  const locale = useLocale()
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const locales = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "fr", label: "Français", flag: "🇫🇷" }
  ]

  useEffect(() => {
    setMounted(true)
    const close = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false)
      }
    }
    document.addEventListener("click", close)
    return () => document.removeEventListener("click", close)
  }, [])
  const [langMenuOpen, setLangMenuOpen] = useState(false)

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false)
      }
    }
    document.addEventListener("click", close)
    return () => document.removeEventListener("click", close)
  }, [])

  const navigation = [
    {
      name: t("dashboard"),
      href: "/dashboard",
      icon: Home,
    },
    {
      name: t("servers"),
      href: "/dashboard/servers",
      icon: Server,
    },
    {
      name: t("store"),
      href: "/create",
      icon: ShoppingCart,
    },
    {
      name: t("balance"),
      href: "/dashboard/balance",
      icon: Wallet,
    },
  ]

  const adminNavigation = [
    {
      name: t("admin"),
      href: "/admin",
      icon: Shield,
    },
  ]

  const isAdmin = session?.user?.role === "admin" // TODO: Implement proper role checking

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur dark:bg-gray-900/95 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <img src={"/logo.png"}/>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                {siteName}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const isActive = pathname === item.href 
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}

            {isAdmin && adminNavigation.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div ref={langRef} className="relative">
            <button
              onClick={(event) => {
                setLangMenuOpen((open) => !open)
                event.stopPropagation()
              }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-sm font-semibold text-foreground shadow-sm transition-colors hover:border-border"
            >
              <span className="text-lg">
                {locales.find((lang) => lang.code === locale)?.flag}
              </span>
              <span>{locale.toUpperCase()}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
            {langMenuOpen && (
              <div className="absolute right-0 z-10 mt-2 w-40 rounded-xl border border-border bg-popover shadow-lg">
                {locales.map((lang) => {
                  const isActive = locale === lang.code
                  return (
                    <button
                      key={lang.code}
                      onClick={(event) => {
                        event.stopPropagation()
                        if (lang.code === locale) {
                          setLangMenuOpen(false)
                          return
                        }
                        const pathWithoutLocale = pathname.replace(/^\/(en|fr)/, '') || '/'
                        window.location.href = `/${lang.code}${pathWithoutLocale}`
                      }}
                      className={cn(
                        "flex items-center gap-2 w-full px-3 py-2 text-left text-sm transition-colors",
                        isActive
                          ? "bg-accent/10 text-accent"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
            <button
              onClick={() =>
                setTheme((theme === "dark" ? "light" : "dark") as "light" | "dark")
              }
              className="flex items-center justify-center rounded-full border border-gray-200 bg-white p-2 text-gray-600 shadow-sm transition-colors hover:border-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              aria-label="Toggle theme"
            >
              {mounted && theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
          </div>
           {session?.user?.email ? <>
             {/* User Menu */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {session?.user?.name || session?.user?.email}
              </span>
            </div>

            <button
              onClick={async () => {
                await signOut({ callbackUrl: "/auth/login" })
                window.location.href="/"

              }}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">{t('logout')}</span>
            </button> </div></>: <div>
            <button
              onClick={async () => {
                window.location.href="/auth/login"

              }}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden md:inline">{t('login')}</span>
            </button>
            </div>
          }
         <div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
            <nav className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium transition-colors",
                      isActive
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}

              {isAdmin && adminNavigation.map((item) => {
                const isActive = pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium transition-colors",
                      isActive
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}

              <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
                <div className="flex items-center gap-3 px-3 py-2">
                  <User className="h-5 w-5 text-gray-500" />
                  <span className="text-base text-gray-700 dark:text-gray-300">
                    {session?.user?.name || session?.user?.email}
                  </span>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
