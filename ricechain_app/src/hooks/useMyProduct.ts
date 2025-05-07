// src/hooks/useMyProduct.ts
import { useState, useEffect } from 'react'
import type { ProductDetails } from '@prisma/client'
import { ProductWithFarmerAndDetails } from './useProducts'

/**
 * useMyProduct: 生産者自身の単一商品取得・編集・削除
 */
export function useMyProduct(id: string) {
  const [product, setProduct] = useState<ProductWithFarmerAndDetails | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProduct = () => {
    setLoading(true)
    fetch(`/api/products/mine/${id}`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => setProduct(data.product))
      .finally(() => setLoading(false))
  }

  const updateProduct = async (
    update: Partial<Omit<ProductWithFarmerAndDetails, 'id' | 'createdAt' | 'updatedAt' | 'farmer'>> & {
      details?: ProductDetails
    }
  ) => {
    const res = await fetch(`/api/products/mine/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(update),
    })
    if (!res.ok) throw new Error('Failed to update product')
    const { product: updated } = await res.json()
    setProduct(updated)
    return updated
  }

  const deleteProduct = async () => {
    const res = await fetch(`/api/products/mine/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    if (!res.ok) throw new Error('Failed to delete product')
    setProduct(null)
    return true
  }

  useEffect(() => { if (id) fetchProduct() }, [id])

  return { product, loading, refresh: fetchProduct, updateProduct, deleteProduct }
}
