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
  X
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

export function Header({siteName="Pteroca"}) {
  const t = useTranslations('header')
  const pathname = usePathname()
  const router = useRouter()
  const locale = useLocale()
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
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

          {/* Language Switcher */}
          <Select value={locale} onValueChange={(newLocale) => {
            const pathWithoutLocale = pathname.replace(/^\/(en|fr)/, '') || '/'
            const newPath = `/${newLocale}${pathWithoutLocale}`
            window.location.href = newPath
          }}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">EN</SelectItem>
              <SelectItem value="fr">FR</SelectItem>
            </SelectContent>
          </Select>

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
            </button>

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