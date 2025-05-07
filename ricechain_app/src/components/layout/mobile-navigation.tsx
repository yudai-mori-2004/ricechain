"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppContext } from '@/contexts/app-context';

const MobileNavigation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const { disputes } = useAppContext();

    // ここでフックを全て宣言する（条件付きではなく）
    // Close the menu when pathname changes (navigation occurs)
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Close the menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (isOpen && !target.closest('#mobile-menu') && !target.closest('#menu-button')) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Prevent scrolling when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Check if on root page - hide navigation on root
    const isRootPage = pathname === '/';
    if (isRootPage) {
        return null;
    }

    // Count active disputes that need jury
    const activeDisputesCount = disputes.filter(d => d.status === 'in_jury').length;

    // Clearly define separate paths for consumer vs farmer - matching Navigation component logic
    const isConsumerSection = pathname?.startsWith('/consumer') ||
        // Any path not in the farmer section is treated as consumer section
        !(pathname?.startsWith('/farmer'));

    const isFarmerSection = pathname?.startsWith('/farmer');

    const consumerLinks = [
        { href: '/consumer/home', label: 'ホーム', badge: undefined },
        { href: '/consumer/market', label: 'マーケット', badge: undefined },
        { href: '/consumer/orders', label: '注文履歴', badge: undefined },
        { href: '/consumer/review', label: 'レビューを書く', badge: undefined },
        { href: '/consumer/wallet', label: 'ウォレット & チャージ', badge: undefined },
        {
            href: '/disputes',
            label: 'トラブル解決に協力',
            badge: activeDisputesCount > 0 ? activeDisputesCount : undefined
        },
    ];

    const farmerLinks = [
        { href: '/farmer/home', label: 'ホーム', badge: undefined },
        { href: '/farmer/products', label: '商品', badge: undefined },
        { href: '/farmer/orders', label: '注文 & 発送', badge: undefined },
        { href: '/farmer/review', label: 'レビュー', badge: undefined },
        { href: '/farmer/wallet', label: 'ウォレット & 出金', badge: undefined },
        {
            href: '/disputes',
            label: 'トラブル解決に協力',
            badge: activeDisputesCount > 0 ? activeDisputesCount : undefined
        },
    ];

    const links = isConsumerSection ? consumerLinks : farmerLinks;

    return (
        <div className="md:hidden">
            {/* Hamburger button */}
            <button
                id="menu-button"
                className="fixed bottom-6 right-6 z-50 bg-accent1 text-text p-3 rounded-full shadow-lg hover:bg-accent2"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Close menu" : "Open menu"}
            >
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                )}
            </button>

            {/* Mobile menu drawer */}
            <div
                id="mobile-menu"
                className={`fixed inset-0 z-40 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`}
            >
                <div className="absolute inset-0 bg-text/50 dark:bg-background/50" onClick={() => setIsOpen(false)}></div>
                <div className="absolute right-0 h-full w-64 bg-background dark:bg-text shadow-xl transform transition-transform duration-300 ease-in-out">
                    <div className="p-4">
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-text dark:text-background mb-4">
                                {isConsumerSection ? '消費者メニュー' : '農家メニュー'}
                            </h2>
                            <nav className="space-y-2">
                                {links.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`block px-4 py-2 rounded-md ${pathname === link.href
                                            ? 'bg-primary/20 text-accent2 dark:bg-primary/30 dark:text-accent1'
                                            : 'text-text/80 hover:bg-primary/10 hover:text-accent2 dark:text-background/80 dark:hover:bg-primary/20 dark:hover:text-accent1'
                                            } relative`}
                                    >
                                        {link.label}
                                        {link.badge && (
                                            <span className="absolute right-2 top-1/2 -translate-y-1/2 bg-accent2 text-background text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                                {link.badge}
                                            </span>
                                        )}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileNavigation;
