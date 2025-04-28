import React from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ui/product-card';
import { mockProductListItems } from '@/lib/mock-data';

export const metadata = {
  title: '商品一覧 | RiceChain',
  description: '厳選された農家直送のお米をお届けします。',
};

export default function ProductsPage() {
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
            defaultValue="recommended"
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
            defaultValue="all"
          >
            <option value="all">すべて</option>
            <option value="komepon">KomePon対象</option>
            <option value="organic">有機栽培</option>
            <option value="reduced-pesticide">減農薬</option>
            <option value="conventional">慣行栽培</option>
          </select>
        </div>

        <div className="flex items-center ml-auto">
          <button className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
            詳細検索
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockProductListItems.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            farmer={product.farmer.name}
            farmerId={product.farmer.id}
            description={product.description}
            price={product.price}
            komePonPrice={product.komePonPrice}
            imageUrl={product.imageUrl}
            rating={product.rating}
            reviewCount={product.reviewCount}
            available={product.available}
            hasKomePon={product.hasKomePon}
          />
        ))}
      </div>

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
