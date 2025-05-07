import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { prisma } from '@/lib/prisma/prisma';
import { OrderStatus } from '@prisma/client';
import { getSession } from '@/lib/solana/session';
import { cookies } from 'next/headers';

// Helper function to get status label and color
function getStatusLabel(status: OrderStatus) {
    switch (status) {
        case 'pending_payment': return { text: '支払い待ち', color: 'bg-yellow-100 text-yellow-800' };
        case 'processing': return { text: '処理中', color: 'bg-blue-100 text-blue-800' };
        case 'shipped': return { text: '発送済み', color: 'bg-indigo-100 text-indigo-800' };
        case 'delivered': return { text: '配達完了', color: 'bg-green-100 text-green-800' };
        case 'completed': return { text: '取引完了', color: 'bg-gray-100 text-gray-800' };
        case 'cancelled': return { text: 'キャンセル', color: 'bg-red-100 text-red-800' };
        case 'refunded': return { text: '返金済み', color: 'bg-red-100 text-red-800' };
        case 'dispute': return { text: '紛争中', color: 'bg-red-100 text-red-800' };
        case 'dispute_resolved': return { text: '紛争解決済み', color: 'bg-gray-100 text-gray-800' };
        default: return { text: '不明', color: 'bg-gray-100 text-gray-800' };
    }
}

