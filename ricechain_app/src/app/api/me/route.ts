// app/api/me/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/solana/session'
import { prisma } from '@/lib/prisma/prisma'
import { z } from 'zod'
import type { User as PrismaUser } from '@prisma/client'

/* -------------------------------- Zod スキーマ -------------------------------- */

const ShippingAddressSchema = z.object({
  id:           z.string().optional(), // 既存レコードなら必須
  name:         z.string(),
  postalCode:   z.string(),
  prefecture:   z.string(),
  city:         z.string(),
  address1:     z.string(),
  address2:     z.string().optional(),
  phoneNumber:  z.string(),
  isDefault:    z.boolean(),
})

const UpdateUserSchema = z.object({
  handleName:       z.string().min(1).max(30).optional(),
  email:            z.string().email().optional(),
  iconImageUrl:     z.string().url().optional(),
  bannerImageUrl:   z.string().url().optional(),
  shippingAddresses: z.array(ShippingAddressSchema).optional(),
})

/* ------------------------------ GET /api/me ------------------------------ */
export async function GET(req: NextRequest) {
  const res     = NextResponse.next()
  const session = await getSession(req, res)

  if (!session.userId) {
    // PrismaUser ではなく null
    return NextResponse.json<{ user: PrismaUser | null }>({
      user: null,
    })
  }

  // Prisma 型がそのまま返る
  const user = await prisma.user.findUnique({
    where:   { id: session.userId },
    include: { shippingAddresses: true },
  })

  return NextResponse.json<{ user: PrismaUser | null }>({ user })
}

/* ----------------------------- PATCH /api/me ----------------------------- */
export async function PATCH(req: NextRequest) {
  const res     = NextResponse.next()
  const session = await getSession(req, res)

  if (!session.userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  // ボディバリデーション
  let data: z.infer<typeof UpdateUserSchema>
  try {
    data = UpdateUserSchema.parse(await req.json())
  } catch (err) {
    return NextResponse.json(
      { error: 'Invalid request', details: (err as z.ZodError).issues },
      { status: 400 }
    )
  }

  const { shippingAddresses, ...profileFields } = data

  // トランザクションでまとめて更新
  const updatedUser = await prisma.$transaction(async (tx) => {
    if (Object.keys(profileFields).length) {
      await tx.user.update({
        where: { id: session.userId },
        data:  profileFields,
      })
    }

    if (shippingAddresses) {
      await tx.shippingAddress.deleteMany({
        where: { userId: session.userId },
      })
      await tx.shippingAddress.createMany({
        data: shippingAddresses.map(({ id: _id, ...addr }) => ({
          ...addr,
          userId: session.userId!,
        })),
      })
    }

    // 更新後のユーザーをそのまま取得
    return tx.user.findUnique({
      where:   { id: session.userId },
      include: { shippingAddresses: true },
    })
  })

  return NextResponse.json<{ user: PrismaUser | null }>({
    user: updatedUser ?? null,
  })
}
