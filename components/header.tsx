"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { 
  Sparkles, 
  Menu, 
  ShoppingCart, 
  User, 
  Search, 
  Heart, 
  Loader2, 
  LogOut,
  ChevronDown,
  Package
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface Category {
  id: string
  name: string
  slug: string
}

// Get customer ID from localStorage
const getCustomerId = () => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("customer_id")
}

// Get customer name
const getCustomerName = () => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("customer_name")
}

// Check if logged in
const isLoggedIn = () => {
  if (typeof window === "undefined") return false
  return !!localStorage.getItem("customer_token")
}

export function Header() {
  const [cartItems, setCartItems] = useState(0)
  const [wishlistItems] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loggedIn, setLoggedIn] = useState(false)
  const [customerName, setCustomerName] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])

  const fetchCartCount = async () => {
    const customerId = getCustomerId()
    if (!customerId) {
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`/api/cart?customer_id=${customerId}`)
      if (response.ok) {
        const data = await response.json()
        const count = data.cartItems?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0
        setCartItems(count)
      }
    } catch (error) {
      console.error("Error fetching cart:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const checkAuth = () => {
    setLoggedIn(isLoggedIn())
    setCustomerName(getCustomerName())
  }

  const handleLogout = () => {
    localStorage.removeItem("customer_token")
    localStorage.removeItem("customer_id")
    localStorage.removeItem("customer_name")
    localStorage.removeItem("customer_email")
    localStorage.removeItem("customer_phone")
    setLoggedIn(false)
    setCustomerName(null)
    setCartItems(0)
    window.dispatchEvent(new Event("auth-changed"))
  }

  useEffect(() => {
    checkAuth()
    fetchCartCount()
    fetchCategories()

    // Listen for auth and cart changes
    const handleCartUpdate = () => fetchCartCount()
    const handleAuthChange = () => checkAuth()
    
    window.addEventListener("cart-updated", handleCartUpdate)
    window.addEventListener("auth-changed", handleAuthChange)

    return () => {
      window.removeEventListener("cart-updated", handleCartUpdate)
      window.removeEventListener("auth-changed", handleAuthChange)
    }
  }, [])

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-center py-2 px-4">
        <p className="text-sm font-medium">
          🎉 Free shipping on orders over R300 | Use code: PAITON20 for 20% off your first order
        </p>
      </div>

      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-pink-100 shadow-sm">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-2 rounded-xl">
                <Sparkles className="h-5 w-5 text-white fill-current" />
              </div>
              <div>
                <h1 className="font-semibold text-lg text-gray-800">Paitons Boutique</h1>
                <p className="text-xs text-pink-600 hidden sm:block font-medium">Handcrafted with Love</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-gray-600 hover:text-pink-600 transition-colors font-medium">
                Home
              </Link>
              
              {/* Categories Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 text-gray-600 hover:text-pink-600 transition-colors font-medium">
                    Shop
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/products" className="cursor-pointer font-medium">
                      <Package className="h-4 w-4 mr-2" />
                      All Products
                    </Link>
                  </DropdownMenuItem>
                  {categories.map((category) => (
                    <DropdownMenuItem key={category.id} asChild>
                      <Link 
                        href={`/products?category=${category.slug}`} 
                        className="cursor-pointer"
                      >
                        {category.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href="/custom-orders" className="text-gray-600 hover:text-pink-600 transition-colors font-medium">
                Custom Orders
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-pink-600 transition-colors font-medium">
                About Paiton
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-pink-600 transition-colors font-medium">
                Contact
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="hidden sm:flex hover:bg-pink-50">
                <Search className="h-5 w-5 text-gray-600" />
              </Button>

              <Button variant="ghost" size="icon" className="relative hover:bg-pink-50" asChild>
                <Link href="/wishlist">
                  <Heart className="h-5 w-5 text-gray-600" />
                  {wishlistItems > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-pink-600 text-white text-xs">
                      {wishlistItems}
                    </Badge>
                  )}
                </Link>
              </Button>

              <Button variant="ghost" size="icon" className="relative hover:bg-pink-50" asChild>
                <Link href="/cart">
                  <ShoppingCart className="h-5 w-5 text-gray-600" />
                  {loading ? (
                    <Loader2 className="absolute -top-2 -right-2 h-4 w-4 animate-spin text-pink-600" />
                  ) : cartItems > 0 ? (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-pink-600 text-white text-xs">
                      {cartItems}
                    </Badge>
                  ) : null}
                </Link>
              </Button>

              {loggedIn ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 hidden lg:block">
                    Hi, {customerName?.split(" ")[0]}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="hover:bg-pink-50"
                    onClick={handleLogout}
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5 text-gray-600" />
                  </Button>
                </div>
              ) : (
                <Button variant="ghost" size="icon" className="hover:bg-pink-50" asChild>
                  <Link href="/auth/login">
                    <User className="h-5 w-5 text-gray-600" />
                  </Link>
                </Button>
              )}

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden hover:bg-pink-50">
                    <Menu className="h-5 w-5 text-gray-600" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-white">
                  <nav className="flex flex-col gap-6 mt-8">
                    <Link href="/" className="text-lg font-medium text-gray-700 hover:text-pink-600">
                      Home
                    </Link>
                    
                    {/* Mobile Categories */}
                    <div className="border-l-2 border-pink-200 pl-4 space-y-3">
                      <p className="text-sm text-gray-500 font-medium">Shop by Category</p>
                      <Link href="/products" className="block text-gray-700 hover:text-pink-600">
                        All Products
                      </Link>
                      {categories.map((category) => (
                        <Link 
                          key={category.id}
                          href={`/products?category=${category.slug}`} 
                          className="block text-gray-700 hover:text-pink-600"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>

                    <Link href="/custom-orders" className="text-lg font-medium text-gray-700 hover:text-pink-600">
                      Custom Orders
                    </Link>
                    <Link href="/about" className="text-lg font-medium text-gray-700 hover:text-pink-600">
                      About Paiton
                    </Link>
                    <Link href="/contact" className="text-lg font-medium text-gray-700 hover:text-pink-600">
                      Contact
                    </Link>
                    
                    {loggedIn ? (
                      <>
                        <div className="border-t pt-4 mt-4">
                          <p className="text-sm text-gray-500 mb-2">Signed in as</p>
                          <p className="font-medium text-gray-800">{customerName}</p>
                        </div>
                        <button 
                          onClick={handleLogout}
                          className="text-lg font-medium text-red-600 hover:text-red-700 text-left"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <Link href="/auth/login" className="text-lg font-medium text-pink-600 border-t pt-4 mt-4">
                        Sign In / Register
                      </Link>
                    )}
                    
                    <Link href="/admin" className="text-lg font-medium text-gray-500 border-t pt-4">
                      Admin Dashboard
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
