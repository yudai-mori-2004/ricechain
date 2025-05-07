'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/contexts/auth-context';
import { Dispute, ChatMessage } from '@/contexts/auth-context';

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">処理待ち</Badge>;
      case 'in_chat':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">当事者間チャット中</Badge>;
      case 'in_jury':
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">陪審員審議中</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">解決済み</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">不明</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!dispute) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">紛争が見つかりません</h1>
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
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold">紛争 #{dispute.id.substring(0, 4)}</h1>
              {getStatusBadge(dispute.status)}
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              注文 #{dispute.orderId} に関する紛争
            </p>
          </div>
          <Link href="/disputes">
            <Button variant="outline">紛争一覧に戻る</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="h-full flex flex-col shadow-sm border-gray-200 dark:border-gray-800">
              <CardHeader className="border-b border-gray-100 dark:border-gray-800">
                <CardTitle className="text-xl">チャット</CardTitle>
                <CardDescription>
                  {dispute.status === 'in_chat'
                    ? '72時間以内に解決しない場合、この紛争は陪審員による審議に移行します。'
                    : dispute.status === 'in_jury'
                      ? '現在、陪審員による審議が行われています。'
                      : dispute.status === 'resolved'
                        ? '紛争は解決済みです。'
                        : '紛争は審査中です。'
                  }
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-grow overflow-hidden p-0">
                {dispute.status === 'in_chat' ? (
                  <div className="flex flex-col h-full">
                    <div className="flex-grow overflow-y-auto p-4 space-y-4 max-h-[50vh] min-h-[30vh] bg-gray-50 dark:bg-gray-900">
                      {dispute.chatMessages.length === 0 ? (
                        <div className="flex justify-center items-center h-full">
                          <p className="text-gray-500 dark:text-gray-400">チャットはまだ始まっていません。最初のメッセージを送信してください。</p>
                        </div>
                      ) : (
                        dispute.chatMessages.map((chatMessage) => {
                          const isSelf = chatMessage.senderId === user?.id;
                          return (
                            <div
                              key={chatMessage.id}
                              className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`max-w-[80%] rounded-lg p-3 shadow-sm ${isSelf
                                ? 'bg-primary-50 dark:bg-primary-900/20 text-gray-800 dark:text-gray-100'
                                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                                }`}>
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
                                    {chatMessage.senderName}
                                  </p>
                                  <span className="mx-2 text-gray-400">•</span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(chatMessage.createdAt).toLocaleString('ja-JP', {
                                      month: 'numeric',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                                <p className="text-sm whitespace-pre-wrap">{chatMessage.message}</p>
                              </div>
                            </div>
                          );
                        })
                      )}
                      <div ref={chatEndRef} />
                    </div>
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex">
                        <textarea
                          placeholder="メッセージを入力..."
                          className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 min-h-[80px] resize-none"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.ctrlKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          disabled={isSending}
                        />
                        <div className="flex flex-col">
                          <Button
                            className="rounded-l-none h-full"
                            onClick={handleSendMessage}
                            disabled={!message.trim() || isSending}
                          >
                            {isSending ? '送信中...' : '送信'}
                          </Button>
                          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">Ctrl + Enter</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : dispute.status === 'in_jury' ? (
                  <div className="p-4 space-y-6">
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-md border border-purple-100 dark:border-purple-800">
                      <h3 className="font-medium text-purple-800 dark:text-purple-300 mb-2">陪審員による審議中</h3>
                      <p className="text-sm text-purple-700 dark:text-purple-400">
                        この紛争は現在、陪審員による審議中です。陪審員の投票結果に基づいて解決されます。
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">チャット履歴</h3>
                      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md p-4 max-h-[50vh] overflow-y-auto">
                        {dispute.chatMessages.map((chatMessage, index) => (
                          <div key={chatMessage.id} className={`pb-3 mb-3 ${index < dispute.chatMessages.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}>
                            <div className="flex items-center mb-1">
                              <div className="relative w-5 h-5 rounded-full overflow-hidden mr-2">
                                <Image
                                  src={chatMessage.senderId === dispute.buyerId ? 'https://randomuser.me/api/portraits/men/32.jpg' : 'https://randomuser.me/api/portraits/men/67.jpg'}
                                  alt={chatMessage.senderName}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <span className="text-xs font-medium">{chatMessage.senderName}</span>
                              <span className="mx-2 text-gray-400">•</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(chatMessage.createdAt).toLocaleString('ja-JP', {
                                  month: 'numeric',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            <p className="text-sm text-gray-800 dark:text-gray-200 pl-7">{chatMessage.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">陪審員の投票状況</h3>
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm">投票済み: {dispute.juryVotes}/{dispute.jurySize}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">残り{dispute.jurySize - dispute.juryVotes}票で決定</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
                          <div
                            className="bg-primary-600 h-2.5 rounded-full"
                            style={{ width: `${Math.round((dispute.juryVotes / dispute.jurySize) * 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                            <span>買い手側: {dispute.buyerVoteCount}</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                            <span>売り手側: {dispute.sellerVoteCount}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : dispute.status === 'resolved' ? (
                  <div className="p-4 space-y-6">
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md border border-green-100 dark:border-green-800">
                      <h3 className="font-medium text-green-800 dark:text-green-300 mb-2">紛争解決済み</h3>
                      <p className="text-sm text-green-700 dark:text-green-400 mb-2">
                        この紛争は正常に解決されました。
                      </p>
                      <div className="font-medium text-green-800 dark:text-green-300">{dispute.resolution}</div>
                      {dispute.compensation && (
                        <div className="mt-2 text-sm text-green-700 dark:text-green-400">
                          補償額: 注文金額の{dispute.compensation}%
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">チャット履歴</h3>
                      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md p-4 max-h-[50vh] overflow-y-auto">
                        {dispute.chatMessages.map((chatMessage, index) => (
                          <div key={chatMessage.id} className={`pb-3 mb-3 ${index < dispute.chatMessages.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}>
                            <div className="flex items-center mb-1">
                              <div className="relative w-5 h-5 rounded-full overflow-hidden mr-2">
                                <Image
                                  src={chatMessage.senderId === dispute.buyerId ? 'https://randomuser.me/api/portraits/men/32.jpg' : 'https://randomuser.me/api/portraits/men/67.jpg'}
                                  alt={chatMessage.senderName}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <span className="text-xs font-medium">{chatMessage.senderName}</span>
                              <span className="mx-2 text-gray-400">•</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(chatMessage.createdAt).toLocaleString('ja-JP', {
                                  month: 'numeric',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            <p className="text-sm text-gray-800 dark:text-gray-200 pl-7">{chatMessage.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 flex items-center justify-center h-full">
                    <p className="text-gray-500 dark:text-gray-400">紛争は現在審査中です。もうしばらくお待ちください。</p>
                  </div>
                )}
              </CardContent>

              {dispute.status === 'in_chat' && (
                <CardFooter className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <Button
                    variant="destructive"
                    size="sm"
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

          <div className="space-y-6">
            <Card className="shadow-sm border-gray-200 dark:border-gray-800">
              <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-2">
                <CardTitle>紛争の詳細</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">紛争理由</h3>
                  <p className="text-sm">{dispute.reason}</p>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">取引内容</h3>
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md text-sm">
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">商品：</span>
                        <span>新潟県産コシヒカリ 5kg</span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">数量：</span>
                        <span>2点</span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">取引金額：</span>
                        <span>15,000円</span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">取引日：</span>
                        <span>2025年4月15日</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
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
                        <p className="font-medium text-sm">買い手</p>
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
                        <p className="font-medium text-sm">売り手</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">農家</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">主張</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">買い手の主張:</p>
                      <p className="text-sm">{dispute.buyerStatement}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">売り手の主張:</p>
                      <p className="text-sm">{dispute.sellerStatement}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">タイムライン</h3>
                  <div className="space-y-3">
                    <div className="flex">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mt-1 mr-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium">紛争開始</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(dispute.createdAt).toLocaleString('ja-JP', {
                            month: 'numeric',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    {dispute.status !== 'pending' && (
                      <div className="flex">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mt-1 mr-2 flex-shrink-0"></div>
                        <div>
                          <p className="text-sm font-medium">チャット開始</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(dispute.chatMessages[0]?.createdAt || dispute.createdAt).toLocaleString('ja-JP', {
                              month: 'numeric',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                    {dispute.status === 'in_jury' && (
                      <div className="flex">
                        <div className="w-3 h-3 rounded-full bg-purple-500 mt-1 mr-2 flex-shrink-0"></div>
                        <div>
                          <p className="text-sm font-medium">陪審員審議開始</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(dispute.updatedAt).toLocaleString('ja-JP', {
                              month: 'numeric',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                    {dispute.status === 'resolved' && (
                      <div className="flex">
                        <div className="w-3 h-3 rounded-full bg-green-500 mt-1 mr-2 flex-shrink-0"></div>
                        <div>
                          <p className="text-sm font-medium">紛争解決</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(dispute.updatedAt).toLocaleString('ja-JP', {
                              month: 'numeric',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {dispute.status === 'in_jury' && (
              <Card className="shadow-sm border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-purple-800 dark:text-purple-300">陪審員として参加</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-purple-700 dark:text-purple-400 mb-4">
                    この紛争の解決に陪審員として参加し、取引の透明性と公平性を向上させましょう。
                  </p>
                  <Link href={`/disputes/${dispute.id}/jury`}>
                    <Button className="w-full">
                      ステークして参加する
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {useMockData && (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-m
