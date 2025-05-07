// src/hooks/useDisputes.ts
import { useState, useEffect } from 'react'
import type { Dispute } from '@prisma/client'

/**
 * useDisputes フック
 * - disputes: 全紛争一覧
 * - myDisputes: 自分の関与する紛争一覧
 * - loading, loadingMine
 * - createDispute, fetchDispute, updateDispute
 */
export function useDisputes() {
  const [disputes, setDisputes] = useState<Dispute[]>([])
  const [myDisputes, setMyDisputes] = useState<Dispute[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMine, setLoadingMine] = useState(true)

  useEffect(() => {
    // 全紛争取得
    fetch('/api/disputes')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch disputes');
        }
        return res.text();
      })
      .then(text => {
        if (!text) {
          return { disputes: [] };
        }
        try {
          return JSON.parse(text);
        } catch (e) {
          console.error('Failed to parse response as JSON:', e);
          return { disputes: [] };
        }
      })
      .then(data => setDisputes(data.disputes || []))
      .catch(error => {
        console.error('Error fetching disputes:', error);
      })
      .finally(() => setLoading(false));

    // 自分の紛争取得
    fetch('/api/disputes/mine')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch my disputes');
        }
        return res.text();
      })
      .then(text => {
        if (!text) {
          return { disputes: [] };
        }
        try {
          return JSON.parse(text);
        } catch (e) {
          console.error('Failed to parse response as JSON:', e);
          return { disputes: [] };
        }
      })
      .then(data => setMyDisputes(data.disputes || []))
      .catch(error => {
        console.error('Error fetching my disputes:', error);
      })
      .finally(() => setLoadingMine(false));
  }, [])

  const createDispute = async (
    orderId: string,
    reason: string,
    requiredJurors: number
  ) => {
    const res = await fetch('/api/disputes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, reason, requiredJurors }),
    })
    if (!res.ok) throw new Error('Failed to create dispute')
    const { dispute } = await res.json()
    setDisputes(prev => [dispute, ...prev])
    setMyDisputes(prev => [dispute, ...prev])
    return dispute
  }

  const fetchDispute = async (id: string) => {
    const res = await fetch(`/api/disputes/${id}`)
    if (!res.ok) throw new Error('Failed to fetch dispute')
    const { dispute } = await res.json()
    return dispute as Dispute | null
  }

  const updateDispute = async (
    id: string,
    update: Partial<Pick<Dispute, 'status' | 'buyerVoteCount' | 'sellerVoteCount'>>
  ) => {
    const res = await fetch(`/api/disputes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update),
    })
    if (!res.ok) throw new Error('Failed to update dispute')
    const { dispute } = await res.json()
    setDisputes(prev => prev.map(d => (d.id === id ? dispute : d)))
    setMyDisputes(prev => prev.map(d => (d.id === id ? dispute : d)))
    return dispute as Dispute
  }

  return { disputes, myDisputes, loading, loadingMine, createDispute, fetchDispute, updateDispute }
}
