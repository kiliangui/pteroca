import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { CategoryNavigation } from "@/components/store/CategoryNavigation"
import { ProductCard } from "@/components/store/ProductCard"
import { prisma } from "@/lib/prisma"

interface StorePageProps {
  searchParams: Promise<{ category?: string }>
}

export default async function StorePage({ searchParams }: StorePageProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
  }

  const { category } = await searchParams
  const categoryId = category ? parseInt(category) : undefined

  // Fetch categories and products from database
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  })

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(categoryId && {
        categoryId: categoryId,
      }),
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      prices: {
        where: {
          deletedAt: null,
        },
        orderBy: {
          value: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Store
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Browse and purchase game server hosting plans
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <CategoryNavigation categories={categories} activeCategoryId={categoryId} />
          </div>

          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.length > 0 ? (
                products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">
                    No products available at the moment.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}