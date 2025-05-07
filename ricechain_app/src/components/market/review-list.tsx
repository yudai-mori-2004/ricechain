'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { StarRating } from '@/components/ui/star-rating';
import type { Review, User } from '@prisma/client';

type ReviewWithUser = Review & {
    user: User;
    komePonEarned?: boolean;
};

interface ReviewListProps {
    reviews: ReviewWithUser[];
    className?: string;
}

export function ReviewList({ reviews, className = '' }: ReviewListProps) {
    if (reviews.length === 0) {
        return null;
    }

    return (
        <div id="reviews" className={`scroll-mt-16 ${className}`}>
            <h2 className="text-xl font-bold mb-4">カスタマーレビュー</h2>
            <div className="space-y-4">
                {reviews.map((review) => (
                    <Card key={review.id} className="overflow-hidden">
                        <CardContent className="p-4">
                            <div className="flex items-center mb-2">
                                <div className="flex">
                                    <StarRating rating={review.rating} size="sm" />
                                </div>
                                <h3 className="font-bold ml-2">{review.title}</h3>
                            </div>

                            <div className="flex flex-wrap items-center mb-3 text-sm text-text/60 dark:text-background/60">
                                <div className="flex items-center mr-2">
                                    {review.user.iconImageUrl ? (
                                        <div className="relative w-5 h-5 rounded-full overflow-hidden mr-1">
                                            <Image
                                                src={review.user.iconImageUrl}
                                                alt={review.user.handleName || 'ユーザー'}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <span className="mr-1">👤</span>
                                    )}
                                    {review.user.handleName || 'ユーザー'}
                                </div>

                                <span className="mx-2 hidden sm:inline">•</span>

                                <span className="mr-2">{new Date(review.createdAt).toLocaleDateString('ja-JP')}</span>

                                {review.komePonEarned && (
                                    <>
                                        <span className="mx-2 hidden sm:inline">•</span>
                                        <span className="text-accent2">KomePon獲得済み</span>
                                    </>
                                )}
                            </div>

                            <p className="text-text/80 dark:text-background/80 mb-4 text-sm">
                                {review.content}
                            </p>

                            {review.imageUrls && review.imageUrls.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mt-3">
                                    {review.imageUrls.map((url: string, idx: number) => (
                                        <div key={idx} className="relative aspect-square rounded-md overflow-hidden">
                                            <Image
                                                src={url}
                                                alt={`Review image ${idx + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
