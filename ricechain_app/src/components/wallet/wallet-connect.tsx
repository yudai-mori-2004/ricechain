'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/lib/app-context';

interface WalletConnectProps {
    onConnect?: (address: string) => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onConnect }) => {
    const { useMockData, setUseMockData } = useAppContext();
    const [connected, setConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showModeToggle, setShowModeToggle] = useState(false);

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

    const toggleModeDropdown = () => {
        setShowModeToggle(!showModeToggle);
    };

    return (
        <div className="relative">
            <div className="flex items-center space-x-2">
                {connected ? (
                    <>
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
                    </>
                ) : (
                    <Button
                        onClick={connectWallet}
                        disabled={loading}
                        size="sm"
                    >
                        {loading ? '接続中...' : 'ウォレット接続'}
                    </Button>
                )}
                
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleModeDropdown}
                    className="text-xs"
                >
                    {useMockData ? 'モック' : 'チェーン'}
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-4 w-4 ml-1" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </Button>
            </div>
            
            {showModeToggle && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                    <div className="p-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">データモード切替</p>
                        <div className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer" onClick={() => { setUseMockData(true); setShowModeToggle(false); }}>
                            <span className="text-sm">モックデータ</span>
                            {useMockData && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>
                        <div className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer" onClick={() => { setUseMockData(false); setShowModeToggle(false); }}>
                            <span className="text-sm">チェーンデータ</span>
                            {!useMockData && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WalletConnect;
