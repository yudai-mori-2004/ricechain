import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Product, User } from '@prisma/client';

type ProductWithFarmer = Product & {
  farmer: User;
};

interface ProductCardProps {
  product: ProductWithFarmer;
  // Calculated properties
  komePonPrice?: number;
  // Farmer-specific props
  isForFarmer: boolean;
  isEditing?: boolean;
  isHidden?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  komePonPrice,
  isForFarmer,
  isEditing = false,
  isHidden = false,
}) => {
  const formattedPrice = new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
  }).format(product.price);

  const formattedKomePonPrice = komePonPrice
    ? new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(komePonPrice)
    : null;

  const hasKomePon = !!product.komePonDiscountRate;

  return (
    <Card className="h-full flex flex-col">
      <div className="relative h-48 w-full max-w-full overflow-hidden">
        <Link href={isForFarmer ? `/farmer/products/${product.id}` : `/consumer/market/${product.id}`}>
          <Image
            src={product.imageUrl || '/placeholder-rice.jpg'}
            alt={product.name}
            fill
            className={`object-cover object-center transition-opacity hover:opacity-90 ${isHidden ? 'opacity-60' : ''}`}
          />
        </Link>

        {/* Status badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {!isForFarmer && hasKomePon && komePonPrice && (
            <Badge variant="secondary" className="bg-accent1 text-text">
              KomePon対象
            </Badge>
          )}

          {isForFarmer && isEditing && (
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
              編集中
            </Badge>
          )}

          {isForFarmer && isHidden && (
            <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">
              非表示中
            </Badge>
          )}

          {!product.available && (
            <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
              在庫切れ
            </Badge>
          )}
        </div>
      </div>
      <CardContent className="flex-grow">
        <div className="mb-2">
          <Link href={isForFarmer ? `/farmer/products/${product.id}` : `/consumer/market/${product.id}`} className="block">
            <h3 className="text-lg font-semibold text-text dark:text-background hover:text-accent2 dark:hover:text-accent1 transition-colors">
              {product.name}
            </h3>
          </Link>
          <Link href={`/consumer/market/farmer/${product.farmerId}`} className="text-sm text-text/70 dark:text-background/70 hover:text-accent2 dark:hover:text-accent1 transition-colors">
            {product.farmer.handleName || 'Unknown Farmer'}
          </Link>
        </div>
        <p className="text-sm text-text/60 dark:text-background/60 line-clamp-2 mb-2">
          {product.description}
        </p>
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${i < Math.floor(product.rating)
                  ? 'text-accent1'
                  : 'text-primary/30 dark:text-primary/20'
                  }`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            ))}
          </div>
          <span className="text-xs text-text/50 dark:text-background/50 ml-1">
            ({product.reviewCount})
          </span>
        </div>
        <div className="mt-auto space-y-2">
          {/* Stock information (shown to both) */}
          {product.stock !== undefined && (
            <p className="text-xs text-text/60 dark:text-background/60">
              残り: {product.stock}個
            </p>
          )}

          {/* Price display */}
          {!isForFarmer && hasKomePon && komePonPrice ? (
            <div className="space-y-1">
              <p className="text-sm text-text/50 dark:text-background/50 line-through">
                通常価格: {formattedPrice}
              </p>
              <p className="text-lg font-bold text-accent2 dark:text-accent2">
                KomePon価格: {formattedKomePonPrice}
              </p>
            </div>
          ) : (
            <p className="text-lg font-bold text-text dark:text-background">
              {formattedPrice}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="text-xs text-text/40 dark:text-background/40 w-full text-right">
          詳細を見る →
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
