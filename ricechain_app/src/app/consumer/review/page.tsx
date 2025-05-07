import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma/prisma';
import { getSession } from '@/lib/solana/session';
import { cookies } from 'next/headers';

export const metadata = {
    title: 'レビューを書く | RiceChain',
    description: '購入した商品のレビューを投稿して、KomePon割引を獲得しましょう。',
};

export default async function ConsumerReviewPage() {
    // 固定のダミーユーザーIDを使用（実際の環境では適切なセッション管理が必要）
    const userId = "c1"; // 仮の消費者ID

    // 空のダミーデータの場合の処理
    if (false) { // ユーザーIDが存在する場合は常にfalseになる
        return (
            <div className="text-center py-12">
                <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg max-w-2xl mx-auto">
                    <h2 className="text-xl font-medium mb-3">ログインが必要です</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        レビューを書くにはログインが必要です。
                    </p>
                    <Link href="/login">
                        <Button variant="outline">ログイン</Button>
                    </Link>
                </div>
            </div>
        );
    }

    // Get completed orders that haven't been reviewed yet
    const orders = await prisma.order.findMany({
        where: {
            buyerId: userId,
            status: 'completed',
            reviewSubmitted: false
        },
        include: {
            items: {
                include: {
                    product: true
                }
            },
            seller: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    // 各注文のメイン画像と商品数をマッピング
    const reviewableOrders = orders.map(order => {
        // 最初の商品の画像をメイン画像として使用
        const mainProduct = order.items[0]?.product;
        const mainImageUrl = mainProduct?.imageUrl || '/placeholder-product.jpg';

        return {
            id: order.id,
            createdAt: order.createdAt,
            status: order.status,
            total: order.total,
            itemCount: order.items.length,
            mainImageUrl,
            reviewSubmitted: order.reviewSubmitted,
        };
    });

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">レビューを書く</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    購入した商品のレビューを投稿して、次回購入時に使えるKomePon値引きを獲得しましょう。
                </p>
            </div>

            {reviewableOrders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviewableOrders.map((order) => (
                        <Card key={order.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">注文日: {new Date(order.createdAt).toLocaleDateString('ja-JP')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="relative h-48 w-full rounded-md overflow-hidden">
                                        <Image
                                            src={order.mainImageUrl}
                                            alt="商品画像"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-medium text-lg">
                                            {order.itemCount > 1 ? `${order.itemCount}点の商品` : '商品'}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            注文番号: {order.id.substring(0, 8)}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            注文合計: {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(order.total)}
                                        </p>
                                    </div>
                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md">
                                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                            <span className="font-medium">KomePonのチャンス！</span> この商品のレビューを投稿すると、次回購入時の値引きが適用されます。
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Link href={`/consumer/review/${order.id}`} className="w-full">
                                    <Button className="w-full">レビューを書く</Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg max-w-2xl mx-auto">
                        <h2 className="text-xl font-medium mb-3">レビュー待ちの商品はありません</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            現在、レビュー待ちの商品はありません。商品を購入し、取引が完了すると、ここでレビューを書くことができます。
                        </p>
                        <Link href="/consumer/market">
                            <Button variant="outline">商品を探す</Button>
                        </Link>
                    </div>
                </div>
            )}

            <div className="bg-primary-50 dark:bg-primary-900/20 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-4">KomePonについて</h2>
                <div className="space-y-4">
                    <p className="text-primary-800 dark:text-primary-200">
                        KomePonは、「レビューを書くと次回購入時に値引きが受けられる」システムです。あなたのレビューは、他の消費者の選択に役立つだけでなく、農家の品質向上にも貢献します。
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm">
                            <h3 className="font-medium text-primary-800 dark:text-primary-200 mb-2">レビューの条件</h3>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                                <li>100文字以上の具体的な内容</li>
                                <li>実際に使用した感想</li>
                                <li>写真があるとより効果的</li>
                            </ul>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm">
                            <h3 className="font-medium text-primary-800 dark:text-primary-200 mb-2">審査について</h3>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                                <li>AIによる内容チェック</li>
                                <li>形式的なレビューは不可</li>
                                <li>写真は実際の商品であること</li>
                            </ul>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm">
                            <h3 className="font-medium text-primary-800 dark:text-primary-200 mb-2">値引きの適用</h3>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                                <li>次回購入時に自動適用</li>
                                <li>値引き額は商品により異なる</li>
                                <li>農家の値引き枠がある場合のみ</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
