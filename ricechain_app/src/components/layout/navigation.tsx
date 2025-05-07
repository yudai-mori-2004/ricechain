"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppContext } from '@/contexts/app-context';

const Navigation = () => {
  const pathname = usePathname();
  const { disputes } = useAppContext();

  // Count active disputes that need jury
  const activeDisputesCount = disputes.filter(d => d.status === 'in_jury').length;

  // Check if on root page - hide navigation on root
  const isRootPage = pathname === '/';
  if (isRootPage) {
    return null;
  }

  // Clearly define separate paths for consumer vs farmer
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
    <aside className="w-50 bg-background dark:bg-text shadow-sm h-screen sticky top-0 hidden md:block">
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
    </aside>
  );
};

export default Navigation;
