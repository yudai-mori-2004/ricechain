'use client'

// app/contexts/wallet-context.tsx
import { ReactNode, useMemo } from 'react'
import { clusterApiUrl } from '@solana/web3.js'
import {
    ConnectionProvider,
    WalletProvider,
} from '@solana/wallet-adapter-react'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'

/**
 * Solana Wallet Adapter を全体に提供するプロバイダー
 */
export function WalletContextProvider({ children }: { children: ReactNode }) {
    // devnet か mainnet-beta を選択
    const endpoint = useMemo(() => clusterApiUrl('devnet'), [])
    // Phantom のみサポート
    const wallets = useMemo(() => [new PhantomWalletAdapter()], [])

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    )
}