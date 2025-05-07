'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useOrders } from '@/hooks/useOrders'
import { OrderStatus } from '@prisma/client'

export default function ConsumerTransactionsPage() {
    const { orders, loading: ordersLoading } = useOrders()
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')

    useEffect(() => {
        // 注文データが読み込まれたらローディング状態を解除
        if (!ordersLoading) {
            setLoading(false);
        }
    }, [ordersLoading])

    // Filter orders based on status
    const filteredOrders = orders.filter(order => {
        if (filter === 'all') return true
        if (filter === 'active') return ['pending_payment', 'processing', 'shipped'].includes(order.status)
        if (filter === 'completed') return ['delivered', 'completed'].includes(order.status)
        return true
    })

    const getStatusLabel = (status: OrderStatus) => {
        switch (status) {
            case 'pending_payment': return { text: '支払い待ち', color: 'bg-yellow-100 text-yellow-800' }
            case 'processing': return { text: '処理中', color: 'bg-blue-100 text-blue-800' }
            case 'shipped': return { text: '発送済み', color: 'bg-indigo-100 text-indigo-800' }
            case 'delivered': return { text: '配達完了', color: 'bg-green-100 text-green-800' }
            case 'completed': return { text: '取引完了', color: 'bg-gray-100 text-gray-800' }
            case 'cancelled': return { text: 'キャンセル', color: 'bg-red-100 text-red-800' }
            case 'refunded': return { text: '返金済み', color: 'bg-red-100 text-red-800' }
            case 'dispute': return { text: '紛争中', color: 'bg-red-100 text-red-800' }
            case 'dispute_resolved': return { text: '紛争解決済み', color: 'bg-gray-100 text-gray-800' }
            default: return { text: '不明', color: 'bg-gray-100 text-gray-800' }
        }
    }

    const formatDate = (dateInput: string | Date | null) => {
        if (!dateInput) return '日付なし';

        const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
        return new Intl.DateTimeFormat('ja-JP', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">取引履歴</h1>

            {/* Filter tabs */}
            <div className="flex border-b mb-6">
                <button
                    className={`py-2 px-4 font-medium ${filter === 'all'
                        ? 'border-b-2 border-primary-600 text-primary-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                    onClick={() => setFilter('all')}
                >
                    すべて
                </button>
                <button
                    className={`py-2 px-4 font-medium ${filter === 'active'
                        ? 'border-b-2 border-primary-600 text-primary-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                    onClick={() => setFilter('active')}
                >
                    進行中
                </button>
                <button
                    className={`py-2 px-4 font-medium ${filter === 'completed'
                        ? 'border-b-2 border-primary-600 text-primary-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                    onClick={() => setFilter('completed')}
                >
                    完了済み
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <p className="text-gray-500">取引履歴を読み込み中...</p>
                </div>
            ) : (
                <>
                    {filteredOrders.length === 0 ? (
                        <Card className="p-6 text-center">
                            <p className="text-gray-500">取引履歴がありません。</p>
                            <Link href="/consumer/market">
                                <Button className="mt-4">商品を探す</Button>
                            </Link>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {filteredOrders.map(order => {
                                const { text: statusText, color: statusColor } = getStatusLabel(order.status);

                                // オーダーの最初の商品を取得
                                const firstItem = order.items && order.items.length > 0 ? order.items[0] : null;

                                return (
                                    <Link key={order.id} href={`/consumer/orders/${order.id}`}>
                                        <Card className="p-4 hover:shadow-md transition-shadow">
                                            <div className="flex flex-col md:flex-row justify-between">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                                                            {statusText}
                                                        </span>
                                                        <span className="text-sm text-gray-500">
                                                            注文番号: {order.id.substring(0, 8)}
                                                        </span>
                                                    </div>

                                                    <h3 className="text-lg font-semibold mb-1">
                                                        {firstItem?.product?.name || '商品名不明'}
                                                        {order.items.length > 1 ? ` 他 ${order.items.length - 1}点` : ''}
                                                    </h3>

                                                    <p className="text-sm text-gray-600 mb-2">
                                                        出品者: {order.seller?.handleName || '販売者不明'}
                                                    </p>

                                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                                        <span>注文日: {formatDate(order.createdAt)}</span>
                                                        {order.shippedAt && (
                                                            <span>発送日: {formatDate(order.shippedAt)}</span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="md:text-right mt-4 md:mt-0">
                                                    <p className="text-lg font-bold">
                                                        {new Intl.NumberFormat('ja-JP', {
                                                            style: 'currency',
                                                            currency: 'JPY'
                                                        }).format(order.total)}
                                                    </p>

                                                    {/* Action buttons for specific statuses */}
                                                    {order.status === 'shipped' && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="mt-2"
                                                            onClick={(e) => {
                                                                e.preventDefault()
                                                                // Handle confirm delivery logic
                                                            }}
                                                        >
                                                            受取確認
                                                        </Button>
                                                    )}

                                                    {order.status === 'delivered' && !order.reviewSubmitted && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="mt-2"
                                                            onClick={(e) => {
                                                                e.preventDefault()
                                                                // Navigate to review page
                                                                window.location.href = `/consumer/review/${order.id}`
                                                            }}
                                                        >
                                                            レビューを書く
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </Card>
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
