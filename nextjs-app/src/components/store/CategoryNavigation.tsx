import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Category {
  id: number
  name: string
  description: string | null
}

interface CategoryNavigationProps {
  categories: Category[]
  activeCategoryId?: number
}

export function CategoryNavigation({ categories, activeCategoryId }: CategoryNavigationProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button
        variant={activeCategoryId === undefined ? "default" : "outline"}
        size="sm"
        asChild
      >
        <Link href="/store">
          All Categories
        </Link>
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={activeCategoryId === category.id ? "default" : "outline"}
          size="sm"
          asChild
        >
          <Link href={`/store?category=${category.id}`}>
            {category.name}
          </Link>
        </Button>
      ))}
    </div>
  )
}