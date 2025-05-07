'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SettingsForm } from '@/components/ui/setting-form';

export default function KomePonSettingsPage() {
  const [farmer, setFarmer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // KomeponデータのState
  const [products, setProducts] = useState<any[]>([]);
  const [komeponStats, setKomeponStats] = useState({
    totalProducts: 0,
    enabledProducts: 0,
    totalDiscount: 0,
    averageRate: 0
  });

  // 農家情報とKomePonデータの取得
  useEffect(() => {
    async function fetchData() {
      try {
        // 農家情報の取得
        const userResponse = await fetch('/api/me');
        const userData = await userResponse.json();
        setFarmer(userData.user);

        // 商品情報の取得
        const productsResponse = await fetch('/api/products/mine');
        const productsData = await productsResponse.json();
        setProducts(productsData.products || []);

        // KomePon統計を計算
        calculateKomeponStats(productsData.products || []);
      } catch (error) {
        console.error('Failed to fetch farmer data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // KomePon統計計算関数
  function calculateKomeponStats(products: any[]) {
    const enabledProducts = products.filter(p => p.komePonDiscountRate);
    const totalDiscount = enabledProducts.reduce((sum, p) =>
      sum + (p.price * p.komePonDiscountRate), 0);
    const averageRate = enabledProducts.length ?
      enabledProducts.reduce((sum, p) => sum + p.komePonDiscountRate, 0) / enabledProducts.length : 0;

    setKomeponStats({
      totalProducts: products.length,
      enabledProducts: enabledProducts.length,
      totalDiscount,
      averageRate
    });
  }

  // 商品のKomePon設定を更新する関数
  const updateProductKomePon = async (productId: string, discountRate: number) => {
    try {
      const response = await fetch(`/api/products/mine/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          komePonDiscountRate: discountRate
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      // 成功したら商品リストを更新
      const productsResponse = await fetch('/api/products/mine');
      const productsData = await productsResponse.json();
      setProducts(productsData.products || []);
      calculateKomeponStats(productsData.products || []);

      return true;
    } catch (error) {
      console.error('Error updating product:', error);
      return false;
    }
  };

  // 全商品にKomePon設定を適用する関数
  const applyToAllProducts = async (discountRate: number) => {
    try {
      // 全商品に同じ割引率を適用する
      const updatePromises = products.map(product =>
        updateProductKomePon(product.id, discountRate)
      );

      await Promise.all(updatePromises);

      // 成功メッセージを表示
      alert('すべての商品にKomePon設定を適用しました');

      return true;
    } catch (error) {
      console.error('Error applying to all products:', error);
      return false;
    }
  };

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

  // KomePon使用状況
  const komePonData = {
    budget: farmer.farmerProfile?.komePonBudget || 0,
    used: Math.floor(farmer.farmerProfile?.komePonBudget * 0.3) || 0, // 仮の計算（実際のアプリでは適切な計算が必要）
    remaining: Math.floor(farmer.farmerProfile?.komePonBudget * 0.7) || 0, // 仮の計算
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          KomePon設定
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          KomePon値引きの設定を管理します。適切な値引き率を設定して、売上を最大化しましょう。
        </p>
      </div>

      {/* KomePon状況 */}
      <Card>
        <CardHeader>
          <CardTitle>KomePon状況</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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

          <div>
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

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
              KomePon予算について
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              KomePon予算は、あなたの評価や売上に基づいて毎月自動的に割り当てられます。
              予算を使い切った場合でも、翌月まで待つことなく追加予算を購入することができます。
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 現在の設定 */}
      <Card>
        <CardHeader>
          <CardTitle>KomePon適用状況</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">KomePon適用商品</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {komeponStats.enabledProducts}/{komeponStats.totalProducts} 商品
              </p>
              <p className="text-sm text-primary-600 dark:text-primary-400">
                {komeponStats.totalProducts > 0
                  ? Math.round((komeponStats.enabledProducts / komeponStats.totalProducts) * 100)
                  : 0}% の商品に適用中
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">平均割引率</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {Math.round(komeponStats.averageRate * 100)}%
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">予想総割引額</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(komeponStats.totalDiscount)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 商品別設定 */}
      <Card>
        <CardHeader>
          <CardTitle>商品別KomePon設定</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-md mb-4">
            <h3 className="text-sm font-medium text-primary-800 dark:text-primary-300 mb-2">
              一括設定
            </h3>
            <div className="flex items-end space-x-4">
              <div className="flex-grow max-w-xs">
                <label htmlFor="bulkDiscountRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  全商品の割引率
                </label>
                <select
                  id="bulkDiscountRate"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  defaultValue=""
                >
                  <option value="" disabled>選択してください</option>
                  <option value="0.05">5%</option>
                  <option value="0.1">10%</option>
                  <option value="0.15">15%</option>
                  <option value="0.2">20%</option>
                  <option value="0.25">25%</option>
                  <option value="0.3">30%</option>
                </select>
              </div>
              <Button
                onClick={() => {
                  const select = document.getElementById('bulkDiscountRate') as HTMLSelectElement;
                  const rate = parseFloat(select.value);
                  if (!isNaN(rate)) {
                    applyToAllProducts(rate);
                  }
                }}
              >
                全商品に適用
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    商品名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    価格
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    KomePon割引率
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    KomePon価格
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {products.map((product) => {
                  const discountRate = product.komePonDiscountRate || 0;
                  const discountPrice = product.price * (1 - discountRate);

                  return (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={product.imageUrl || '/placeholder-product.jpg'}
                              alt={product.name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {product.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(product.price)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          className="block w-full p-2 border border-gray-300 rounded-md"
                          value={discountRate}
                          onChange={(e) => updateProductKomePon(product.id, parseFloat(e.target.value))}
                        >
                          <option value="0">0% (無効)</option>
                          <option value="0.05">5%</option>
                          <option value="0.1">10%</option>
                          <option value="0.15">15%</option>
                          <option value="0.2">20%</option>
                          <option value="0.25">25%</option>
                          <option value="0.3">30%</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {discountRate > 0 ? (
                          <span className="text-sm text-accent2 font-medium">
                            {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(discountPrice)}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a href={`/farmer/products/${product.id}`} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                          詳細
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* KomePonの仕組み */}
      <Card>
        <CardHeader>
          <CardTitle>KomePonの仕組み</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            KomePonは、「レビューを書くと次回購入時に値引きが受けられる」システムです。
            単なる値引きではなく、品質向上と消費者参加を促す仕組みとなっています。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                農家側のメリット
              </h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                <li>レビューによる商品改善のフィードバック</li>
                <li>リピート購入の促進</li>
                <li>評価の高い農家ほど多くの予算が割り当てられる</li>
                <li>新規顧客の獲得</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                消費者側のメリット
              </h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                <li>レビュー投稿で次回購入時に値引き</li>
                <li>品質の高い商品の見極めが容易に</li>
                <li>生産者との繋がりを実感</li>
                <li>参加型のエコシステムに貢献</li>
              </ul>
            </div>
          </div>

          <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-md">
            <h3 className="text-sm font-medium text-primary-800 dark:text-primary-300 mb-2">
              KomePon設定のコツ
            </h3>
            <p className="text-sm text-primary-700 dark:text-primary-400">
              一般的に、10%前後の値引き率が最も効果的とされています。
              値引き率が小さすぎると消費者の購入意欲を高める効果が薄く、
              大きすぎると予算の消費が早くなりすぎる傾向があります。
              自社商品の価格帯や競合状況に合わせて最適な設定を見つけましょう。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
