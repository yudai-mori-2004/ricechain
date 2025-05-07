'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMyProduct } from '@/hooks/useMyProduct';
import { useReviews } from '@/hooks/useReviews';

export default function FarmerProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params?.id as string;

    const { product, loading: productLoading, updateProduct } = useMyProduct(productId);
    const [reviews, setReviews] = useState<any[]>([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);

    // レビューを取得
    useEffect(() => {
        if (!productId) return;

        fetch(`/api/reviews?productId=${productId}`)
            .then(res => res.json())
            .then(data => {
                setReviews(data.reviews || []);
                setReviewsLoading(false);
            })
            .catch(error => {
                console.error('Failed to fetch reviews:', error);
                setReviewsLoading(false);
            });
    }, [productId]);

    // 商品情報がロード中または見つからない場合
    if (productLoading) {
        return <div className="flex justify-center items-center h-64">商品情報を読み込み中...</div>;
    }

    if (!product) {
        return <div className="flex justify-center items-center h-64">商品が見つかりません</div>;
    }

    // 価格のフォーマット
    const formattedPrice = new Intl.NumberFormat('ja-JP', {
        style: 'currency',
        currency: 'JPY',
    }).format(product.price);

    // KomePon価格の計算とフォーマット
    const hasActiveKomePon = !!product.komePonDiscountRate;
    const komePonPrice = hasActiveKomePon
        ? product.price * (1 - product.komePonDiscountRate!)
        : null;

    const formattedKomePonPrice = komePonPrice
        ? new Intl.NumberFormat('ja-JP', {
            style: 'currency',
            currency: 'JPY',
        }).format(komePonPrice)
        : null;

    // Komeponディスカウントレートをパーセンテージとして表示
    const discountPercent = hasActiveKomePon
        ? Math.round(product.komePonDiscountRate! * 100)
        : 0;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">商品詳細 & 管理</h1>
                <div className="flex gap-2">
                    <Button variant="outline">プレビュー</Button>
                    <Button>商品を編集</Button>
                </div>
            </div>

            {/* Product Overview Section */}
            <Card>
                <CardHeader>
                    <CardTitle>商品概要</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Product Image */}
                        <div className="w-full md:w-2/5">
                            <div className="relative aspect-square rounded-lg overflow-hidden">
                                <Image
                                    src={product.imageUrl}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    priority
                                />

                                {/* Status badges */}
                                <div className="absolute top-3 right-3 flex flex-col gap-1">
                                    {!product.available && (
                                        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                                            非表示 / 在庫切れ
                                        </Badge>
                                    )}

                                    {hasActiveKomePon && (
                                        <Badge variant="outline" className="bg-accent1/20 text-accent1 border-accent1/30">
                                            KomePon設定済み
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="w-full md:w-3/5">
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-2xl font-bold">{product.name}</h2>
                                    <p className="text-sm text-text/60 dark:text-background/60">最終更新: {new Date(product.updatedAt).toLocaleDateString('ja-JP')}</p>
                                </div>

                                {/* Description */}
                                <div>
                                    <h3 className="text-sm font-medium text-text/60 dark:text-background/60">商品説明</h3>
                                    <p className="text-text/80 dark:text-background/80">
                                        {product.description}
                                    </p>
                                </div>

                                {/* Sales stats */}
                                <div className="grid grid-cols-3 gap-4 py-2">
                                    <div className="border rounded-md p-3 text-center">
                                        <p className="text-lg font-bold">{product.stock}</p>
                                        <p className="text-xs text-text/60 dark:text-background/60">在庫数</p>
                                    </div>
                                    <div className="border rounded-md p-3 text-center">
                                        <p className="text-lg font-bold">{product.reviewCount}</p>
                                        <p className="text-xs text-text/60 dark:text-background/60">レビュー数</p>
                                    </div>
                                    <div className="border rounded-md p-3 text-center">
                                        <p className="text-lg font-bold">{product.rating.toFixed(1)}</p>
                                        <p className="text-xs text-text/60 dark:text-background/60">評価</p>
                                    </div>
                                </div>

                                {/* Price info */}
                                <div className="space-y-2">
                                    <div>
                                        <h3 className="text-sm font-medium text-text/60 dark:text-background/60">通常価格</h3>
                                        <p className="text-xl font-bold">{formattedPrice}</p>
                                    </div>

                                    {hasActiveKomePon && formattedKomePonPrice && (
                                        <div>
                                            <h3 className="text-sm font-medium text-text/60 dark:text-background/60">KomePon適用価格</h3>
                                            <div className="flex items-center">
                                                <p className="text-xl font-bold text-accent2">{formattedKomePonPrice}</p>
                                                <span className="ml-2 text-sm bg-accent2/10 text-accent2 px-2 py-0.5 rounded">
                                                    {discountPercent}% OFF
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Stock management */}
                                <div className="pt-4 space-y-2">
                                    <h3 className="text-sm font-medium text-text/60 dark:text-background/60">在庫および表示ステータス</h3>
                                    <div className="flex flex-wrap gap-2">
                                        <Button variant="outline" size="sm">
                                            {product.available ? '非表示にする' : '表示する'}
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            在庫数を編集
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* KomePon Settings */}
            <Card>
                <CardHeader>
                    <CardTitle>KomePon設定</CardTitle>
                </CardHeader>
                <CardContent>
                    {hasActiveKomePon ? (
                        <div className="space-y-4">
                            <div className="bg-accent1/10 p-4 rounded-md">
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                    <div>
                                        <h3 className="font-medium">KomePon割引が有効</h3>
                                        <p className="text-sm text-text/70 dark:text-background/70">
                                            この商品はKomePon割引が適用されています。レビューを投稿した消費者は次回購入時に割引価格で購入できます。
                                        </p>
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-2 shrink-0">
                                        <Button variant="outline" size="sm">
                                            設定を編集
                                        </Button>
                                        <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                                            無効にする
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="border rounded-md p-4">
                                    <p className="text-sm text-text/60 dark:text-background/60">通常価格</p>
                                    <p className="text-lg font-medium">{formattedPrice}</p>
                                </div>
                                <div className="border rounded-md p-4">
                                    <p className="text-sm text-text/60 dark:text-background/60">KomePon価格</p>
                                    <p className="text-lg font-medium text-accent2">{formattedKomePonPrice}</p>
                                </div>
                                <div className="border rounded-md p-4">
                                    <p className="text-sm text-text/60 dark:text-background/60">割引率</p>
                                    <p className="text-lg font-medium">{discountPercent}%</p>
                                </div>
                                <div className="border rounded-md p-4">
                                    <p className="text-sm text-text/60 dark:text-background/60">残り割引枠</p>
                                    <p className="text-lg font-medium">20枠</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                    <div>
                                        <h3 className="font-medium">KomePon割引が未設定</h3>
                                        <p className="text-sm text-text/70 dark:text-background/70">
                                            この商品にはKomePon割引が設定されていません。割引を設定すると、レビューを投稿した消費者が次回購入時に割引価格で購入できます。
                                        </p>
                                    </div>
                                    <div className="shrink-0">
                                        <Button>
                                            KomePonを設定する
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm text-text/70 dark:text-background/70">
                                KomePonを設定すると以下のメリットがあります：
                            </p>
                            <ul className="list-disc list-inside text-sm text-text/70 dark:text-background/70 space-y-1">
                                <li>消費者がレビューを投稿するインセンティブになります</li>
                                <li>レビューが増えることで他の購入検討者の判断材料になります</li>
                                <li>リピート率が向上します</li>
                                <li>評価の高い農家ほど、KomePon予算の配分が増えます</li>
                            </ul>
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <div className="w-full">
                        <Link href="/farmer/komepon">
                            <Button variant="outline" size="sm" className="w-full md:w-auto">
                                KomePon管理ページへ
                            </Button>
                        </Link>
                    </div>
                </CardFooter>
            </Card>

            {/* Product Details Section */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>商品詳細</CardTitle>
                    <Button variant="outline" size="sm">
                        詳細を編集
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-medium mb-2">基本情報</h3>
                            <dl className="space-y-2">
                                <div className="grid grid-cols-3 gap-1">
                                    <dt className="text-sm text-text/60 dark:text-background/60">品種</dt>
                                    <dd className="text-sm col-span-2">{product.details?.variety || '-'}</dd>
                                </div>
                                <div className="grid grid-cols-3 gap-1">
                                    <dt className="text-sm text-text/60 dark:text-background/60">重量</dt>
                                    <dd className="text-sm col-span-2">{product.details?.weightKg ? `${product.details.weightKg}kg` : '-'}</dd>
                                </div>
                            </dl>
                        </div>
                        {/* Note: 栽培方法などの情報はスキーマ更新により削除されました */}
                    </div>
                </CardContent>
            </Card>

            {/* Reviews Section */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">消費者レビュー</h2>
                    <span className="text-sm text-text/60 dark:text-background/60">
                        平均評価: {product.rating.toFixed(1)}/5 ({product.reviewCount}件)
                    </span>
                </div>

                {reviews.length > 0 ? (
                    <div className="space-y-6">
                        {reviews.map((review) => (
                            <Card key={review.id}>
                                <CardContent className="pt-6">
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                                <div className="flex items-center">
                                                    <div className="flex items-center mr-2">
                                                        {[...Array(5)].map((_, i) => (
                                                            <svg
                                                                key={i}
                                                                className={`w-5 h-5 ${i < review.rating
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
                                                    <h3 className="text-lg font-bold">{review.title}</h3>
                                                </div>
                                                <div className="text-sm text-text/60 dark:text-background/60">
                                                    投稿日: {new Date(review.createdAt).toLocaleDateString('ja-JP')}
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-2 my-3">
                                                <div className="relative w-6 h-6 rounded-full overflow-hidden">
                                                    <Image
                                                        src={review.user.iconImageUrl || '/placeholder-avatar.jpg'}
                                                        alt={review.user.handleName || '匿名ユーザー'}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <span className="text-sm text-gray-600 dark:text-gray-400">{review.user.handleName || '匿名ユーザー'}</span>
                                                {review.komePonEarned && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-100">
                                                        KomePon獲得済み
                                                    </span>
                                                )}
                                            </div>

                                            <p className="text-gray-700 dark:text-gray-300 mb-4">{review.content}</p>

                                            {review.imageUrls && review.imageUrls.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-3">
                                                    {review.imageUrls.map((url: string, idx: number) => (
                                                        <div key={idx} className="relative w-24 h-24 rounded-md overflow-hidden">
                                                            <Image
                                                                src={url}
                                                                alt={`レビュー画像 ${idx + 1}`}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {product.reviewCount > 3 && (
                            <div className="text-center mt-4">
                                <Button variant="outline">
                                    すべてのレビューを見る（{product.reviewCount}件）
                                </Button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="p-6">
                            <p className="text-center text-gray-500 dark:text-gray-400">
                                この商品にはまだレビューがありません。
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
