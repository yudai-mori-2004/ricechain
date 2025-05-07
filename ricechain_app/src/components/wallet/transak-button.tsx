'use client'

import { useCallback } from 'react'
import { Transak } from '@transak/transak-sdk'
import { Button } from '@/components/ui/button'

type TransakButtonProps = {
    walletAddress: string        // FaceWallet から渡すアドレス
    variant?: 'default' | 'outline' | 'secondary'
    size?: 'default' | 'sm' | 'lg'
}

export default function TransakButton({
    walletAddress,
    variant = 'default',
    size = 'default'
}: TransakButtonProps) {
    const openTransak = useCallback(() => {
        const transak = new Transak({
            apiKey: process.env.NEXT_PUBLIC_TRANSAK_API_KEY!,   // 必須
            environment: process.env.NEXT_PUBLIC_TRANSAK_ENV === 'PRODUCTION'
                ? Transak.ENVIRONMENTS.PRODUCTION
                : Transak.ENVIRONMENTS.STAGING,
            cryptoCurrencyCode: 'SOL',          // SOL 固定
            walletAddress,                      // ユーザーの Solana アドレス
            defaultFiatCurrency: 'JPY',
            themeColor: '000000',               // テーマカラー
            exchangeScreenTitle: 'SOLをチャージ',
        })

        transak.init()

        // TypeScriptエラーを回避するために型アサーションを使用
        // @ts-ignore - SDKの型定義が不完全のため
        transak.on(Transak.EVENTS.TRANSAK_WIDGET_CLOSE, () => {
            console.log('Transakウィジェットが閉じられました')
            transak.close()
        })

        // @ts-ignore - SDKの型定義が不完全のため
        transak.on(Transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (data: any) => {
            console.log('Transak購入完了:', data)
        })
    }, [walletAddress])

    return (
        <Button
            variant={variant}
            size={size}
            onClick={openTransak}
            disabled={!walletAddress}
        >
            SOLをチャージする
        </Button>
    )
}
