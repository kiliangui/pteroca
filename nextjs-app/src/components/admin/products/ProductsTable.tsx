"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Package, Plus, Edit, Trash2, Search, DollarSign } from "lucide-react"
import { toast } from "sonner"

interface Product {
  id: number
  name: string
  description: string | null
  isActive: boolean
  recommended: boolean
  diskSpace: number
  memory: number
  cpu: number
  io: number
  categoryId: number | null
  category?: {
    id: number
    name: string
  }
  prices: Array<{
    id: number
    type: string
    value: number
    unit: string
    price: string
    stripePriceId?: string
  }>
}

interface Category {
  id: number
  name: string
}

export function ProductsTable() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isPriceDialogOpen, setIsPriceDialogOpen] = useState(false)
  const [isEditPriceDialogOpen, setIsEditPriceDialogOpen] = useState(false)
  const [selectedPrice, setSelectedPrice] = useState<(Product["prices"][number]) | null>(null)

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      if (response.ok) {
        const data = await response.json()
        setProducts((data as any)?.products ?? data)
        setLoading(false)
      }
    } catch (error) {
      console.error("Failed to fetch products:", error)
      toast.error("Failed to load products")
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  const filteredProducts: Product[] = (
    Array.isArray(products) ? products : ((products as any)?.products ?? [])
  ).filter((product: Product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleCreateProduct = async (formData: FormData) => {
    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        toast.success("Product created successfully")
        setIsCreateDialogOpen(false)
        fetchProducts()
      } else {
        toast.error("Failed to create product")
      }
    } catch (error) {
      toast.error("Failed to create product")
    }
  }

  const handleUpdateProduct = async (formData: FormData) => {
    if (!selectedProduct) return

    try {
      const response = await fetch(`/api/admin/products/${selectedProduct.id}`, {
        method: "PUT",
        body: formData,
      })

      if (response.ok) {
        toast.success("Product updated successfully")
        setIsEditDialogOpen(false)
        setSelectedProduct(null)
        fetchProducts()
      } else {
        toast.error("Failed to update product")
      }
    } catch (error) {
      toast.error("Failed to update product")
    }
  }

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Product deleted successfully")
        fetchProducts()
      } else {
        toast.error("Failed to delete product")
      }
    } catch (error) {
      toast.error("Failed to delete product")
    }
  }

  const handleAddPrice = async (formData: FormData) => {
    if (!selectedProduct) return
  
    try {
      const response = await fetch(`/api/admin/products/${selectedProduct.id}/prices`, {
        method: "POST",
        body: formData,
      })
  
      if (response.ok) {
        toast.success("Price added successfully")
        fetchProducts()
        setIsPriceDialogOpen(false)
      } else {
        toast.error("Failed to add price")
      }
    } catch (error) {
      toast.error("Failed to add price")
    }
  }
  
  const handleUpdatePrice = async (formData: FormData) => {
    if (!selectedPrice) return
  
    try {
      const response = await fetch(`/api/admin/products/prices/${selectedPrice.id}`, {
        method: "PUT",
        body: formData,
      })
  
      if (response.ok) {
        toast.success("Price updated successfully")
        setIsEditPriceDialogOpen(false)
        setSelectedPrice(null)
        fetchProducts()
      } else {
        const data = await response.json().catch(() => ({}))
        toast.error(data?.error || "Failed to update price")
      }
    } catch (error) {
      toast.error("Failed to update price")
    }
  }

  const handleDeletePrice = async (priceId: number) => {
    if (!confirm("Are you sure you want to delete this price?")) return

    try {
      const response = await fetch(`/api/admin/products/prices/${priceId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Price deleted successfully")
        fetchProducts()
      } else {
        toast.error("Failed to delete price")
      }
    } catch (error) {
      toast.error("Failed to delete price")
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Products Management
          </CardTitle>
          <CardDescription>Manage server products</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading products...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Products Management
              </CardTitle>
              <CardDescription>Manage server products and configurations</CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Product</DialogTitle>
                  <DialogDescription>Add a new server product</DialogDescription>
                </DialogHeader>
                <form action={handleCreateProduct} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" name="name" required />
                    </div>
                    <div>
                      <Label htmlFor="categoryId">Category</Label>
                      <Select name="categoryId">
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="diskSpace">Disk Space (MB)</Label>
                      <Input id="diskSpace" name="diskSpace" type="number" required />
                    </div>
                    <div>
                      <Label htmlFor="memory">Memory (MB)</Label>
                      <Input id="memory" name="memory" type="number" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cpu">CPU (%)</Label>
                      <Input id="cpu" name="cpu" type="number" required />
                    </div>
                    <div>
                      <Label htmlFor="io">IO</Label>
                      <Input id="io" name="io" type="number" required />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="isActive" name="isActive" defaultChecked />
                    <Label htmlFor="isActive">Active</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="recommended" name="recommended" />
                    <Label htmlFor="recommended">Recommended</Label>
                  </div>
                  <Button type="submit">Create Product</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Resources</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Pricing</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-medium">{product.name}</div>
                      {product.description && (
                        <div className="text-sm text-muted-foreground">{product.description}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{product.category?.name || "No category"}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>CPU: {product.cpu}%</div>
                      <div>RAM: {product.memory}MB</div>
                      <div>Disk: {product.diskSpace}MB</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.isActive ? "default" : "secondary"}>
                      {product.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {product.prices.slice(0, 2).map((price) => (
                        <div key={price.id}>
                          {price.type}: {(price.unit?.toUpperCase() === 'EUR' ? '€' : '$')}{price.price}
                        </div>
                      ))}
                      {product.prices.length > 2 && (
                        <div className="text-muted-foreground">+{product.prices.length - 2} more</div>
                      )}
                      {product.prices.length === 0 && (
                        <div className="text-muted-foreground">No pricing set</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedProduct(product)
                          setIsEditDialogOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedProduct(product)
                          setIsPriceDialogOpen(true)
                        }}
                      >
                        <DollarSign className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Price Management Dialog */}
      <Dialog open={isPriceDialogOpen} onOpenChange={setIsPriceDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Pricing</DialogTitle>
            <DialogDescription>Configure pricing for {selectedProduct?.name}</DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Current Prices</h4>
                {selectedProduct.prices.length > 0 ? (
                  <div className="space-y-2">
                    {selectedProduct.prices.map((price) => (
                      <div key={price.id} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <span className="font-medium">{price.type}</span>
                          <span className="text-sm text-muted-foreground ml-2">
                            {price.value} {price.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{(price.unit?.toUpperCase() === 'EUR' ? '€' : '$')}{price.price}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedPrice(price)
                              setIsEditPriceDialogOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeletePrice(price.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No prices configured yet.</p>
                )}
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-4">Add New Price</h4>
                <form action={handleAddPrice} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price-type">Type</Label>
                      <Select name="type" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="price-value">Duration</Label>
                      <Input id="price-value" name="value" type="number" placeholder="1" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price-unit">Currency</Label>
                      <Select name="unit" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">$ USD</SelectItem>
                          <SelectItem value="EUR">€ EUR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="price-amount">Price</Label>
                      <Input id="price-amount" name="price" type="number" step="0.01" placeholder="9.99" required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="price-stripe-id">Stripe Price ID (optional)</Label>
                    <Input id="price-stripe-id" name="stripePriceId" placeholder="price_123..." />
                  </div>
                  <Button type="submit">Add Price</Button>
                </form>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Price Dialog */}
      <Dialog open={isEditPriceDialogOpen} onOpenChange={setIsEditPriceDialogOpen}>
        <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Price</DialogTitle>
            <DialogDescription>Update price details</DialogDescription>
          </DialogHeader>
          {selectedPrice && (
            <form action={handleUpdatePrice} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-price-type">Type</Label>
                  <Select name="type" defaultValue={selectedPrice.type}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-price-value">Duration</Label>
                  <Input id="edit-price-value" name="value" type="number" defaultValue={selectedPrice.value} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-price-unit">Currency</Label>
                  <Select name="unit" defaultValue={selectedPrice.unit}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">$ USD</SelectItem>
                      <SelectItem value="EUR">€ EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-price-amount">Price</Label>
                  <Input id="edit-price-amount" name="price" type="number" step="0.01" defaultValue={selectedPrice.price} />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-price-stripe-id">Stripe Price ID</Label>
                <Input id="edit-price-stripe-id" name="stripePriceId" defaultValue={selectedPrice.stripePriceId || ""} placeholder="price_123..." />
              </div>
              <Button type="submit">Update Price</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product information</DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <form action={handleUpdateProduct} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Name</Label>
                  <Input id="edit-name" name="name" defaultValue={selectedProduct.name} required />
                </div>
                <div>
                  <Label htmlFor="edit-categoryId">Category</Label>
                  <Select name="categoryId" defaultValue={selectedProduct.categoryId?.toString()}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea id="edit-description" name="description" defaultValue={selectedProduct.description || ""} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-diskSpace">Disk Space (MB)</Label>
                  <Input id="edit-diskSpace" name="diskSpace" type="number" defaultValue={selectedProduct.diskSpace} required />
                </div>
                <div>
                  <Label htmlFor="edit-memory">Memory (MB)</Label>
                  <Input id="edit-memory" name="memory" type="number" defaultValue={selectedProduct.memory} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-cpu">CPU (%)</Label>
                  <Input id="edit-cpu" name="cpu" type="number" defaultValue={selectedProduct.cpu} required />
                </div>
                <div>
                  <Label htmlFor="edit-io">IO</Label>
                  <Input id="edit-io" name="io" type="number" defaultValue={selectedProduct.io} required />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="edit-isActive" name="isActive" defaultChecked={selectedProduct.isActive} />
                <Label htmlFor="edit-isActive">Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="edit-recommended" name="recommended" defaultChecked={selectedProduct.recommended} />
                <Label htmlFor="edit-recommended">Recommended</Label>
              </div>
              <Button type="submit">Update Product</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}