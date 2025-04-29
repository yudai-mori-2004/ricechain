'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/lib/app-context';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cart, removeFromCart, updateCartItemQuantity, clearCart, addOrder, user, useMockData } = useAppContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  // Calculate cart totals
  const subtotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const komePonDiscount = cart.reduce((total, item) => {
    if (item.product.hasKomePon && item.product.komePonPrice) {
      return total + ((item.product.price - item.product.komePonPrice) * item.quantity);
    }
    return total;
  }, 0);
  const shippingFee = cart.length > 0 ? 800 : 0; // 送料: 一律800円
  const tax = Math.round((subtotal - komePonDiscount + shippingFee) * 0.1); // 消費税: 10%
  const total = subtotal - komePonDiscount + shippingFee + tax;

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    updateCartItemQuantity(productId, quantity);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    setIsProcessing(true);
    
    // Simulate order processing
    setTimeout(() => {
      // Create a new order
      const newOrder = {
        id: `o${Math.floor(Math.random() * 10000)}`,
        userId: user?.id || 'u1',
        status: 'processing' as const,
        items: cart.map(item => ({
          id: `oi${Math.floor(Math.random() * 10000)}`,
          productId: item.product.id,
          productName: item.product.name,
          productImageUrl: item.product.imageUrl,
          quantity: item.quantity,
          price: item.product.price,
          komePonApplied: item.product.hasKomePon && !!item.product.komePonPrice,
          komePonDiscount: item.product.hasKomePon && item.product.komePonPrice 
            ? (item.product.price - item.product.komePonPrice) 
            : undefined,
          farmerId: item.product.farmer.id,
          farmerName: item.product.farmer.name,
        })),
        subtotal,
        shippingFee,
        tax,
        komePonDiscount,
        total,
        paymentMethod: 'solana' as const,
        paymentStatus: 'paid' as const,
        transactionHash: `0x${Math.random().toString(16).substring(2, 42)}`,
        shippingAddress: user?.shippingAddresses.find(addr => addr.isDefault) || {
          name: '佐々木健太',
          postalCode: '100-0001',
          prefecture: '東京都',
          city: '千代田区',
          address1: '千代田1-1-1',
          address2: 'マンション千代田101',
          phoneNumber: '090-1234-5678',
        },
        reviewSubmitted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Add the order to the context
      addOrder(newOrder);
      
      // Clear the cart
      clearCart();
      
      // Redirect to the order confirmation page
      router.push(`/orders`);
      
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">ショッピングカート</h1>
        <p className="text-gray-600 dark:text-gray-400">
          カートに追加した商品を確認し、注文を確定してください。
        </p>
      </div>

      {cart.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>カート内の商品 ({cart.length}点)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {cart.map((item) => (
                  <div key={item.productId} className="flex border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                    <div className="relative w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-grow">
                      <div className="flex justify-between">
                        <div>
                          <Link href={`/products/${item.productId}`} className="font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400">
                            {item.product.name}
                          </Link>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {item.product.farmer.name}
                          </p>
                          <div className="mt-2">
                            {item.product.hasKomePon && item.product.komePonPrice ? (
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 line-through">
                                  {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(item.product.price)}
                                </p>
                                <p className="text-sm font-bold text-primary-600 dark:text-primary-400">
                                  {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(item.product.komePonPrice)}
                                  <span className="ml-1">
                                    ({Math.round((1 - item.product.komePonPrice / item.product.price) * 100)}%OFF)
                                  </span>
                                </p>
                              </div>
                            ) : (
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(item.product.price)}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <button
                              className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-700"
                              onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-700"
                              onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                          </div>
                          <p className="mt-2 font-bold text-gray-900 dark:text-white">
                            {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(
                              (item.product.hasKomePon && item.product.komePonPrice ? item.product.komePonPrice : item.product.price) * item.quantity
                            )}
                          </p>
                          <button
                            className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                            onClick={() => removeFromCart(item.productId)}
                          >
                            削除
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => clearCart()}>
                  カートを空にする
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>注文内容</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">小計:</span>
                  <span className="text-gray-900 dark:text-white">
                    {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(subtotal)}
                  </span>
                </div>
                {komePonDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-primary-600 dark:text-primary-400">KomePon割引:</span>
                    <span className="text-primary-600 dark:text-primary-400">
                      -{new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(komePonDiscount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">送料:</span>
                  <span className="text-gray-900 dark:text-white">
                    {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">消費税:</span>
                  <span className="text-gray-900 dark:text-white">
                    {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(tax)}
                  </span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <div className="flex justify-between font-bold">
                    <span className="text-gray-900 dark:text-white">合計:</span>
                    <span className="text-gray-900 dark:text-white">
                      {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(total)}
                    </span>
                  </div>
                </div>

                {useMockData && (
                  <div className="mt-4 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                    <p className="text-xs text-yellow-700 dark:text-yellow-400">
                      <span className="font-medium">モックモード:</span> 実際のブロックチェーンとは接続していません。右上の「モック」ボタンからモードを切り替えられます。
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={handleCheckout}
                  disabled={cart.length === 0 || isProcessing}
                >
                  {isProcessing ? '処理中...' : '注文を確定する'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              カートは空です
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              商品をカートに追加して、お買い物を続けましょう。
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
