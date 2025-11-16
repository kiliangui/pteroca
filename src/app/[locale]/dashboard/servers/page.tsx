import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { ServersTable } from "@/components/dashboard/ServersTable"

export default async function ServersPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
  }

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          My Servers
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Manage your game servers
        </p>
      </header>

      <ServersTable />
    </div>
  )
}