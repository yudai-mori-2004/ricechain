'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useAppContext } from '@/lib/app-context';
import { Dispute, ChatMessage } from '@/lib/app-context';

export default function DisputeDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { disputes, updateDispute, user, useMockData } = useAppContext();
  const [dispute, setDispute] = useState<Dispute | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Fetch dispute data
  useEffect(() => {
    const fetchDispute = () => {
      const foundDispute = disputes.find(d => d.id === params.id);
      if (foundDispute) {
        setDispute(foundDispute);
      }
      setLoading(false);
    };

    fetchDispute();
  }, [params.id, disputes]);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [dispute?.chatMessages]);

  const handleSendMessage = () => {
    if (!message.trim() || !dispute || !user) return;
    
    setIsSending(true);
    
    // Create a new chat message
    const newMessage: ChatMessage = {
      id: `cm${Math.floor(Math.random() * 10000)}`,
      disputeId: dispute.id,
      senderId: user.id,
      senderName: user.name,
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };
    
    // Add the message to the dispute
    const updatedDispute: Dispute = {
      ...dispute,
      chatMessages: [...dispute.chatMessages, newMessage],
      updatedAt: new Date().toISOString(),
    };
    
    // Simulate a delay for the message sending
    setTimeout(() => {
      // Update the dispute in the context
      updateDispute(dispute.id, updatedDispute);
      
      // Clear the message input
      setMessage('');
      
      setIsSending(false);
      
      // If this is a chat with 72 hours passed, simulate moving to jury phase
      if (dispute.status === 'in_chat' && dispute.chatMessages.length >= 5) {
        // Check if the first message is more than 72 hours old
        const firstMessageTime = new Date(dispute.chatMessages[0].createdAt).getTime();
        const currentTime = new Date().getTime();
        const hoursPassed = (currentTime - firstMessageTime) / (1000 * 60 * 60);
        
        if (hoursPassed >= 72) {
          // Move to jury phase after a delay
          setTimeout(() => {
            const juryDispute: Dispute = {
              ...updatedDispute,
              status: 'in_jury',
              updatedAt: new Date().toISOString(),
            };
            
            updateDispute(dispute.id, juryDispute);
          }, 2000);
        }
      }
    }, 500);
  };

  const handleEscalateToJury = () => {
    if (!dispute) return;
    
    // Update the dispute status to in_jury
    const updatedDispute: Dispute = {
      ...dispute,
      status: 'in_jury',
      updatedAt: new Date().toISOString(),
    };
    
    // Update the dispute in the context
    updateDispute(dispute.id, updatedDispute);
    
    // Redirect to the disputes page
    router.push('/disputes');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!dispute) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          紛争が見つかりません
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          指定された紛争は存在しないか、削除された可能性があります。
        </p>
        <Link href="/disputes">
          <Button>紛争一覧に戻る</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">紛争 #{dispute.id.substring(0, 4)}</h1>
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
        <p className="text-gray-600 dark:text-gray-400">
          注文 #{dispute.orderId} に関する紛争
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>チャット</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden">
              {dispute.status === 'in_chat' ? (
                <div className="flex flex-col h-full">
                  <div className="flex-grow overflow-y-auto mb-4 space-y-4 max-h-[50vh]">
                    {dispute.chatMessages.map((chatMessage) => {
                      const isSelf = chatMessage.senderId === user?.id;
                      return (
                        <div
                          key={chatMessage.id}
                          className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[80%] ${isSelf ? 'bg-primary-100 dark:bg-primary-900' : 'bg-gray-100 dark:bg-gray-800'} rounded-lg p-3`}>
                            <div className="flex items-center mb-1">
                              {!isSelf && (
                                <div className="relative w-6 h-6 rounded-full overflow-hidden mr-2">
                                  <Image
                                    src={chatMessage.senderId === dispute.buyerId ? 'https://randomuser.me/api/portraits/men/32.jpg' : 'https://randomuser.me/api/portraits/men/67.jpg'}
                                    alt={chatMessage.senderName}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              )}
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {chatMessage.senderName} - {new Date(chatMessage.createdAt).toLocaleString('ja-JP')}
                              </p>
                            </div>
                            <p className="text-gray-800 dark:text-gray-200">{chatMessage.message}</p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={chatEndRef} />
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex">
                      <input
                        type="text"
                        placeholder="メッセージを入力..."
                        className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        disabled={isSending}
                      />
                      <Button
                        className="rounded-l-none"
                        onClick={handleSendMessage}
                        disabled={!message.trim() || isSending}
                      >
                        {isSending ? '送信中...' : '送信'}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      72時間以内に解決しない場合、この紛争は陪審員による審議に移行します。
                    </p>
                  </div>
                </div>
              ) : dispute.status === 'in_jury' ? (
                <div className="space-y-4">
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-md">
                    <h3 className="font-medium text-purple-800 dark:text-purple-300 mb-2">陪審員による審議中</h3>
                    <p className="text-sm text-purple-700 dark:text-purple-400">
                      この紛争は現在、陪審員による審議中です。陪審員の投票結果に基づいて解決されます。
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md max-h-[50vh] overflow-y-auto space-y-4">
                    {dispute.chatMessages.map((chatMessage) => (
                      <div key={chatMessage.id} className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0 last:pb-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {chatMessage.senderName} - {new Date(chatMessage.createdAt).toLocaleString('ja-JP')}
                        </p>
                        <p className="text-gray-800 dark:text-gray-200">{chatMessage.message}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">陪審員の投票状況</h3>
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
              ) : dispute.status === 'resolved' ? (
                <div className="space-y-4">
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md">
                    <h3 className="font-medium text-green-800 dark:text-green-300 mb-2">紛争解決済み</h3>
                    <p className="text-sm text-green-700 dark:text-green-400">
                      この紛争は解決されました。
                    </p>
                    <p className="font-medium text-green-800 dark:text-green-300 mt-2">{dispute.resolution}</p>
                    {dispute.compensation && (
                      <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                        補償額: 注文金額の{dispute.compensation}%
                      </p>
                    )}
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md max-h-[50vh] overflow-y-auto space-y-4">
                    {dispute.chatMessages.map((chatMessage) => (
                      <div key={chatMessage.id} className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0 last:pb-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {chatMessage.senderName} - {new Date(chatMessage.createdAt).toLocaleString('ja-JP')}
                        </p>
                        <p className="text-gray-800 dark:text-gray-200">{chatMessage.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 dark:text-gray-400">チャットはまだ開始されていません。</p>
                </div>
              )}
            </CardContent>
            {dispute.status === 'in_chat' && (
              <CardFooter className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <Button
                  variant="outline"
                  className="text-red-600 dark:text-red-400 border-red-600 dark:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={handleEscalateToJury}
                >
                  陪審員による審議に移行する
                </Button>
                <p className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                  当事者間で解決できない場合、陪審員による審議に移行できます。
                </p>
              </CardFooter>
            )}
          </Card>
        </div>

        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>紛争の詳細</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">紛争理由</h3>
                <p className="text-gray-900 dark:text-white">{dispute.reason}</p>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">当事者</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2">
                      <Image
                        src="https://randomuser.me/api/portraits/men/32.jpg"
                        alt="買い手"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">買い手</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">消費者</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2">
                      <Image
                        src="https://randomuser.me/api/portraits/men/67.jpg"
                        alt="売り手"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">売り手</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">農家</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">主張</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">買い手の主張:</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{dispute.buyerStatement}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">売り手の主張:</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{dispute.sellerStatement}</p>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">タイムライン</h3>
                <div className="space-y-2">
                  <div className="flex">
                    <div className="w-4 h-4 rounded-full bg-blue-500 mt-1 mr-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">紛争開始</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(dispute.createdAt).toLocaleString('ja-JP')}
                      </p>
                    </div>
                  </div>
                  {dispute.status !== 'pending' && (
                    <div className="flex">
                      <div className="w-4 h-4 rounded-full bg-blue-500 mt-1 mr-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">チャット開始</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(dispute.chatMessages[0]?.createdAt || dispute.createdAt).toLocaleString('ja-JP')}
                        </p>
                      </div>
                    </div>
                  )}
                  {dispute.status === 'in_jury' && (
                    <div className="flex">
                      <div className="w-4 h-4 rounded-full bg-purple-500 mt-1 mr-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">陪審員審議開始</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(dispute.updatedAt).toLocaleString('ja-JP')}
                        </p>
                      </div>
                    </div>
                  )}
                  {dispute.status === 'resolved' && (
                    <div className="flex">
                      <div className="w-4 h-4 rounded-full bg-green-500 mt-1 mr-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">紛争解決</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(dispute.updatedAt).toLocaleString('ja-JP')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Link href="/disputes">
            <Button variant="outline" className="w-full">
              紛争一覧に戻る
            </Button>
          </Link>
        </div>
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
