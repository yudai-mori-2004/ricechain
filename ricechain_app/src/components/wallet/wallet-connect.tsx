'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface WalletConnectProps {
    onConnect?: (address: string) => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onConnect }) => {
    const [connected, setConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Check if wallet is already connected on component mount
    useEffect(() => {
        const checkWalletConnection = async () => {
            try {
                // In a real implementation, this would check if a wallet is connected
                // For now, we'll check localStorage for a mock connection
                const savedAddress = localStorage.getItem('walletAddress');
                if (savedAddress) {
                    setWalletAddress(savedAddress);
                    setConnected(true);
                    if (onConnect) onConnect(savedAddress);
                }
            } catch (error) {
                console.error('Failed to check wallet connection:', error);
            }
        };

        checkWalletConnection();
    }, [onConnect]);

    const connectWallet = async () => {
        setLoading(true);
        try {
            // In a real implementation, this would connect to a Solana wallet
            // For now, we'll simulate a connection with a mock address
            const mockAddress = 'CXYZpqrs1234567890abcdefghijklmnopqrstuvwxyz';

            // Simulate a delay for the connection
            await new Promise(resolve => setTimeout(resolve, 1000));

            setWalletAddress(mockAddress);
            setConnected(true);
            localStorage.setItem('walletAddress', mockAddress);

            if (onConnect) onConnect(mockAddress);
        } catch (error) {
            console.error('Failed to connect wallet:', error);
            alert('ウォレット接続に失敗しました。再度お試しください。');
        } finally {
            setLoading(false);
        }
    };

    const disconnectWallet = async () => {
        setLoading(true);
        try {
            // In a real implementation, this would disconnect from the Solana wallet
            // For now, we'll just clear our mock connection
            localStorage.removeItem('walletAddress');
            setWalletAddress(null);
            setConnected(false);
        } catch (error) {
            console.error('Failed to disconnect wallet:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {connected ? (
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400 hidden md:inline">
                        {walletAddress?.substring(0, 4)}...{walletAddress?.substring(walletAddress.length - 4)}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={disconnectWallet}
                        disabled={loading}
                    >
                        {loading ? '処理中...' : '切断'}
                    </Button>
                </div>
            ) : (
                <Button
                    onClick={connectWallet}
                    disabled={loading}
                    size="sm"
                >
                    {loading ? '接続中...' : 'ウォレット接続'}
                </Button>
            )}
        </div>
    );
};

export default WalletConnect;
