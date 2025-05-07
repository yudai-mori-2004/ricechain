// app/api/disputes/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/solana/session'
import { prisma } from '@/lib/prisma/prisma'

/**
 * GET /api/disputes/:id
 * - 認証済みユーザーに紛争を公開
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const res = NextResponse.next()
  const session = await getSession(req, res)
  if (!session.userId) {
    return NextResponse.json({ dispute: null })
  }
  const dispute = await prisma.dispute.findUnique({
    where: { id: params.id },
    include: { chatMessages: true, juryVotes: true },
  })
  return NextResponse.json({ dispute })
}

/**
 * PATCH /api/disputes/:id
 * - 紛争のステータスや投票数を更新
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const res = NextResponse.next()
  const session = await getSession(req, res)
  if (!session.userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }
  const data = await req.json()
  const dispute = await prisma.dispute.update({
    where: { id: params.id },
    data,
  })
  return NextResponse.json({ dispute })
}
