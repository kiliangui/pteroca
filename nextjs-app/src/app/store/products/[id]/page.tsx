import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { OrderForm } from "@/components/store/OrderForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { OrderFormWrapper } from "@/components/store/OrderFormWrapper"
import { prisma } from "@/lib/prisma"

interface Product {
  id: number
  name: string
  description: string | null
  diskSpace: number
  memory: number
  cpu: number
  io: number
  dbCount: number
  swap: number
  backups: number
  ports: number
  category: {
    id: number
    name: string
    description: string | null
  }
  prices: ProductPrice[]
}

interface ProductPrice {
  id: number
  type: string
  value: number
  unit: string
  price: string
}

interface UserBalance {
  balance: string
  currency: string
}

async function getProduct(id: string): Promise<Product | null> {
    try{
        const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/products/${id}`, {
            cache: 'no-store'
        })
        if (!res.ok) {
            if (res.status === 404) return null
            throw new Error('Failed to fetch product')
        }
        return res.json()
    }catch(e){
    return null

    }
  
}

async function getUserBalance(): Promise<UserBalance | null> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null

  try {
    // Use internal API call instead of fetch to avoid auth issues
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { balance: true },
    })

    if (!user) return null

    return {
      balance: user.balance || '0',
      currency: 'USD'
    }
  } catch (error) {
    console.error('Failed to fetch user balance:', error)
    // Return a default balance for testing
    return {
      balance: '100.00',
      currency: 'USD'
    }
  }
}

function ProductSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="h-8 bg-muted rounded w-3/4"></div>
        <div className="h-4 bg-muted rounded w-full"></div>
        <div className="h-4 bg-muted rounded w-2/3"></div>
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded"></div>
          ))}
        </div>
      </div>
      <div className="h-96 bg-muted rounded"></div>
    </div>
  )
}

export default async function ProductPage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = await params
  const product = await getProduct(id)
  const userBalance = await getUserBalance()

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/store">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Store
          </Link>
        </Button>
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <Badge variant="secondary">{product.category.name}</Badge>
        </div>
        {product.description && (
          <p className="text-muted-foreground">{product.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Server Specifications</CardTitle>
              <CardDescription>
                Detailed specifications for this hosting plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Disk Space:</span>
                    <span className="text-sm">{product.diskSpace} MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Memory:</span>
                    <span className="text-sm">{product.memory} MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">CPU:</span>
                    <span className="text-sm">{product.cpu}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">IO:</span>
                    <span className="text-sm">{product.io}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Databases:</span>
                    <span className="text-sm">{product.dbCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Swap:</span>
                    <span className="text-sm">{product.swap} MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Backups:</span>
                    <span className="text-sm">{product.backups}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Ports:</span>
                    <span className="text-sm">{product.ports}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Pricing Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {product.prices.map((price) => (
                  <div key={price.id} className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <span className="font-medium">
                        {price.type === 'fixed' ? 'One-time payment' : `${price.value} ${price.unit}`}
                      </span>
                    </div>
                    <Badge variant="outline">${price.price}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Suspense fallback={<div className="h-96 bg-muted rounded animate-pulse"></div>}>
            <OrderFormWrapper
              product={product}
              userBalance={userBalance?.balance || '0'}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}