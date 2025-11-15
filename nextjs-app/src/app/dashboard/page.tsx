import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { ServerCards } from "@/components/dashboard/ServerCards"
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
          Tableau de bord
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Bon retour, {session.user?.name || session.user?.email}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <ServerCards />
      </div>

      <div className="mt-8">
        <ActivityFeed />
      </div>
    </div>
  )
}