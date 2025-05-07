'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.orderId as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // 注文データを取得
  useEffect(() => {
    async function fetchOrder() {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch order');
        }
        const data = await response.json();
        setOrder(data.order);
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('注文情報の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    }

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  // 画像アップロード処理
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setImages(prevImages => [...prevImages, ...fileArray].slice(0, 5)); // 最大5枚まで
    }
  };

  // 画像削除処理
  const removeImage = (index: number) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  // レビュー投稿処理
  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      alert('評価を選択してください');
      return;
    }

    if (content.length < 100) {
      alert('レビュー内容は100文字以上入力してください');
      return;
    }

    setSubmitting(true);

    try {
      // FormDataにレビュー情報をセット
      const formData = new FormData();
      formData.append('orderId', orderId);
      formData.append('rating', rating.toString());
      formData.append('title', title);
      formData.append('content', content);

      // 画像があれば追加
      images.forEach(image => {
        formData.append('images', image);
      });

      // APIにPOSTリクエスト
      const response = await fetch('/api/reviews', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      // 成功したら注文詳細ページにリダイレクト
      router.push(`/consumer/orders/${orderId}?reviewSuccess=true`);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('レビューの投稿に失敗しました。もう一度お試しください。');
    } finally {
      setSubmitting(false);
    }
  };

  // レビューが既に投稿済みかチェック
  if (!loading && order?.reviewSubmitted) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          この注文のレビューは既に投稿済みです
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          同じ注文に対して複数のレビューを投稿することはできません。
        </p>
        <Link href="/consumer/orders">
          <Button>注文履歴に戻る</Button>
        </Link>
      </div>
    );
  }

  // 完了していない注文の場合もエラーページを表示
  if (!loading && order?.status !== 'completed') {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          レビューを投稿できません
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          注文が完了した後にレビューを投稿することができます。
        </p>
        <Link href="/consumer/orders">
          <Button>注文履歴に戻る</Button>
        </Link>
      </div>
    );
  }

  // エラーページ
  if (error) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          エラーが発生しました
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {error}
        </p>
        <Link href="/consumer/orders">
          <Button>注文履歴に戻る</Button>
        </Link>
      </div>
    );
  }

  // ローディング表示
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">レビューを書く</h1>
        <p className="text-gray-600 dark:text-gray-400">
          商品のレビューを投稿して、次回購入時に使えるKomePon値引きを獲得しましょう。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <form onSubmit={submitReview}>
              <CardHeader>
                <CardTitle>レビューフォーム</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label htmlFor="rating" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    評価
                  </label>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`${rating >= star
                            ? 'text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600 hover:text-yellow-400 dark:hover:text-yellow-400'
                          }`}
                        onClick={() => setRating(star)}
                      >
                        <svg
                          className="w-8 h-8"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    タイトル
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800"
                    placeholder="レビューのタイトルを入力してください"
                  />
                </div>

                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    レビュー内容
                  </label>
                  <textarea
                    id="content"
                    rows={6}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800"
                    placeholder="商品の感想を詳しく教えてください"
                  ></textarea>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    最低100文字以上入力してください。KomePon値引きを獲得するには、具体的な感想や使用感を詳しく書くことをおすすめします。
                    <span className="ml-1 font-medium">{content.length}/100文字</span>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    写真を追加（任意）
                  </label>

                  {/* アップロード済み画像のプレビュー */}
                  {images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative w-24 h-24">
                          <Image
                            src={URL.createObjectURL(image)}
                            alt={`アップロード画像 ${index + 1}`}
                            fill
                            className="object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 画像アップロードエリア */}
                  {images.length < 5 && (
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="dropzone-file"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 hover:bg-gray-100 dark:border-gray-600"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">クリックしてアップロード</span>
                            またはドラッグ＆ドロップ
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            PNG, JPG, GIF (最大 5MB)
                          </p>
                        </div>
                        <input
                          id="dropzone-file"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          multiple
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                  )}

                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    写真を追加すると、より多くのユーザーにあなたのレビューが参考になります。
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={submitting}
                >
                  キャンセル
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? 'レビューを投稿中...' : 'レビューを投稿'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>レビュー対象商品</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order?.items?.map((item: any) => (
                <div key={item.id} className="flex space-x-4">
                  <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product?.imageUrl || '/placeholder-product.jpg'}
                      alt={item.product?.name || '商品名'}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {item.product?.name || '商品名'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {order.seller?.handleName || '出品者名'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      数量: {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>KomePonについて</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                レビューを投稿すると、次回購入時に使える<strong>KomePon値引き</strong>を獲得できます。
              </p>
              <div className="bg-primary-50 dark:bg-primary-900 p-4 rounded-md">
                <h4 className="font-medium text-primary-700 dark:text-primary-300 mb-2">
                  KomePon値引きの条件
                </h4>
                <ul className="text-sm text-primary-700 dark:text-primary-300 list-disc list-inside space-y-1">
                  <li>100文字以上の具体的なレビュー</li>
                  <li>AIによる内容チェックに合格</li>
                  <li>写真付きレビューがより効果的</li>
                </ul>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                獲得したKomePon値引きは、次回購入時に自動的に適用されます。
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
