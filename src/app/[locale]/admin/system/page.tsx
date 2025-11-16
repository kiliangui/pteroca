import { SystemOverview } from "@/components/admin/system/SystemOverview"

export default function AdminSystemPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          System Overview
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Monitor system performance, logs, and infrastructure
        </p>
      </header>

      <SystemOverview />
    </div>
  )
}