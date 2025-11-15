"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

interface ProductPrice {
  id: number
  type: string
  value: number
  unit: string
  price: string
}

interface Product {
  id: number
  name: string
  description: string | null
  diskSpace: number
  memory: number
  cpu: number
  prices: ProductPrice[]
}

interface OrderFormProps {
  product: Product
  userBalance: string
  onOrderComplete: () => void
}

export function OrderForm({ product, userBalance, onOrderComplete }: OrderFormProps) {
  const [selectedPriceId, setSelectedPriceId] = useState<string>("")
  const [serverName, setServerName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const selectedPrice = product.prices.find(p => p.id.toString() === selectedPriceId)
  const orderAmount = selectedPrice ? parseFloat(selectedPrice.price) : 0
  const currentBalance = parseFloat(userBalance)
  const hasEnoughBalance = currentBalance >= orderAmount

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPrice || !serverName.trim()) return

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          priceId: selectedPrice.id,
          billingCycle: selectedPrice.type === 'fixed' ? 'one-time' : selectedPrice.unit.toLowerCase(),
          serverName: serverName.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create order")
      }

      onOrderComplete()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order {product.name}</CardTitle>
        <CardDescription>
          Configure your server and complete your order
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="serverName">Server Name</Label>
              <Input
                id="serverName"
                value={serverName}
                onChange={(e) => setServerName(e.target.value)}
                placeholder="Enter server name"
                required
              />
            </div>

            <div>
              <Label>Billing Options</Label>
              <RadioGroup value={selectedPriceId} onValueChange={setSelectedPriceId}>
                {product.prices.map((price) => (
                  <div key={price.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={price.id.toString()} id={`price-${price.id}`} />
                    <Label htmlFor={`price-${price.id}`} className="flex-1 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <span>
                          {price.type === 'fixed' ? 'One-time payment' : `${price.value} ${price.unit}`}
                        </span>
                        <span className="font-semibold">${price.price}</span>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          {selectedPrice && (
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <span>Order Total:</span>
                <span className="font-semibold">${selectedPrice.price}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Your Balance:</span>
                <span>${userBalance}</span>
              </div>
              {!hasEnoughBalance && (
                <Alert className="mt-4">
                  <AlertDescription>
                    Insufficient balance. You need ${orderAmount - currentBalance} more.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          className="w-full"
          disabled={!selectedPriceId || !serverName.trim() || !hasEnoughBalance || isLoading}
          onClick={handleSubmit}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Complete Order
        </Button>
      </CardFooter>
    </Card>
  )
}