// app/api/reviews/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/solana/session'
import { prisma } from '@/lib/prisma/prisma'

/**
 * GET /api/reviews?productId=...  
 * - 指定商品のレビュー一覧を取得
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const productId = url.searchParams.get('productId')
  if (!productId) {
    return NextResponse.json({ reviews: [] })
  }

  const reviews = await prisma.review.findMany({
    where: { productId },
    include: { user: { select: { handleName: true, iconImageUrl: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ reviews })
}

/**
 * POST /api/reviews  
 * - 新しいレビューを作成
 * - body: { productId, orderId, rating, title, content, imageUrls? }
 */
export async function POST(req: NextRequest) {
  const res = NextResponse.next()
  const session = await getSession(req, res)
  if (!session.userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { productId, orderId, rating, title, content, imageUrls } = await req.json()
  const review = await prisma.review.create({
    data: {
      productId,
      userId:       session.userId,
      orderId,
      rating,
      title,
      content,
      imageUrls,
    },
  })

  return NextResponse.json({ review }, { status: 201 })
}