'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useSalesOrders } from '@/hooks/useSalesOrders'
import { OrderStatus } from '@prisma/client'

export default function FarmerTransactionsPage() {
    const { orders, loading: ordersLoading } = useSalesOrders()
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'dispute'>('all')

    useEffect(() => {
        // 注文データが読み込まれたらローディング状態を解除
        if (!ordersLoading) {
            setLoading(false)
        }
    }, [ordersLoading])

    // Filter orders based on status
    const filteredOrders = orders.filter(order => {
        if (filter === 'all') return true
        if (filter === 'active') return ['pending_payment', 'processing', 'shipped'].includes(order.status)
        if (filter === 'completed') return ['delivered', 'completed'].includes(order.status)
        if (filter === 'dispute') return ['dispute', 'dispute_resolved'].includes(order.status)
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

    const handleShipOrder = async (orderId: string, e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        try {
            // 発送ステータスに更新するAPIを呼び出す
            const response = await fetch(`/api/orders/${orderId}/ship`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to update order status');
            }

            // 成功したら画面をリロード
            window.location.reload();
        } catch (error) {
            console.error('Error shipping order:', error);
            alert('発送処理に失敗しました。もう一度お試しください。');
        }
    }

    // アクティブな注文数を計算
    const activeOrdersCount = orders.filter(o =>
        ['pending_payment', 'processing', 'shipped'].includes(o.status)
    ).length;

    // 完了した注文数を計算
    const completedOrdersCount = orders.filter(o =>
        ['delivered', 'completed'].includes(o.status)
    ).length;

    // 紛争中の注文数を計算
    const disputeOrdersCount = orders.filter(o =>
        ['dispute', 'dispute_resolved'].includes(o.status)
    ).length;

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">取引管理</h1>

            {/* Filter tabs */}
            <div className="flex border-b mb-6">
                <button
                    className={`py-2 px-4 font-medium ${filter === 'all'
                        ? 'border-b-2 border-primary-600 text-primary-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                    onClick={() => setFilter('all')}
                >
                    すべて ({orders.length})
                </button>
                <button
                    className={`py-2 px-4 font-medium ${filter === 'active'
                        ? 'border-b-2 border-primary-600 text-primary-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                    onClick={() => setFilter('active')}
                >
                    進行中 ({activeOrdersCount})
                </button>
                <button
                    className={`py-2 px-4 font-medium ${filter === 'completed'
                        ? 'border-b-2 border-primary-600 text-primary-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                    onClick={() => setFilter('completed')}
                >
                    完了 ({completedOrdersCount})
                </button>
                <button
                    className={`py-2 px-4 font-medium ${filter === 'dispute'
                        ? 'border-b-2 border-primary-600 text-primary-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                    onClick={() => setFilter('dispute')}
                >
                    紛争 ({disputeOrdersCount})
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            ) : (
                <>
                    {filteredOrders.length === 0 ? (
                        <Card className="p-6 text-center">
                            <p className="text-gray-500">該当する取引がありません。</p>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {filteredOrders.map(order => {
                                const { text: statusText, color: statusColor } = getStatusLabel(order.status)

                                // 売上金額（この農家向けの金額）
                                const totalSales = order.total;

                                return (
                                    <Card key={order.id} className="p-4 hover:shadow-md transition-shadow">
                                        <Link href={`/farmer/orders/${order.id}`}>
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
                                                        {order.items && order.items.length > 0 ? (
                                                            <>
                                                                {order.items[0].product?.name || '商品名不明'}
                                                                {order.items.length > 1 ? ` 他 ${order.items.length - 1}点` : ''}
                                                            </>
                                                        ) : (
                                                            '商品情報なし'
                                                        )}
                                                    </h3>

                                                    <p className="text-sm text-gray-600 mb-2">
                                                        購入者: {order.buyer?.handleName || order.shippingAddress?.name || '名前不明'}
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
                                                        }).format(totalSales)}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>

                                        {/* Action buttons for farmers based on status */}
                                        <div className="mt-4 flex justify-end">
                                            {order.status === 'processing' && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={(e) => handleShipOrder(order.id, e)}
                                                >
                                                    発送する
                                                </Button>
                                            )}

                                            {order.status === 'dispute' && (
                                                <Link href={`/disputes/${order.id}`} onClick={e => e.stopPropagation()}>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                                                    >
                                                        紛争対応
                                                    </Button>
                                                </Link>
                                            )}

                                            <Link href={`/farmer/orders/${order.id}`} className="ml-2">
                                                <Button variant="outline" size="sm">
                                                    詳細を見る
                                                </Button>
                                            </Link>
                                        </div>
                                    </Card>
                                )
                            })}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
