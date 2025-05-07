'use client';

import React, { useState, useEffect } from 'react';
import { getFace } from '@/lib/singleton/face';
import { initSolanaConnection, getSolBalance } from '@/lib/solana/solana-utils';
import { Card } from '@/components/ui/card';

// SOL to JPY conversion rate (in a real app, this would come from an API)
const SOL_TO_JPY_RATE = 16000; // Example rate: 1 SOL = 16,000 JPY

type WalletBalanceProps = {
    walletAddress: string | null;
    isConnected: boolean;
};

const WalletBalance: React.FC<WalletBalanceProps> = ({ walletAddress, isConnected }) => {
    const [balance, setBalance] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchBalance = async () => {
            if (!isConnected || !walletAddress) {
                setBalance(null);
                return;
            }

            setLoading(true);
            try {
                const connection = await initSolanaConnection();
                const solBalance = await getSolBalance(connection, walletAddress);
                setBalance(solBalance);
            } catch (err) {
                console.error('残高の取得に失敗しました', err);
                setBalance(null);
            } finally {
                setLoading(false);
            }
        };

        fetchBalance();

        // 30秒ごとに残高を更新
        const intervalId = setInterval(fetchBalance, 30000);
        return () => clearInterval(intervalId);
    }, [walletAddress, isConnected]);

    if (!isConnected) {
        return (
            <Card className="p-4 bg-yellow-50 border-yellow-200">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-yellow-700 font-medium">ウォレット未接続</p>
                        <p className="text-sm text-yellow-600">商品を購入するにはウォレットに接続してください</p>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-4 bg-white border-gray-200">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 font-medium">ウォレット残高</p>
                    {loading ? (
                        <p className="text-sm text-gray-400">読み込み中...</p>
                    ) : balance !== null ? (
                        <div>
                            <p className="text-lg font-bold">{balance.toFixed(4)} SOL</p>
                            <p className="text-sm text-gray-600">≈ {(balance * SOL_TO_JPY_RATE).toLocaleString()} JPY</p>
                        </div>
                    ) : (
                        <p className="text-sm text-red-500">残高の取得に失敗しました</p>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default WalletBalance;
