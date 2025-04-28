import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockOrderListItems } from '@/lib/mock-data';
import { OrderStatus } from '@/types/order';

export const metadata = {
  title: '注文履歴 | RiceChain',
  description: 'あなたの注文履歴を確認できます。',
};

const getStatusText = (status: OrderStatus): string => {
  switch (status) {
    case 'pending_payment':
      return '支払い待ち';
    case 'processing':
      return '処理中';
    case 'shipped':
      return '発送済み';
    case 'delivered':
      return '配達済み';
    case 'completed':
      return '完了';
    case 'cancelled':
      return 'キャンセル';
    case 'refunded':
      return '返金済み';
    case 'dispute':
      return '紛争中';
    case 'dispute_resolved':
      return '紛争解決済み';
    default:
      return '不明';
  }
};

const getStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case 'pending_payment':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'processing':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'shipped':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
    case 'delivered':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case 'refunded':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    case 'dispute':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case 'dispute_resolved':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

export default function OrdersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">注文履歴</h1>
        <p className="text-gray-600 dark:text-gray-400">
          過去の注文履歴を確認できます。
        </p>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center">
          <label htmlFor="filter" className="mr-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            絞り込み:
          </label>
          <select
            id="filter"
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            defaultValue="all"
          >
            <option value="all">すべて</option>
            <option value="processing">処理中</option>
            <option value="shipped">発送済み</option>
            <option value="completed">完了</option>
            <option value="cancelled">キャンセル</option>
          </select>
        </div>

        <div className="flex items-center">
          <label htmlFor="sort" className="mr-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            並び替え:
          </label>
          <select
            id="sort"
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            defaultValue="newest"
          >
            <option value="newest">新しい順</option>
            <option value="oldest">古い順</option>
            <option value="price-high">金額の高い順</option>
            <option value="price-low">金額の低い順</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {mockOrderListItems.length > 0 ? (
          mockOrderListItems.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      注文番号: {order.id}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      注文日: {new Date(order.createdAt).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                    <Link href={`/orders/${order.id}`} className="text-primary-600 dark:text-primary-400 hover:underline text-sm font-medium">
                      詳細を見る
                    </Link>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col md:flex-row gap-6">
                  <div className="relative w-full md:w-32 h-32 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={order.mainImageUrl}
                      alt="商品画像"
                      fill
                      className="object-cover"
                    />
                    {order.itemCount > 1 && (
                      <div className="absolute bottom-2 right-2 bg-gray-800 bg-opacity-75 text-white text-xs px-2 py-1 rounded-md">
                        +{order.itemCount - 1}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        合計金額: {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(order.total)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {order.itemCount}点の商品
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      {order.status === 'shipped' && (
                        <Button variant="outline">
                          配送状況を確認
                        </Button>
                      )}
                      
                      {order.canReview && (
                        <Link href={`/review/${order.id}`}>
                          <Button>
                            レビューを書く
                          </Button>
                        </Link>
                      )}
                      
                      {order.status === 'completed' && (
                        <Button variant="outline">
                          再度購入
                        </Button>
                      )}
                      
                      {(order.status === 'pending_payment' || order.status === 'processing') && (
                        <Button variant="outline" className="text-red-600 dark:text-red-400 border-red-300 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900">
                          キャンセル
                        </Button>
                      )}
                      
                      {order.status === 'delivered' && (
                        <Button>
                          受取確認
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">注文履歴がありません。</p>
              <Link href="/products">
                <Button>
                  商品を探す
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
      
      {mockOrderListItems.length > 0 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center space-x-2">
            <button className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
              前へ
            </button>
            <button className="px-3 py-2 rounded-md bg-primary-600 text-white">1</button>
            <button className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
              2
            </button>
            <button className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
              次へ
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
