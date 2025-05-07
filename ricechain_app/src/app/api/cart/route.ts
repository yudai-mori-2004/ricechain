// src/app/api/cart/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/solana/session'
import { prisma } from '@/lib/prisma/prisma'
import { PrismaClient } from '@prisma/client'

/** GET: 現在のカートを取得 */
export async function GET(req: NextRequest) {
  const res     = NextResponse.next()
  const session = await getSession(req, res)
  if (!session.userId) {
    return NextResponse.json({ cart: null }, { status: 200 })
  }
  const cart = await prisma.cart.findUnique({
    where:   { userId: session.userId },
    include: { items: true },
  })
  return NextResponse.json({ cart })
}

/** POST: カートにアイテムを追加（既存なら数量を加算） */
export async function POST(req: NextRequest) {
  const res     = NextResponse.next()
  const session = await getSession(req, res)
  if (!session.userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }
  const { productId, quantity } = await req.json()

  const updatedCart = await prisma.$transaction(async (tx) => {
    // カートを upsert
    const cart = await tx.cart.upsert({
      where:  { userId: session.userId },
      create: { userId: session.userId!, totalPrice: 0 },
      update: {},
    })

    // カートアイテムを upsert
    const existing = await tx.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } },
    })
    if (existing) {
      await tx.cartItem.update({
        where: { id: existing.id },
        data:  { quantity: existing.quantity + quantity },
      })
    } else {
      await tx.cartItem.create({
        data: { cartId: cart.id, productId, quantity },
      })
    }

    // 合計金額を再計算
    const items = await tx.cartItem.findMany({
      where:   { cartId: cart.id },
      include: { product: { select: { price: true } } },
    })
    const totalPrice = items.reduce((sum: number, i: any) => sum + i.quantity * i.product.price, 0)

    // カートを更新
    await tx.cart.update({
      where: { id: cart.id },
      data:  { totalPrice },
    })

    return tx.cart.findUnique({
      where:   { id: cart.id },
      include: { items: true },
    })
  })

  return NextResponse.json({ cart: updatedCart })
}

/** PATCH: アイテム数量を更新 */
export async function PATCH(req: NextRequest) {
  const res     = NextResponse.next()
  const session = await getSession(req, res)
  if (!session.userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }
  const { itemId, quantity } = await req.json()

  const updatedCart = await prisma.$transaction(async (tx) => {
    await tx.cartItem.update({
      where: { id: itemId },
      data:  { quantity },
    })

    const cart = await tx.cart.findUnique({ where: { userId: session.userId } })
    if (!cart) throw new Error('Cart not found')

    const items = await tx.cartItem.findMany({
      where:   { cartId: cart.id },
      include: { product: { select: { price: true } } },
    })
    const totalPrice = items.reduce((sum:number, i:any) => sum + i.quantity * i.product.price, 0)

    await tx.cart.update({
      where: { id: cart.id },
      data:  { totalPrice },
    })

    return tx.cart.findUnique({
      where:   { id: cart.id },
      include: { items: true },
    })
  })

  return NextResponse.json({ cart: updatedCart })
}

/** DELETE: アイテムをカートから削除 */
export async function DELETE(req: NextRequest) {
  const res     = NextResponse.next()
  const session = await getSession(req, res)
  if (!session.userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }
  const { itemId } = await req.json()

  const updatedCart = await prisma.$transaction(async (tx) => {
    const cart = await tx.cart.findUnique({ where: { userId: session.userId } })
    if (!cart) throw new Error('Cart not found')

    await tx.cartItem.delete({ where: { id: itemId } })

    const items = await tx.cartItem.findMany({
      where:   { cartId: cart.id },
      include: { product: { select: { price: true } } },
    })
    const totalPrice = items.reduce((sum:number, i:any) => sum + i.quantity * i.product.price, 0)

    await tx.cart.update({
      where: { id: cart.id },
      data:  { totalPrice },
    })

    return tx.cart.findUnique({
      where:   { id: cart.id },
      include: { items: true },
    })
  })

  return NextResponse.json({ cart: updatedCart })
}
