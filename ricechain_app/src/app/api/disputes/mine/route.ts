// app/api/disputes/mine/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/solana/session'
import { prisma } from '@/lib/prisma/prisma'

/**
 * GET /api/disputes/mine
 * - 認証済みユーザーの関与する紛争のみ取得
 */
export async function GET(_req: NextRequest) {
  const res = NextResponse.next()
  const session = await getSession(_req, res)
  if (!session.userId) {
    return NextResponse.json({ disputes: [] })
  }
  const disputes = await prisma.dispute.findMany({
    where: {
      OR: [
        { buyerId: session.userId },
        { sellerId: session.userId },
      ],
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ disputes })
}
