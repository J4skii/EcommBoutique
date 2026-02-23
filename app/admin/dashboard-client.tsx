"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Package, ShoppingCart, DollarSign, Eye, Edit, Trash2, X } from "lucide-react"
import Image from "next/image"
import { createProduct, deleteProduct, updateOrderStatus } from "@/app/actions/admin"

interface AdminDashboardClientProps {
  initialProducts: any[]
  initialOrders: any[]
  stats: {
    products: number
    orders: number
  }
}

export default function AdminDashboardClient({ initialProducts, initialOrders, stats }: AdminDashboardClientProps) {
  const [variants, setVariants] = useState<{size: string, color: string, stock: string}[]>([])

  const addVariant = () => {
      setVariants([...variants, { size: '', color: '', stock: '0' }])
  }

  const removeVariant = (index: number) => {
      setVariants(variants.filter((_, i) => i !== index))
  }

  const handleVariantChange = (index: number, field: string, value: string) => {
      const newVariants = [...variants]
      // @ts-ignore
      newVariants[index][field] = value
      setVariants(newVariants)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your bow boutique</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.products}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.orders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R0.00</div>
              <p className="text-xs text-muted-foreground">Calculated from completed orders</p>
            </CardContent>
          </Card>

          <Card>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Items need restocking</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="add-product">Add Product</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Product Management</CardTitle>
                <CardDescription>Manage your bow inventory</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {initialProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                           {product.imageUrl ? (
                                <Image
                                src={product.imageUrl}
                                alt={product.name}
                                fill
                                className="object-cover"
                                />
                           ) : (
                               <div className="w-full h-full flex items-center justify-center">
                                   <Package className="h-6 w-6 text-gray-400" />
                               </div>
                           )}
                        </div>
                        <div>
                          <h3 className="font-medium">{product.name}</h3>
                          <p className="text-sm text-gray-600">R{product.price}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant={product.stockQuantity > 0 ? "default" : "destructive"}>
                          {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : "Sold out"}
                        </Badge>
                        <div className="flex gap-2">
                          <form action={async () => {
                              if(confirm('Delete product?')) await deleteProduct(product.id)
                          }}>
                            <Button size="sm" variant="outline" type="submit">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                          </form>
                        </div>
                      </div>
                    </div>
                  ))}
                  {initialProducts.length === 0 && <p className="text-center text-gray-500 py-8">No products found.</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Manage customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {initialOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">Order #{order.orderNumber}</h3>
                        <p className="text-sm text-gray-600">{order.customerEmail}</p>
                        <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right flex flex-col items-end gap-2">
                        <p className="font-medium">R{order.totalAmount}</p>
                        <Badge variant="outline">{order.status}</Badge>
                         {/* Simple status toggle for demo */}
                         {order.status === 'pending' && (
                             <form action={() => updateOrderStatus(order.id, 'confirmed')}>
                                 <Button size="sm" variant="ghost">Mark Confirmed</Button>
                             </form>
                         )}
                      </div>
                    </div>
                  ))}
                   {initialOrders.length === 0 && <p className="text-center text-gray-500 py-8">No orders found.</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add-product">
            <Card>
              <CardHeader>
                <CardTitle>Add New Product</CardTitle>
                <CardDescription>Add a new bow to your collection</CardDescription>
              </CardHeader>
              <CardContent>
                <form action={createProduct} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name</Label>
                      <Input id="name" name="name" placeholder="e.g., Classic Rose Bow" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">Price (R)</Label>
                      <Input id="price" name="price" type="number" step="0.01" placeholder="45.00" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" name="category" placeholder="e.g. Bows" defaultValue="Bows" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" placeholder="Describe your beautiful bow..." />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="stockQuantity">Total Stock Quantity</Label>
                      <Input id="stockQuantity" name="stockQuantity" type="number" placeholder="5" defaultValue="0" />
                      <p className="text-xs text-gray-500">Overall stock if no variants, or sum of variants.</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="imageUrls">Image URL</Label>
                        <Input id="imageUrls" name="imageUrls" placeholder="https://..." />
                    </div>
                  </div>

                  {/* Variants Section */}
                  <div className="space-y-4 border p-4 rounded-md">
                      <div className="flex justify-between items-center">
                          <Label>Product Variants (Optional)</Label>
                          <Button type="button" size="sm" variant="outline" onClick={addVariant}>
                              <Plus className="h-4 w-4 mr-2" /> Add Variant
                          </Button>
                      </div>

                      {variants.map((v, i) => (
                          <div key={i} className="flex gap-2 items-end">
                              <div className="flex-1">
                                  <Label className="text-xs">Size</Label>
                                  <Input name="variant_size" value={v.size} onChange={e => handleVariantChange(i, 'size', e.target.value)} placeholder="e.g. Small" />
                              </div>
                              <div className="flex-1">
                                  <Label className="text-xs">Color</Label>
                                  <Input name="variant_color" value={v.color} onChange={e => handleVariantChange(i, 'color', e.target.value)} placeholder="e.g. Red" />
                              </div>
                              <div className="w-24">
                                  <Label className="text-xs">Stock</Label>
                                  <Input name="variant_stock" type="number" value={v.stock} onChange={e => handleVariantChange(i, 'stock', e.target.value)} placeholder="0" />
                              </div>
                              <Button type="button" size="icon" variant="ghost" onClick={() => removeVariant(i)}>
                                  <X className="h-4 w-4 text-red-500" />
                              </Button>
                          </div>
                      ))}
                      {variants.length === 0 && <p className="text-sm text-gray-500">No variants added. Product will use base stock.</p>}
                  </div>

                  <div className="flex items-center space-x-2">
                      <Label htmlFor="isFeatured">Featured?</Label>
                      <Input id="isFeatured" name="isFeatured" type="checkbox" className="w-4 h-4" />
                  </div>

                  <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
