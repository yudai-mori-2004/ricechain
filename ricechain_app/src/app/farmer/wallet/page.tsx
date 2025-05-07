'use client'

import '@solana/wallet-adapter-react-ui/styles.css'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import { useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import TransakButton from '@/components/wallet/transak-button'
import WalletBalance from '@/components/wallet/wallet-balance'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'

export default function WalletPage() {
    const { publicKey, connected, disconnect } = useWallet()
    const { user, login, logout, loading: authLoading } = useAuth()
    const walletAddress = user?.walletAddress ?? publicKey?.toBase58() ?? null

    // ウォレット接続後に SIWS 認証
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
            <h1 className="text-2xl font-bold mb-6">決済</h1>

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
                                    接続済み:{' '}
                                    <span className="font-mono">
                                        {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                                    </span>
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleDisconnect}
                                disabled={authLoading}
                            >
                                切断する
                            </Button>
                        </div>

                        <WalletBalance isConnected={connected} walletAddress={walletAddress} />

                        <div className="mt-8">
                            <h2 className="text-lg font-semibold mb-3">SOLをチャージする</h2>
                            <p className="text-gray-600 mb-4">
                                Transakを利用してクレジットカードでSOLを購入し、ウォレットに直接チャージできます。
                                ウォレット残高は商品購入時に使用されます。
                            </p>

                            <div className="text-sm text-gray-500 mb-4">
                                <ul className="list-disc list-inside space-y-1">
                                    <li>初回チャージ時は本人確認(KYC)が必要です</li>
                                    <li>Visa/MasterCardのみ対応（JCBは非対応）</li>
                                    <li>最低チャージ額: 1,000円から</li>
                                </ul>
                            </div>

                            <TransakButton walletAddress={walletAddress} size="lg" />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Phantom 等対応ウォレットの選択ボタン */}
                        <WalletMultiButton className="w-full justify-center" />

                        <div className="border-t pt-4 mt-4">
                            <p className="text-gray-600 mb-4">
                                RiceChainでお買い物をするには、ウォレットに接続する必要があります。<br />
                                Phantomなどの対応ウォレットを選択してください。
                            </p>
                        </div>
                    </div>
                )}
            </Card>

            <div className="mt-4 text-center">
                <Link
                    href="/consumer/purchase"
                    className="text-blue-600 hover:text-blue-800"
                >
                    商品一覧に戻る
                </Link>
            </div>
        </div>
    )
}
