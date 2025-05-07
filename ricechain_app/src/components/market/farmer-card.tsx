'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { StarRating } from '@/components/ui/star-rating';

interface FarmerCardProps {
    id: string;
    name: string;
    imageUrl?: string;
    location?: string;
    rating: number;
    reviewCount: number;
    className?: string;
}

export function FarmerCard({
    id,
    name,
    imageUrl,
    location,
    rating,
    reviewCount,
    className = ''
}: FarmerCardProps) {
    return (
        <Link href={`/consumer/market/farmer/${id}`} className={className}>
            <Card className="hover:shadow-md transition-shadow overflow-hidden">
                <CardContent className="p-0">
                    <div className="flex items-start">
                        {/* 生産者画像 */}
                        {imageUrl && (
                            <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
                                <Image
                                    src={imageUrl}
                                    alt={name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}

                        {/* 生産者情報 */}
                        <div className="p-4">
                            <h3 className="font-bold text-lg">{name}</h3>
                            {location && (
                                <p className="text-sm text-text/60 dark:text-background/60">
                                    {location}
                                </p>
                            )}
                            <div className="flex items-center mt-2">
                                <StarRating rating={rating} />
                                <span className="text-xs text-text/60 dark:text-background/60 ml-1">
                                    ({reviewCount} レビュー)
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
