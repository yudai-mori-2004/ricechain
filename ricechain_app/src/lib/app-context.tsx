'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/user';
import { Order } from '@/types/order';
import { Product } from '@/types/product';
import { blockchainService } from '@/lib/blockchain-service';

interface AppContextType {
  isAuthenticated: boolean;
  user: User | null;
  useMockData: boolean;
  setUseMockData: (useMock: boolean) => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  disputes: Dispute[];
  addDispute: (dispute: Dispute) => void;
  updateDispute: (disputeId: string, updates: Partial<Dispute>) => void;
  juryVotes: JuryVote[];
  addJuryVote: (vote: JuryVote) => void;
}

interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}

export interface Dispute {
  id: string;
  orderId: string;
  buyerId: string;
  sellerId: string;
  reason: string;
  buyerStatement: string;
  sellerStatement: string;
  status: 'pending' | 'in_chat' | 'in_jury' | 'resolved';
  resolution?: string;
  compensation?: number;
  createdAt: string;
  updatedAt: string;
  chatMessages: ChatMessage[];
  jurySize: number;
  juryVotes: number;
  buyerVoteCount: number;
  sellerVoteCount: number;
}

export interface ChatMessage {
  id: string;
  disputeId: string;
  senderId: string;
  senderName: string;
  message: string;
  createdAt: string;
}

export interface JuryVote {
  id: string;
  disputeId: string;
  jurorId: string;
  vote: 'buyer' | 'seller';
  confidence: number; // 0-100
  comment?: string;
  createdAt: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [useMockData, setUseMockData] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [juryVotes, setJuryVotes] = useState<JuryVote[]>([]);

  // Initialize with mock user on mount
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const mockUser = await blockchainService.getUserById('u1');
        if (mockUser) {
          setUser(mockUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Failed to initialize user:', error);
      }
    };

    const initializeOrders = async () => {
      try {
        const mockOrders = await blockchainService.getOrders();
        setOrders(mockOrders);
      } catch (error) {
        console.error('Failed to initialize orders:', error);
      }
    };

    // Initialize mock disputes
    const initializeDisputes = () => {
      const mockDisputes: Dispute[] = [
        {
          id: 'd1',
          orderId: 'o2',
          buyerId: 'u1',
          sellerId: 'f2',
          reason: '商品が破損していました',
          buyerStatement: '商品が届いた際に袋に破れがあり、一部の米がこぼれていました。',
          sellerStatement: '配送中の事故だと思われます。差額分を返金するか、再送するかご希望をお知らせください。',
          status: 'in_chat',
          createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          chatMessages: [
            {
              id: 'cm1',
              disputeId: 'd1',
              senderId: 'u1',
              senderName: '佐々木健太',
              message: '商品が届いた際に袋に破れがあり、一部の米がこぼれていました。30%ほど返金していただけないでしょうか。',
              createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: 'cm2',
              disputeId: 'd1',
              senderId: 'f2',
              senderName: '佐藤ファーム',
              message: '配送中の事故だと思われます。20%の返金でいかがでしょうか？',
              createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: 'cm3',
              disputeId: 'd1',
              senderId: 'u1',
              senderName: '佐々木健太',
              message: '25%でお願いできないでしょうか？',
              createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            }
          ],
          jurySize: 5,
          juryVotes: 0,
          buyerVoteCount: 0,
          sellerVoteCount: 0
        },
        {
          id: 'd2',
          orderId: 'o3',
          buyerId: 'u2',
          sellerId: 'f6',
          reason: '商品の品質が説明と異なる',
          buyerStatement: '届いた商品は説明にあった「もっちりとした食感」ではなく、パサパサしていました。',
          sellerStatement: '保存方法や炊き方によって食感が変わることがあります。詳しい状況を教えていただけますか？',
          status: 'in_jury',
          createdAt: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          chatMessages: [
            {
              id: 'cm4',
              disputeId: 'd2',
              senderId: 'u2',
              senderName: '田中美咲',
              message: '届いた商品は説明にあった「もっちりとした食感」ではなく、パサパサしていました。全額返金を希望します。',
              createdAt: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: 'cm5',
              disputeId: 'd2',
              senderId: 'f6',
              senderName: '小林ライスファーム',
              message: '保存方法や炊き方によって食感が変わることがあります。詳しい状況を教えていただけますか？',
              createdAt: new Date(Date.now() - 84 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: 'cm6',
              disputeId: 'd2',
              senderId: 'u2',
              senderName: '田中美咲',
              message: '説明書通りに炊きましたが、期待していた食感ではありませんでした。少なくとも50%の返金を希望します。',
              createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: 'cm7',
              disputeId: 'd2',
              senderId: 'f6',
              senderName: '小林ライスファーム',
              message: '全額返金はできませんが、20%の返金であれば対応可能です。',
              createdAt: new Date(Date.now() - 60 * 60 * 60 * 1000).toISOString(),
            }
          ],
          jurySize: 5,
          juryVotes: 3,
          buyerVoteCount: 1,
          sellerVoteCount: 2
        }
      ];
      
      setDisputes(mockDisputes);
    };

    initializeUser();
    initializeOrders();
    initializeDisputes();
  }, []);

  const addToCart = (product: Product, quantity: number) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.productId === product.id);
      
      if (existingItemIndex >= 0) {
        // Update quantity if item already exists
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      } else {
        // Add new item
        return [...prevCart, { productId: product.id, product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
  };

  const updateCartItemQuantity = (productId: string, quantity: number) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const addOrder = (order: Order) => {
    setOrders(prevOrders => [...prevOrders, order]);
  };

  const updateOrder = (orderId: string, updates: Partial<Order>) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, ...updates } : order
      )
    );
  };

  const addDispute = (dispute: Dispute) => {
    setDisputes(prevDisputes => [...prevDisputes, dispute]);
  };

  const updateDispute = (disputeId: string, updates: Partial<Dispute>) => {
    setDisputes(prevDisputes => 
      prevDisputes.map(dispute => 
        dispute.id === disputeId ? { ...dispute, ...updates } : dispute
      )
    );
  };

  const addJuryVote = (vote: JuryVote) => {
    setJuryVotes(prevVotes => [...prevVotes, vote]);
    
    // Update dispute vote counts
    setDisputes(prevDisputes => 
      prevDisputes.map(dispute => {
        if (dispute.id === vote.disputeId) {
          const updatedDispute = { ...dispute };
          updatedDispute.juryVotes += 1;
          
          if (vote.vote === 'buyer') {
            updatedDispute.buyerVoteCount += 1;
          } else {
            updatedDispute.sellerVoteCount += 1;
          }
          
          // Check if all votes are in
          if (updatedDispute.juryVotes >= updatedDispute.jurySize) {
            updatedDispute.status = 'resolved';
            updatedDispute.resolution = updatedDispute.buyerVoteCount > updatedDispute.sellerVoteCount 
              ? '買い手側の主張が認められました' 
              : '売り手側の主張が認められました';
            
            // Set compensation based on vote results
            if (updatedDispute.buyerVoteCount > updatedDispute.sellerVoteCount) {
              updatedDispute.compensation = 25; // 25% refund for buyer win
            } else {
              updatedDispute.compensation = 10; // 10% refund as goodwill for seller win
            }
          }
          
          return updatedDispute;
        }
        return dispute;
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        user,
        useMockData,
        setUseMockData,
        cart,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        orders,
        addOrder,
        updateOrder,
        disputes,
        addDispute,
        updateDispute,
        juryVotes,
        addJuryVote
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
