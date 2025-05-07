// src/app/consumer/market/farmer/[farmerId]/layout.tsx
import { blockchainService } from '@/lib/blockchain-service';

export async function generateMetadata({ params }: { params: { farmerId: string } }) {
    const farmer = await blockchainService.getFarmerById(params.farmerId);

    if (!farmer) {
        return {
            title: '農家が見つかりません | RiceChain',
            description: '指定された農家は存在しないか、削除された可能性があります。',
        };
    }

    return {
        title: `${farmer.name} | RiceChain`,
        description: farmer.description || `${farmer.name}の商品一覧`,
    };
}

export default function FarmerDetailLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
