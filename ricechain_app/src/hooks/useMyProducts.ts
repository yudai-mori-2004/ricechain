// src/hooks/useMyProducts.ts
import { useState, useEffect } from 'react'
import { ProductWithFarmerAndDetails } from './useProducts'

/**
 * useMyProducts: 生産者自身の商品一覧取得
 */
export function useMyProducts() {
  const [products, setProducts] = useState<ProductWithFarmerAndDetails[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products/mine')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        return res.text();
      })
      .then(text => {
        if (!text) {
          return { products: [] };
        }
        try {
          return JSON.parse(text);
        } catch (e) {
          console.error('Failed to parse response as JSON:', e);
          return { products: [] };
        }
      })
      .then(data => setProducts(data.products || []))
      .catch(error => {
        console.error('Error fetching products:', error);
      })
      .finally(() => setLoading(false));
  }, [])

  const refresh = () => {
    setLoading(true)
    fetch('/api/products/mine')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        return res.text();
      })
      .then(text => {
        if (!text) {
          return { products: [] };
        }
        try {
          return JSON.parse(text);
        } catch (e) {
          console.error('Failed to parse response as JSON:', e);
          return { products: [] };
        }
      })
      .then(data => setProducts(data.products || []))
      .catch(error => {
        console.error('Error refreshing products:', error);
      })
      .finally(() => setLoading(false));
  }

  return { products, loading, refresh }
}
