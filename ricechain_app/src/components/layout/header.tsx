import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">R</span>
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">RiceChain</span>
        </Link>
        
        <div className="flex items-center space-x-6">
          <nav className="hidden md:flex space-x-6">
            <Link href="/products" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
              商品一覧
            </Link>
            <Link href="/orders" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
              注文履歴
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            <Link href="/cart" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Link>
            
            <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors">
              ログイン
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
