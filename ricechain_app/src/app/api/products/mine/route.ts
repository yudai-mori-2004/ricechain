// app/api/products/mine/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/solana/session'
import { prisma } from '@/lib/prisma/prisma'

/**
 * GET /api/products/mine
 * - ログイン中生産者の商品一覧を取得
 */
export async function GET(req: NextRequest) {
  const res = NextResponse.next()
  const session = await getSession(req, res)
  if (!session.userId) {
    return NextResponse.json({ products: [] })
  }
  const products = await prisma.product.findMany({
    where: { farmerId: session.userId },
    orderBy: { createdAt: 'desc' },
    include: { 
      details: true,
      farmer: true 
    },
  })
  return NextResponse.json({ products })
}
