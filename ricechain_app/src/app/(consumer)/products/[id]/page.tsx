import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { blockchainService } from '@/lib/blockchain-service';
import { Product } from '@/types/product';
import { ReviewListItem } from '@/types/review';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await blockchainService.getProductById(params.id);

  if (!product) {
    return {
      title: '商品が見つかりません | RiceChain',
      description: '指定された商品は存在しないか、削除された可能性があります。',
    };
  }

  return {
    title: `${product.name} | RiceChain`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await blockchainService.getProductById(params.id);

  if (!product) {
    notFound();
  }

  const reviews = await blockchainService.getReviewsByProductId(params.id);
  const reviewListItems: ReviewListItem[] = reviews.map(review => ({
    id: review.id,
    productId: review.productId,
    rating: review.rating,
    title: review.title,
    content: review.content,
    imageUrls: review.imageUrls,
    likes: review.likes,
    createdAt: review.createdAt,
    user: {
      id: review.user.id,
      name: review.user.name,
      avatarUrl: review.user.avatarUrl,
    },
    product: {
      id: review.product.id,
      name: review.product.name,
      imageUrl: review.product.imageUrl,
    },
  }));

  // Get related products (excluding current product)
  const allProducts = await blockchainService.getProducts();
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 商品画像 */}
        <div className="relative h-96 md:h-full rounded-lg overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
          {product.hasKomePon && product.komePonPrice && (
            <div className="absolute top-4 right-4 bg-primary-600 text-white px-3 py-1 rounded-md font-bold">
              KomePon対象
            </div>
          )}
        </div>

        {/* 商品情報 */}
        <div className="space-y-6">
          <div>
            <Link
              href={`/farmers/${product.farmer.id}`}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              {product.farmer.name}
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
              {product.name}
            </h1>
          </div>

          <div className="flex items-center">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${i < Math.floor(product.rating)
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
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
              {product.rating} ({product.reviewCount}件のレビュー)
            </span>
          </div>

          <p className="text-gray-700 dark:text-gray-300">
            {product.description}
          </p>

          <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4">
            {product.hasKomePon && product.komePonPrice ? (
              <div className="space-y-1">
                <p className="text-sm text-gray-500 dark:text-gray-400 line-through">
                  通常価格: {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(product.price)}
                </p>
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  KomePon価格: {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(product.komePonPrice)}
                </p>
                <p className="text-sm text-primary-600 dark:text-primary-400">
                  {Math.round((1 - product.komePonPrice / product.price) * 100)}%OFF
                </p>
              </div>
            ) : (
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(product.price)}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-gray-700 dark:text-gray-300 mr-2">数量:</span>
              <select className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex space-x-4">
              <Button
                variant={product.available ? 'default' : 'outline'}
                disabled={!product.available}
                fullWidth={true}
              >
                {product.available ? 'カートに追加' : '在庫切れ'}
              </Button>

              <Button variant="outline">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 商品詳細 */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">商品詳細</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">基本情報</h3>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-gray-600 dark:text-gray-400">品種</dt>
                  <dd className="text-gray-900 dark:text-white font-medium">{product.details.variety}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600 dark:text-gray-400">収穫日</dt>
                  <dd className="text-gray-900 dark:text-white font-medium">
                    {new Date(product.details.harvestDate).toLocaleDateString('ja-JP')}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600 dark:text-gray-400">内容量</dt>
                  <dd className="text-gray-900 dark:text-white font-medium">{product.details.weight}kg</dd>
                </div>
                {product.details.polishingRatio && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-400">精米歩合</dt>
                    <dd className="text-gray-900 dark:text-white font-medium">{product.details.polishingRatio}%</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-gray-600 dark:text-gray-400">栽培方法</dt>
                  <dd className="text-gray-900 dark:text-white font-medium">
                    {product.details.cultivationMethod === 'organic' && '有機栽培'}
                    {product.details.cultivationMethod === 'reduced_pesticide' && '減農薬栽培'}
                    {product.details.cultivationMethod === 'conventional' && '慣行栽培'}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">生産者情報</h3>
              <div className="flex items-center mb-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                  <Image
                    src={'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&q=80'}
                    alt={product.farmer.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">{product.farmer.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{product.farmer.location}</p>
                </div>
              </div>
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.farmer.rating)
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
                <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">
                  ({product.farmer.rating})
                </span>
              </div>
              <Link
                href={`/farmers/${product.farmer.id}`}
                className="text-primary-600 dark:text-primary-400 hover:underline text-sm font-medium"
              >
                生産者の詳細を見る
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* レビュー */}
      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">カスタマーレビュー</h2>
          <Link
            href={`/products/${product.id}/reviews`}
            className="text-primary-600 dark:text-primary-400 hover:underline text-sm font-medium"
          >
            すべてのレビューを見る
          </Link>
        </div>

        {reviewListItems.length > 0 ? (
          <div className="space-y-6">
            {reviewListItems.slice(0, 3).map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                        <Image
                          src={review.user.avatarUrl || 'https://via.placeholder.com/150'}
                          alt={review.user.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{review.user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString('ja-JP')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < review.rating
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
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{review.title}</h4>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{review.content}</p>

                  {review.imageUrls && review.imageUrls.length > 0 && (
                    <div className="flex space-x-2 mt-3">
                      {review.imageUrls.map((url, index) => (
                        <div key={index} className="relative w-20 h-20 rounded-md overflow-hidden">
                          <Image src={url} alt={`レビュー画像 ${index + 1}`} fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center mt-4">
                    <button className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                        />
                      </svg>
                      役に立った ({review.likes})
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">まだレビューがありません。</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* おすすめ商品 */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">おすすめ商品</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((relatedProduct) => (
            <Link key={relatedProduct.id} href={`/products/${relatedProduct.id}`}>
              <div className="group">
                <div className="relative h-48 rounded-lg overflow-hidden mb-3">
                  <Image
                    src={relatedProduct.imageUrl}
                    alt={relatedProduct.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {relatedProduct.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{relatedProduct.farmer.name}</p>
                <p className="font-bold text-gray-900 dark:text-white mt-1">
                  {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(relatedProduct.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
