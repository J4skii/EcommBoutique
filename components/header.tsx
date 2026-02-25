"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Sparkles, Menu, ShoppingCart, User, Search, Heart } from "lucide-react"
import Link from "next/link"

interface HeaderProps {
    cartCount?: number;
}

export function Header({ cartCount = 0 }: HeaderProps) {
  // Wishlist is local storage usually, so we can't easily SSR it without hydration mismatch or useEffect.
  // For now, static 0 or client side fetch. I'll leave it as 0.

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-center py-2 px-4">
        <p className="text-sm font-medium">
          🎉 Free shipping on orders over R300 | Use code: MONICA20 for 20% off your first order
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
                <h1 className="font-semibold text-lg text-gray-800">Monica's Bow Boutique</h1>
                <p className="text-xs text-pink-600 hidden sm:block font-medium">Handcrafted with Love</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-gray-600 hover:text-pink-600 transition-colors font-medium">
                Home
              </Link>
              <Link href="/products" className="text-gray-600 hover:text-pink-600 transition-colors font-medium">
                Collection
              </Link>
              <Link href="/custom-orders" className="text-gray-600 hover:text-pink-600 transition-colors font-medium">
                Custom Orders
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-pink-600 transition-colors font-medium">
                About Monica
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-pink-600 transition-colors font-medium">
                Contact
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="hidden sm:flex hover:bg-pink-50" asChild>
                <Link href="/search">
                    <Search className="h-5 w-5 text-gray-600" />
                </Link>
              </Button>

              <Button variant="ghost" size="icon" className="relative hover:bg-pink-50" asChild>
                <Link href="/wishlist">
                  <Heart className="h-5 w-5 text-gray-600" />
                </Link>
              </Button>

              <Button variant="ghost" size="icon" className="relative hover:bg-pink-50" asChild>
                <Link href="/cart">
                  <ShoppingCart className="h-5 w-5 text-gray-600" />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-pink-600 text-white text-xs">
                      {cartCount}
                    </Badge>
                  )}
                </Link>
              </Button>

              <Button variant="ghost" size="icon" className="hidden sm:flex hover:bg-pink-50" asChild>
                <Link href="/account">
                    <User className="h-5 w-5 text-gray-600" />
                </Link>
              </Button>

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
                    <Link href="/products" className="text-lg font-medium text-gray-700 hover:text-pink-600">
                      Collection
                    </Link>
                    <Link href="/custom-orders" className="text-lg font-medium text-gray-700 hover:text-pink-600">
                      Custom Orders
                    </Link>
                    <Link href="/about" className="text-lg font-medium text-gray-700 hover:text-pink-600">
                      About Monica
                    </Link>
                    <Link href="/contact" className="text-lg font-medium text-gray-700 hover:text-pink-600">
                      Contact
                    </Link>
                    <Link href="/admin" className="text-lg font-medium text-pink-600 border-t pt-4 mt-4">
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
