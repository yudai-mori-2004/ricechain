'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useCart } from '@/contexts/cart-context';

const Header = () => {
  const { cart } = useCart();
  const { user, kycStatus } = useAuth();
  const pathname = usePathname();
  const [isModeSwitcherOpen, setIsModeSwitcherOpen] = useState(false);
  const modeSwitcherRef = useRef<HTMLDivElement>(null);

  // カート内合計アイテム数
  const cartItemCount =
    cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  const isRootSection = pathname === '/';
  const isFarmerSection = pathname?.startsWith('/farmer');
  const isConsumerSection =
    !isRootSection && !isFarmerSection;

  // KYCレベルに基づく表示テキストを取得
  const getKycLevelText = (level: number) => {
    switch (level) {
      case 0: return '未認証';
      case 1: return '基本認証';
      case 2: return '中級認証';
      case 3: return '完全認証';
      default: return '未認証';
    }
  };

  // KYCレベルに基づく色を取得
  const getKycLevelColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-red-500 text-red-500';
      case 1: return 'bg-yellow-500 text-yellow-500';
      case 2: return 'bg-blue-500 text-blue-500';
      case 3: return 'bg-green-500 text-green-500';
      default: return 'bg-red-500 text-red-500';
    }
  };

  // 現在のセクションに基づいてKYCレベルを取得
  const getCurrentKycLevel = () => {
    if (isFarmerSection) {
      return kycStatus?.farmerLevel || 0;
    }
    return kycStatus?.consumerLevel || 0;
  };

  // 現在のKYCレベル
  const currentKycLevel = getCurrentKycLevel();

  // 現在のモード名を取得
  const getCurrentModeName = () => {
    return isFarmerSection ? '農家モード' : '消費者モード';
  };

  // ウォレットページのリンク
  const getWalletLink = () => {
    return isFarmerSection ? '/farmer/wallet' : '/consumer/wallet';
  };

  // ドロップダウン外クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        modeSwitcherRef.current &&
        !modeSwitcherRef.current.contains(e.target as Node)
      ) {
        setIsModeSwitcherOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-background dark:bg-text shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-accent1 rounded-full flex items-center justify-center">
            <span className="text-text font-bold text-xl">R</span>
          </div>
          <span className="text-xl font-bold text-text dark:text-background">
            RiceChain
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          {/* ウォレット＆認証ステータス */}
          {!isRootSection && (
            <Link href={getWalletLink()} className="flex items-center hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-1.5 rounded-full transition">
              {!user?.walletAddress ? (
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-red-500 mr-2" />
                  <span className="text-sm font-medium">ウォレット未接続</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <div className={`h-3 w-3 rounded-full ${getKycLevelColor(currentKycLevel).split(' ')[0]} mr-2`} />
                  <span className="text-sm font-medium">
                    {getKycLevelText(currentKycLevel)}
                  </span>
                </div>
              )}
            </Link>
          )}

          {/* モード切替ボタン */}
          {!isRootSection && (
            <div ref={modeSwitcherRef} className="relative">
              <button
                onClick={() => setIsModeSwitcherOpen((o) => !o)}
                className="flex items-center space-x-1 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <span className="text-sm font-medium">{getCurrentModeName()}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={`w-4 h-4 transition-transform ${isModeSwitcherOpen ? 'rotate-180' : ''}`}
                >
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </button>

              {isModeSwitcherOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-10">
                  <Link
                    href="/consumer"
                    className={`flex items-center justify-between px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition ${!isFarmerSection ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                  >
                    <span className="text-sm font-medium">消費者モード</span>
                    <div className={`h-2.5 w-2.5 rounded-full ${getKycLevelColor(kycStatus?.consumerLevel || 0).split(' ')[0]}`} />
                  </Link>
                  <Link
                    href="/farmer"
                    className={`flex items-center justify-between px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition ${isFarmerSection ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                  >
                    <span className="text-sm font-medium">農家モード</span>
                    <div className={`h-2.5 w-2.5 rounded-full ${getKycLevelColor(kycStatus?.farmerLevel || 0).split(' ')[0]}`} />
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* 消費者ビュー: カート */}
          {!isRootSection && isConsumerSection && (
            <Link
              href="/consumer/cart"
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
              aria-label="カートを表示"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent1 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
