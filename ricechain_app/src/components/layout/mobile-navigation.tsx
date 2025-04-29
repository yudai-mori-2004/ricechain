"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MobileNavigation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

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

    const isConsumerSection = pathname?.startsWith('/(consumer)') ||
        pathname?.startsWith('/products') ||
        pathname?.startsWith('/orders') ||
        pathname?.startsWith('/review');

    const isFarmerSection = pathname?.startsWith('/(farmer)') ||
        pathname?.startsWith('/dashboard') ||
        pathname?.startsWith('/komepon');

    const consumerLinks = [
        { href: '/products', label: '商品一覧' },
        { href: '/orders', label: '注文履歴' },
    ];

    const farmerLinks = [
        { href: '/dashboard', label: 'ダッシュボード' },
        { href: '/products', label: '商品管理' },
        { href: '/komepon', label: 'KomePon設定' },
        { href: '/orders', label: '注文管理' },
    ];

    const links = isConsumerSection ? consumerLinks : farmerLinks;

    return (
        <div className="md:hidden">
            {/* Hamburger button */}
            <button
                id="menu-button"
                className="fixed bottom-6 right-6 z-50 bg-primary-600 text-white p-3 rounded-full shadow-lg"
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
                <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)}></div>
                <div className="absolute right-0 h-full w-64 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out">
                    <div className="p-4">
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                {isConsumerSection ? '消費者メニュー' : '農家メニュー'}
                            </h2>
                            <nav className="space-y-2">
                                {links.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`block px-4 py-2 rounded-md ${pathname === link.href
                                                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                                                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                モード切替
                            </h2>
                            <div className="space-y-2">
                                <Link
                                    href={isConsumerSection ? '/dashboard' : '/products'}
                                    className="block px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    {isConsumerSection ? '農家モードへ切替' : '消費者モードへ切替'}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileNavigation;
