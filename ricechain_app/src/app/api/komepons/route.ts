// app/api/komepons/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/solana/session'
import { prisma } from '@/lib/prisma/prisma'

/**
 * GET /api/komepons
 * - ログイン中ユーザーの KomePon 履歴を取得
 */
export async function GET(req: NextRequest) {
  const res = NextResponse.next()
  const session = await getSession(req, res)
  if (!session.userId) {
    return NextResponse.json({ komePons: [] })
  }
  const komePons = await prisma.komePon.findMany({
    where: { userId: session.userId },
    orderBy: { givenAt: 'desc' },
  })
  return NextResponse.json({ komePons })
}

/**
 * POST /api/komepons
 * - 新しい KomePon を付与
 * - body: { relatedOrderId?: string }
 */
export async function POST(req: NextRequest) {
  const res = NextResponse.next()
  const session = await getSession(req, res)
  if (!session.userId) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    )
  }

  const { relatedOrderId } = await req.json()
  const newKomePon = await prisma.komePon.create({
    data: {
      userId: session.userId,
      available: true,
      givenAt: new Date(),
      relatedOrderId,
    },
  })

  return NextResponse.json({ komePon: newKomePon }, { status: 201 })
}