// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/prisma'

/**
 * GET /api/products
 * - 全商品一覧を取得 (消費者向け)
 *   オプション: ?available=true などでフィルタ
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const available = url.searchParams.get('available')
  const where: any = {}
  if (available !== null) {
    where.available = available === 'true'
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { 
      details: true,
      farmer: true 
    },
  })
  return NextResponse.json({ products })
}
