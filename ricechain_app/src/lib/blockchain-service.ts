import { Product, ProductListItem } from '@/types/product';
import { Farmer, FarmerListItem } from '@/types/farmer';
import { Review, ReviewListItem } from '@/types/review';
import { Order, OrderListItem } from '@/types/order';
import { User } from '@/types/user';
import { mockProducts, mockProductListItems, mockFarmers, mockFarmerListItems, mockReviews, mockReviewListItems, mockOrders, mockOrderListItems, mockUser, mockDisputes } from '@/lib/mock-data';
import { Dispute, ChatMessage, JuryVote } from '@/lib/app-context';

// Flag to toggle between mock data and blockchain data
// Set to true to use blockchain data, false to use mock data
const USE_BLOCKCHAIN_DATA = false;

/**
 * Service for interacting with the Solana blockchain
 */
class BlockchainService {
  // Connection to Solana network
  private connection: any = null;
  
  // Initialize connection to Solana network
  private async initConnection() {
    if (this.connection) return;
    
    try {
      // This would be replaced with actual Solana connection code
      console.log('Initializing connection to Solana network...');
      // Example: this.connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
      this.connection = {};
      console.log('Connected to Solana network');
    } catch (error) {
      console.error('Failed to connect to Solana network:', error);
      throw new Error('Failed to connect to Solana network');
    }
  }

  /**
   * Get all products from the blockchain
   */
  async getProducts(): Promise<Product[]> {
    if (!USE_BLOCKCHAIN_DATA) return mockProducts;
    
    try {
      await this.initConnection();
      
      // This would be replaced with actual blockchain data fetching
      console.log('Fetching products from blockchain...');
      // Example: const products = await fetchProductsFromProgram(this.connection, programId);
      
      // For now, return mock data
      return mockProducts;
    } catch (error) {
      console.error('Failed to fetch products from blockchain:', error);
      // Fallback to mock data in case of error
      return mockProducts;
    }
  }

  /**
   * Get product list items from the blockchain
   */
  async getProductListItems(): Promise<ProductListItem[]> {
    if (!USE_BLOCKCHAIN_DATA) return mockProductListItems;
    
    try {
      await this.initConnection();
      
      // This would be replaced with actual blockchain data fetching
      console.log('Fetching product list items from blockchain...');
      
      // For now, return mock data
      return mockProductListItems;
    } catch (error) {
      console.error('Failed to fetch product list items from blockchain:', error);
      return mockProductListItems;
    }
  }

  /**
   * Get a product by ID from the blockchain
   */
  async getProductById(id: string): Promise<Product | undefined> {
    if (!USE_BLOCKCHAIN_DATA) return mockProducts.find(p => p.id === id);
    
    try {
      await this.initConnection();
      
      // This would be replaced with actual blockchain data fetching
      console.log(`Fetching product ${id} from blockchain...`);
      
      // For now, return mock data
      return mockProducts.find(p => p.id === id);
    } catch (error) {
      console.error(`Failed to fetch product ${id} from blockchain:`, error);
      return mockProducts.find(p => p.id === id);
    }
  }

  /**
   * Get all farmers from the blockchain
   */
  async getFarmers(): Promise<Farmer[]> {
    if (!USE_BLOCKCHAIN_DATA) return mockFarmers;
    
    try {
      await this.initConnection();
      
      // This would be replaced with actual blockchain data fetching
      console.log('Fetching farmers from blockchain...');
      
      // For now, return mock data
      return mockFarmers;
    } catch (error) {
      console.error('Failed to fetch farmers from blockchain:', error);
      return mockFarmers;
    }
  }

  /**
   * Get farmer list items from the blockchain
   */
  async getFarmerListItems(): Promise<FarmerListItem[]> {
    if (!USE_BLOCKCHAIN_DATA) return mockFarmerListItems;
    
    try {
      await this.initConnection();
      
      // This would be replaced with actual blockchain data fetching
      console.log('Fetching farmer list items from blockchain...');
      
      // For now, return mock data
      return mockFarmerListItems;
    } catch (error) {
      console.error('Failed to fetch farmer list items from blockchain:', error);
      return mockFarmerListItems;
    }
  }

