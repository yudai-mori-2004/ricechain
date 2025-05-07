'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAppContext } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Order } from '@/features/common/order';
import { blockchainService } from '@/lib/blockchain-service';
import { ChatMessage } from '@/contexts/auth-context';

export default function FarmerOrderChatPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { user, orders, updateOrder } = useAppContext();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const messageEndRef = useRef<HTMLDivElement>(null);

    // Current farmer ID (in a real app, this would come from authentication)
    const currentFarmerId = "f1";

    // Fetch order data
    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                const orderData = await blockchainService.getOrderById(params.id);
                if (!orderData) {
                    router.push('/farmer/orders');
                    return;
                }

                // Check if this order contains products from this farmer
                const farmerItems = orderData.items.filter(item => item.farmerId === currentFarmerId);
                if (farmerItems.length === 0) {
                    router.push('/farmer/orders');
                    return;
                }

                setOrder(orderData);

                // For now, we'll create a mock chat history
                // In a real app, this would be fetched from the blockchain or a database
                const mockMessages: ChatMessage[] = [
                    {
                        id: 'cm1',
                        disputeId: '',
                        senderId: currentFarmerId,
                        senderName: farmerItems[0].farmerName,
                        message: `${orderData.shippingAddress.name}様、ご注文ありがとうございます。商品は明日発送予定です。何かご質問があればお気軽にお問い合わせください。`,
                        createdAt: new Date(new Date(orderData.createdAt).getTime() + 2 * 60 * 60 * 1000).toISOString(),
                    },
                    {
                        id: 'cm2',
                        disputeId: '',
                        senderId: orderData.userId,
                        senderName: '顧客',
                        message: 'ありがとうございます。商品の保存方法について教えていただけますか？',
                        createdAt: new Date(new Date(orderData.createdAt).getTime() + 3 * 60 * 60 * 1000).toISOString(),
                    },
                    {
                        id: 'cm3',
                        disputeId: '',
                        senderId: currentFarmerId,
                        senderName: farmerItems[0].farmerName,
                        message: '直射日光を避け、涼しく乾燥した場所で保存してください。開封後は冷蔵庫での保存がおすすめです。',
                        createdAt: new Date(new Date(orderData.createdAt).getTime() + 5 * 60 * 60 * 1000).toISOString(),
                    },
                ];

                setMessages(mockMessages);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch order:', error);
                setLoading(false);
            }
        };

        fetchOrderData();
    }, [params.id, router, currentFarmerId]);

    // Scroll to bottom when messages change
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !order) return;

        setSending(true);

        try {
            // Create a new message
            const newMsg: ChatMessage = {
                id: `cm${Date.now()}`,
                disputeId: '',
                senderId: currentFarmerId,
                senderName: order.items.find(item => item.farmerId === currentFarmerId)?.farmerName || '販売者',
                message: newMessage,
                createdAt: new Date().toISOString(),
            };

            // In a real app, this would be saved to the blockchain or a database
            // For now, we'll just update the local state
            setMessages(prev => [...prev, newMsg]);
            setNewMessage('');
        } catch (error) {
            console.error('Failed to send message:', error);
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

    // Get customer name from order
    const getCustomerName = () => {
        if (!order) return '顧客';
        return order.shippingAddress.name;
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
                <Link href={`/farmer/orders/${params.id}`} className="text-primary hover:text-primary-dark mr-4">
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
                            <CardTitle className="text-xl">顧客とのメッセージ</CardTitle>
                            <p className="text-sm text-gray-500">注文番号: {order.id}</p>
                            <p className="text-sm text-gray-500">顧客: {getCustomerName()}</p>
                        </div>

                        {order.status === 'dispute' && (
                            <Link href={`/farmer/orders/${params.id}/dispute`}>
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
                                    className={`flex ${msg.senderId === currentFarmerId ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-lg p-3 ${msg.senderId === currentFarmerId
                                            ? 'bg-primary-100 dark:bg-primary-900 text-gray-800 dark:text-gray-100'
                                            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                                            }`}
                                    >
                                        <div className="flex items-center mb-1">
                                            <span className={`text-xs font-medium ${msg.senderId === currentFarmerId ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`}>
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

            {/* Customer quick action section */}
            <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">クイックレスポンス</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Button
                        variant="outline"
                        className="justify-start text-sm"
                        onClick={() => setNewMessage('商品は本日発送いたしました。追跡番号は後ほどお知らせいたします。')}
                    >
                        発送通知
                    </Button>
                    <Button
                        variant="outline"
                        className="justify-start text-sm"
                        onClick={() => setNewMessage('ご質問ありがとうございます。')}
                    >
                        質問への返答
                    </Button>
                    <Button
                        variant="outline"
                        className="justify-start text-sm"
                        onClick={() => setNewMessage('お問い合わせいただきありがとうございます。確認次第、ご連絡いたします。')}
                    >
                        問い合わせ受付確認
                    </Button>
                    <Button
                        variant="outline"
                        className="justify-start text-sm"
                        onClick={() => setNewMessage('ご購入ありがとうございました。またのご利用をお待ちしております。')}
                    >
                        お礼メッセージ
                    </Button>
                </div>
            </div>
        </div>
    );
}
