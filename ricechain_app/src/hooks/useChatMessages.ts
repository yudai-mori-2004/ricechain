// src/hooks/useChatMessages.ts
import { useState, useEffect } from 'react'
import type { ChatMessage } from '@prisma/client'

/**
 * useChatMessages フック
 * - disputeId に紐づくメッセージを取得・送信
 */
export function useChatMessages(disputeId: string) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!disputeId) {
      setChatMessages([])
      setLoading(false)
      return
    }
    setLoading(true)
    fetch(`/api/chat-messages?disputeId=${disputeId}`)
      .then(res => res.json())
      .then(data => {
        setChatMessages(data.chatMessages)
      })
      .finally(() => setLoading(false))
  }, [disputeId])

  const createChatMessage = async (message: string) => {
    const res = await fetch('/api/chat-messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ disputeId, message }),
    })
    if (!res.ok) throw new Error('Failed to send message')
    const { chatMessage } = await res.json()
    setChatMessages(prev => [...prev, chatMessage])
    return chatMessage
  }

  return { chatMessages, loading, createChatMessage }
}