  /**
   * Get a farmer by ID from the blockchain
   */
  async getFarmerById(id: string): Promise<Farmer | undefined> {
    if (!USE_BLOCKCHAIN_DATA) return mockFarmers.find(f => f.id === id);
    
    try {
      await this.initConnection();
      
      // This would be replaced with actual blockchain data fetching
      console.log(`Fetching farmer ${id} from blockchain...`);
      
      // For now, return mock data
      return mockFarmers.find(f => f.id === id);
    } catch (error) {
      console.error(`Failed to fetch farmer ${id} from blockchain:`, error);
      return mockFarmers.find(f => f.id === id);
    }
  }

  /**
   * Get all reviews from the blockchain
   */
  async getReviews(): Promise<Review[]> {
    if (!USE_BLOCKCHAIN_DATA) return mockReviews;
    
    try {
      await this.initConnection();
      
      // This would be replaced with actual blockchain data fetching
      console.log('Fetching reviews from blockchain...');
      
      // For now, return mock data
      return mockReviews;
    } catch (error) {
      console.error('Failed to fetch reviews from blockchain:', error);
      return mockReviews;
    }
  }

  /**
   * Get review list items from the blockchain
   */
  async getReviewListItems(): Promise<ReviewListItem[]> {
    if (!USE_BLOCKCHAIN_DATA) return mockReviewListItems;
    
    try {
      await this.initConnection();
      
      // This would be replaced with actual blockchain data fetching
      console.log('Fetching review list items from blockchain...');
      
      // For now, return mock data
      return mockReviewListItems;
    } catch (error) {
      console.error('Failed to fetch review list items from blockchain:', error);
      return mockReviewListItems;
    }
  }

  /**
   * Get reviews for a product from the blockchain
   */
  async getReviewsByProductId(productId: string): Promise<Review[]> {
    if (!USE_BLOCKCHAIN_DATA) return mockReviews.filter(r => r.productId === productId);
    
    try {
      await this.initConnection();
      
      // This would be replaced with actual blockchain data fetching
      console.log(`Fetching reviews for product ${productId} from blockchain...`);
      
      // For now, return mock data
      return mockReviews.filter(r => r.productId === productId);
    } catch (error) {
      console.error(`Failed to fetch reviews for product ${productId} from blockchain:`, error);
      return mockReviews.filter(r => r.productId === productId);
    }
  }

  /**
   * Get all orders from the blockchain
   */
  async getOrders(): Promise<Order[]> {
    if (!USE_BLOCKCHAIN_DATA) return mockOrders;
    
    try {
      await this.initConnection();
      
      // This would be replaced with actual blockchain data fetching
      console.log('Fetching orders from blockchain...');
      
      // For now, return mock data
      return mockOrders;
    } catch (error) {
      console.error('Failed to fetch orders from blockchain:', error);
      return mockOrders;
    }
  }

  /**
   * Get order list items from the blockchain
   */
  async getOrderListItems(): Promise<OrderListItem[]> {
    if (!USE_BLOCKCHAIN_DATA) return mockOrderListItems;
    
    try {
      await this.initConnection();
      
      // This would be replaced with actual blockchain data fetching
      console.log('Fetching order list items from blockchain...');
      
      // For now, return mock data
      return mockOrderListItems;
    } catch (error) {
      console.error('Failed to fetch order list items from blockchain:', error);
      return mockOrderListItems;
    }
  }

  /**
   * Get an order by ID from the blockchain
   */
  async getOrderById(id: string): Promise<Order | undefined> {
    if (!USE_BLOCKCHAIN_DATA) return mockOrders.find(o => o.id === id);
    
    try {
      await this.initConnection();
      
      // This would be replaced with actual blockchain data fetching
      console.log(`Fetching order ${id} from blockchain...`);
      
      // For now, return mock data
      return mockOrders.find(o => o.id === id);
    } catch (error) {
      console.error(`Failed to fetch order ${id} from blockchain:`, error);
      return mockOrders.find(o => o.id === id);
    }
  }

  /**
   * Get orders for a user from the blockchain
   */
  async getOrdersByUserId(userId: string): Promise<Order[]> {
    if (!USE_BLOCKCHAIN_DATA) return mockOrders.filter(o => o.userId === userId);
    
    try {
      await this.initConnection();
      
      // This would be replaced with actual blockchain data fetching
      console.log(`Fetching orders for user ${userId} from blockchain...`);
      
      // For now, return mock data
      return mockOrders.filter(o => o.userId === userId);
    } catch (error) {
      console.error(`Failed to fetch orders for user ${userId} from blockchain:`, error);
      return mockOrders.filter(o => o.userId === userId);
    }
  }

