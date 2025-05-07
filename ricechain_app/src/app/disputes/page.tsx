'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDisputes } from '@/hooks/useDisputes';

export default function DisputesPage() {
  const { disputes, loading } = useDisputes();

  // デベロッパーモードかどうか（実際のアプリでは環境変数などで管理）
  const useMockData = process.env.NODE_ENV === 'development';

  // Filter disputes that need jury
  const juryDisputes = disputes.filter(d => d.status === 'in_jury');

  // Only show disputes where the user can participate as a juror
  const displayDisputes = juryDisputes;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">紛争解決センター</h1>
          <p className="text-gray-600 dark:text-gray-400">
            取引に関する問題を解決するためのプラットフォームです。第三者による公平な審議で透明性の高い解決を提供します。
          </p>
        </div>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/10 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-blue-800 dark:text-blue-300">陪審員参加依頼</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-700 dark:text-blue-400 mb-6">
              あなたが陪審員に選ばれました。ステークをし、陪審員としてこの紛争解決に協力しますか？
            </p>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-blue-200 dark:border-blue-800 mb-4">
              <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">陪審員ステーキングについて</h3>
              <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                <p>陪審員として参加するには、取引金額の1%をステークする必要があります。このステークは、あなたの公平な判断を促すための仕組みです。</p>
                <ul className="list-disc list-inside space-y-1 pl-1">
                  <li>最小ステーク金額: 50円 / 最大ステーク金額: 500円</li>
                  <li>小額取引（2,500円未満）の場合: 25円をステーク、報酬は50円</li>
                  <li>大額取引（50,000円以上）の場合: 500円をステーク、報酬は1,000円</li>
                  <li>中間金額の取引の場合: 取引額の1%をステーク、報酬はステーク額の2倍</li>
                </ul>
                <p className="font-medium mt-2">多数派と同じ判断をした場合、ステーク額の2倍が返還されます。少数派の場合はステーク額が没収されます。</p>
              </div>
            </div>

            {juryDisputes.length > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800">
                  新規依頼 {juryDisputes.length}件
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Disputes list */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">陪審員として参加可能な紛争</h2>

          {displayDisputes.length > 0 ? (
            displayDisputes.map((dispute) => (
              <Card key={dispute.id} className="overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">紛争 #{dispute.id.substring(0, 4)}</CardTitle>
                      <Badge
                        className={dispute.status === 'in_jury'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                        }
                      >
                        陪審員審議中
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(dispute.createdAt).toLocaleDateString('ja-JP')}
                    </span>
                  </div>
                  <CardDescription>注文番号: {dispute.orderId}</CardDescription>
                </CardHeader>

                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">紛争理由</h3>
                      <p className="text-sm">{dispute.reason}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">ステーキング情報</h3>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md text-sm">
                        {(() => {
                          // Calculate stake amount based on order value
                          // This is a placeholder calculation - in real app you'd get the actual order value
                          const orderValue = 15000; // Sample value, this would come from the order data

                          let stakeAmount = Math.round(orderValue * 0.01); // 1% of order value
                          let rewardAmount = stakeAmount * 2;

                          // Apply minimum and maximum limits
                          if (orderValue < 2500) {
                            stakeAmount = 25;
                            rewardAmount = 50;
                          } else if (orderValue > 50000) {
                            stakeAmount = 500;
                            rewardAmount = 1000;
                          }

                          return (
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="font-medium">必要ステーク額:</span>
                                <span className="font-medium text-blue-700 dark:text-blue-300">{stakeAmount}円</span>
                              </div>
                              <div className="flex justify-between">
                                <span>多数派の場合の報酬:</span>
                                <span className="text-green-600 dark:text-green-400">{rewardAmount}円</span>
                              </div>
                              <div className="flex justify-between">
                                <span>少数派の場合:</span>
                                <span className="text-red-600 dark:text-red-400">ステーク額没収</span>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mb-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">当事者の主張</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="relative w-6 h-6 rounded-full overflow-hidden">
                            <Image
                              src="https://randomuser.me/api/portraits/men/32.jpg"
                              alt="買い手"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="font-medium text-sm">買い手の主張</span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                          {/* バイヤーの陳述はチャットメッセージから再構築する必要があるため、仮テキスト表示 */}
                          商品が説明と異なり、期待していた品質ではありませんでした。
                        </p>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="relative w-6 h-6 rounded-full overflow-hidden">
                            <Image
                              src="https://randomuser.me/api/portraits/men/67.jpg"
                              alt="売り手"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="font-medium text-sm">売り手の主張</span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                          {/* 販売者の陳述はチャットメッセージから再構築する必要があるため、仮テキスト表示 */}
                          商品は説明通りの品質で発送しており、写真にも詳細を記載しています。
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">陪審員の投票状況</h3>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">投票済み: {dispute.buyerVoteCount + dispute.sellerVoteCount}/{dispute.requiredJurors}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">残り{dispute.requiredJurors - (dispute.buyerVoteCount + dispute.sellerVoteCount)}票で決定</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
                      <div
                        className="bg-primary-600 h-2.5 rounded-full"
                        style={{ width: `${Math.round(((dispute.buyerVoteCount + dispute.sellerVoteCount) / dispute.requiredJurors) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="border-t border-gray-100 dark:border-gray-800 pt-4 flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => window.open(`/disputes/${dispute.id}`, '_blank')}
                  >
                    詳細を見る
                  </Button>
                  <Link href={`/disputes/${dispute.id}/jury`}>
                    <Button>
                      ステークして参加する
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))
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
                    d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01"
                  />
                </svg>
                <h3 className="text-xl font-semibold mb-2">
                  陪審員として参加できる紛争はありません
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  現在、陪審員として参加できる紛争はありません。新たな紛争が発生し、あなたが陪審員に選ばれると、ここに表示されます。
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {useMockData && (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border border-yellow-200 dark:border-yellow-900/50">
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              <span className="font-medium">モックモード:</span> 実際のブロックチェーンとは接続していません。右上の「モック」ボタンからモードを切り替えられます。
            </p>
            <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-2">
              このデモでは、紛争解決プロセスの流れを確認できます。実際のアプリでは、ブロックチェーン上で透明かつ安全に紛争が解決されます。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
