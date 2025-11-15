import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

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

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
    let lowestPrice;
    try{
    

  lowestPrice = product?.prices?.reduce((min, price) =>
    parseFloat(price.price) < parseFloat(min.price) ? price : min
  )
    }catch{
lowestPrice=0
    }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Disk Space:</span>
            <span>{product.diskSpace} MB</span>
          </div>
          <div className="flex justify-between">
            <span>Memory:</span>
            <span>{product.memory} MB</span>
          </div>
          <div className="flex justify-between">
            <span>CPU:</span>
            <span>{product.cpu}%</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="flex items-center justify-between w-full">
          <Badge variant="secondary">
            From ${lowestPrice.price}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {lowestPrice.type === 'fixed' ? 'One-time' : `${lowestPrice.value} ${lowestPrice.unit}`}
          </span>
        </div>
        <Button asChild className="w-full">
          <Link href={`/store/products/${product.id}`}>
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}