'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/cart-context';
import { Button } from '@/components/ui/button';
import type { Product, ProductDetails } from '@prisma/client';

type ProductWithDetails = Product & { details: ProductDetails | null };

type PriceInfoType = {
    formattedPrice: string;
    formattedKomePonPrice: string | null;
    hasDiscount: boolean;
    discountPercentage: number;
};

interface ProductActionsProps {
    product: ProductWithDetails;
    priceInfo: PriceInfoType;
    className?: string;
}

export function ProductActions({ product, priceInfo, className = '' }: ProductActionsProps) {
    const { addItem } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);

    const handleAddToCart = async () => {
        setAddingToCart(true);

        // Add to cart
        await addItem(product.id, quantity);

        // Show success message briefly
        setAddedToCart(true);
        setTimeout(() => {
            setAddingToCart(false);
            setAddedToCart(false);
        }, 2000);
    };

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity >= 1 && newQuantity <= (product.stock || 10)) {
            setQuantity(newQuantity);
        }
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {/* 価格情報 */}
            <div className="mb-4">
                {priceInfo.hasDiscount ? (
                    <div className="space-y-1">
                        <p className="text-sm text-text/50 dark:text-background/50 line-through">
                            通常価格: {priceInfo.formattedPrice}
                        </p>
                        <p className="text-2xl font-bold text-accent2 dark:text-accent2">
                            KomePon価格: {priceInfo.formattedKomePonPrice}
                        </p>
                        <p className="text-sm text-accent2/80">
                            {priceInfo.discountPercentage}% OFF
                        </p>
                    </div>
                ) : (
                    <p className="text-2xl font-bold">
                        {priceInfo.formattedPrice}
                    </p>
                )}
            </div>

            {/* 在庫情報 */}
            <p className="text-sm text-text/60 dark:text-background/60">
                在庫: {product.stock} 個
            </p>

            {/* 数量選択とカート追加 */}
            <div className="pt-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex items-center border rounded-md w-full sm:w-auto sm:mr-4">
                        <button
                            className="px-3 py-1 border-r"
                            onClick={() => handleQuantityChange(quantity - 1)}
                            disabled={quantity <= 1 || !product.available}
                        >
                            -
                        </button>
                        <span className="px-3 py-1">{quantity} kg</span>
                        <button
                            className="px-3 py-1 border-l"
                            onClick={() => handleQuantityChange(quantity + 1)}
                            disabled={!product.available || quantity >= (product.stock || 10)}
                        >
                            +
                        </button>
                    </div>

                    <Button
                        disabled={!product.available || addingToCart}
                        size="lg"
                        className="w-full relative"
                        onClick={handleAddToCart}
                    >
                        {addedToCart ? (
                            <span className="flex items-center justify-center">
                                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                カートに追加しました
                            </span>
                        ) : addingToCart ? (
                            '追加中...'
                        ) : product.available ? (
                            'カートに追加'
                        ) : (
                            '在庫切れ'
                        )}
                    </Button>
                </div>

                {product.komePonDiscountRate && (
                    <p className="text-xs text-accent2 mt-2">
                        ※KomePon適用価格はあなたのアカウントに値引き権利がある場合に適用されます
                    </p>
                )}
            </div>
        </div>
    );
}
