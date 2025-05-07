// app/api/orders/sales/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/solana/session'
import { prisma } from '@/lib/prisma/prisma'

/**
 * GET /api/orders/sales
 * - ログイン中ユーザーの販売履歴（受注）を取得
 */
export async function GET(req: NextRequest) {
  const res = NextResponse.next()
  const session = await getSession(req, res)
  if (!session.userId) {
    return NextResponse.json({ orders: [] })
  }
  const orders = await prisma.order.findMany({
    where: { sellerId: session.userId },
    orderBy: { createdAt: 'desc' },
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
  return NextResponse.json({ orders })
}

/**
 * POST /api/orders
 * - 新しい注文を作成
 * - body: { shippingAddressId: string; items: { productId: string; quantity: number }[] }
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

  const { shippingAddressId, items } = await req.json()
  if (!shippingAddressId || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }

  const newOrder = await prisma.$transaction(async (tx) => {
    // 単一ベンダー想定: 最初のアイテムの生産者を sellerId とする
    const firstProduct = await tx.product.findUnique({
      where: { id: items[0].productId },
      select: { farmerId: true, price: true }
    })
    if (!firstProduct) throw new Error('Product not found')
    const sellerId = firstProduct.farmerId

    // 合計金額計算
    let subtotal = 0
    for (const { productId, quantity } of items) {
      const p = await tx.product.findUnique({
        where: { id: productId },
        select: { price: true }
      })
      if (!p) throw new Error(`Invalid product ${productId}`)
      subtotal += p.price * quantity
    }
    const shippingFee = 0
    const total = subtotal + shippingFee

    // 注文生成
    const order = await tx.order.create({
      data: {
        buyerId: session.userId!,
        sellerId,
        shippingAddressId,
        status: 'pending_payment',
        subtotal,
        shippingFee,
        komePonDiscount: 0,
        total,
        paymentStatus: 'pending',
      }
    })

    // 注文アイテム生成
    await tx.orderItem.createMany({
      data: items.map(({ productId, quantity }) => ({
        orderId: order.id,
        productId,
        quantity,
        price: items[0].quantity ? items[0].price : 0,
      }))
    })

    // 生成後の注文を返す (関連データを含める)
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
      }
    })
  })

  return NextResponse.json({ order: newOrder }, { status: 201 })
}
