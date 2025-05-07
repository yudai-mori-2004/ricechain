'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useMyProducts } from '@/hooks/useMyProducts'
import { useMyProduct } from '@/hooks/useMyProduct'
import Link from 'next/link'
import Image from 'next/image'

export default function FarmerProductsPage() {
    const router = useRouter()
    const { products, loading, refresh } = useMyProducts()
    const { updateProduct } = useMyProduct('')
    const [activeTab, setActiveTab] = useState<'active' | 'inactive'>('active')

    const handleToggleAvailability = async (productId: string, currentState: boolean) => {
        try {
            // 直接APIを呼び出して商品を更新
            const response = await fetch(`/api/products/mine/${productId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ available: !currentState }),
            });

            if (!response.ok) {
                throw new Error('Failed to update product availability');
            }

            // データを再取得してUIを更新
            refresh();
        } catch (error) {
            console.error('Failed to update product availability:', error);
        }
    }

    const filteredProducts = products.filter(p =>
        activeTab === 'active' ? p.available : !p.available
    )

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">商品管理</h1>
                <Button onClick={() => router.push('/products/new')}>
                    新規商品を登録
                </Button>
            </div>

            {/* Tab navigation */}
            <div className="flex border-b mb-6">
                <button
                    className={`py-2 px-4 font-medium ${activeTab === 'active'
                        ? 'border-b-2 border-primary-600 text-primary-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                    onClick={() => setActiveTab('active')}
                >
                    出品中 ({products.filter(p => p.available).length})
                </button>
                <button
                    className={`py-2 px-4 font-medium ${activeTab === 'inactive'
                        ? 'border-b-2 border-primary-600 text-primary-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                    onClick={() => setActiveTab('inactive')}
                >
                    非公開 ({products.filter(p => !p.available).length})
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <p className="text-gray-500">商品を読み込み中...</p>
                </div>
            ) : (
                <>
                    {filteredProducts.length === 0 ? (
                        <Card className="p-6 text-center">
                            <p className="text-gray-500">
                                {activeTab === 'active'
                                    ? '出品中の商品がありません。'
                                    : '非公開の商品がありません。'}
                            </p>
                            {activeTab === 'active' && (
                                <Button
                                    className="mt-4"
                                    onClick={() => router.push('/products/new')}
                                >
                                    新規商品を登録する
                                </Button>
                            )}
                        </Card>
                    ) : (
                        <div className="grid gap-6">
                            {filteredProducts.map(product => (
                                <Card key={product.id} className="p-4">
                                    <div className="flex flex-col md:flex-row gap-4">
                                        {/* Product image */}
                                        <div className="relative w-full md:w-32 h-32 flex-shrink-0">
                                            <Image
                                                src={product.imageUrl || '/placeholder-rice.jpg'}
                                                alt={product.name}
                                                fill
                                                className="object-cover rounded-md"
                                            />
                                            {product.komePonDiscountRate && (
                                                <div className="absolute top-2 right-2 bg-primary-600 text-white px-2 py-1 rounded-md text-xs font-bold">
                                                    KomePon
                                                </div>
                                            )}
                                        </div>

                                        {/* Product info */}
                                        <div className="flex-grow">
                                            <Link href={`/farmer/products/${product.id}`} className="hover:text-primary-600">
                                                <h3 className="text-lg font-semibold">{product.name}</h3>
                                            </Link>
                                            <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                                                {product.description}
                                            </p>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <p className="text-sm text-gray-500">通常価格</p>
                                                    <p className="font-semibold">
                                                        {new Intl.NumberFormat('ja-JP', {
                                                            style: 'currency',
                                                            currency: 'JPY'
                                                        }).format(product.price)}
                                                    </p>
                                                </div>
                                                {product.komePonDiscountRate && (
                                                    <div>
                                                        <p className="text-sm text-gray-500">KomePon価格</p>
                                                        <p className="font-semibold text-primary-600">
                                                            {new Intl.NumberFormat('ja-JP', {
                                                                style: 'currency',
                                                                currency: 'JPY'
                                                            }).format(product.price * (1 - product.komePonDiscountRate))}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                <p className="text-sm text-gray-500">
                                                    在庫: <span className="font-semibold">{product.stock}kg</span>
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    評価: <span className="font-semibold">{product.rating.toFixed(1)}</span>
                                                    <span className="text-xs ml-1">({product.reviewCount}件)</span>
                                                </p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col justify-between">
                                            <div className="flex gap-2">
                                                <Link href={`/farmer/products/${product.id}`}>
                                                    <Button variant="outline" size="sm">
                                                        編集
                                                    </Button>
                                                </Link>
                                                <Link href={`/farmer/komepon`}>
                                                    <Button variant="outline" size="sm">
                                                        KomePon設定
                                                    </Button>
                                                </Link>
                                            </div>
                                            <Button
                                                variant={product.available ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => handleToggleAvailability(product.id, product.available)}
                                            >
                                                {product.available ? '非公開にする' : '公開する'}
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
