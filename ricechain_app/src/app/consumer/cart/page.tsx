'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { useAppContext } from '@/contexts/auth-context'

export default function CartPage() {
    const { cart, removeFromCart, updateCartItemQuantity, clearCart } = useAppContext()
    const router = useRouter()
    const [isProcessing, setIsProcessing] = useState(false)

    // Calculate totals
    const subtotal = cart.reduce(
        (total, item) => total + (item.product.hasKomePon && item.product.komePonPrice
            ? item.product.komePonPrice * item.quantity
            : item.product.price * item.quantity),
        0
    )

    const shippingFee = cart.length > 0 ? 800 : 0 // 送料
    const tax = Math.round(subtotal * 0.1) // 消費税10%
    const total = subtotal + shippingFee + tax

    const handleRemoveItem = (productId: string) => {
        removeFromCart(productId)
    }

    const handleQuantityChange = (productId: string, newQuantity: number) => {
        if (newQuantity < 1) return // Prevent negative quantities
        updateCartItemQuantity(productId, newQuantity)
    }

    const handleCheckout = () => {
        setIsProcessing(true)

        // Normally you would redirect to a checkout page or process the payment
        // For this example, we'll just simulate a delay and redirect to a success page
        setTimeout(() => {
            clearCart()
            router.push('/(consumer)/checkout/success')
        }, 1000)
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">ショッピングカート</h1>

            {cart.length === 0 ? (
                <Card className="p-8 text-center">
                    <p className="text-gray-500 mb-4">カートに商品がありません。</p>
                    <Link href="/(consumer)/purchase">
                        <Button>商品を探す</Button>
                    </Link>
                </Card>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Card className="p-4">
                            <div className="divide-y">
                                {cart.map((item) => (
                                    <div key={item.productId} className="py-4 flex flex-col md:flex-row gap-4">
                                        <div className="relative w-full md:w-24 h-24 flex-shrink-0">
                                            <Image
                                                src={item.product.imageUrl || '/placeholder-rice.jpg'}
                                                alt={item.product.name}
                                                fill
                                                className="object-cover rounded-md"
                                            />
                                        </div>

                                        <div className="flex-grow">
                                            <div className="flex justify-between">
                                                <div>
                                                    <h3 className="font-semibold">{item.product.name}</h3>
                                                    <p className="text-sm text-gray-500">出品者: {item.product.farmer.name}</p>
                                                </div>
                                                <div className="text-right">
                                                    {item.product.hasKomePon && item.product.komePonPrice ? (
                                                        <>
                                                            <p className="text-sm text-gray-500 line-through">
                                                                {new Intl.NumberFormat('ja-JP', {
                                                                    style: 'currency',
                                                                    currency: 'JPY'
                                                                }).format(item.product.price)} / kg
                                                            </p>
                                                            <p className="font-semibold text-primary-600">
                                                                {new Intl.NumberFormat('ja-JP', {
                                                                    style: 'currency',
                                                                    currency: 'JPY'
                                                                }).format(item.product.komePonPrice)} / kg
                                                            </p>
                                                        </>
                                                    ) : (
                                                        <p className="font-semibold">
                                                            {new Intl.NumberFormat('ja-JP', {
                                                                style: 'currency',
                                                                currency: 'JPY'
                                                            }).format(item.product.price)} / kg
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex justify-between mt-4 items-center">
                                                <div className="flex items-center border rounded-md">
                                                    <button
                                                        className="px-3 py-1 border-r"
                                                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="px-3 py-1">{item.quantity} kg</span>
                                                    <button
                                                        className="px-3 py-1 border-l"
                                                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <p className="font-semibold">
                                                        {new Intl.NumberFormat('ja-JP', {
                                                            style: 'currency',
                                                            currency: 'JPY'
                                                        }).format(
                                                            item.product.hasKomePon && item.product.komePonPrice
                                                                ? item.product.komePonPrice * item.quantity
                                                                : item.product.price * item.quantity
                                                        )}
                                                    </p>

                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleRemoveItem(item.productId)}
                                                    >
                                                        削除
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    <div>
                        <Card className="p-6 sticky top-6">
                            <h2 className="text-lg font-semibold mb-4">注文内容</h2>

                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">小計</span>
                                    <span>
                                        {new Intl.NumberFormat('ja-JP', {
                                            style: 'currency',
                                            currency: 'JPY'
                                        }).format(subtotal)}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">送料</span>
                                    <span>
                                        {new Intl.NumberFormat('ja-JP', {
                                            style: 'currency',
                                            currency: 'JPY'
                                        }).format(shippingFee)}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">消費税</span>
                                    <span>
                                        {new Intl.NumberFormat('ja-JP', {
                                            style: 'currency',
                                            currency: 'JPY'
                                        }).format(tax)}
                                    </span>
                                </div>

                                <div className="border-t pt-2 mt-2 font-semibold flex justify-between">
                                    <span>合計</span>
                                    <span>
                                        {new Intl.NumberFormat('ja-JP', {
                                            style: 'currency',
                                            currency: 'JPY'
                                        }).format(total)}
                                    </span>
                                </div>
                            </div>

                            <Button
                                className="w-full"
                                onClick={handleCheckout}
                                disabled={isProcessing}
                            >
                                {isProcessing ? '処理中...' : '注文を確定する'}
                            </Button>

                            <p className="text-xs text-gray-500 mt-4">
                                「注文を確定する」をクリックすると、利用規約およびプライバシーポリシーに同意したものとみなされます。
                            </p>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    )
}