  /**
   * Get orders for a farmer from the blockchain
   */
  async getOrdersByFarmerId(farmerId: string): Promise<Order[]> {
    if (!USE_BLOCKCHAIN_DATA) {
      return mockOrders.filter(o => o.items.some(item => item.farmerId === farmerId));
    }
    
    try {
      await this.initConnection();
      
      // This would be replaced with actual blockchain data fetching
      console.log(`Fetching orders for farmer ${farmerId} from blockchain...`);
      
      // For now, return mock data
      return mockOrders.filter(o => o.items.some(item => item.farmerId === farmerId));
    } catch (error) {
      console.error(`Failed to fetch orders for farmer ${farmerId} from blockchain:`, error);
      return mockOrders.filter(o => o.items.some(item => item.farmerId === farmerId));
    }
  }

  /**
   * Get user data from the blockchain
   */
  async getUserById(id: string): Promise<User | undefined> {
    if (!USE_BLOCKCHAIN_DATA) return mockUser.id === id ? mockUser : undefined;
    
    try {
      await this.initConnection();
      
      // This would be replaced with actual blockchain data fetching
      console.log(`Fetching user ${id} from blockchain...`);
      
      // For now, return mock data
      return mockUser.id === id ? mockUser : undefined;
    } catch (error) {
      console.error(`Failed to fetch user ${id} from blockchain:`, error);
      return mockUser.id === id ? mockUser : undefined;
    }
  }

