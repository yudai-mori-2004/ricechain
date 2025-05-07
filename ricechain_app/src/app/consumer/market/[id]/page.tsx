// src/app/consumer/market/[id]/page.tsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma/prisma';
import { Badge } from '@/components/ui/badge';
import { ProductActions } from '@/components/market/product-actions';
import { ProductDetails } from '@/components/market/product-details';
import { FarmerCard } from '@/components/market/farmer-card';
import { ReviewList } from '@/components/market/review-list';

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  // paramsを先にawaitする
  params = await params;

  // Get product with details and farmer information
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      details: true,
      farmer: {
        include: {
          farmerProfile: true
        }
      }
    }
  });

  if (!product) {
    notFound();
  }

  // Get reviews for this product
  const reviews = await prisma.review.findMany({
    where: { productId: params.id },
    include: { user: true },
    orderBy: { createdAt: 'desc' }
  });

  // Prepare farmer data
  const farmer = {
    id: product.farmerId,
    name: product.farmer.handleName || 'Unknown Farmer',
    imageUrl: product.farmer.iconImageUrl || '/placeholder-farmer.jpg',
    location: product.farmer.farmerProfile?.location || 'Japan',
    rating: product.farmer.farmerProfile?.rating || 0,
    reviewCount: product.reviewCount || 0
  };

  // Calculate KomePon price if discount rate is available
  const hasKomePon = !!product.komePonDiscountRate;
  const komePonPrice = hasKomePon
    ? product.price * (1 - (product.komePonDiscountRate || 0))
    : null;

  // Format prices with Japanese Yen
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

  // データを整形して渡す
  const priceInfo = {
    formattedPrice,
    formattedKomePonPrice,
    hasDiscount: hasKomePon,
    discountPercentage: product.komePonDiscountRate
      ? Math.round(product.komePonDiscountRate * 100)
      : 0,
  };

  return (
    <div className="container px-4 py-6 mx-auto max-w-6xl">
      {/* モバイルヘッダー (モバイル専用) */}
      <div className="mb-4 md:hidden">
        <Link
          href={`/consumer/market/farmer/${farmer.id}`}
          className="text-sm text-primary hover:text-primary-dark flex items-center"
        >
          {farmer.name}
          <svg
            className="w-3 h-3 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold mt-1">{product.name}</h1>
      </div>

      {/* メインコンテンツ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 左カラム: 商品画像 */}
        <div>
          <div className="relative aspect-square w-full rounded-lg overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* ステータスバッジ */}
            <div className="absolute top-3 right-3 flex flex-col gap-1">
              {hasKomePon && komePonPrice && (
                <Badge variant="secondary" className="bg-accent1 text-text">
                  KomePon対象
                </Badge>
              )}

              {!product.available && (
                <Badge
                  variant="outline"
                  className="bg-red-100 text-red-800 border-red-300"
                >
                  在庫切れ
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* 右カラム: 商品情報とカート追加 */}
        <div>
          {/* デスクトップ用ヘッダー (デスクトップ専用) */}
          <div className="hidden md:block mb-6">
            <Link
              href={`/consumer/market/farmer/${farmer.id}`}
              className="text-primary hover:text-primary-dark"
            >
              {farmer.name}
            </Link>
            <h1 className="text-3xl font-bold mt-1">{product.name}</h1>
          </div>

          {/* カート追加アクション */}
          <ProductActions product={product} priceInfo={priceInfo} />

          {/* 説明文 */}
          <div className="mt-8 mb-6">
            <h2 className="text-lg font-semibold mb-2">商品説明</h2>
            <p className="text-text/80 dark:text-background/80 text-sm">
              {product.description}
            </p>
          </div>

          {/* 商品詳細 */}
          <ProductDetails product={product} />
        </div>
      </div>

      {/* 生産者情報 */}
      <div className="mt-12 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-4">生産者情報</h2>
        <FarmerCard
          id={farmer.id!}
          name={farmer.name!}
          imageUrl={farmer.imageUrl}
          location={farmer.location}
          rating={farmer.rating}
          reviewCount={farmer.reviewCount}
        />
      </div>

      {/* レビューセクション */}
      <div className="mt-12 pt-4 border-t border-gray-200 dark:border-gray-700">
        <ReviewList reviews={reviews} />
      </div>
    </div>
  );
}
