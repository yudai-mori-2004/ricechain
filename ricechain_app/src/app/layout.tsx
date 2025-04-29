import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/layout/header';
import Navigation from '@/components/layout/navigation';
import MobileNavigation from '@/components/layout/mobile-navigation';
import { AppProvider } from '@/lib/app-context';

const inter = Inter({ subsets: ['latin'], variable: '--font-geist-sans' });

export const metadata = {
  title: 'RiceChain - 農家から消費者への直接販売米流通プラットフォーム',
  description: '良いお米を作る農家が評価され、消費者はそれをより安く手に入れる好循環の創出を目指すプラットフォーム',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={inter.variable}>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <AppProvider>
          <Header />
          <div className="flex">
            <Navigation />
            <main className="flex-1 container mx-auto px-4 py-8">
              {children}
            </main>
          </div>
          <MobileNavigation />
        </AppProvider>
      </body>
    </html>
  );
}
