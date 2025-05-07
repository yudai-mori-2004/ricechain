'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';

// 型定義
interface ChatMessage {
    id: string;
    disputeId: string;
    senderId: string;
    senderName: string;
    message: string;
    createdAt: string;
}

interface Dispute {
    id: string;
    orderId: string;
    buyerId: string;
    sellerId: string;
    reason: string;
    buyerStatement: string;
    sellerStatement: string;
    status: 'pending' | 'in_chat' | 'in_jury' | 'resolved';
    resolution: string | null;
    compensation: number | null;
    createdAt: string;
    updatedAt: string;
    jurySize: number;
    juryVotes: number;
    buyerVoteCount: number;
    chatMessages: ChatMessage[];
}

interface OrderItem {
    id: string;
    productId: string;
    orderId: string;
    quantity: number;
    price: number;
    product: {
        id: string;
        name: string;
        imageUrl: string;
        farmerId: string;
    };
}

interface ShippingAddress {
    id: string;
    name: string;
    postalCode: string;
    prefecture: string;
    city: string;
    address1: string;
    address2: string | null;
    phoneNumber: string;
}

interface Order {
    id: string;
    buyerId: string;
    sellerId: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    shippedAt: string | null;
    items: OrderItem[];
    seller: {
        id: string;
        handleName: string;
    };
    buyer: {
        id: string;
        handleName: string;
    };
    shippingAddress: ShippingAddress;
    dispute?: Dispute;
}

