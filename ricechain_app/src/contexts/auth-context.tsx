'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { siwsLoginWithPhantom } from '@/lib/solana/siws'
import type { SiwsResponse } from '@/features/auth/types'
import type { User as PrismaUser, KycStatus as PrismaKycStatus } from '@prisma/client'

// Auth Context の型定義
export type AuthContextValue = {
  user: PrismaUser | null
  userId: string | null
  isAuthenticated: boolean
  kycStatus: PrismaKycStatus | null
  login: () => Promise<void>
  logout: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

interface AuthProviderProps {
  initialUser: PrismaUser | null
  children: ReactNode
}

export function AuthProvider({ initialUser, children }: AuthProviderProps) {
  const [user, setUser] = useState<PrismaUser | null>(initialUser)
  const [kycStatus, setKycStatus] = useState<PrismaKycStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const { publicKey, connect, disconnect, signMessage } = useWallet()

  // userId に変化があったら KYC ステータスを取得
  useEffect(() => {
    if (user?.id) {
      fetch('/api/kyc-status', { credentials: 'include' })
        .then(res => res.ok ? res.json() : null)
        .then((data: { kycStatus: PrismaKycStatus | null } | null) => setKycStatus(data?.kycStatus ?? null))
        .catch(() => setKycStatus(null))
    } else {
      setKycStatus(null)
    }
  }, [user?.id])

  /* ------------------ login ------------------ */
  const login = async () => {
    if (!publicKey || !signMessage) {
      // Phantom の接続ダイアログを開く
      await connect()
      if (!publicKey || !signMessage) {
        throw new Error('Wallet not connected or signMessage missing')
      }
    }

    setLoading(true)
    try {
      const res = await siwsLoginWithPhantom(publicKey, signMessage)
      if (res.ok) {
        const meRes = await fetch('/api/me', { credentials: 'include' })
        const { user } = await meRes.json()
        setUser(user)
      }
    } finally {
      setLoading(false)
    }
  }

  /* ------------------ logout ------------------ */
  const logout = async () => {
    setLoading(true)
    try {
      await disconnect()
      await fetch('/api/logout', { method: 'POST', credentials: 'include' })
      setUser(null)
    } finally {
      setLoading(false)
    }
  }


  return (
    <AuthContext.Provider
      value={{
        user,
        userId: user?.id ?? null,
        isAuthenticated: !!user,
        kycStatus,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
