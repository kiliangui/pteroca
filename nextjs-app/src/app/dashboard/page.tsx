import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { BalanceCard } from "@/components/dashboard/BalanceCard"
import { ServersTable } from "@/components/dashboard/ServersTable"
import { ActivityFeed } from "@/components/dashboard/ActivityFeed"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
  }

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Welcome back, {session.user?.name || session.user?.email}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <BalanceCard />
        </div>

        <div className="lg:col-span-2">
          <ServersTable />
        </div>
      </div>

      <div className="mt-8">
        <ActivityFeed />
      </div>
    </div>
  )
}