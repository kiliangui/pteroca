import { SettingsForm } from "@/components/admin/settings/SettingsForm"

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          System Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Configure system-wide settings and preferences
        </p>
      </header>

      <SettingsForm />
    </div>
  )
}