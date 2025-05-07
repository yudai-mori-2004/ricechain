// src/contexts/cart-context.tsx
'use client'

import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from 'react'
import type { Cart as PrismaCart, CartItem as PrismaCartItem } from '@prisma/client'

type CartWithItems = PrismaCart & { items: PrismaCartItem[] }

interface CartContextValue {
    cart: CartWithItems | null
    addItem: (productId: string, quantity?: number) => Promise<void>
    updateItem: (itemId: string, quantity: number) => Promise<void>
    removeItem: (itemId: string) => Promise<void>
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartWithItems | null>(null)

    // カート取得
    const fetchCart = async () => {
        const res = await fetch('/api/cart')
        if (res.ok) {
            const { cart } = await res.json()
            setCart(cart)
        }
    }

    useEffect(() => {
        fetchCart()
    }, [])

    // アイテム追加
    const addItem = async (productId: string, quantity = 1) => {
        const res = await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, quantity }),
        })
        if (res.ok) {
            const { cart } = await res.json()
            setCart(cart)
        }
    }

    // アイテム数量更新
    const updateItem = async (itemId: string, quantity: number) => {
        const res = await fetch('/api/cart', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ itemId, quantity }),
        })
        if (res.ok) {
            const { cart } = await res.json()
            setCart(cart)
        }
    }

    // アイテム削除
    const removeItem = async (itemId: string) => {
        const res = await fetch('/api/cart', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ itemId }),
        })
        if (res.ok) {
            const { cart } = await res.json()
            setCart(cart)
        }
    }

    return (
        <CartContext.Provider value={{ cart, addItem, updateItem, removeItem }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const ctx = useContext(CartContext)
    if (!ctx) throw new Error('useCart must be used within CartProvider')
    return ctx
}
