// app/api/jury-votes/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/solana/session'
import { prisma } from '@/lib/prisma/prisma'

/**
 * GET /api/jury-votes?disputeId=<id>
 * - 指定紛争の投票一覧を取得
 */
export async function GET(req: NextRequest) {
  const res = NextResponse.next()
  const session = await getSession(req, res)
  const url = new URL(req.url)
  const disputeId = url.searchParams.get('disputeId')
  if (!session.userId || !disputeId) {
    return NextResponse.json({ votes: [] })
  }
  const votes = await prisma.juryVote.findMany({
    where: { disputeId },
    orderBy: { createdAt: 'asc' },
  })
  return NextResponse.json({ votes })
}

/**
 * POST /api/jury-votes
 * - 投票／更新
 * - body: { disputeId: string, vote: 'buyer' | 'seller', confidence: number }
 */
export async function POST(req: NextRequest) {
  const res = NextResponse.next()
  const session = await getSession(req, res)
  if (!session.userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { disputeId, vote, confidence } = await req.json()
  if (
    typeof disputeId !== 'string' ||
    !['buyer', 'seller'].includes(vote) ||
    typeof confidence !== 'number'
  ) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const juryVote = await prisma.juryVote.upsert({
    where: {
      disputeId_jurorId: {
        disputeId,
        jurorId: session.userId,
      },
    },
    update: { vote, confidence },
    create: {
      disputeId,
      jurorId: session.userId,
      vote,
      confidence,
    },
  })

  return NextResponse.json({ juryVote })
}