// Helper function to format date
function formatDate(dateString: string | Date | null | undefined) {
    if (!dateString) return '未定';

    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ja-JP', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

// Helper function to format price
function formatPrice(price: number) {
    return new Intl.NumberFormat('ja-JP', {
        style: 'currency',
        currency: 'JPY'
    }).format(price);
}

export default async function FarmerOrderDetailPage({ params }: { params: { id: string } }) {
    // For now, we'll use a fake userId for demonstration
    // In a real implementation, you'd get this from the session
    const currentFarmerId = "f1"; // Placeholder farmer ID for demonstration

    /* 
    // The proper code to get the user ID from session would be:
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    if (!sessionCookie) {
        return (
            <div className="text-center py-10">
                <h2>ログインが必要です</h2>
                <Link href="/login" className="text-primary">ログインページへ</Link>
            </div>
        );
    }
    
    let currentFarmerId: string;
    try {
        const sessionData = JSON.parse(decodeURIComponent(sessionCookie));
        currentFarmerId = sessionData.userId;
        if (!currentFarmerId) throw new Error('No user ID in session');
    } catch (error) {
        return (
            <div className="text-center py-10">
                <h2>ログインセッションが無効です</h2>
                <Link href="/login" className="text-primary">ログインページへ</Link>
            </div>
        );
    }
    */


    // Fetch order details with related data
    const order = await prisma.order.findUnique({
        where: { id: params.id },
        include: {
            items: {
                include: {
                    product: true
                }
            },
            buyer: true,
            seller: true,
            shippingAddress: true,
            dispute: true
        }
    });

    if (!order) {
        notFound();
    }

    // Verify this order belongs to the current farmer
    if (order.sellerId !== currentFarmerId) {
        notFound();
    }

    const { text: statusText, color: statusColor } = getStatusLabel(order.status);

    // Calculate farmer-specific values
    const farmerSubtotal = order.subtotal;
    const farmerKomePonDiscount = order.komePonDiscount;
    const farmerTotal = order.total;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="flex items-center mb-6">
                <Link href="/farmer/orders" className="text-primary hover:text-primary-dark mr-4">
                    <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    受注一覧に戻る
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column - Order Summary */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <h1 className="text-xl font-bold">注文詳細</h1>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
                                    {statusText}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500">注文番号: {order.id.substring(0, 8)}</p>
                            <p className="text-sm text-gray-500">注文日: {formatDate(order.createdAt)}</p>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                                        <div className="relative h-20 w-20 rounded overflow-hidden flex-shrink-0">
                                            <Image
                                                src={item.product.imageUrl || '/placeholder-product.jpg'}
                                                alt={item.product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="ml-4 flex-grow">
                                            <div className="flex justify-between">
                                                <Link href={`/farmer/products/${item.productId}`} className="font-medium hover:text-primary-600">
                                                    {item.product.name}
                                                </Link>
                                                <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                                            </div>
                                            <div className="text-sm text-gray-600 mt-1">
                                                <span>数量: {item.quantity}</span>
                                                <span className="mx-2">|</span>
                                                <span>単価: {formatPrice(item.price)}</span>
                                                {item.product.komePonDiscountRate && (
                                                    <>
                                                        <span className="mx-2">|</span>
                                                        <span className="text-accent2">KomePon設定済み</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order summary for this farmer */}
                            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <h3 className="text-md font-medium mb-2">売上情報</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>小計:</span>
                                        <span>{formatPrice(farmerSubtotal)}</span>
                                    </div>
                                    {farmerKomePonDiscount > 0 && (
                                        <div className="flex justify-between text-accent2">
                                            <span>KomePon割引:</span>
                                            <span>-{formatPrice(farmerKomePonDiscount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between font-medium pt-2">
                                        <span>収益合計:</span>
                                        <span>{formatPrice(farmerTotal)}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Customer & Shipping Information */}
                    <Card>
                        <CardHeader className="pb-2">
                            <h2 className="text-lg font-medium">配送情報</h2>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-1">配送先</h3>
                                    <p className="text-sm">
                                        {order.shippingAddress.name}
                                    </p>
                                    <p className="text-sm">
                                        〒{order.shippingAddress.postalCode}<br />
                                        {order.shippingAddress.prefecture}{order.shippingAddress.city}<br />
                                        {order.shippingAddress.address1} {order.shippingAddress.address2 || ''}
                                    </p>
                                    <p className="text-sm mt-1">
                                        TEL: {order.shippingAddress.phoneNumber}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-1">発送状況</h3>
                                    <div className="space-y-2">
                                        {/* スキーマに無い項目は表示しない
                                        {order.trackingNumber ? (
                                            <div className="flex justify-between text-sm">
                                                <span>追跡番号:</span>
                                                <span className="font-medium">{order.trackingNumber}</span>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-amber-600">追跡番号はまだ発行されていません</p>
                                        )}
                                        */}

                                        {order.shippedAt ? (
                                            <div className="flex justify-between text-sm">
                                                <span>発送日:</span>
                                                <span>{formatDate(order.shippedAt)}</span>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-amber-600">まだ発送されていません</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Transaction Details */}
                    {order.transactionHash && (
                        <Card>
                            <CardHeader className="pb-2">
                                <h2 className="text-lg font-medium">ブロックチェーン情報</h2>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex flex-col sm:flex-row sm:justify-between text-sm">
                                        <span className="text-gray-500">トランザクションハッシュ:</span>
                                        <code className="font-mono text-xs bg-gray-100 dark:bg-gray-800 p-1 rounded break-all mt-1 sm:mt-0">
                                            {order.transactionHash}
                                        </code>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right Column - Order Actions */}
                <div className="space-y-6">
                    {/* Order Actions */}
                    <Card>
                        <CardHeader className="pb-2">
                            <h2 className="text-lg font-medium">出荷アクション</h2>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {/* Process Order button */}
                            {order.status === 'pending_payment' && (
                                <Button variant="outline" className="w-full" disabled>
                                    支払い待ち
                                </Button>
                            )}

                            {/* Mark as Shipped button */}
                            {order.status === 'processing' && (
                                <>
                                    <div className="space-y-2">
                                        <label htmlFor="tracking-number" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            追跡番号
                                        </label>
                                        <div className="flex space-x-2">
                                            <input
                                                type="text"
                                                id="tracking-number"
                                                className="flex-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                                                placeholder="追跡番号を入力"
                                            />
                                        </div>
                                    </div>
                                    <Button className="w-full">
                                        発送済みとしてマーク
                                    </Button>
                                </>
                            )}

                            {/* View Tracking button - current schema doesn't have tracking number
                            {['shipped', 'delivered', 'completed'].includes(order.status) && order.trackingNumber && (
                                <Link href={`https://tracking.example.com/${order.trackingNumber}`} target="_blank" className="block">
                                    <Button className="w-full">
                                        追跡情報を確認
                                    </Button>
                                </Link>
                            )}
                            */}

                            {/* Print Label button - always available */}
                            <Link href={`/farmer/shipping?orderId=${order.id}`} className="block">
                                <Button variant="outline" className="w-full">
                                    配送ラベルを印刷
                                </Button>
                            </Link>

                            {/* Report Issue button */}
                            {['processing', 'shipped', 'delivered'].includes(order.status) && !order.dispute && (
                                <Link href={`/farmer/orders/${order.id}/dispute`} className="block">
                                    <Button variant="outline" className="w-full">
                                        問題を報告
                                    </Button>
                                </Link>
                            )}

                            {/* Contact Customer button */}
                            <Link href={`/farmer/orders/${order.id}/chat`} className="block">
                                <Button variant="outline" className="w-full">
                                    顧客に連絡する
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Analytics Card */}
                    <Card>
                        <CardHeader className="pb-2">
                            <h2 className="text-lg font-medium">注文分析</h2>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center">
                                    <span>KomePon適用商品:</span>
                                    <span className="font-medium">
                                        {order.items.filter(item => item.product.komePonDiscountRate).length}/{order.items.length} 商品
                                    </span>
                                </div>
                                {farmerKomePonDiscount > 0 && (
                                    <div className="flex justify-between items-center">
                                        <span>KomePon割引額:</span>
                                        <span className="font-medium">{formatPrice(farmerKomePonDiscount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center">
                                    <span>処理時間:</span>
                                    <span className="font-medium">
                                        {order.shippedAt && order.createdAt
                                            ? `${Math.floor((new Date(order.shippedAt).getTime() - new Date(order.createdAt).getTime()) / (1000 * 60 * 60))}時間`
                                            : '未処理'}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
