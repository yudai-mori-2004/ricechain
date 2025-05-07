// src/hooks/useProducts.ts
import { useState, useEffect } from 'react'
import type { Product, ProductDetails, User } from '@prisma/client'

// APIから返されるプロダクトの型定義
export type ProductWithFarmerAndDetails = Product & { 
  details: ProductDetails | null;
  farmer: User;
}

/**
 * useProducts: 公開商品一覧取得
 */
export function useProducts(available?: boolean) {
  const [products, setProducts] = useState<ProductWithFarmerAndDetails[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = () => {
    setLoading(true)
    let url = '/api/products'
    if (available !== undefined) {
      url += `?available=${available}`
    }
    fetch(url)
      .then(res => res.json())
      .then(data => setProducts(data.products))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchProducts() }, [available])

  return { products, loading, refresh: fetchProducts }
}
