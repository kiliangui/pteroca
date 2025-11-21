"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Package,
  FolderOpen,
  Settings,
  Activity,
  Shield
} from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: FolderOpen,
  },{
    name: "Eggs",
    href: "/admin/eggs",
    icon: FolderOpen,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
  {
    name: "System",
    href: "/admin/system",
    icon: Activity,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-lg">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Admin Panel
          </h1>
        </div>
      </div>

      <nav className="px-4 pb-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}