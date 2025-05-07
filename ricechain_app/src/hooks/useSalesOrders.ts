// src/hooks/useSalesOrders.ts
import { useState, useEffect } from 'react'
import type { Order, OrderItem, Product, User, ShippingAddress } from '@prisma/client'

// useOrdersで使用した型を再利用
type OrderWithDetails = Order & { 
  items: (OrderItem & { 
    product: Product 
  })[];
  buyer: User;
  seller: User;
  shippingAddress: ShippingAddress;
}

/**
 * useSalesOrders フック - 販売履歴 (seller)
 */
export function useSalesOrders() {
  const [orders, setOrders] = useState<OrderWithDetails[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/orders/sales')
      .then(res => res.json())
      .then(data => setOrders(data.orders))
      .finally(() => setLoading(false))
  }, [])

  return { orders, loading }
}
