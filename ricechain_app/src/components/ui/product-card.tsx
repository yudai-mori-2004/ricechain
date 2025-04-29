import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  id: string;
  name: string;
  farmer: string;
  farmerId: string;
  description: string;
  price: number;
  komePonPrice?: number;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  available: boolean;
  hasKomePon?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  farmer,
  farmerId,
  description,
  price,
  komePonPrice,
  imageUrl,
  rating,
  reviewCount,
  available,
  hasKomePon = false,
}) => {
  const formattedPrice = new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
  }).format(price);

  const formattedKomePonPrice = komePonPrice
    ? new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(komePonPrice)
    : null;

  return (
    <Card className="h-full flex flex-col">
      <div className="relative h-48 w-full max-w-full overflow-hidden">
        <Image
          src={imageUrl || '/placeholder-rice.jpg'}
          alt={name}
          fill
          className="object-cover object-center"
        />
        {hasKomePon && komePonPrice && (
          <div className="absolute top-2 right-2 bg-primary-600 text-white px-2 py-1 rounded-md text-xs font-bold">
            KomePon対象
          </div>
        )}
      </div>
      <CardContent className="flex-grow">
        <div className="mb-2">
          <Link href={`/products/${id}`} className="block">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              {name}
            </h3>
          </Link>
          <Link href={`/farmers/${farmerId}`} className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            {farmer}
          </Link>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
          {description}
        </p>
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${i < Math.floor(rating)
                    ? 'text-yellow-400'
                    : 'text-gray-300 dark:text-gray-600'
                  }`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
            ({reviewCount})
          </span>
        </div>
        <div className="mt-auto">
          {hasKomePon && komePonPrice ? (
            <div className="space-y-1">
              <p className="text-sm text-gray-500 dark:text-gray-400 line-through">
                通常価格: {formattedPrice}
              </p>
              <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                KomePon価格: {formattedKomePonPrice}
              </p>
            </div>
          ) : (
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {formattedPrice}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          fullWidth={true}
          disabled={!available}
          variant={available ? 'default' : 'outline'}
        >
          {available ? 'カートに追加' : '在庫切れ'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
