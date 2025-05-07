// src/app/consumer/market/[id]/layout.tsx
import { blockchainService } from '@/lib/blockchain-service';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await blockchainService.getProductById(params.id);

  if (!product) {
    return {
      title: '商品が見つかりません | RiceChain',
      description: '指定された商品は存在しないか、削除された可能性があります。',
    };
  }

  return {
    title: `${product.name} | RiceChain`,
    description: product.description,
  };
}

export default function ProductDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
