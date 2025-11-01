"use client"

import { OrderForm } from "@/components/store/OrderForm"

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

interface OrderFormWrapperProps {
  product: Product
  userBalance: string
}

export function OrderFormWrapper({ product, userBalance }: OrderFormWrapperProps) {
  const handleOrderComplete = () => {
    // This will be handled by client-side navigation
    window.location.href = '/dashboard'
  }

  return (
    <OrderForm
      product={product}
      userBalance={userBalance}
      onOrderComplete={handleOrderComplete}
    />
  )
}