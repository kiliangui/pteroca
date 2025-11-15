import { CategoriesTable } from "@/components/admin/categories/CategoriesTable"

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Categories Management
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Manage product categories
        </p>
      </header>

      <CategoriesTable />
    </div>
  )
}