// src/hooks/useKomePons.ts
import { useState, useEffect } from 'react'
import type { KomePon } from '@prisma/client'

/**
 * KomePon フック
 * - komePons: 履歴
 * - loading: 読み込み中フラグ
 * - createKomePon: 新規付与
 */
export function useKomePons() {
  const [komePons, setKomePons] = useState<KomePon[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/komepons')
      .then(res => res.json())
      .then(data => setKomePons(data.komePons))
      .finally(() => setLoading(false))
  }, [])

  const createKomePon = async (relatedOrderId?: string) => {
    const res = await fetch('/api/komepons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ relatedOrderId }),
    })
    if (!res.ok) throw new Error('Failed to create KomePon')
    const { komePon } = await res.json()
    setKomePons(prev => [komePon, ...prev])
    return komePon
  }

  return { komePons, loading, createKomePon }
}
