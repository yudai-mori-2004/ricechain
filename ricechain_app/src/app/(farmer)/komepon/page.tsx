import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockFarmers } from '@/lib/mock-data';

export const metadata = {
  title: 'KomePon設定 | RiceChain',
  description: 'KomePon値引きの設定を管理します。',
};

export default function KomePonSettingsPage() {
  // 農家ID（実際のアプリではログインユーザーから取得）
  const farmerId = 'f1';
  
  // 農家情報
  const farmer = mockFarmers.find(f => f.id === farmerId);
  
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
    budget: farmer.komePonBudget || 0,
    used: farmer.komePonSettings?.maxRedemptions 
      ? (farmer.komePonSettings.maxRedemptions - farmer.komePonSettings.remainingRedemptions) * farmer.komePonSettings.discountAmount
      : 0,
    remaining: farmer.komePonSettings?.remainingRedemptions 
      ? farmer.komePonSettings.remainingRedemptions * farmer.komePonSettings.discountAmount
      : 0,
    discountAmount: farmer.komePonSettings?.discountAmount || 0,
    maxRedemptions: farmer.komePonSettings?.maxRedemptions || 0,
    remainingRedemptions: farmer.komePonSettings?.remainingRedemptions || 0,
  };
  
  // 割引率
  const discountRate = farmer.komePonSettings?.discountAmount 
    ? Math.round((farmer.komePonSettings.discountAmount / 3500) * 100) 
    : 0;
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          KomePon設定
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          KomePon値引きの設定を管理します。適切な値引き額と枠数を設定して、売上を最大化しましょう。
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
          
          <div>
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
          <CardTitle>現在の設定</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">1件あたりの値引き額</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(komePonData.discountAmount)}
              </p>
              <p className="text-sm text-primary-600 dark:text-primary-400">
                約{discountRate}%割引
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">値引き枠数</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {komePonData.maxRedemptions}枠
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">残り値引き枠数</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {komePonData.remainingRedemptions}枠
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                使用済み: {komePonData.maxRedemptions - komePonData.remainingRedemptions}枠
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 設定変更フォーム */}
      <Card>
        <CardHeader>
          <CardTitle>設定変更</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="discount-amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                1件あたりの値引き額
              </label>
              <div className="flex items-center">
                <input
                  type="range"
                  id="discount-amount"
                  min="100"
                  max="1000"
                  step="50"
                  defaultValue={komePonData.discountAmount}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <span className="ml-4 min-w-[80px] text-gray-900 dark:text-white">
                  {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(komePonData.discountAmount)}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                値引き額が大きいほど、消費者の購入意欲は高まりますが、予算の消費も早くなります。
              </p>
            </div>
            
            <div>
              <label htmlFor="max-redemptions" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                値引き枠数
              </label>
              <div className="flex items-center">
                <input
                  type="range"
                  id="max-redemptions"
                  min="10"
                  max="200"
                  step="10"
                  defaultValue={komePonData.maxRedemptions}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <span className="ml-4 min-w-[80px] text-gray-900 dark:text-white">
                  {komePonData.maxRedemptions}枠
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                枠数が多いほど、より多くの消費者に値引きを提供できますが、1件あたりの値引き額は小さくなります。
              </p>
            </div>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md">
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-2">
              設定変更の注意点
            </h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              設定変更は即時反映されます。変更後は、新しい設定に基づいて値引きが適用されます。
              ただし、既に使用された値引き枠は元に戻りません。
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              予算シミュレーション
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">総予算</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(komePonData.budget)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">設定値引き総額</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(komePonData.discountAmount * komePonData.maxRedemptions)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">予算残高</p>
                <p className={`text-sm font-medium ${
                  komePonData.budget >= komePonData.discountAmount * komePonData.maxRedemptions
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(
                    komePonData.budget - (komePonData.discountAmount * komePonData.maxRedemptions)
                  )}
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
              <div
                className={`h-2.5 rounded-full ${
                  komePonData.budget >= komePonData.discountAmount * komePonData.maxRedemptions
                    ? 'bg-green-600'
                    : 'bg-red-600'
                }`}
                style={{ width: `${Math.min(100, Math.round((komePonData.discountAmount * komePonData.maxRedemptions / komePonData.budget) * 100))}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {komePonData.budget >= komePonData.discountAmount * komePonData.maxRedemptions
                ? '予算内で設定されています。'
                : '設定値引き総額が予算を超えています。予算を追加するか、設定を見直してください。'}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => window.history.back()}>
            キャンセル
          </Button>
          <Button>
            設定を保存
          </Button>
        </CardFooter>
      </Card>
      
      {/* 追加予算購入 */}
      <Card>
        <CardHeader>
          <CardTitle>追加予算購入</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            予算が不足している場合は、追加予算を購入することができます。
            追加予算は即時反映され、翌月の予算割り当てには影響しません。
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  スモール
                </h3>
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  ¥5,000
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  約14件分の値引き
                </p>
                <Button variant="outline" className="w-full">
                  購入する
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-primary-600 dark:border-primary-400 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="bg-primary-600 text-white text-xs font-bold py-1 px-2 rounded-full mb-2 inline-block">
                  おすすめ
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  ミディアム
                </h3>
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  ¥10,000
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  約28件分の値引き
                </p>
                <Button className="w-full">
                  購入する
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  ラージ
                </h3>
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  ¥20,000
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  約57件分の値引き
                </p>
                <Button variant="outline" className="w-full">
                  購入する
                </Button>
              </CardContent>
            </Card>
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
              値引き額が小さすぎると消費者の購入意欲を高める効果が薄く、
              大きすぎると予算の消費が早くなりすぎる傾向があります。
              自社商品の価格帯や競合状況に合わせて最適な設定を見つけましょう。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
