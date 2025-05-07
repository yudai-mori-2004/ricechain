// src/hooks/useJuryVotes.ts
import { useState, useEffect } from 'react'
import type { JuryVote } from '@prisma/client'

/**
 * useJuryVotes フック
 * - votes: 指定紛争の投票一覧
 * - loading: ローディングフラグ
 * - submitVote: ジュリーボートの作成／更新
 */
export function useJuryVotes(disputeId: string) {
  const [votes, setVotes] = useState<JuryVote[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!disputeId) {
      setVotes([])
      setLoading(false)
      return
    }
    fetch(`/api/jury-votes?disputeId=${encodeURIComponent(disputeId)}`)
      .then(res => res.json())
      .then(data => setVotes(data.votes))
      .finally(() => setLoading(false))
  }, [disputeId])

  const submitVote = async (
    vote: 'buyer' | 'seller',
    confidence: number
  ) => {
    const res = await fetch('/api/jury-votes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ disputeId, vote, confidence }),
    })
    if (!res.ok) throw new Error('Failed to submit vote')
    const { juryVote } = await res.json()
    setVotes(prev => {
      const others = prev.filter(v => v.jurorId !== juryVote.jurorId)
      return [...others, juryVote]
    })
    return juryVote
  }

  return { votes, loading, submitVote }
}