import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ProductCard from '@/components/ui/product-card';
import { mockProductListItems, mockFarmerListItems } from '@/lib/mock-data';

export const metadata = {
  title: 'RiceChain - 農家から消費者への直接販売米流通プラットフォーム',
  description: '良いお米を作る農家が評価され、消費者はそれをより安く手に入れる好循環の創出を目指すプラットフォーム',
};

export default function Home() {
  // 特集商品（KomePon対象商品）
  const featuredProducts = mockProductListItems.filter(product => product.hasKomePon).slice(0, 4);
  
  // 新着商品
  const newProducts = mockProductListItems.slice(0, 4);
  
  // 人気の農家
  const popularFarmers = [...mockFarmerListItems].sort((a, b) => b.rating - a.rating).slice(0, 3);
  
  return (
    <div className="space-y-16">
      {/* ヒーローセクション */}
      <section className="relative h-[500px] -mt-8 -mx-4 sm:-mx-8 lg:-mx-16">
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
        <div className="relative h-full flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            農家から直接、美味しいお米を
          </h1>
          <p className="text-xl text-white mb-8 max-w-3xl">
            RiceChainは、良いお米を作る農家が評価され、消費者はそれをより安く手に入れる好循環を創出するプラットフォームです。
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/products">
              <Button size="lg" className="px-8">
                商品を探す
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="bg-white bg-opacity-20 text-white border-white hover:bg-white hover:bg-opacity-30 px-8">
              KomeponとRiceChainについて
            </Button>
          </div>
        </div>
      </section>
      
      {/* KomePon説明セクション */}
      <section className="bg-primary-50 dark:bg-primary-900/20 -mx-4 sm:-mx-8 lg:-mx-16 px-4 sm:px-8 lg:px-16 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              KomePonシステムで、お得に美味しいお米を
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              レビューを書くと次回購入時に値引きが受けられる「KomePon」システムで、
              品質向上と消費者参加を促す好循環を生み出します。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  1. お米を購入
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  全国の厳選された農家から、美味しいお米を直接購入します。
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  2. レビューを投稿
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  お米の感想をレビューとして投稿し、KomePon値引き権利を獲得します。
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  3. 次回はお得に購入
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  獲得したKomePon値引きで、次回はお得に美味しいお米を購入できます。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* 特集商品セクション */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            KomePon対象商品
          </h2>
          <Link href="/products?filter=komepon" className="text-primary-600 dark:text-primary-400 hover:underline">
            すべて見る
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              farmer={product.farmer.name}
              farmerId={product.farmer.id}
              description={product.description}
              price={product.price}
              komePonPrice={product.komePonPrice}
              imageUrl={product.imageUrl}
              rating={product.rating}
              reviewCount={product.reviewCount}
              available={product.available}
              hasKomePon={product.hasKomePon}
            />
          ))}
        </div>
      </section>
      
      {/* 新着商品セクション */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            新着商品
          </h2>
          <Link href="/products?sort=newest" className="text-primary-600 dark:text-primary-400 hover:underline">
            すべて見る
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              farmer={product.farmer.name}
              farmerId={product.farmer.id}
              description={product.description}
              price={product.price}
              komePonPrice={product.komePonPrice}
              imageUrl={product.imageUrl}
              rating={product.rating}
              reviewCount={product.reviewCount}
              available={product.available}
              hasKomePon={product.hasKomePon}
            />
          ))}
        </div>
      </section>
      
      {/* 人気の農家セクション */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            人気の農家
          </h2>
          <Link href="/farmers" className="text-primary-600 dark:text-primary-400 hover:underline">
            すべて見る
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {popularFarmers.map((farmer) => (
            <Link key={farmer.id} href={`/farmers/${farmer.id}`}>
              <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 w-full">
                  <Image
                    src={farmer.imageUrl}
                    alt={farmer.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {farmer.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {farmer.location}
                  </p>
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(farmer.rating)
                              ? 'text-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                      ({farmer.reviewCount}件のレビュー)
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {farmer.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md text-xs"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {farmer.productCount}種類の商品
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
      
      {/* CTAセクション */}
      <section className="bg-primary-600 -mx-4 sm:-mx-8 lg:-mx-16 px-4 sm:px-8 lg:px-16 py-16 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            RiceChainで美味しいお米を見つけよう
          </h2>
          <p className="text-lg mb-8 opacity-90">
            全国の厳選された農家から、あなたにぴったりのお米を見つけましょう。
            レビューを投稿して、次回はお得に購入できます。
          </p>
          <Link href="/products">
            <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100 px-8">
              商品を探す
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
