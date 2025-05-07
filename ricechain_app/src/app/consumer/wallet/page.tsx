'use client'

import '@solana/wallet-adapter-react-ui/styles.css'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import { useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/contexts/auth-context'
import TransakButton from '@/components/wallet/transak-button'
import WalletBalance from '@/components/wallet/wallet-balance'
import Link from 'next/link'

export default function WalletPage() {
    const { publicKey, connected, disconnect } = useWallet()
    const { user, login, logout, loading: authLoading } = useAuth()

    // ウォレットアドレスは Auth の user または Wallet Adapter の publicKey から
    const walletAddress = user?.walletAddress ?? (publicKey ? publicKey.toBase58() : null)

    // Phantom 接続後に SIWS 認証
    useEffect(() => {
        // if (connected && publicKey) {
        //     login().catch(console.error)
        // }
    }, [connected, publicKey, login])

    // 切断処理
    const handleDisconnect = async () => {
        await logout()
        disconnect()
    }

    return (
        <div className="container mx-auto py-8 max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">ウォレット</h1>

            <Card className="p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">ウォレット接続</h2>

                {authLoading ? (
                    <p className="text-center">読み込み中...</p>
                ) : connected && walletAddress ? (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div className="h-3 w-3 rounded-full bg-green-500" />
                                <p className="font-medium">
                                    接続済み: <span className="font-mono">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
                                </p>
                            </div>
                            <button
                                onClick={handleDisconnect}
                                disabled={authLoading}
                                className="px-3 py-1 border rounded text-sm"
                            >
                                切断する
                            </button>
                        </div>

                        <WalletBalance isConnected={connected} walletAddress={walletAddress} />

                        <div className="mt-8">
                            <h2 className="text-lg font-semibold mb-3">SOLをチャージする</h2>
                            <p className="text-gray-600 mb-4">
                                Transakを利用してクレジットカードでSOLを購入し、ウォレットに直接チャージできます。
                            </p>
                            <TransakButton walletAddress={walletAddress} size="lg" />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Phantom 等対応ウォレット選択 */}
                        <WalletMultiButton className="w-full justify-center" />

                        <div className="border-t pt-4 mt-4 text-gray-600 text-sm">
                            <p>
                                RiceChainでお買い物をするには、ウォレットに接続してください。<br />
                                Phantomなどの対応ウォレットを選択できます。
                            </p>
                        </div>
                    </div>
                )}
            </Card>

            <div className="mt-4 text-center">
                <Link href="/consumer/purchase" className="text-blue-600 hover:text-blue-800">
                    商品一覧に戻る
                </Link>
            </div>
        </div>
    )
}