export default function ConsumerDisputePage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { user } = useAuth();
    const [order, setOrder] = useState<Order | null>(null);
    const [dispute, setDispute] = useState<Dispute | null>(null);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const messageEndRef = useRef<HTMLDivElement>(null);

    // Fetch order and dispute data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 注文データを取得
                const orderResponse = await fetch(`/api/orders/${params.id}`);
                if (!orderResponse.ok) {
                    router.push('/consumer/orders');
                    return;
                }

                const orderData = await orderResponse.json();
                setOrder(orderData.order);

                // 紛争データを取得
                const disputeResponse = await fetch(`/api/disputes?orderId=${params.id}`);
                if (!disputeResponse.ok) {
                    // 紛争が存在しない場合、注文詳細ページにリダイレクト
                    router.push(`/consumer/orders/${params.id}`);
                    return;
                }

                const disputeData = await disputeResponse.json();
                if (!disputeData.dispute) {
                    router.push(`/consumer/orders/${params.id}`);
                    return;
                }

                setDispute(disputeData.dispute);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [params.id, router]);

    // Scroll to bottom when messages change
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [dispute?.chatMessages]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !dispute || !user) return;

        setSending(true);

        try {
            // メッセージをAPIに送信
            const response = await fetch(`/api/disputes/${dispute.id}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: newMessage
                })
            });

            if (response.ok) {
                const result = await response.json();
                // 紛争データを更新（返却された紛争全体を使用）
                if (result.dispute) {
                    setDispute(result.dispute);
                } else {
                    // APIがまだ実装されていない場合や、返却形式が異なる場合のフォールバック
                    // クライアント側でメッセージを追加
                    const newMsg: ChatMessage = {
                        id: `cm${Date.now()}`,
                        disputeId: dispute.id,
                        senderId: user.id,
                        senderName: user.handleName || '購入者',
                        message: newMessage,
                        createdAt: new Date().toISOString(),
                    };

                    setDispute({
                        ...dispute,
                        chatMessages: [...dispute.chatMessages, newMsg]
                    });
                }
            } else {
                // エラー処理
                console.error('Failed to send message:', await response.text());
            }

            setNewMessage('');
        } catch (error) {
            console.error('Failed to send message:', error);

            // エラー時でもUIに反映するためにクライアント側で追加
            if (dispute) {
                const newMsg: ChatMessage = {
                    id: `cm${Date.now()}`,
                    disputeId: dispute.id,
                    senderId: user.id,
                    senderName: user.handleName || '購入者',
                    message: newMessage,
                    createdAt: new Date().toISOString(),
                };

                setDispute({
                    ...dispute,
                    chatMessages: [...dispute.chatMessages, newMsg]
                });
            }

            setNewMessage('');
        } finally {
            setSending(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('ja-JP', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending': return { text: '受付中', color: 'bg-yellow-100 text-yellow-800' };
            case 'in_chat': return { text: '交渉中', color: 'bg-blue-100 text-blue-800' };
            case 'in_jury': return { text: '陪審団審議中', color: 'bg-purple-100 text-purple-800' };
            case 'resolved': return { text: '解決済み', color: 'bg-green-100 text-green-800' };
            default: return { text: '不明', color: 'bg-gray-100 text-gray-800' };
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center h-64">
                    <p className="text-gray-500">読み込み中...</p>
                </div>
            </div>
        );
    }

    if (!dispute || !order) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center h-64">
                    <p className="text-gray-500">紛争が見つかりません</p>
                </div>
            </div>
        );
    }

    const { text: statusText, color: statusColor } = getStatusLabel(dispute.status);

    // Determine if current user is the buyer in this dispute
    const isBuyer = user?.id === dispute.buyerId;
    const yourStatement = isBuyer ? dispute.buyerStatement : dispute.sellerStatement;
    const theirStatement = isBuyer ? dispute.sellerStatement : dispute.buyerStatement;
    const otherPartyName = isBuyer
        ? order.seller.handleName
        : order.buyer.handleName;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Navigation */}
            <div className="flex items-center mb-6">
                <Link href={`/consumer/orders/${params.id}`} className="text-primary hover:text-primary-dark mr-4">
                    <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    注文詳細に戻る
                </Link>
            </div>

            {/* Dispute Header */}
            <Card className="mb-6">
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                        <div>
                            <CardTitle className="text-xl">紛争詳細</CardTitle>
                            <CardDescription>注文番号: {order.id.substring(0, 8)}</CardDescription>
                            <CardDescription>紛争理由: {dispute.reason}</CardDescription>
                            <CardDescription>開始日: {formatDate(dispute.createdAt)}</CardDescription>
                        </div>

                        <div className="flex items-center">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
                                {statusText}
                            </span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Your Statement */}
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-2">あなたの申し立て</h3>
                            <div className="p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800/30">
                                <p className="text-sm whitespace-pre-wrap">{yourStatement}</p>
                            </div>
                        </div>

                        {/* Their Statement */}
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-2">{otherPartyName}の申し立て</h3>
                            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                <p className="text-sm whitespace-pre-wrap">{theirStatement}</p>
                            </div>
                        </div>
                    </div>

                    {/* Resolution (if resolved) */}
                    {dispute.status === 'resolved' && (
                        <div className="mt-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30">
                            <h3 className="text-md font-medium text-green-800 dark:text-green-200 mb-2">解決結果</h3>
                            <p className="text-sm text-green-700 dark:text-green-300">{dispute.resolution}</p>
                            {dispute.compensation && (
                                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                                    補償額: 注文金額の{dispute.compensation}%
                                </p>
                            )}
                        </div>
                    )}

                    {/* Jury status (if in jury) */}
                    {dispute.status === 'in_jury' && (
                        <div className="mt-6 p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/30">
                            <h3 className="text-md font-medium text-purple-800 dark:text-purple-200 mb-2">第三者による審議状況</h3>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-purple-700 dark:text-purple-300">
                                        陪審団による審議中です（{dispute.juryVotes}/{dispute.jurySize}人が投票済み）
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="text-xs text-purple-700 dark:text-purple-300">あなた</div>
                                    <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-green-500"
                                            style={{ width: `${(dispute.buyerVoteCount / dispute.juryVotes) * 100}%` }}
                                        ></div>
                                    </div>
                                    <div className="text-xs text-purple-700 dark:text-purple-300">相手</div>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Message Exchange */}
            <Card className="shadow-lg">
                <CardHeader className="border-b">
                    <CardTitle className="text-lg">メッセージ履歴</CardTitle>
                </CardHeader>

                <div className="h-[50vh] overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
                    {dispute.chatMessages?.length === 0 ? (
                        <div className="flex justify-center items-center h-full">
                            <p className="text-gray-500">メッセージはまだありません</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {dispute.chatMessages?.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-lg p-3 ${msg.senderId === user?.id
                                            ? 'bg-primary-100 dark:bg-primary-900 text-gray-800 dark:text-gray-100'
                                            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                                            }`}
                                    >
                                        <div className="flex items-center mb-1">
                                            <span className={`text-xs font-medium ${msg.senderId === user?.id ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                                {msg.senderName}
                                            </span>
                                            <span className="mx-2 text-gray-400">•</span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {formatDate(msg.createdAt)}
                                            </span>
                                        </div>
                                        <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messageEndRef} />
                        </div>
                    )}
                </div>

                {/* Input field - only shown if dispute is in chat status */}
                {dispute.status === 'in_chat' && (
                    <CardFooter className="border-t p-4">
                        <div className="flex w-full space-x-2">
                            <textarea
                                className="flex-1 min-h-[80px] p-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="メッセージを入力..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && e.ctrlKey) {
                                        handleSendMessage();
                                    }
                                }}
                            />
                            <div className="flex flex-col justify-end">
                                <Button
                                    onClick={handleSendMessage}
                                    disabled={!newMessage.trim() || sending}
                                    className="h-10 px-4"
                                >
                                    {sending ? '送信中...' : '送信'}
                                </Button>
                                <span className="text-xs text-gray-500 mt-1 text-center">Ctrl + Enter</span>
                            </div>
                        </div>
                    </CardFooter>
                )}

                {dispute.status === 'pending' && (
                    <CardFooter className="border-t p-4 flex justify-center">
                        <p className="text-amber-600">管理者による確認中です。しばらくお待ちください。</p>
                    </CardFooter>
                )}

                {dispute.status === 'in_jury' && (
                    <CardFooter className="border-t p-4 flex justify-center">
                        <p className="text-purple-600">第三者による審議中です。結果をお待ちください。</p>
                    </CardFooter>
                )}

                {dispute.status === 'resolved' && (
                    <CardFooter className="border-t p-4 flex justify-center">
                        <p className="text-green-600">この紛争は解決済みです。</p>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}
