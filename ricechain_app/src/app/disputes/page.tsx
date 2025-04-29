'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/lib/app-context';

export default function DisputesPage() {
  const { disputes, user, useMockData } = useAppContext();
  const [activeTab, setActiveTab] = useState<'all' | 'jury'>('all');
  
  // Filter disputes that need jury
  const juryDisputes = disputes.filter(d => d.status === 'in_jury');
  
  // Filter disputes that involve the current user
  const userDisputes = disputes.filter(d => d.buyerId === user?.id || d.sellerId === user?.id);
  
  // Determine which disputes to display based on the active tab
  const displayDisputes = activeTab === 'all' ? userDisputes : juryDisputes;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">紛争解決センター</h1>
        <p className="text-gray-600 dark:text-gray-400">
          取引に関する問題を解決するためのプラットフォームです。
        </p>
      </div>

      {/* Tab navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === 'all'
              ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('all')}
        >
          自分の紛争
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === 'jury'
              ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('jury')}
        >
          陪審員として参加 
          {juryDisputes.length > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {juryDisputes.length}
            </span>
          )}
        </button>
      </div>

      {/* Disputes list */}
      <div className="space-y-6">
        {displayDisputes.length > 0 ? (
          displayDisputes.map((dispute) => (
            <Card key={dispute.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">紛争 #{dispute.id.substring(0, 4)}</CardTitle>
                  <div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      dispute.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                      dispute.status === 'in_chat' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                      dispute.status === 'in_jury' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' :
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    }`}>
                      {dispute.status === 'pending' ? '処理待ち' :
                       dispute.status === 'in_chat' ? '当事者間チャット中' :
                       dispute.status === 'in_jury' ? '陪審員審議中' :
                       '解決済み'}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">紛争理由</h3>
                      <p className="text-gray-900 dark:text-white">{dispute.reason}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">注文番号</h3>
                      <p className="text-gray-900 dark:text-white">#{dispute.orderId}</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">当事者の主張</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                        <div className="flex items-center mb-2">
                          <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2">
                            <Image
                              src="https://randomuser.me/api/portraits/men/32.jpg"
                              alt="買い手"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <p className="font-medium">買い手の主張</p>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{dispute.buyerStatement}</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                        <div className="flex items-center mb-2">
                          <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2">
                            <Image
                              src="https://randomuser.me/api/portraits/men/67.jpg"
                              alt="売り手"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <p className="font-medium">売り手の主張</p>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{dispute.sellerStatement}</p>
                      </div>
                    </div>
                  </div>
                  
                  {dispute.status === 'in_chat' && (
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">最近のチャット</h3>
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md max-h-40 overflow-y-auto">
                        {dispute.chatMessages.slice(-3).map((message) => (
                          <div key={message.id} className="mb-2 last:mb-0">
                            <p className="text-xs text-gray-500 dark:text-gray-400">{message.senderName} - {new Date(message.createdAt).toLocaleString('ja-JP')}</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{message.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {dispute.status === 'in_jury' && (
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">陪審員の投票状況</h3>
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm">投票済み: {dispute.juryVotes}/{dispute.jurySize}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            残り{dispute.jurySize - dispute.juryVotes}票で決定
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div
                            className="bg-primary-600 h-2.5 rounded-full"
                            style={{ width: `${Math.round((dispute.juryVotes / dispute.jurySize) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {dispute.status === 'resolved' && (
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">解決結果</h3>
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
                        <p className="font-medium text-green-800 dark:text-green-300 mb-1">{dispute.resolution}</p>
                        {dispute.compensation && (
                          <p className="text-sm text-green-700 dark:text-green-400">
                            補償額: 注文金額の{dispute.compensation}%
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    {activeTab === 'all' ? (
                      <Link href={`/disputes/${dispute.id}`}>
                        <Button>
                          {dispute.status === 'in_chat' ? 'チャットを続ける' : 
                           dispute.status === 'in_jury' ? '詳細を見る' : 
                           dispute.status === 'resolved' ? '詳細を見る' : 
                           'チャットを開始する'}
                        </Button>
                      </Link>
                    ) : (
                      <Link href={`/disputes/${dispute.id}/jury`}>
                        <Button>
                          陪審員として参加する
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
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
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {activeTab === 'all' ? '紛争はありません' : '陪審員として参加できる紛争はありません'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {activeTab === 'all' 
                  ? '現在、あなたが関わっている紛争はありません。' 
                  : '現在、陪審員として参加できる紛争はありません。'}
              </p>
              {activeTab === 'all' && (
                <Link href="/orders">
                  <Button>
                    注文履歴を確認する
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>
      
      {useMockData && (
        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            <span className="font-medium">モックモード:</span> 実際のブロックチェーンとは接続していません。右上の「モック」ボタンからモードを切り替えられます。
          </p>
          <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-2">
            このデモでは、紛争解決プロセスの流れを確認できます。実際のアプリでは、ブロックチェーン上で透明かつ安全に紛争が解決されます。
          </p>
        </div>
      )}
    </div>
  );
}
