import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import WalletBalance from '@/components/wallet/wallet-balance';
import { prisma } from '@/lib/prisma/prisma';
import { Order, OrderItem, Product, OrderStatus } from '@prisma/client';

export const metadata = {
    title: 'ホーム | RiceChain',
    description: '最近の購入履歴やアクティブな取引、ウォレット残高を確認できます。',
};

// Define the type for orders with additional information
type OrderWithItems = Order & {
    items: (OrderItem & {
        product: {
            id: string;
            name: string;
            imageUrl: string;
            // これはごく基本的なフィールドのみで十分です。
            // 現在のページでは表示に必要な最小限のプロパティのみを使用しています
        };
    })[];
};

// Process orders to get the display information
function processOrders(orders: OrderWithItems[]) {
    return orders.map(order => {
        // Find the main product image (first item's product image)
        const mainImage = order.items[0]?.product.imageUrl || '/placeholder-product.jpg';

        return {
            id: order.id,
            status: order.status,
            total: order.total,
            createdAt: order.createdAt,
            mainImageUrl: mainImage,
            itemCount: order.items.length,
            reviewSubmitted: order.reviewSubmitted
        };
    });
}

export default async function ConsumerHomePage() {
    // Attempt to get user ID from the session (handled by getSession in a real app)
    // But for now, default to fetching all orders of the first user we find
    let userId: string | null = null;

    try {
        // Find the first user in the database
        // In a real app, this would be the current authenticated user
        const user = await prisma.user.findFirst();
        userId = user?.id || null;
    } catch (e) {
        console.error('Failed to get user', e);
    }

    // If no logged in user, return empty data
    if (!userId) {
        return <div>Please login to view your orders</div>;
    }

    // Get latest orders with items and product info
    const dbOrders = await prisma.order.findMany({
        where: {
            buyerId: userId
        },
        include: {
            items: {
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                            imageUrl: true
                        }
                    }
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    // Process orders for display
    const latestOrders = processOrders(dbOrders);

    // Filter for active and reviewable orders
    const activeOrders = latestOrders.filter(order =>
        ['processing', 'shipped'].includes(order.status as string)
    );

    const reviewableOrders = latestOrders.filter(order =>
        order.status === 'completed' && !order.reviewSubmitted
    );

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">ホーム</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    最近のアクティビティやウォレット残高を確認できます。
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Wallet Balance Card */}
                <div className="md:col-span-3">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle>ウォレット残高</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <WalletBalance walletAddress={null} isConnected={false} />
                        </CardContent>
                    </Card>
                </div>

                {/* Active Transactions Card */}
                <div className="md:col-span-2">
                    <Card className="h-full">
                        <CardHeader className="pb-2">
                            <CardTitle>現在進行中の取引</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-0">
                            <div className="space-y-4">
                                {activeOrders.length > 0 ? (
                                    activeOrders.map((order) => (
                                        <div key={order.id} className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                                            <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={order.mainImageUrl}
                                                    alt="商品画像"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 dark:text-white truncate">
                                                    {order.itemCount > 1 ? `${order.itemCount}点の商品` : '商品'}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {order.status === 'processing' ? '処理中' : '発送済み'}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    注文日: {new Date(order.createdAt).toLocaleDateString('ja-JP')}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-100">
                                                    ¥{order.total.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 dark:text-gray-400">現在進行中の取引はありません</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                        {activeOrders.length > 0 && (
                            <CardFooter>
                                <Link href="/consumer/orders">
                                    <Button variant="outline" className="w-full">すべての注文を見る</Button>
                                </Link>
                            </CardFooter>
                        )}
                    </Card>
                </div>

                {/* Review Reminders Card */}
                <div className="md:col-span-1">
                    <Card className="h-full">
                        <CardHeader className="pb-2">
                            <CardTitle>レビュー待ち</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-0">
                            <div className="space-y-3">
                                {reviewableOrders.length > 0 ? (
                                    reviewableOrders.map((order) => (
                                        <div key={order.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                                                    <Image
                                                        src={order.mainImageUrl}
                                                        alt="商品画像"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-gray-900 dark:text-white truncate">
                                                        {order.itemCount > 1 ? `${order.itemCount}点の商品` : '商品'}
                                                    </p>
                                                </div>
                                            </div>
                                            <Link href={`/consumer/review/${order.id}`}>
                                                <Button size="sm" className="w-full">
                                                    レビューを書く
                                                </Button>
                                            </Link>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6">
                                        <p className="text-gray-500 dark:text-gray-400">レビュー待ちの商品はありません</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                        {reviewableOrders.length > 0 && (
                            <CardFooter>
                                <Link href="/consumer/review">
                                    <Button variant="outline" className="w-full">すべてのレビューを見る</Button>
                                </Link>
                            </CardFooter>
                        )}
                    </Card>
                </div>

                {/* Recent Orders Card */}
                <div className="md:col-span-3">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle>最近の注文履歴</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b dark:border-gray-700">
                                            <th className="px-4 py-3 text-left">商品</th>
                                            <th className="px-4 py-3 text-left">注文日</th>
                                            <th className="px-4 py-3 text-right">金額</th>
                                            <th className="px-4 py-3 text-center">状態</th>
                                            <th className="px-4 py-3 text-right">詳細</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {latestOrders.length > 0 ? (
                                            latestOrders.slice(0, 5).map((order) => (
                                                <tr key={order.id} className="border-b dark:border-gray-700">
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="relative w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
                                                                <Image
                                                                    src={order.mainImageUrl}
                                                                    alt="商品画像"
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                            <span className="truncate max-w-[200px]">{order.itemCount}点の商品</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                                                        {new Date(order.createdAt).toLocaleDateString('ja-JP')}
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-medium">
                                                        ¥{order.total.toLocaleString()}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full 
                              ${order.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                                                                order.status === 'shipped' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' :
                                                                    order.status === 'processing' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
                                                                        'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                                                            }`}>
                                                            {order.status === 'completed' ? '完了' :
                                                                order.status === 'shipped' ? '発送済み' :
                                                                    order.status === 'processing' ? '処理中' :
                                                                        order.status === 'pending_payment' ? '支払い待ち' :
                                                                            order.status === 'dispute' ? '紛争中' : ''}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <Link href={`/consumer/orders/${order.id}`}>
                                                            <Button size="sm" variant="ghost">詳細</Button>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                                    注文履歴はありません
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                        {latestOrders.length > 5 && (
                            <CardFooter>
                                <Link href="/consumer/orders">
                                    <Button variant="outline" className="w-full">すべての注文履歴を見る</Button>
                                </Link>
                            </CardFooter>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
