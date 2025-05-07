'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ui/product-card';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/hooks/useProducts';
import { ProductWithFarmerAndDetails } from '@/hooks/useProducts';

// Metadata is moved to a separate file for client components

export default function ProductsPage() {
  const [fullProducts, setFullProducts] = useState<ProductWithFarmerAndDetails[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductWithFarmerAndDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('recommended');
  const [filterOption, setFilterOption] = useState('all');
  const [showDetailedSearch, setShowDetailedSearch] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [selectedVarieties, setSelectedVarieties] = useState<string[]>([]);
  const [selectedFarmers, setSelectedFarmers] = useState<string[]>([]);
  const [onlyKomePon, setOnlyKomePon] = useState(false);
  const [onlyAvailable, setOnlyAvailable] = useState(true);
  const [minRating, setMinRating] = useState(0);

  // Use the products hook for core data fetching
  const { products: fetchedProducts, loading: productsLoading } = useProducts(true);

  // Store fetched products
  useEffect(() => {
    if (fetchedProducts.length === 0) return;

    try {
      setFullProducts(fetchedProducts);
      setFilteredProducts(fetchedProducts);
      setLoading(false);
    } catch (error) {
      console.error('Failed to process products:', error);
      setLoading(false);
    }
  }, [fetchedProducts]);

  // Get unique varieties from products
  const varieties = Array.from(
    new Set(fullProducts
      .filter(p => p.details)
      .map(p => p.details?.variety || ''))
  ).filter(Boolean);

  // Get unique farmers from products
  const farmers = Array.from(
    new Set(fullProducts.map(p => p.farmer.handleName || ''))
  ).filter(Boolean);

  // Apply sorting and filtering
  useEffect(() => {
    if (fullProducts.length === 0) return;

    let filtered = [...fullProducts];

    // Apply basic filter
    if (filterOption !== 'all') {
      if (filterOption === 'komepon') {
        filtered = filtered.filter((product) => product.komePonDiscountRate !== null);
      }
      // 注意: cultivationMethodはスキーマに含まれていないようなので、このフィルターは現在機能しません
      // 実際の実装では、適切なフィールドでフィルタリングするか、この部分を削除してください
    }

    // Apply detailed filters if any are set
    if (
      priceRange[0] > 0 ||
      priceRange[1] < 5000 ||
      selectedVarieties.length > 0 ||
      selectedFarmers.length > 0 ||
      onlyKomePon ||
      !onlyAvailable ||
      minRating > 0
    ) {
      filtered = filtered.filter((product) => {
        // Price range filter
        if (product.price < priceRange[0] || product.price > priceRange[1]) {
          return false;
        }

        // Variety filter
        if (
          selectedVarieties.length > 0 &&
          !selectedVarieties.includes(product.details?.variety || '')
        ) {
          return false;
        }

        // Farmer filter
        if (
          selectedFarmers.length > 0 &&
          !selectedFarmers.includes(product.farmer.handleName || '')
        ) {
          return false;
        }

        // KomePon filter
        if (onlyKomePon && product.komePonDiscountRate === null) {
          return false;
        }

        // Availability filter
        if (onlyAvailable && !product.available) {
          return false;
        }

        // Rating filter
        if (product.rating < minRating) {
          return false;
        }

        return true;
      });
    }

    // Apply sorting
    if (sortOption === 'newest') {
      filtered.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sortOption === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }
    // 'recommended' is the default order from the API

    setFilteredProducts(filtered);
  }, [sortOption, filterOption, priceRange, selectedVarieties, selectedFarmers, onlyKomePon, onlyAvailable, minRating, fullProducts]);

  // Reset detailed search filters
  const resetFilters = () => {
    setPriceRange([0, 5000]);
    setSelectedVarieties([]);
    setSelectedFarmers([]);
    setOnlyKomePon(false);
    setOnlyAvailable(true);
    setMinRating(0);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">商品一覧</h1>
        <p className="text-gray-600 dark:text-gray-400">
          全国の厳選された農家から直接お届けする美味しいお米をご紹介します。
        </p>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center">
          <label htmlFor="sort" className="mr-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            並び替え:
          </label>
          <select
            id="sort"
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="recommended">おすすめ順</option>
            <option value="newest">新着順</option>
            <option value="price-asc">価格の安い順</option>
            <option value="price-desc">価格の高い順</option>
            <option value="rating">評価の高い順</option>
          </select>
        </div>

        <div className="flex items-center">
          <label htmlFor="filter" className="mr-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            絞り込み:
          </label>
          <select
            id="filter"
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
          >
            <option value="all">すべて</option>
            <option value="komepon">KomePon対象</option>
            <option value="organic">有機栽培</option>
            <option value="reduced-pesticide">減農薬</option>
            <option value="conventional">慣行栽培</option>
          </select>
        </div>

        <div className="flex items-center ml-auto">
          <button
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            onClick={() => setShowDetailedSearch(true)}
          >
            詳細検索
          </button>
        </div>
      </div>

      {/* Detailed Search Modal */}
      {showDetailedSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">詳細検索</h2>
                <button
                  onClick={() => setShowDetailedSearch(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Price Range */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">価格帯</h3>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="0"
                      max="5000"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-24 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm"
                    />
                    <span className="text-gray-500">〜</span>
                    <input
                      type="number"
                      min="0"
                      max="5000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-24 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm"
                    />
                    <span className="text-gray-500">円</span>
                  </div>
                </div>

                {/* Rice Varieties */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">品種</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {varieties.map((variety) => (
                      <label key={variety} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedVarieties.includes(variety)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedVarieties([...selectedVarieties, variety]);
                            } else {
                              setSelectedVarieties(selectedVarieties.filter((v) => v !== variety));
                            }
                          }}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{variety}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Farmers */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">農家</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {farmers.map((farmer) => (
                      <label key={farmer} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedFarmers.includes(farmer!)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedFarmers([...selectedFarmers, farmer!]);
                            } else {
                              setSelectedFarmers(selectedFarmers.filter((f) => f !== farmer));
                            }
                          }}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{farmer}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Other Filters */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">その他の条件</h3>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={onlyKomePon}
                        onChange={(e) => setOnlyKomePon(e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">KomePon対象のみ</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={onlyAvailable}
                        onChange={(e) => setOnlyAvailable(e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">在庫あり</span>
                    </label>
                  </div>
                </div>

                {/* Minimum Rating */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">最低評価</h3>
                  <div className="flex items-center space-x-2">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setMinRating(rating + 1)}
                        className={`flex items-center justify-center w-8 h-8 rounded-full ${minRating > rating
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                      >
                        {rating + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setMinRating(0)}
                      className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 ml-2"
                    >
                      リセット
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <Button
                  variant="outline"
                  onClick={resetFilters}
                >
                  条件をリセット
                </Button>
                <Button
                  onClick={() => setShowDetailedSearch(false)}
                >
                  検索
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          {/* Results count */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {filteredProducts.length}件の商品が見つかりました
            </p>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                // KomePon対象商品の場合、割引価格を計算
                const komePonPrice = product.komePonDiscountRate
                  ? product.price * (1 - product.komePonDiscountRate)
                  : undefined;

                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    komePonPrice={komePonPrice}
                    isForFarmer={false}
                  />
                );
              })
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  条件に一致する商品が見つかりませんでした。検索条件を変更してお試しください。
                </p>
              </div>
            )}
          </div>
        </>
      )}

      <div className="flex justify-center mt-8">
        <nav className="flex items-center space-x-2">
          <button className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
            前へ
          </button>
          <button className="px-3 py-2 rounded-md bg-primary-600 text-white">1</button>
          <button className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
            2
          </button>
          <button className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
            3
          </button>
          <span className="px-3 py-2 text-gray-500 dark:text-gray-400">...</span>
          <button className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
            10
          </button>
          <button className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
            次へ
          </button>
        </nav>
      </div>
    </div>
  );
}
