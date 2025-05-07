'use client';

import type { Product, ProductDetails } from '@prisma/client';
import { StarRating } from '../ui/star-rating';

type ProductWithDetails = Product & { details: ProductDetails | null };

interface ProductDetailsProps {
    product: ProductWithDetails;
    className?: string;
}

export function ProductDetails({ product, className = '' }: ProductDetailsProps) {
    return (
        <div className={`space-y-4 ${className}`}>
            {/* 商品詳細 */}
            {product.details && (
                <div>
                    <h2 className="text-lg font-semibold mb-3">商品詳細</h2>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-y-2 text-sm">
                            {product.details.variety && (
                                <>
                                    <div className="text-text/60 dark:text-background/60">品種</div>
                                    <div>{product.details.variety}</div>
                                </>
                            )}
                            {product.details.weightKg && (
                                <>
                                    <div className="text-text/60 dark:text-background/60">重量</div>
                                    <div>{product.details.weightKg}kg</div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
