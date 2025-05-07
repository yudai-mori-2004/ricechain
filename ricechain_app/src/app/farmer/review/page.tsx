'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function FarmerReviewPage() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [farmerInfo, setFarmerInfo] = useState<any>(null);

    // データの取得
    useEffect(() => {
        async function fetchData() {
            try {
                // 現在の農家ユーザー情報を取得
                const userResponse = await fetch('/api/me');
                const userData = await userResponse.json();
                setFarmerInfo(userData.user);

                if (!userData.user || !userData.user.id) {
                    setLoading(false);
                    return;
                }

                // 農家に関連するレビューを取得
                const reviewsResponse = await fetch(`/api/reviews?farmerId=${userData.user.id}`);
                const reviewsData = await reviewsResponse.json();
                setReviews(reviewsData.reviews || []);

                setLoading(false);
            } catch (error) {
                console.error('データの取得に失敗しました:', error);
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    // ローディング中の表示
    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    // 農家情報が取得できなかった場合
    if (!farmerInfo) {
        return (
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    農家情報が見つかりません
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                    ログインしてください。
                </p>
            </div>
        );
    }

    // 平均評価を計算
    const avgRating = reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">レビュー</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    消費者からのレビューを確認できます。
                </p>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle>レビュー概要</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                                {reviews.length}
                            </span>
                            <span className="text-gray-600 dark:text-gray-400">レビュー数</span>
                        </div>
                        <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="flex items-center">
                                <span className="text-3xl font-bold text-primary-600 dark:text-primary-400 mr-1">
                                    {avgRating.toFixed(1)}
                                </span>
                                <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                </svg>
                            </div>
                            <span className="text-gray-600 dark:text-gray-400">平均評価</span>
                        </div>
                        <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                                {reviews.filter(review => review.komePonEarned).length}
                            </span>
                            <span className="text-gray-600 dark:text-gray-400">KomePon付与数</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">レビュー一覧</h2>
                {reviews.length > 0 ? (
                    <div className="space-y-6">
                        {reviews.map((review) => (
                            <Card key={review.id}>
                                <CardContent className="pt-6">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="w-full md:w-1/4">
                                            <div className="relative h-48 w-full rounded-md overflow-hidden mb-3">
                                                <Image
                                                    src={review.product?.imageUrl || '/placeholder-product.jpg'}
                                                    alt={review.product?.name || '商品名'}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <h3 className="text-lg font-medium">{review.product?.name || '商品名'}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(review.createdAt).toLocaleDateString('ja-JP')}
                                            </p>
                                        </div>
                                        <div className="w-full md:w-3/4">
                                            <div className="flex items-center mb-2">
                                                <div className="flex items-center mr-2">
                                                    {[...Array(5)].map((_, i) => (
                                                        <svg
                                                            key={i}
                                                            className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
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
                                            <div className="flex items-center space-x-2 mb-3">
                                                <div className="relative w-6 h-6 rounded-full overflow-hidden">
                                                    <Image
                                                        src={review.user?.iconImageUrl || '/placeholder-avatar.jpg'}
                                                        alt={review.user?.handleName || '匿名ユーザー'}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    {review.user?.handleName || '匿名ユーザー'}
                                                </span>
                                                {review.komePonEarned && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-100">
                                                        KomePon獲得
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-700 dark:text-gray-300 mb-4">{review.content}</p>
                                            {review.imageUrls && review.imageUrls.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-3">
                                                    {review.imageUrls.map((url: string, idx: number) => (
                                                        <div key={idx} className="relative w-20 h-20 rounded-md overflow-hidden">
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
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg max-w-2xl mx-auto">
                            <h3 className="text-xl font-medium mb-3">まだレビューがありません</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                消費者からのレビューはまだ投稿されていません。商品が購入され、取引が完了すると、消費者がレビューを投稿できるようになります。
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle>レビューについて</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <p className="text-gray-700 dark:text-gray-300">
                            消費者のレビューは、あなたの商品の品質向上に役立つだけでなく、KomePonシステムを通じて消費者の購買意欲を高める重要な要素です。
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                                <h3 className="font-medium text-gray-900 dark:text-white mb-2">レビューの活用方法</h3>
                                <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                                    <li>消費者のフィードバックを商品改善に活用</li>
                                    <li>高評価レビューを商品ページで紹介</li>
                                    <li>消費者の声を参考に新商品開発</li>
                                </ul>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                                <h3 className="font-medium text-gray-900 dark:text-white mb-2">KomePonとの関連</h3>
                                <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                                    <li>レビュー投稿者には次回購入時の値引き特典</li>
                                    <li>評価が高いほどKomePon予算配分が増加</li>
                                    <li>KomePoを通じてリピート購入を促進</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Link href="/farmer/komepon">
                        <Button variant="outline">KomePon設定を確認</Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
