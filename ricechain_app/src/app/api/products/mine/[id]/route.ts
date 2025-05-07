// app/api/products/mine/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/solana/session'
import { prisma } from '@/lib/prisma/prisma'

/**
 * GET /api/products/mine/:id
 * - 自身が出品した商品の詳細取得
 */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const res = NextResponse.next()
  const session = await getSession(req, res)
  if (!session.userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }
  const product = await prisma.product.findUnique({
    where: { id: params.id, farmerId: session.userId },
    include: { 
      details: true,
      farmer: true 
    },
  })
  if (!product) {
    return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 })
  }
  return NextResponse.json({ product })
}

/**
 * PATCH /api/products/mine/:id
 * - 自身が出品した商品の更新
 */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const res = NextResponse.next()
  const session = await getSession(req, res)
  if (!session.userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { name, description, imageUrl, price, komePonDiscountRate, stock, available, details } = await req.json()

  const updated = await prisma.product.updateMany({
    where: { id: params.id, farmerId: session.userId },
    data: {
      name,
      description,
      imageUrl,
      price,
      komePonDiscountRate,
      stock,
      available,
    },
  })
  if (updated.count === 0) {
    return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 })
  }
  // details は別処理で upsert
  if (details) {
    await prisma.productDetails.upsert({
      where: { productId: params.id },
      create: { productId: params.id, ...details },
      update: details,
    })
  }

  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { 
      details: true,
      farmer: true 
    },
  })
  return NextResponse.json({ product })
}

/**
 * DELETE /api/products/mine/:id
 * - 自身が出品した商品の削除
 */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const res = NextResponse.next()
  const session = await getSession(req, res)
  if (!session.userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }
  const deleted = await prisma.product.deleteMany({ where: { id: params.id, farmerId: session.userId } })
  if (deleted.count === 0) {
    return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 })
  }
  return NextResponse.json({ success: true })
}
