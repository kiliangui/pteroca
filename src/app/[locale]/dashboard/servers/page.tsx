import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ServersTable } from "@/components/dashboard/ServersTable"
import { Sparkles, Plus, ShieldCheck } from "lucide-react"

export default async function ServersPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950 p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 dark:bg-gray-900/60 px-3 py-1 text-sm font-semibold text-blue-700 dark:text-blue-200 shadow-sm">
              <Sparkles className="h-4 w-4" />
              Mission Control
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white">
                My Servers
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Track performance, deploy new instances, and jump back into any panel with one click.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className="gap-2">
              <Link href="/create">
                <Plus className="h-4 w-4" />
                Launch new server
              </Link>
            </Button>
            <Button variant="outline" asChild className="gap-2 border-gray-300 dark:border-gray-700">
              <Link href="/contact">
                <ShieldCheck className="h-4 w-4" />
                Need help?
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <ServersTable />
    </div>
  )
}
