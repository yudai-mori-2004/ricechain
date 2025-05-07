// src/hooks/useOrders.ts
import { useState, useEffect } from 'react'
import type { Order, OrderItem, Product, User, ShippingAddress } from '@prisma/client'

// 拡張されたOrderの型定義（APIレスポンスの形式と一致）
type OrderWithDetails = Order & { 
  items: (OrderItem & { 
    product: Product 
  })[];
  buyer: User;
  seller: User;
  shippingAddress: ShippingAddress;
}

/**
 * useOrders フック - 購入履歴 (buyer)
 */
export function useOrders() {
  const [orders, setOrders] = useState<OrderWithDetails[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => setOrders(data.orders))
      .finally(() => setLoading(false))
  }, [])

  const createOrder = async (
    shippingAddressId: string,
    items: { productId: string; quantity: number }[]
  ) => {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shippingAddressId, items }),
    })
    if (!res.ok) throw new Error('Failed to create order')
    const { order } = await res.json()
    setOrders(prev => [order, ...prev])
    return order
  }

  return { orders, loading, createOrder }
}
