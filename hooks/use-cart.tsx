"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface CartItem {
    id: string
    product_id: string
    name: string
    price: number
    quantity: number
    image_url: string | null
    selected_color: string | null
    selected_size: string | null
    stock_quantity: number
}

interface CartContextType {
    items: CartItem[]
    addItem: (item: Omit<CartItem, "id">) => void
    removeItem: (productId: string) => void
    updateQuantity: (productId: string, quantity: number) => void
    clearCart: () => void
    itemCount: number
    subtotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("monicas-cart")
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart))
            } catch (e) {
                console.error("Failed to parse cart:", e)
            }
        }
        setIsLoaded(true)
    }, [])

    // Save cart to localStorage whenever items change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("monicas-cart", JSON.stringify(items))
        }
    }, [items, isLoaded])

    const addItem = (newItem: Omit<CartItem, "id">) => {
        setItems((currentItems) => {
            const existingItem = currentItems.find(
                (item) =>
                    item.product_id === newItem.product_id &&
                    item.selected_color === newItem.selected_color &&
                    item.selected_size === newItem.selected_size
            )

            if (existingItem) {
                return currentItems.map((item) =>
                    item.product_id === newItem.product_id &&
                        item.selected_color === newItem.selected_color &&
                        item.selected_size === newItem.selected_size
                        ? { ...item, quantity: Math.min(item.quantity + newItem.quantity, newItem.stock_quantity) }
                        : item
                )
            }

            return [...currentItems, { ...newItem, id: `${newItem.product_id}-${Date.now()}` }]
        })
    }

    const removeItem = (productId: string) => {
        setItems((currentItems) => currentItems.filter((item) => item.product_id !== productId))
    }

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(productId)
            return
        }

        setItems((currentItems) =>
            currentItems.map((item) =>
                item.product_id === productId ? { ...item, quantity: Math.min(quantity, item.stock_quantity) } : item
            )
        )
    }

    const clearCart = () => {
        setItems([])
    }

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                itemCount,
                subtotal,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider")
    }
    return context
}
