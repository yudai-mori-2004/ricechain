// app/api/chat-messages/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/solana/session'
import { prisma } from '@/lib/prisma/prisma'

/**
 * GET /api/chat-messages?disputeId=xxx
 * - 指定された紛争のチャットメッセージ一覧を取得
 */
export async function GET(req: NextRequest) {
  const res = NextResponse.next()
  const session = await getSession(req, res)
  if (!session.userId) {
    return NextResponse.json({ chatMessages: [] })
  }

  const disputeId = req.nextUrl.searchParams.get('disputeId')
  if (!disputeId) {
    return NextResponse.json({ error: 'disputeId is required' }, { status: 400 })
  }

  const chatMessages = await prisma.chatMessage.findMany({
    where: { disputeId },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json({ chatMessages })
}

/**
 * POST /api/chat-messages
 * - ボディ: { disputeId: string; message: string }
 * - セッションユーザーを senderId に設定
 */
export async function POST(req: NextRequest) {
  const res = NextResponse.next()
  const session = await getSession(req, res)
  if (!session.userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { disputeId, message } = await req.json()
  if (!disputeId || typeof message !== 'string') {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }

  const newMessage = await prisma.chatMessage.create({
    data: {
      disputeId,
      senderId: session.userId,
      message,
    },
  })

  return NextResponse.json({ chatMessage: newMessage }, { status: 201 })
}
