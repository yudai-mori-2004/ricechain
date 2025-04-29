import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { blockchainService } from '@/lib/blockchain-service';

export const metadata = {
  title: '注文履歴 | RiceChain',
  description: 'あなたの注文履歴を確認できます。',
};

export default async function OrdersPage() {
  // ユーザーID（実際のアプリではログインユーザーから取得）
  const userId = 'u1';

  // ユーザー情報
  const user = await blockchainService.getUserById(userId);

  if (!user) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          ユーザー情報が見つかりません
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          ログインしてください。
        </p>
        <Link href="/login">
          <Button>ログイン</Button>
        </Link>
      </div>
    );
  }

  // ユーザーの注文
  const orders = await blockchainService.getOrdersByUserId(userId);

  // 注文を日付順にソート（新しい順）
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">注文履歴</h1>
        <p className="text-gray-600 dark:text-gray-400">
          過去の注文履歴を確認できます。
        </p>
      </div>

      {sortedOrders.length > 0 ? (
        <div className="space-y-6">
          {sortedOrders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      注文日: {new Date(order.createdAt).toLocaleDateString('ja-JP')}
                    </p>
                    <p className="text-sm font-medium">
                      注文番号: {order.id.substring(0, 8)}
                    </p>
                  </div>
                  <div>
                    <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                          order.status === 'processing' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                            order.status === 'pending_payment' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                      {order.status === 'completed' ? '完了' :
                        order.status === 'shipped' ? '発送済み' :
                          order.status === 'processing' ? '処理中' :
                            order.status === 'pending_payment' ? '支払い待ち' :
                              order.status === 'cancelled' ? 'キャンセル' :
                                order.status === 'refunded' ? '返金済み' :
                                  order.status === 'dispute' ? '紛争中' :
                                    order.status === 'dispute_resolved' ? '紛争解決済み' :
                                      '不明'}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* 注文商品 */}
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0 last:pb-0">
                        <div className="flex items-center">
                          <div className="relative w-16 h-16 rounded-md overflow-hidden mr-4">
                            <Image
                              src={item.productImageUrl}
                              alt={item.productName}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <Link href={`/products/${item.productId}`} className="font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400">
                              {item.productName}
                            </Link>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {item.farmerName}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              数量: {item.quantity}
                            </p>
                            {item.komePonApplied && (
                              <p className="text-xs text-primary-600 dark:text-primary-400">
                                KomePon適用: {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(item.komePonDiscount || 0)} OFF
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 注文合計 */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">小計:</span>
                      <span className="text-gray-900 dark:text-white">
                        {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(order.subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-600 dark:text-gray-400">送料:</span>
                      <span className="text-gray-900 dark:text-white">
                        {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(order.shippingFee)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-600 dark:text-gray-400">消費税:</span>
                      <span className="text-gray-900 dark:text-white">
                        {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(order.tax)}
                      </span>
                    </div>
                    {order.komePonDiscount > 0 && (
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-primary-600 dark:text-primary-400">KomePon値引き:</span>
                        <span className="text-primary-600 dark:text-primary-400">
                          -{new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(order.komePonDiscount)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-gray-900 dark:text-white">合計:</span>
                      <span className="text-gray-900 dark:text-white">
                        {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(order.total)}
                      </span>
                    </div>
                  </div>

                  {/* 配送情報 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">配送先</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {order.shippingAddress.name}<br />
                        〒{order.shippingAddress.postalCode}<br />
                        {order.shippingAddress.prefecture}{order.shippingAddress.city}<br />
                        {order.shippingAddress.address1}<br />
                        {order.shippingAddress.address2 && `${order.shippingAddress.address2}`}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">配送情報</h4>
                      {order.trackingNumber ? (
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            追跡番号: {order.trackingNumber}
                          </p>
                          {order.shippedAt && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              発送日: {new Date(order.shippedAt).toLocaleDateString('ja-JP')}
                            </p>
                          )}
                          {order.deliveredAt && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              配達日: {new Date(order.deliveredAt).toLocaleDateString('ja-JP')}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          発送準備中
                        </p>
                      )}
                    </div>
                  </div>

                  {/* アクション */}
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    {order.status === 'completed' && !order.reviewSubmitted && (
                      <Link href={`/review/${order.id}`}>
                        <Button>
                          レビューを書く
                        </Button>
                      </Link>
                    )}
                    {(order.status === 'shipped' || order.status === 'delivered') && (
                      <Button variant="outline">
                        配送状況を確認
                      </Button>
                    )}
                    {order.status === 'processing' && (
                      <Button variant="outline">
                        キャンセルをリクエスト
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              注文履歴がありません
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              まだ商品を購入していないようです。美味しいお米を探してみましょう。
            </p>
            <Link href="/products">
              <Button>
                商品を探す
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
