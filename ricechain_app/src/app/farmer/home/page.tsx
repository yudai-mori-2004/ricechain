'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function FarmerDashboardPage() {
  const [farmer, setFarmer] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFarmerData = async () => {
      try {
        // ログインユーザー情報を取得
        const userResponse = await fetch('/api/me');
        const userData = await userResponse.json();

        if (!userData.user) {
          setLoading(false);
          return;
        }

        setFarmer(userData.user);

        // 農家の商品を取得
        const productsResponse = await fetch('/api/products/mine');
        const productsData = await productsResponse.json();
        setProducts(productsData.products || []);

        // 農家の注文を取得
        const ordersResponse = await fetch('/api/orders/sales');
        const ordersData = await ordersResponse.json();
        setOrders(ordersData.orders || []);

        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch farmer data:', error);
        setLoading(false);
      }
    };

    fetchFarmerData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

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

  // 最近の注文（最新5件）
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // 売上データの計算
  const calculateSales = (orders: any[], days = 0) => {
    const now = new Date();
    const startDate = new Date();
    if (days > 0) {
      startDate.setDate(startDate.getDate() - days);
    }

    return orders.reduce((total, order) => {
      const orderDate = new Date(order.createdAt);
      // daysが0の場合は今日の売上、それ以外は指定した日数内の売上
      if (days === 0) {
        if (orderDate.toDateString() === now.toDateString()) {
          return total + order.total;
        }
      } else if (orderDate >= startDate) {
        return total + order.total;
      }
      return total;
    }, 0);
  };

  // 売上データ
  const salesData = {
    today: calculateSales(orders, 0),
    week: calculateSales(orders, 7),
    month: calculateSales(orders, 30),
    total: orders.reduce((total, order) => total + order.total, 0),
  };

  // KomePon使用状況
  const komePonData = {
    budget: farmer.farmerProfile?.komePonBudget || 0,
    used: Math.floor(farmer.farmerProfile?.komePonBudget * 0.3) || 0, // 仮の計算（実際のアプリでは適切な計算が必要）
    remaining: Math.floor(farmer.farmerProfile?.komePonBudget * 0.7) || 0, // 仮の計算
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            ダッシュボード
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            こんにちは、{farmer.handleName || farmer.farmerProfile?.farmName || '農家'}さん。今日も良い一日をお過ごしください。
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
                {farmer.farmerProfile?.komePonRank || '-'}位
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
                {komePonData.budget > 0 ? Math.round((komePonData.used / komePonData.budget) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-primary-600 h-2.5 rounded-full"
                style={{ width: `${komePonData.budget > 0 ? Math.round((komePonData.used / komePonData.budget) * 100) : 0}%` }}
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
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center">
                      <div className="relative w-12 h-12 rounded-md overflow-hidden mr-4">
                        {order.items && order.items.length > 0 && order.items[0].product && (
                          <Image
                            src={order.items[0].product.imageUrl || '/placeholder-rice.jpg'}
                            alt={order.items[0].product.name || '商品'}
                            fill
                            className="object-cover"
                          />
                        )}
                        {order.items && order.items.length > 1 && (
                          <div className="absolute bottom-0 right-0 bg-gray-800 bg-opacity-75 text-white text-xs px-1 rounded-sm">
                            +{order.items.length - 1}
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
                        {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(order.total)}
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
                ))}
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
            {products.length > 0 ? (
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center">
                      <div className="relative w-12 h-12 rounded-md overflow-hidden mr-4">
                        <Image
                          src={product.imageUrl || '/placeholder-rice.jpg'}
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
