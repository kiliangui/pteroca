import { ProductsTable } from "@/components/admin/products/ProductsTable"

export default function AdminProductsPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Products Management
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Manage server products and pricing
        </p>
      </header>

      <ProductsTable />
    </div>
  )
}