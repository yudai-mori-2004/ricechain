// src/app/consumer/market/farmer/[farmerId]/page.tsx
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProductCard from '@/components/ui/product-card';
import { StarRating } from '@/components/ui/star-rating';
import { CultivationMethods } from '@/components/market/cultivation-methods';
import { blockchainService } from '@/lib/blockchain-service';

export default async function FarmerProductsPage({ params }: { params: { farmerId: string } }) {
    const farmer = await blockchainService.getFarmerById(params.farmerId);

    if (!farmer) {
        notFound();
    }

    // Get all products
    const allProducts = await blockchainService.getProductListItems();

    // Filter products by farmer ID
    const farmerProducts = allProducts.filter(product => product.farmer.id === params.farmerId && product.available);

    return (
        <div className="container px-4 py-6 mx-auto max-w-7xl space-y-8">
            {/* Farmer Profile Header */}
            <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden">
                <Image
                    src={farmer.bannerImageUrl || '/placeholder-banner.jpg'}
                    alt={`${farmer.name}のバナー画像`}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-end gap-4">
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-white shadow-lg">
                            <Image
                                src={farmer.imageUrl || '/placeholder-farmer.jpg'}
                                alt={farmer.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold">{farmer.name}</h1>
                            <p className="text-white/80">{farmer.location}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Farmer Info Card */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-2/3 space-y-4">
                            <div>
                                <h2 className="text-xl font-bold mb-2">生産者紹介</h2>
                                <p className="text-text/80 dark:text-background/80">
                                    {farmer.description || `${farmer.name}は${farmer.location}で米作りをしています。`}
                                </p>
                                {farmer.story && (
                                    <div className="mt-4">
                                        <h3 className="text-lg font-medium mb-1">ストーリー</h3>
                                        <p className="text-text/80 dark:text-background/80">{farmer.story}</p>
                                    </div>
                                )}
                            </div>

                            {farmer.specialties && farmer.specialties.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-medium mb-1">特徴・特産品</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {farmer.specialties.map((specialty, index) => (
                                            <span key={index} className="inline-block px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-sm rounded-full">
                                                {specialty}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="md:w-1/3 space-y-4">
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-lg font-medium">評価</h3>
                                    <div className="flex items-center">
                                        <StarRating rating={farmer.rating} />
                                        <span className="ml-1 text-text/60 dark:text-background/60">
                                            {farmer.rating.toFixed(1)}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm text-text/60 dark:text-background/60">
                                    レビュー数: {farmer.reviewCount}件
                                </p>
                                {farmer.establishedYear && (
                                    <p className="text-sm text-text/60 dark:text-background/60">
                                        設立: {farmer.establishedYear}年
                                    </p>
                                )}

                                {/* KomePon Status */}
                                {farmer.komePonRank && (
                                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center">
                                            <span className="text-sm font-medium text-accent1">KomePonランク: {farmer.komePonRank}位</span>
                                        </div>
                                        <p className="text-xs text-text/60 dark:text-background/60 mt-1">
                                            消費者からの評価が高いほど、KomePon割引の予算配分が増えます。
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Contact Info */}
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                <h3 className="text-lg font-medium mb-2">連絡先</h3>
                                {farmer.contactEmail && (
                                    <p className="text-sm text-text/80 dark:text-background/80 mb-1">
                                        Eメール: {farmer.contactEmail}
                                    </p>
                                )}
                                {farmer.phoneNumber && (
                                    <p className="text-sm text-text/80 dark:text-background/80">
                                        電話: {farmer.phoneNumber}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Products Section */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{farmer.name}の商品</h2>
                    <span className="text-text/60 dark:text-background/60">
                        {farmerProducts.length}件の商品
                    </span>
                </div>

                {farmerProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {farmerProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                farmer={farmer.name}
                                farmerId={farmer.id}
                                description={product.description}
                                price={product.price}
                                komePonPrice={product.komePonPrice}
                                imageUrl={product.imageUrl}
                                rating={product.rating}
                                reviewCount={product.reviewCount}
                                available={product.available}
                                hasKomePon={product.hasKomePon}
                                isForFarmer={false}
                            />
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="p-6 text-center">
                            <p className="text-gray-500 dark:text-gray-400">
                                現在、この農家から購入できる商品はありません。
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Certifications Section (if available) */}
            {farmer.certifications && farmer.certifications.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>認証・資格</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-3">
                            {farmer.certifications.map((certification, index) => (
                                <div key={index} className="flex items-center bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-md">
                                    <svg className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-sm text-green-800 dark:text-green-200">{certification}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Cultivation Methods Section (if available) */}
            {farmer.cultivationMethods && farmer.cultivationMethods.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>栽培方法</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CultivationMethods methods={farmer.cultivationMethods} />
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
