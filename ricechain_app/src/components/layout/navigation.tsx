"use client"


import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navigation = () => {
  const pathname = usePathname();
  
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
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-sm h-screen sticky top-0 hidden md:block">
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
                className={`block px-4 py-2 rounded-md ${
                  pathname === link.href
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
    </aside>
  );
};

export default Navigation;
