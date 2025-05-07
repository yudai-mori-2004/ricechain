// src/hooks/useProduct.ts
import { useState, useEffect } from 'react'
import { ProductWithFarmerAndDetails } from './useProducts'

/**
 * useProduct: 商品詳細取得
 */
export function useProduct(id: string) {
  const [product, setProduct] = useState<ProductWithFarmerAndDetails | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProduct = () => {
    setLoading(true)
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data.product))
      .finally(() => setLoading(false))
  }

  useEffect(() => { if (id) fetchProduct() }, [id])

  return { product, loading, refresh: fetchProduct }
}
