// app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/solana/session'
import { prisma } from '@/lib/prisma/prisma'

/**
 * GET /api/orders
 * - ログイン中ユーザーの購入注文一覧を取得（buyerId）
 */
export async function GET(req: NextRequest) {
  const res = NextResponse.next()
  const session = await getSession(req, res)
  if (!session.userId) {
    return NextResponse.json({ orders: [] })
  }
  const orders = await prisma.order.findMany({
    where: { buyerId: session.userId },
    include: { 
      items: {
        include: {
          product: true
        }
      },
      buyer: true,
      seller: true,
      shippingAddress: true
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ orders })
}

/**
 * POST /api/orders
 * - 新規注文を作成
 * - body: { sellerId: string, shippingAddressId: string, items: { productId: string; quantity: number }[] }
 */
export async function POST(req: NextRequest) {
  const res = NextResponse.next()
  const session = await getSession(req, res)
  if (!session.userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }
  const { sellerId, shippingAddressId, items } = await req.json() as {
    sellerId: string
    shippingAddressId: string
    items: { productId: string; quantity: number }[]
  }

  // トランザクション内で小計計算とレコード作成
  const newOrder = await prisma.$transaction(async (tx) => {
    let subtotal = 0
    // 各商品の価格を参照
    for (const it of items) {
      const prod = await tx.product.findUnique({ where: { id: it.productId } })
      if (!prod) throw new Error(`Product not found: ${it.productId}`)
      subtotal += prod.price * it.quantity
    }

    // 注文作成
    const order = await tx.order.create({
      data: {
        buyerId: session.userId!,
        sellerId,
        shippingAddressId,
        status: 'pending_payment',
        subtotal,
        shippingFee: 0,
        komePonDiscount: 0,
        total: subtotal,
        paymentStatus: 'unpaid',
      },
    })

    // 注文明細作成
    for (const it of items) {
      const prod = await tx.product.findUnique({ where: { id: it.productId } })!
      if (!prod) throw new Error(`Product not found: ${it.productId}`)
      await tx.orderItem.create({
        data: {
          orderId: order.id,
          productId: it.productId,
          quantity: it.quantity,
          price: prod.price,
        },
      })
    }

    // 完成した注文を取得して返却 (関連データを含める)
    return tx.order.findUnique({
      where: { id: order.id },
      include: { 
        items: {
          include: {
            product: true
          }
        },
        buyer: true,
        seller: true,
        shippingAddress: true 
      },
    })
  })

  return NextResponse.json({ order: newOrder }, { status: 201 })
}
