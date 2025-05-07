'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import WalletBalance from './wallet-balance'

type WalletConnectProps = { showBalance?: boolean }

const WalletConnect: React.FC<WalletConnectProps> = ({ showBalance = true }) => {
    const { user, login, logout, loading } = useAuth()
    const connected = Boolean(user)
    const walletAddress = user?.walletAddress ?? null

    const connectWallet = async () => {
        try {
            await login()
        } catch (err) {
            console.error('ウォレット接続／認証に失敗しました', err)
            alert('ウォレット接続／認証に失敗しました')
        }
    }

    const disconnectWallet = async () => {
        try {
            await logout()
        } catch (err) {
            console.error('ウォレット切断に失敗しました', err)
            alert('ウォレット切断に失敗しました')
        }
    }

    return (
        <div className="space-y-3">
            <Button
                size="sm"
                disabled={loading}
                onClick={connected ? disconnectWallet : connectWallet}
            >
                {loading
                    ? '処理中…'
                    : connected
                        ? `${walletAddress?.slice(0, 4)}…${walletAddress?.slice(-4)} を切断`
                        : 'ウォレット接続'}
            </Button>

            {showBalance && (
                <WalletBalance isConnected={connected} walletAddress={walletAddress} />
            )}
        </div>
    )
}

export default WalletConnect
