// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

// Next.js のホットリロード対策としてグローバル変数に一度だけ保持
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

export const prisma: PrismaClient =
  global.prisma ??
  new PrismaClient({
    log: ['query', 'error'], // 必要ならログを出す設定
  })

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}
