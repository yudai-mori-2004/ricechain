// app/api/disputes/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/solana/session'
import { prisma } from '@/lib/prisma/prisma'

/**
 * GET /api/disputes
 * - 認証済みユーザーなら全紛争を取得
 */
export async function GET(req: NextRequest) {
  const res = NextResponse.next()
  const session = await getSession(req, res)
  if (!session.userId) {
    return NextResponse.json({ disputes: [] })
  }
  // 全認証ユーザーに全紛争データを公開
  const disputes = await prisma.dispute.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ disputes })
}

/**
 * POST /api/disputes
 * - 新規紛争を作成
 */
export async function POST(req: NextRequest) {
  const res = NextResponse.next()
  const session = await getSession(req, res)
  if (!session.userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }
  const { orderId, reason, requiredJurors } = await req.json()
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { sellerId: true },
  })
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }
  const dispute = await prisma.dispute.create({
    data: {
      orderId,
      buyerId: session.userId,
      sellerId: order.sellerId,
      reason,
      requiredJurors,
    },
  })
  return NextResponse.json({ dispute }, { status: 201 })
}
