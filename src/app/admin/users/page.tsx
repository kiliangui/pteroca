import { UsersTable } from "@/components/admin/users/UsersTable"

export default function AdminUsersPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Users Management
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Manage user accounts, roles, and permissions
        </p>
      </header>

      <UsersTable />
    </div>
  )
}