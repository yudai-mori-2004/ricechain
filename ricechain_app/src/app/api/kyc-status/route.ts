// app/api/kyc-status/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/solana/session'
import { prisma } from '@/lib/prisma/prisma'

export async function GET(req: NextRequest) {
  const session = await getSession(req, NextResponse.next())
  if (!session.userId) {
    return NextResponse.json({ kycStatus: null })
  }
  const kycStatus = await prisma.kycStatus.findUnique({
    where: { userId: session.userId }
  })
  return NextResponse.json({ kycStatus })
}
