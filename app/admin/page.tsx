"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Package, ShoppingCart, DollarSign, Eye, Edit, Trash2, Loader2, LogOut, FolderOpen, Check, X } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface Product {
  id: string
  name: string
  price: number
  stock_quantity: number
  image_url: string | null
  is_active: boolean
  is_featured: boolean
  category_id: string | null
}

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  is_active: boolean
  product_count?: number
}

interface Order {
  id: string
  order_number: string
  customer_email: string
  total_amount: number
  status: string
  payment_status: string
  created_at: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    revenue: 0,
    lowStock: 0,
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  // Category form state
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryDescription, setNewCategoryDescription] = useState("")
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editCategoryName, setEditCategoryName] = useState("")

  useEffect(() => {
    checkAuth()
    fetchData()
  }, [])

  const checkAuth = () => {
    const session = document.cookie.match(/admin_session=admin_([^;]+)/)
    if (!session) {
      router.push("/admin/login")
    }
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch products, orders, and categories in parallel
      const [productsRes, ordersRes, categoriesRes] = await Promise.all([
        fetch("/api/products?limit=100&includeInactive=true"),
        fetch("/api/orders?limit=100"),
        fetch("/api/categories?includeInactive=true&withProductCount=true"),
      ])

      const productsData = productsRes.ok ? await productsRes.json() : { products: [] }
      const ordersData = ordersRes.ok ? await ordersRes.json() : { orders: [] }
      const categoriesData = categoriesRes.ok ? await categoriesRes.json() : { categories: [] }

      const products = productsData.products || []
      const orders = ordersData.orders || []
      const categories = categoriesData.categories || []

      setProducts(products)
      setOrders(orders)
      setCategories(categories)

      // Calculate stats
      const revenue = orders
        .filter((o: Order) => o.payment_status === "paid")
        .reduce((sum: number, o: Order) => sum + o.total_amount, 0)

      const lowStock = products.filter((p: Product) => p.stock_quantity < 5).length

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        revenue,
        lowStock,
      })
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    router.push("/admin/login")
  }

  // Category Management
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCategoryName.trim()) return

    setSubmitting(true)
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCategoryName,
          description: newCategoryDescription,
        }),
      })

      if (response.ok) {
        setNewCategoryName("")
        setNewCategoryDescription("")
        fetchData()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to create category")
      }
    } catch (error) {
      alert("Failed to create category")
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateCategory = async (id: string) => {
    if (!editCategoryName.trim()) return

    try {
      const response = await fetch("/api/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          name: editCategoryName,
        }),
      })

      if (response.ok) {
        setEditingCategory(null)
        setEditCategoryName("")
        fetchData()
      } else {
        alert("Failed to update category")
      }
    } catch (error) {
      alert("Failed to update category")
    }
  }

  const handleDeleteCategory = async (id: string) => {
    const category = categories.find(c => c.id === id)
    if (category?.product_count && category.product_count > 0) {
      alert(`Cannot delete "${category.name}" - it has ${category.product_count} products. Reassign products first.`)
      return
    }

    if (!confirm("Are you sure you want to delete this category?")) return

    try {
      const response = await fetch(`/api/categories?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchData()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to delete category")
      }
    } catch (error) {
      alert("Failed to delete category")
    }
  }

  const handleToggleCategory = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch("/api/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          is_active: !currentStatus,
        }),
      })

      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      alert("Failed to update category")
    }
  }

  // Product Management
  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)

    const formData = new FormData(e.currentTarget)
    
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          description: formData.get("description"),
          price: Number(formData.get("price")),
          stock_quantity: Number(formData.get("stock")),
          category_id: formData.get("category_id") || null,
          is_featured: false,
        }),
      })

      if (response.ok) {
        fetchData()
        e.currentTarget.reset()
      } else {
        alert("Failed to add product")
      }
    } catch (error) {
      console.error("Error adding product:", error)
      alert("Failed to add product")
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
      case "delivered":
        return "default"
      case "shipped":
        return "secondary"
      case "pending":
        return "outline"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-pink-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your bow boutique</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R{stats.revenue.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stats.lowStock > 0 ? "text-orange-600" : ""}`}>
                {stats.lowStock}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="flex flex-wrap">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="categories">
              <FolderOpen className="h-4 w-4 mr-1" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="add-product">Add Product</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Product Management</CardTitle>
                <CardDescription>Manage your bow inventory</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No products yet. Add your first product!</p>
                  ) : (
                    products.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <Image
                            src={product.image_url || "/placeholder.svg"}
                            alt={product.name}
                            width={60}
                            height={60}
                            className="rounded-lg object-cover"
                          />
                          <div>
                            <h3 className="font-medium">{product.name}</h3>
                            <p className="text-sm text-gray-600">R{product.price}</p>
                            {product.category_id && (
                              <p className="text-xs text-pink-600">
                                {categories.find(c => c.id === product.category_id)?.name || "Uncategorized"}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant={product.stock_quantity > 0 ? "default" : "destructive"}>
                            {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : "Sold out"}
                          </Badge>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Manage customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No orders yet.</p>
                  ) : (
                    orders.slice(0, 20).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{order.order_number}</h3>
                          <p className="text-sm text-gray-600">{order.customer_email}</p>
                          <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">R{order.total_amount.toFixed(2)}</p>
                          <div className="flex gap-2 mt-1">
                            <Badge variant={getStatusBadgeVariant(order.status)}>
                              {order.status}
                            </Badge>
                            <Badge variant={order.payment_status === "paid" ? "default" : "outline"}>
                              {order.payment_status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Add Category Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Add New Category</CardTitle>
                  <CardDescription>Create a new product category</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddCategory} className="space-y-4">
                    <div>
                      <Label htmlFor="categoryName">Category Name *</Label>
                      <Input
                        id="categoryName"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="e.g., Wedding Collection"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="categoryDescription">Description</Label>
                      <Textarea
                        id="categoryDescription"
                        value={newCategoryDescription}
                        onChange={(e) => setNewCategoryDescription(e.target.value)}
                        placeholder="Describe this category..."
                        rows={3}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-pink-600 hover:bg-pink-700"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4 mr-2" />
                      )}
                      Create Category
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Categories List */}
              <Card>
                <CardHeader>
                  <CardTitle>Manage Categories</CardTitle>
                  <CardDescription>{categories.length} categories total</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {categories.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No categories yet.</p>
                    ) : (
                      categories.map((category) => (
                        <div 
                          key={category.id} 
                          className={`flex items-center justify-between p-3 border rounded-lg ${
                            !category.is_active ? "opacity-60 bg-gray-50" : ""
                          }`}
                        >
                          <div className="flex-1">
                            {editingCategory === category.id ? (
                              <div className="flex gap-2">
                                <Input
                                  value={editCategoryName}
                                  onChange={(e) => setEditCategoryName(e.target.value)}
                                  className="h-8"
                                  autoFocus
                                />
                                <Button 
                                  size="sm" 
                                  onClick={() => handleUpdateCategory(category.id)}
                                  className="h-8 px-2"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => {
                                    setEditingCategory(null)
                                    setEditCategoryName("")
                                  }}
                                  className="h-8 px-2"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium">{category.name}</h3>
                                  {!category.is_active && (
                                    <Badge variant="outline" className="text-xs">Inactive</Badge>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500">
                                  {category.product_count || 0} products • /products?category={category.slug}
                                </p>
                              </>
                            )}
                          </div>
                          
                          {editingCategory !== category.id && (
                            <div className="flex gap-1 ml-2">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => {
                                  setEditingCategory(category.id)
                                  setEditCategoryName(category.name)
                                }}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleToggleCategory(category.id, category.is_active)}
                                className="h-8 w-8 p-0"
                                title={category.is_active ? "Deactivate" : "Activate"}
                              >
                                {category.is_active ? (
                                  <Check className="h-4 w-4 text-green-600" />
                                ) : (
                                  <X className="h-4 w-4 text-gray-400" />
                                )}
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleDeleteCategory(category.id)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                disabled={(category.product_count || 0) > 0}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Add Product Tab */}
          <TabsContent value="add-product">
            <Card>
              <CardHeader>
                <CardTitle>Add New Product</CardTitle>
                <CardDescription>Add a new bow to your collection</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddProduct} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name *</Label>
                      <Input id="name" name="name" placeholder="e.g., Classic Rose Bow" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">Price (R) *</Label>
                      <Input id="price" name="price" type="number" placeholder="45" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" placeholder="Describe your beautiful bow..." />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock Quantity *</Label>
                      <Input id="stock" name="stock" type="number" placeholder="5" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category_id">Category</Label>
                      <select
                        id="category_id"
                        name="category_id"
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      >
                        <option value="">Select a category</option>
                        {categories.filter(c => c.is_active).map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Product Image URL</Label>
                    <Input id="image" name="image" placeholder="https://..." />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-pink-600 hover:bg-pink-700"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                      </>
                    )}
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
