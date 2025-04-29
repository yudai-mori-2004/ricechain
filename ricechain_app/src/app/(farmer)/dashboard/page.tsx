import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { blockchainService } from '@/lib/blockchain-service';

export const metadata = {
  title: '農家ダッシュボード | RiceChain',
  description: '農家向けダッシュボードで売上や注文を管理します。',
};

export default async function FarmerDashboardPage() {
  // 農家ID（実際のアプリではログインユーザーから取得）
  const farmerId = 'f1';

  // 農家情報
  const farmer = await blockchainService.getFarmerById(farmerId);

  if (!farmer) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          農家情報が見つかりません
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          ログインしてください。
        </p>
      </div>
    );
  }

  // 農家の商品
  const allProducts = await blockchainService.getProducts();
  const farmerProducts = allProducts.filter(p => p.farmer.id === farmerId);

  // 農家の注文
  const farmerOrders = await blockchainService.getOrdersByFarmerId(farmerId);

  // 最近の注文（最新5件）
  const recentOrders = [...farmerOrders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // 売上データ（実際のアプリではAPIから取得）
  const salesData = {
    today: 12500,
    week: 87500,
    month: 350000,
    total: 1250000,
  };

  // KomePon使用状況
  const komePonData = {
    budget: farmer.komePonBudget || 0,
    used: farmer.komePonSettings?.maxRedemptions
      ? (farmer.komePonSettings.maxRedemptions - farmer.komePonSettings.remainingRedemptions) * farmer.komePonSettings.discountAmount
      : 0,
    remaining: farmer.komePonSettings?.remainingRedemptions
      ? farmer.komePonSettings.remainingRedemptions * farmer.komePonSettings.discountAmount
      : 0,
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            ダッシュボード
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            こんにちは、{farmer.name}さん。今日も良い一日をお過ごしください。
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/farmer/products/new">
            <Button>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              新規商品登録
            </Button>
          </Link>
          <Link href="/farmer/settings">
            <Button variant="outline">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              設定
            </Button>
          </Link>
        </div>
      </div>

      {/* 売上サマリー */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col">
              <p className="text-sm text-gray-500 dark:text-gray-400">本日の売上</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(salesData.today)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col">
              <p className="text-sm text-gray-500 dark:text-gray-400">今週の売上</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(salesData.week)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col">
              <p className="text-sm text-gray-500 dark:text-gray-400">今月の売上</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(salesData.month)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col">
              <p className="text-sm text-gray-500 dark:text-gray-400">総売上</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(salesData.total)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KomePon状況 */}
      <Card>
        <CardHeader>
          <CardTitle>KomePon状況</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">KomePonランク</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {farmer.komePonRank || '-'}位
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">KomePon予算</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(komePonData.budget)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">残り予算</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(komePonData.remaining)}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">予算使用状況</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {Math.round((komePonData.used / komePonData.budget) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-primary-600 h-2.5 rounded-full"
                style={{ width: `${Math.round((komePonData.used / komePonData.budget) * 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="mt-6">
            <Link href="/farmer/komepon">
              <Button variant="outline" className="w-full sm:w-auto">
                KomePon設定を管理
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* 最近の注文と商品 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 最近の注文 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>最近の注文</CardTitle>
            <Link href="/farmer/orders" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
              すべて見る
            </Link>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => {
                  const orderItems = order.items.filter(item => item.farmerId === farmerId);
                  const orderTotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

                  return (
                    <div key={order.id} className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center">
                        <div className="relative w-12 h-12 rounded-md overflow-hidden mr-4">
                          <Image
                            src={orderItems[0].productImageUrl}
                            alt={orderItems[0].productName}
                            fill
                            className="object-cover"
                          />
                          {orderItems.length > 1 && (
                            <div className="absolute bottom-0 right-0 bg-gray-800 bg-opacity-75 text-white text-xs px-1 rounded-sm">
                              +{orderItems.length - 1}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            注文 #{order.id.substring(0, 8)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString('ja-JP')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(orderTotal)}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                              order.status === 'processing' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                          {order.status === 'completed' ? '完了' :
                            order.status === 'shipped' ? '発送済み' :
                              order.status === 'processing' ? '処理中' :
                                order.status === 'pending_payment' ? '支払い待ち' :
                                  '不明'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                注文がありません
              </p>
            )}
          </CardContent>
        </Card>

        {/* 商品一覧 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>商品一覧</CardTitle>
            <Link href="/farmer/products" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
              すべて見る
            </Link>
          </CardHeader>
          <CardContent>
            {farmerProducts.length > 0 ? (
              <div className="space-y-4">
                {farmerProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center">
                      <div className="relative w-12 h-12 rounded-md overflow-hidden mr-4">
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {product.name}
                        </p>
                        <div className="flex items-center">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-3 h-3 ${i < Math.floor(product.rating)
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
                            ({product.reviewCount})
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(product.price)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        在庫: {product.stock}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                商品がありません
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
