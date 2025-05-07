import { Metadata } from 'next';

export const metadata: Metadata = {
    title: '商品一覧 | RiceChain',
    description: '厳選された農家直送のお米をお届けします。',
};

export default function ProductsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