  /**
   * Submit a review to the blockchain
   */
  async submitReview(review: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): Promise<Review> {
    if (!USE_BLOCKCHAIN_DATA) {
      // Create a mock review with generated ID and timestamps
      const newReview: Review = {
        ...review,
        id: `r${mockReviews.length + 1}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // In a real app, we would update the mock data here
      // mockReviews.push(newReview);
      
      return newReview;
    }
    
    try {
      await this.initConnection();
      
      // This would be replaced with actual blockchain transaction
      console.log('Submitting review to blockchain...');
      
      // For now, return a mock review
      const newReview: Review = {
        ...review,
        id: `r${mockReviews.length + 1}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return newReview;
    } catch (error) {
      console.error('Failed to submit review to blockchain:', error);
      throw new Error('Failed to submit review to blockchain');
    }
  }

  /**
   * Create an order on the blockchain
   */
  async createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    if (!USE_BLOCKCHAIN_DATA) {
      // Create a mock order with generated ID and timestamps
      const newOrder: Order = {
        ...order,
        id: `o${mockOrders.length + 1}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // In a real app, we would update the mock data here
      // mockOrders.push(newOrder);
      
      return newOrder;
    }
    
    try {
      await this.initConnection();
      
      // This would be replaced with actual blockchain transaction
      console.log('Creating order on blockchain...');
      
      // For now, return a mock order
      const newOrder: Order = {
        ...order,
        id: `o${mockOrders.length + 1}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return newOrder;
    } catch (error) {
      console.error('Failed to create order on blockchain:', error);
      throw new Error('Failed to create order on blockchain');
    }
  }

  /**
   * Update KomePon settings for a farmer on the blockchain
   */
  async updateKomePonSettings(
    farmerId: string, 
    settings: { discountAmount: number; maxRedemptions: number }
  ): Promise<Farmer | undefined> {
    if (!USE_BLOCKCHAIN_DATA) {
      const farmer = mockFarmers.find(f => f.id === farmerId);
      
      if (!farmer) return undefined;
      
      // In a real app, we would update the mock data here
      // const updatedFarmer = {
      //   ...farmer,
      //   komePonSettings: {
      //     ...settings,
      //     remainingRedemptions: settings.maxRedemptions,
      //   },
      //   updatedAt: new Date().toISOString(),
      // };
      
      return farmer;
    }
    
    try {
      await this.initConnection();
      
      // This would be replaced with actual blockchain transaction
      console.log(`Updating KomePon settings for farmer ${farmerId} on blockchain...`);
      
      // For now, return the mock farmer
      const farmer = mockFarmers.find(f => f.id === farmerId);
      
      return farmer;
    } catch (error) {
      console.error(`Failed to update KomePon settings for farmer ${farmerId} on blockchain:`, error);
      throw new Error('Failed to update KomePon settings on blockchain');
    }
  }

  /**
   * Get all disputes from the blockchain
   */
  async getDisputes(): Promise<Dispute[]> {
    if (!USE_BLOCKCHAIN_DATA) return mockDisputes;
    
    try {
      await this.initConnection();
      
      // This would be replaced with actual blockchain data fetching
      console.log('Fetching disputes from blockchain...');
      
      // For now, return mock data
      return mockDisputes;
    } catch (error) {
      console.error('Failed to fetch disputes from blockchain:', error);
      return mockDisputes;
    }
  }

  /**
   * Get a dispute by ID from the blockchain
   */
  async getDisputeById(id: string): Promise<Dispute | undefined> {
    if (!USE_BLOCKCHAIN_DATA) return mockDisputes.find(d => d.id === id);
    
    try {
      await this.initConnection();
      
      // This would be replaced with actual blockchain data fetching
      console.log(`Fetching dispute ${id} from blockchain...`);
      
      // For now, return mock data
      return mockDisputes.find(d => d.id === id);
    } catch (error) {
      console.error(`Failed to fetch dispute ${id} from blockchain:`, error);
      return mockDisputes.find(d => d.id === id);
    }
  }

  /**
   * Get disputes for a user from the blockchain
   */
  async getDisputesByUserId(userId: string): Promise<Dispute[]> {
    if (!USE_BLOCKCHAIN_DATA) return mockDisputes.filter(d => d.buyerId === userId || d.sellerId === userId);
    
    try {
      await this.initConnection();
      
      // This would be replaced with actual blockchain data fetching
      console.log(`Fetching disputes for user ${userId} from blockchain...`);
      
      // For now, return mock data
      return mockDisputes.filter(d => d.buyerId === userId || d.sellerId === userId);
    } catch (error) {
      console.error(`Failed to fetch disputes for user ${userId} from blockchain:`, error);
      return mockDisputes.filter(d => d.buyerId === userId || d.sellerId === userId);
    }
  }

  /**
   * Create a new dispute on the blockchain
   */
  async createDispute(dispute: Omit<Dispute, 'id' | 'createdAt' | 'updatedAt' | 'chatMessages' | 'juryVotes' | 'buyerVoteCount' | 'sellerVoteCount'>): Promise<Dispute> {
    if (!USE_BLOCKCHAIN_DATA) {
      // Create a mock dispute with generated ID and timestamps
      const newDispute: Dispute = {
        ...dispute,
        id: `d${mockDisputes.length + 1}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        chatMessages: [
          {
            id: `cm${Date.now()}`,
            disputeId: `d${mockDisputes.length + 1}`,
            senderId: dispute.buyerId,
            senderName: mockUser.name,
            message: dispute.buyerStatement,
            createdAt: new Date().toISOString(),
          }
        ],
        jurySize: 5,
        juryVotes: 0,
        buyerVoteCount: 0,
        sellerVoteCount: 0
      };
      
      // In a real app, we would update the mock data here
      // mockDisputes.push(newDispute);
      
      return newDispute;
    }
    
    try {
      await this.initConnection();
      
      // This would be replaced with actual blockchain transaction
      console.log('Creating dispute on blockchain...');
      
      // For now, return a mock dispute
      const newDispute: Dispute = {
        ...dispute,
        id: `d${mockDisputes.length + 1}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        chatMessages: [
          {
            id: `cm${Date.now()}`,
            disputeId: `d${mockDisputes.length + 1}`,
            senderId: dispute.buyerId,
            senderName: mockUser.name,
            message: dispute.buyerStatement,
            createdAt: new Date().toISOString(),
          }
        ],
        jurySize: 5,
        juryVotes: 0,
        buyerVoteCount: 0,
        sellerVoteCount: 0
      };
      
      return newDispute;
    } catch (error) {
      console.error('Failed to create dispute on blockchain:', error);
      throw new Error('Failed to create dispute on blockchain');
    }
  }

  /**
   * Add a chat message to a dispute on the blockchain
   */
  async addDisputeChatMessage(disputeId: string, message: Omit<ChatMessage, 'id' | 'createdAt'>): Promise<Dispute | undefined> {
    if (!USE_BLOCKCHAIN_DATA) {
      const dispute = mockDisputes.find(d => d.id === disputeId);
      
      if (!dispute) return undefined;
      
      // Create a new chat message
      const newMessage: ChatMessage = {
        ...message,
        id: `cm${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      
      // In a real app, we would update the mock data here
      // const updatedDispute = {
      //   ...dispute,
      //   chatMessages: [...dispute.chatMessages, newMessage],
      //   updatedAt: new Date().toISOString(),
      // };
      
      // Return a new object with the updated chat messages
      return {
        ...dispute,
        chatMessages: [...dispute.chatMessages, newMessage],
        updatedAt: new Date().toISOString(),
      };
    }
    
    try {
      await this.initConnection();
      
      // This would be replaced with actual blockchain transaction
      console.log(`Adding chat message to dispute ${disputeId} on blockchain...`);
      
      // For now, return the updated dispute
      const dispute = mockDisputes.find(d => d.id === disputeId);
      
      if (!dispute) return undefined;
      
      // Create a new chat message
      const newMessage: ChatMessage = {
        ...message,
        id: `cm${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      
      // Return a new object with the updated chat messages
      return {
        ...dispute,
        chatMessages: [...dispute.chatMessages, newMessage],
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error(`Failed to add chat message to dispute ${disputeId} on blockchain:`, error);
      throw new Error('Failed to add chat message to dispute on blockchain');
    }
  }

  /**
   * Update a dispute status on the blockchain
   */
  async updateDisputeStatus(disputeId: string, status: 'pending' | 'in_chat' | 'in_jury' | 'resolved', resolution?: string, compensation?: number): Promise<Dispute | undefined> {
    if (!USE_BLOCKCHAIN_DATA) {
      const dispute = mockDisputes.find(d => d.id === disputeId);
      
      if (!dispute) return undefined;
      
      // In a real app, we would update the mock data here
      // const updatedDispute = {
      //   ...dispute,
      //   status,
      //   resolution,
      //   compensation,
      //   updatedAt: new Date().toISOString(),
      // };
      
      // Return a new object with the updated status
      return {
        ...dispute,
        status,
        resolution,
        compensation,
        updatedAt: new Date().toISOString(),
      };
    }
    
    try {
      await this.initConnection();
      
      // This would be replaced with actual blockchain transaction
      console.log(`Updating dispute ${disputeId} status to ${status} on blockchain...`);
      
      // For now, return the updated dispute
      const dispute = mockDisputes.find(d => d.id === disputeId);
      
      if (!dispute) return undefined;
      
      // Return a new object with the updated status
      return {
        ...dispute,
        status,
        resolution,
        compensation,
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error(`Failed to update dispute ${disputeId} status on blockchain:`, error);
      throw new Error('Failed to update dispute status on blockchain');
    }
  }

  /**
   * Submit a jury vote for a dispute on the blockchain
   */
  async submitJuryVote(vote: Omit<JuryVote, 'id' | 'createdAt'>): Promise<JuryVote> {
    if (!USE_BLOCKCHAIN_DATA) {
      // Create a mock jury vote with generated ID and timestamp
      const newVote: JuryVote = {
        ...vote,
        id: `jv${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      
      // In a real app, we would update the mock data here
      // Update the dispute with the new vote count
      // const dispute = mockDisputes.find(d => d.id === vote.disputeId);
      // if (dispute) {
      //   dispute.juryVotes += 1;
      //   if (vote.vote === 'buyer') {
      //     dispute.buyerVoteCount += 1;
      //   } else {
      //     dispute.sellerVoteCount += 1;
      //   }
      //   dispute.updatedAt = new Date().toISOString();
      // }
      
      return newVote;
    }
    
    try {
      await this.initConnection();
      
      // This would be replaced with actual blockchain transaction
      console.log(`Submitting jury vote for dispute ${vote.disputeId} on blockchain...`);
      
      // For now, return a mock jury vote
      const newVote: JuryVote = {
        ...vote,
        id: `jv${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      
      return newVote;
    } catch (error) {
      console.error(`Failed to submit jury vote for dispute ${vote.disputeId} on blockchain:`, error);
      throw new Error('Failed to submit jury vote on blockchain');
    }
  }
}

// Export a singleton instance
export const blockchainService = new BlockchainService();
