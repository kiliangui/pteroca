"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getSession } from "next-auth/react"
import { OrderForm } from "@/components/store/OrderForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

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

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const productId = searchParams.get('productId')

  const [product, setProduct] = useState<Product | null>(null)
  const [userBalance, setUserBalance] = useState<UserBalance | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadData() {
      if (!productId) {
        setError("No product selected")
        setLoading(false)
        return
      }

      try {
        const session = await getSession()
        if (!session?.user) {
          router.push('/auth/login')
          return
        }

        // Fetch product
        const productRes = await fetch(`/api/products/${productId}`)
        if (!productRes.ok) {
          throw new Error("Product not found")
        }
        const productData = await productRes.json()
        setProduct(productData)

        // Fetch user balance
        const balanceRes = await fetch('/api/user/balance')
        if (balanceRes.ok) {
          const balanceData = await balanceRes.json()
          setUserBalance(balanceData)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load checkout data")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [productId, router])

  const handleOrderComplete = () => {
    router.push('/dashboard?success=order_completed')
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-destructive mb-4">{error || "Product not found"}</p>
              <Button asChild>
                <Link href="/store">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Store
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href={`/store/products/${product.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Product
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p className="text-muted-foreground">
          Complete your order for {product.name}
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        {userBalance ? (
          <OrderForm
            product={product}
            userBalance={userBalance.balance}
            onOrderComplete={handleOrderComplete}
          />
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  Unable to load your account balance. Please try again.
                </p>
                <Button onClick={() => window.location.reload()}>
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}