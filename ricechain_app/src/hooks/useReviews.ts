// src/hooks/useReviews.ts
import { useState, useEffect } from 'react'
import type { Review } from '@prisma/client'

/**
 * 商品レビュー用フック
 * @param productId - レビューを取得・投稿する商品ID
 */
export function useReviews(productId: string) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  // レビュー一覧を取得
  useEffect(() => {
    if (!productId) return
    fetch(`/api/reviews?productId=${productId}`)
      .then(res => res.json())
      .then(data => setReviews(data.reviews))
      .finally(() => setLoading(false))
  }, [productId])

  // 新規レビュー投稿
  const createReview = async (payload: {
    productId: string
    orderId:   string
    rating:    number
    title:     string
    content:   string
    imageUrls?: string[]
  }) => {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      throw new Error('Failed to create review')
    }
    const { review } = await res.json()
    setReviews(prev => [review, ...prev])
    return review as Review
  }

  return { reviews, loading, createReview }
}
