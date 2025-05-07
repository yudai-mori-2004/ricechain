'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

// ChatMessageの型定義
interface ChatMessage {
    id: string;
    disputeId: string;
    senderId: string;
    senderName: string;
    message: string;
    createdAt: string;
}

// OrderとItemの型定義
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
}

export default function OrderChatPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { user } = useAuth();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const messageEndRef = useRef<HTMLDivElement>(null);

    // Fetch order data
    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                // APIエンドポイントから注文データを取得
                const response = await fetch(`/api/orders/${params.id}`);
                if (!response.ok) {
                    router.push('/consumer/orders');
                    return;
                }

                const data = await response.json();
                setOrder(data.order);

                // チャットメッセージを取得（現在はAPIがないためモックデータを使用）
                // 実際のアプリでは、/api/chat-messages?orderId=XXXのようなエンドポイントを作成する
                try {
                    const chatResponse = await fetch(`/api/chat-messages?orderId=${params.id}`);
                    if (chatResponse.ok) {
                        const chatData = await chatResponse.json();
                        setMessages(chatData.messages || []);
                    }
                } catch (chatError) {
                    console.error('Failed to fetch chat messages:', chatError);
                    // APIがまだ実装されていない場合はモックデータを使用
                    if (data.order) {
                        const mockMessages: ChatMessage[] = [
                            {
                                id: 'cm1',
                                disputeId: '',
                                senderId: data.order.sellerId,
                                senderName: data.order.seller.handleName || '出品者',
                                message: `${data.order.shippingAddress.name}様、ご注文ありがとうございます。商品は明日発送予定です。何かご質問があればお気軽にお問い合わせください。`,
                                createdAt: new Date(new Date(data.order.createdAt).getTime() + 2 * 60 * 60 * 1000).toISOString(),
                            },
                            {
                                id: 'cm2',
                                disputeId: '',
                                senderId: data.order.buyerId,
                                senderName: user?.handleName || '顧客',
                                message: 'ありがとうございます。商品の保存方法について教えていただけますか？',
                                createdAt: new Date(new Date(data.order.createdAt).getTime() + 3 * 60 * 60 * 1000).toISOString(),
                            },
                            {
                                id: 'cm3',
                                disputeId: '',
                                senderId: data.order.sellerId,
                                senderName: data.order.seller.handleName || '出品者',
                                message: '直射日光を避け、涼しく乾燥した場所で保存してください。開封後は冷蔵庫での保存がおすすめです。',
                                createdAt: new Date(new Date(data.order.createdAt).getTime() + 5 * 60 * 60 * 1000).toISOString(),
                            },
                        ];
                        setMessages(mockMessages);
                    }
                }

                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch order:', error);
                setLoading(false);
            }
        };

        fetchOrderData();
    }, [params.id, router, user]);

    // Scroll to bottom when messages change
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !order || !user) return;

        setSending(true);

        try {
            // 新しいメッセージを作成
            const messageData = {
                orderId: order.id,
                message: newMessage
            };

            // APIエンドポイントにメッセージを送信（実際にはこのAPIを実装する必要がある）
            const response = await fetch('/api/chat-messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageData)
            });

            if (response.ok) {
                const result = await response.json();
                // 返却されたメッセージをステートに追加
                setMessages(prev => [...prev, result.message]);
            } else {
                // APIがまだ実装されていない場合はモックデータを使用
                const newMsg: ChatMessage = {
                    id: `cm${Date.now()}`,
                    disputeId: '',
                    senderId: user.id,
                    senderName: user.handleName || '顧客',
                    message: newMessage,
                    createdAt: new Date().toISOString(),
                };
                setMessages(prev => [...prev, newMsg]);
            }

            setNewMessage('');
        } catch (error) {
            console.error('Failed to send message:', error);

            // エラーが発生した場合でもUIに表示するためにモックメッセージを追加
            const newMsg: ChatMessage = {
                id: `cm${Date.now()}`,
                disputeId: '',
                senderId: user.id,
                senderName: user.handleName || '顧客',
                message: newMessage,
                createdAt: new Date().toISOString(),
            };
            setMessages(prev => [...prev, newMsg]);
            setNewMessage('');
        } finally {
            setSending(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('ja-JP', {
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
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

    if (!order) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center h-64">
                    <p className="text-gray-500">注文が見つかりません</p>
                </div>
            </div>
        );
    }

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

            <Card className="shadow-lg">
                <CardHeader className="border-b">
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-xl">メッセージ</CardTitle>
                            <p className="text-sm text-gray-500">注文番号: {order.id.substring(0, 8)}</p>
                        </div>

                        {order.status === 'dispute' && (
                            <Link href={`/consumer/orders/${params.id}/dispute`}>
                                <Button variant="destructive" size="sm">
                                    紛争中
                                </Button>
                            </Link>
                        )}
                    </div>
                </CardHeader>

                <div className="h-[50vh] overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
                    {messages.length === 0 ? (
                        <div className="flex justify-center items-center h-full">
                            <p className="text-gray-500">メッセージはまだありません</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {messages.map((msg) => (
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
            </Card>
        </div>
    );
}
