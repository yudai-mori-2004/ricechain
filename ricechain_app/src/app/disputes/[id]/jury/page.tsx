'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useAppContext } from '@/contexts/auth-context';
import { Dispute, JuryVote } from '@/contexts/auth-context';
import WalletBalance from '@/components/wallet/wallet-balance';

export default function JuryVotePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { disputes, addJuryVote, user, useMockData } = useAppContext();
  const [dispute, setDispute] = useState<Dispute | null>(null);
  const [loading, setLoading] = useState(true);
  const [vote, setVote] = useState<'buyer' | 'seller' | null>(null);
  const [confidence, setConfidence] = useState(50);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [stakeAmount, setStakeAmount] = useState(0);
  const [rewardAmount, setRewardAmount] = useState(0);
  const [paymentStep, setPaymentStep] = useState<'initial' | 'confirm' | 'processing' | 'complete'>('initial');
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // Fetch dispute data and calculate stake amount
  useEffect(() => {
    const fetchDispute = () => {
      const foundDispute = disputes.find(d => d.id === params.id);
      if (foundDispute) {
        setDispute(foundDispute);

        // Calculate stake amount
        // In a real app, we would get the actual order value
        const orderValue = 15000; // Sample value for demonstration

        let calculatedStake = Math.round(orderValue * 0.01); // 1% of order value
        let calculatedReward = calculatedStake * 2;

        // Apply minimum and maximum limits
        if (orderValue < 2500) {
          calculatedStake = 25;
          calculatedReward = 50;
        } else if (orderValue > 50000) {
          calculatedStake = 500;
          calculatedReward = 1000;
        }

        setStakeAmount(calculatedStake);
        setRewardAmount(calculatedReward);
      }
      setLoading(false);
    };

    fetchDispute();

    // Mock wallet connection status
    // In a real app, this would come from actual wallet connection
    setWalletConnected(true);
    setWalletAddress('7Xf92h3v...4Tgq');
  }, [params.id, disputes]);

  // Check if user has already voted
  useEffect(() => {
    if (dispute) {
      // In a real app, we would check if the user has already voted for this dispute
      // For now, we'll just set it to false
      setHasVoted(false);
    }
  }, [dispute]);

  // Function to proceed to stake confirmation
  const handleProceedToStake = () => {
    if (!vote) return;
    setPaymentStep('confirm');
  };

  // Function to make stake payment
  const handleMakeStake = () => {
    if (!vote || !dispute || !user) return;

    setPaymentStep('processing');

    // Simulate processing time
    setTimeout(() => {
      setPaymentStep('complete');

      // Create a new jury vote
      const newVote: JuryVote = {
        id: `jv${Math.floor(Math.random() * 10000)}`,
        disputeId: dispute.id,
        jurorId: user.id,
        vote,
        confidence,
        comment: comment.trim() || undefined,
        createdAt: new Date().toISOString(),
      };

      // Add the vote to the context
      addJuryVote(newVote);

      // Set has voted to true
      setHasVoted(true);

      // Redirect to the disputes page after a short delay
      setTimeout(() => {
        router.push('/disputes?tab=jury');
      }, 3000);
    }, 2000);
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

  if (dispute.status !== 'in_jury') {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          この紛争は現在陪審員による審議中ではありません
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          この紛争は既に解決されたか、まだ陪審員による審議段階に達していません。
        </p>
        <Link href="/disputes">
          <Button>紛争一覧に戻る</Button>
        </Link>
      </div>
    );
  }

  if (hasVoted) {
    return (
      <div className="text-center py-12">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 mx-auto text-green-500 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          投票が完了しました
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          あなたの投票が正常に記録されました。紛争解決にご協力いただきありがとうございます。
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">陪審員投票</h1>
        <p className="text-gray-600 dark:text-gray-400">
          紛争 #{dispute.id.substring(0, 4)} の解決に協力してください。両者の主張を確認し、公平な判断を行ってください。
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>紛争の詳細</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">紛争理由</h3>
            <p className="text-gray-900 dark:text-white">{dispute.reason}</p>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">取引内容</h3>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <h4 className="text-xs text-gray-500 dark:text-gray-400 mb-1">商品</h4>
                  <p className="font-medium">新潟県産コシヒカリ 5kg</p>
                </div>
                <div>
                  <h4 className="text-xs text-gray-500 dark:text-gray-400 mb-1">数量</h4>
                  <p className="font-medium">2点</p>
                </div>
                <div>
                  <h4 className="text-xs text-gray-500 dark:text-gray-400 mb-1">取引金額</h4>
                  <p className="font-medium">15,000円</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-xs text-gray-500 dark:text-gray-400 mb-1">取引日</h4>
                <p className="font-medium">2025年4月15日</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">当事者の主張</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                <div className="flex items-center mb-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                    <Image
                      src="https://randomuser.me/api/portraits/men/32.jpg"
                      alt="買い手"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">買い手の主張</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">消費者</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{dispute.buyerStatement}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                <div className="flex items-center mb-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                    <Image
                      src="https://randomuser.me/api/portraits/men/67.jpg"
                      alt="売り手"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">売り手の主張</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">農家</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{dispute.sellerStatement}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">チャット履歴</h3>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md max-h-60 overflow-y-auto">
              {dispute.chatMessages.map((message) => (
                <div key={message.id} className="mb-3 last:mb-0">
                  <p className="text-xs text-gray-500 dark:text-gray-400">{message.senderName} - {new Date(message.createdAt).toLocaleString('ja-JP')}</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{message.message}</p>
                </div>
              ))}
            </div>
          </div>

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
        </CardContent>
      </Card>

      {paymentStep === 'initial' && (
        <Card>
          <CardHeader>
            <CardTitle>あなたの投票</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">どちらの主張が正しいと思いますか？</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  className={`p-4 rounded-md border-2 ${vote === 'buyer'
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  onClick={() => setVote('buyer')}
                >
                  <div className="flex items-center mb-2">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2">
                      <Image
                        src="https://randomuser.me/api/portraits/men/32.jpg"
                        alt="買い手"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="font-medium">買い手の主張が正しい</p>
                  </div>
                  <p className="text-sm text-left text-gray-600 dark:text-gray-400">
                    買い手の主張に同意し、買い手側に有利な判断を下します。
                  </p>
                </button>
                <button
                  className={`p-4 rounded-md border-2 ${vote === 'seller'
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  onClick={() => setVote('seller')}
                >
                  <div className="flex items-center mb-2">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2">
                      <Image
                        src="https://randomuser.me/api/portraits/men/67.jpg"
                        alt="売り手"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="font-medium">売り手の主張が正しい</p>
                  </div>
                  <p className="text-sm text-left text-gray-600 dark:text-gray-400">
                    売り手の主張に同意し、売り手側に有利な判断を下します。
                  </p>
                </button>
              </div>
            </div>

            {vote && (
              <>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">あなたの確信度</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    あなたの判断にどの程度の確信がありますか？
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>低い確信度</span>
                      <span>高い確信度</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={confidence}
                      onChange={(e) => setConfidence(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                    <div className="text-center font-medium">
                      {confidence}%
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">コメント（任意）</h3>
                  <textarea
                    rows={3}
                    placeholder="あなたの判断理由や補足事項があれば入力してください"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push('/disputes')}>
              キャンセル
            </Button>
            <Button
              onClick={handleProceedToStake}
              disabled={!vote}
            >
              ステークして投票する
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Stake Payment Confirmation */}
      {paymentStep === 'confirm' && (
        <Card>
          <CardHeader>
            <CardTitle>ステーキング確認</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
              <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">ステーキング情報</h3>
              <div className="space-y-3 text-blue-700 dark:text-blue-400">
                <p>陪審員として参加するには、取引金額の1%（{stakeAmount}円）をステークする必要があります。</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="font-medium">ステーク金額:</p>
                    <p className="text-lg">{stakeAmount}円</p>
                  </div>
                  <div>
                    <p className="font-medium">多数派の場合の報酬:</p>
                    <p className="text-lg text-green-600 dark:text-green-400">{rewardAmount}円</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ※ 少数派の場合はステーク額が没収されます。
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h3 className="font-medium mb-3">ウォレット情報</h3>
              {walletConnected ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <p className="font-medium">接続済み: <span className="font-mono">{walletAddress}</span></p>
                    </div>
                  </div>
                  <WalletBalance isConnected={true} walletAddress={walletAddress || ''} />
                </div>
              ) : (
                <div className="text-center bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md">
                  <p className="text-yellow-700 dark:text-yellow-400 mb-2">
                    ステークするにはウォレットを接続してください
                  </p>
                  <Button>ウォレットに接続</Button>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h3 className="font-medium mb-3">投票内容</h3>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                <p className="mb-2">
                  <span className="font-medium">判断: </span>
                  {vote === 'buyer' ? '買い手の主張が正しい' : '売り手の主張が正しい'}
                </p>
                <p className="mb-2">
                  <span className="font-medium">確信度: </span>
                  {confidence}%
                </p>
                {comment && (
                  <p>
                    <span className="font-medium">コメント: </span>
                    {comment}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setPaymentStep('initial')}>
              戻る
            </Button>
            <Button
              onClick={handleMakeStake}
              disabled={!walletConnected}
            >
              {stakeAmount}円をステークして投票を確定する
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Processing State */}
      {paymentStep === 'processing' && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              ステーキング処理中
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              ステーク金額を送金し、ブロックチェーン上に投票を記録しています。しばらくお待ちください...
            </p>
          </CardContent>
        </Card>
      )}

      {/* Success State */}
      {paymentStep === 'complete' && (
        <Card>
          <CardContent className="p-12 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-green-500 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              ステーキングと投票が完了しました
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              あなたの投票が正常に記録されました。紛争解決にご協力いただきありがとうございます。
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              まもなく紛争一覧ページにリダイレクトします...
            </p>
          </CardContent>
        </Card>
      )}

      {useMockData && (
        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            <span className="font-medium">モックモード:</span> 実際のブロックチェーンとは接続していません。右上の「モック」ボタンからモードを切り替えられます。
          </p>
          <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-2">
            このデモでは、陪審員投票の流れを確認できます。実際のアプリでは、ブロックチェーン上で透明かつ安全に投票が記録されます。
          </p>
        </div>
      )}
    </div>
  );
}
