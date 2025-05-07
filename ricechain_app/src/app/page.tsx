import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ProductCard from '@/components/ui/product-card';
import { prisma } from '@/lib/prisma/prisma';

export const metadata = {
  title: 'RiceChain - 農家から消費者への直接販売米流通プラットフォーム',
  description: '良いお米を作る農家が評価され、消費者はそれをより安く手に入れる好循環の創出を目指すプラットフォーム',
};

export default async function Home() {
  // Get products directly from database
  const products = await prisma.product.findMany({
    where: { available: true },
    include: {
      farmer: true,
      details: true
    },
    orderBy: { createdAt: 'desc' },
    take: 8
  });

  // 特集商品（KomePon対象商品）
  const featuredProducts = products
    .filter(product => product.komePonDiscountRate)
    .slice(0, 4);

  // 新着商品
  const newProducts = products.slice(0, 4);

  // 人気の農家
  const farmers = await prisma.user.findMany({
    where: {
      farmerProfile: {
        isNot: null
      }
    },
    include: {
      farmerProfile: true
    },
    orderBy: {
      farmerProfile: {
        rating: 'desc'
      }
    },
    take: 3
  });

  const popularFarmers = farmers.map(farmer => ({
    id: farmer.id,
    name: farmer.handleName || 'Unknown Farmer',
    imageUrl: farmer.iconImageUrl || '/placeholder-farmer.jpg',
    location: farmer.farmerProfile?.location || 'Japan',
    rating: farmer.farmerProfile?.rating || 0,
    description: farmer.farmerProfile?.description || ''
  }));

  return (
    <div className="space-y-16">
      {/* ヒーローセクション */}
      <section className="relative h-[500px] -mx-4 -mt-8">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
            alt="田んぼの風景"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        <div className="relative h-full flex flex-col justify-center items-center text-center px-7 sm:px-5 lg:px-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            農家から直接、美味しいお米を
          </h1>
          <p className="text-xl text-white mb-8 max-w-3xl">
            RiceChainは、良いお米を作る農家が評価され、消費者はそれをより安く手に入れる好循環を創出するプラットフォームです。
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="#mode-selection">
              <Button size="lg" className="px-8">
                サービスを利用する
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="bg-white bg-opacity-20 text-white border-white hover:bg-white hover:bg-opacity-30 px-8">
              KomeponとRiceChainについて
            </Button>
          </div>
        </div>
      </section>

      {/* モード選択セクション - 新規追加 */}
      <section id="mode-selection" className="bg-primary/10 dark:bg-primary/20 px-4 sm:px-8 lg:px-16 py-12 rounded-lg shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-text dark:text-background mb-4">
              RiceChainをどのように利用しますか？
            </h2>
            <p className="text-lg text-text/70 dark:text-background/70 max-w-3xl mx-auto">
              RiceChainでは、お米を購入したい方と販売したい農家の方、
              それぞれに合わせたサービスを提供しています。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 消費者モード */}
            <Link href="/consumer/home" className="block">
              <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow border-2 hover:border-accent1">
                <div className="relative h-48 w-full max-w-full overflow-hidden bg-primary">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold text-text dark:text-background mb-4 flex items-center">
                    <span className="bg-accent1 text-text rounded-full w-8 h-8 flex items-center justify-center mr-3">1</span>
                    消費者モード
                  </h3>
                  <p className="text-text/70 dark:text-background/70 text-lg mb-4">
                    美味しいお米を購入したい方はこちら
                  </p>
                  <ul className="space-y-2 mb-6 text-text/70 dark:text-background/70">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-accent1 dark:text-accent1 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      全国厳選された農家から直接お米を購入
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-accent1 dark:text-accent1 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      レビューを書いて次回お得に購入できるKomePon
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-accent1 dark:text-accent1 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      安心・安全なブロックチェーン取引
                    </li>
                  </ul>
                  <Button className="w-full py-6 text-lg">消費者モードを利用する</Button>
                </CardContent>
              </Card>
            </Link>

            {/* 農家モード */}
            <Link href="/farmer/home" className="block">
              <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow border-2 hover:border-accent1">
                <div className="relative h-48 w-full max-w-full overflow-hidden bg-primary">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold text-text dark:text-background mb-4 flex items-center">
                    <span className="bg-accent1 text-text rounded-full w-8 h-8 flex items-center justify-center mr-3">2</span>
                    農家モード
                  </h3>
                  <p className="text-text/70 dark:text-background/70 text-lg mb-4">
                    お米を販売したい農家の方はこちら
                  </p>
                  <ul className="space-y-2 mb-6 text-text/70 dark:text-background/70">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-accent1 dark:text-accent1 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      コストを抑えて消費者に直接販売
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-accent1 dark:text-accent1 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      KomePonで顧客満足度を高め、リピーターを獲得
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-accent1 dark:text-accent1 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      安心・安全なブロックチェーンでの取引管理
                    </li>
                  </ul>
                  <Button variant="secondary" className="w-full py-6 text-lg">農家モードを利用する</Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* 特集商品セクション（KomePon対象商品） */}
      <section className="px-4 sm:px-8 lg:px-16 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-bold text-text dark:text-background mb-2">
                特集商品
              </h2>
              <p className="text-text/60 dark:text-background/60">
                KomePon割引が適用されるおすすめ商品
              </p>
            </div>
            <Link href="/consumer/market" className="text-primary hover:text-primary-dark">
              すべて見る →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => {
              // KomePon割引価格を計算
              const komePonPrice = product.komePonDiscountRate
                ? product.price * (1 - product.komePonDiscountRate)
                : undefined;

              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  komePonPrice={komePonPrice}
                  isForFarmer={false}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* 新着商品セクション */}
      <section className="bg-gray-50 dark:bg-gray-900 px-4 sm:px-8 lg:px-16 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-bold text-text dark:text-background mb-2">
                新着商品
              </h2>
              <p className="text-text/60 dark:text-background/60">
                最近追加された新しい商品
              </p>
            </div>
            <Link href="/consumer/market" className="text-primary hover:text-primary-dark">
              すべて見る →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newProducts.map((product) => {
              // KomePon割引価格を計算
              const komePonPrice = product.komePonDiscountRate
                ? product.price * (1 - product.komePonDiscountRate)
                : undefined;

              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  komePonPrice={komePonPrice}
                  isForFarmer={false}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* KomePon説明セクション */}
      <section className="bg-primary/10 dark:bg-primary/20 px-4 sm:px-8 lg:px-16 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text dark:text-background mb-4">
              KomePonシステムで、お得に美味しいお米を
            </h2>
            <p className="text-lg text-text/70 dark:text-background/70 max-w-3xl mx-auto">
              レビューを書くと次回購入時に値引きが受けられる「KomePon」システムで、
              品質向上と消費者参加を促す好循環を生み出します。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/30 dark:bg-primary/40 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent1 dark:text-accent1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-text dark:text-background mb-2">
                  1. お米を購入
                </h3>
                <p className="text-text/70 dark:text-background/70">
                  全国の厳選された農家から、美味しいお米を直接購入します。
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/30 dark:bg-primary/40 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent1 dark:text-accent1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-text dark:text-background mb-2">
                  2. レビューを投稿
                </h3>
                <p className="text-text/70 dark:text-background/70">
                  お米の感想をレビューとして投稿し、KomePon値引き権利を獲得します。
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/30 dark:bg-primary/40 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent1 dark:text-accent1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-text dark:text-background mb-2">
                  3. 次回はお得に購入
                </h3>
                <p className="text-text/70 dark:text-background/70">
                  獲得したKomePon値引きで、次回はお得に美味しいお米を購入できます。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>


      {/* CTAセクション */}
      <section className="bg-accent1 px-4 sm:px-8 lg:px-16 py-16 text-text">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            RiceChainで美味しいお米を見つけよう
          </h2>
          <p className="text-lg mb-8 opacity-90">
            全国の厳選された農家から、あなたにぴったりのお米を見つけましょう。
            レビューを投稿して、次回はお得に購入できます。
          </p>
          <Link href="#mode-selection">
            <Button size="lg" variant="outline" className="bg-background text-text hover:bg-accent2 hover:text-background px-8">
              サービスを利用する
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
