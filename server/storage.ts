import {
  users,
  customerLoyalty,
  loyaltyPrograms,
  rewards,
  pointTransactions,
  rewardRedemptions,
  products,
  type User,
  type UpsertUser,
  type CustomerLoyalty,
  type InsertCustomerLoyalty,
  type LoyaltyProgram,
  type InsertLoyaltyProgram,
  type Reward,
  type InsertReward,
  type PointTransaction,
  type InsertPointTransaction,
  type RewardRedemption,
  type InsertRewardRedemption,
  type Product,
  type InsertProduct,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sum, count, and } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Customer loyalty operations
  getCustomerLoyalty(userId: string): Promise<CustomerLoyalty | undefined>;
  createCustomerLoyalty(loyalty: InsertCustomerLoyalty): Promise<CustomerLoyalty>;
  updateCustomerLoyalty(userId: string, updates: Partial<CustomerLoyalty>): Promise<CustomerLoyalty>;
  
  // Loyalty program operations
  getLoyaltyPrograms(): Promise<LoyaltyProgram[]>;
  getActiveLoyaltyPrograms(): Promise<LoyaltyProgram[]>;
  createLoyaltyProgram(program: InsertLoyaltyProgram): Promise<LoyaltyProgram>;
  updateLoyaltyProgram(id: string, updates: Partial<LoyaltyProgram>): Promise<LoyaltyProgram>;
  
  // Rewards operations
  getRewards(): Promise<Reward[]>;
  getActiveRewards(): Promise<Reward[]>;
  getReward(id: string): Promise<Reward | undefined>;
  createReward(reward: InsertReward): Promise<Reward>;
  updateReward(id: string, updates: Partial<Reward>): Promise<Reward>;
  
  // Point transaction operations
  addPointTransaction(transaction: InsertPointTransaction): Promise<PointTransaction>;
  getUserPointTransactions(userId: string): Promise<PointTransaction[]>;
  
  // Reward redemption operations
  redeemReward(redemption: InsertRewardRedemption): Promise<RewardRedemption>;
  getUserRedemptions(userId: string): Promise<RewardRedemption[]>;
  
  // Product operations
  getProducts(): Promise<Product[]>;
  getActiveProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Analytics operations
  getLoyaltyStats(): Promise<{
    totalMembers: number;
    totalPointsIssued: number;
    totalRedemptions: number;
    revenueImpact: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Customer loyalty operations
  async getCustomerLoyalty(userId: string): Promise<CustomerLoyalty | undefined> {
    const [loyalty] = await db
      .select()
      .from(customerLoyalty)
      .where(eq(customerLoyalty.userId, userId));
    return loyalty;
  }

  async createCustomerLoyalty(loyalty: InsertCustomerLoyalty): Promise<CustomerLoyalty> {
    const [newLoyalty] = await db
      .insert(customerLoyalty)
      .values(loyalty)
      .returning();
    return newLoyalty;
  }

  async updateCustomerLoyalty(userId: string, updates: Partial<CustomerLoyalty>): Promise<CustomerLoyalty> {
    const [updated] = await db
      .update(customerLoyalty)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(customerLoyalty.userId, userId))
      .returning();
    return updated;
  }

  // Loyalty program operations
  async getLoyaltyPrograms(): Promise<LoyaltyProgram[]> {
    return await db.select().from(loyaltyPrograms).orderBy(desc(loyaltyPrograms.createdAt));
  }

  async getActiveLoyaltyPrograms(): Promise<LoyaltyProgram[]> {
    return await db
      .select()
      .from(loyaltyPrograms)
      .where(eq(loyaltyPrograms.isActive, true))
      .orderBy(desc(loyaltyPrograms.createdAt));
  }

  async createLoyaltyProgram(program: InsertLoyaltyProgram): Promise<LoyaltyProgram> {
    const [newProgram] = await db
      .insert(loyaltyPrograms)
      .values(program)
      .returning();
    return newProgram;
  }

  async updateLoyaltyProgram(id: string, updates: Partial<LoyaltyProgram>): Promise<LoyaltyProgram> {
    const [updated] = await db
      .update(loyaltyPrograms)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(loyaltyPrograms.id, id))
      .returning();
    return updated;
  }

  // Rewards operations
  async getRewards(): Promise<Reward[]> {
    return await db.select().from(rewards).orderBy(desc(rewards.createdAt));
  }

  async getActiveRewards(): Promise<Reward[]> {
    return await db
      .select()
      .from(rewards)
      .where(eq(rewards.isActive, true))
      .orderBy(rewards.pointCost);
  }

  async getReward(id: string): Promise<Reward | undefined> {
    const [reward] = await db.select().from(rewards).where(eq(rewards.id, id));
    return reward;
  }

  async createReward(reward: InsertReward): Promise<Reward> {
    const [newReward] = await db
      .insert(rewards)
      .values(reward)
      .returning();
    return newReward;
  }

  async updateReward(id: string, updates: Partial<Reward>): Promise<Reward> {
    const [updated] = await db
      .update(rewards)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(rewards.id, id))
      .returning();
    return updated;
  }

  // Point transaction operations
  async addPointTransaction(transaction: InsertPointTransaction): Promise<PointTransaction> {
    const [newTransaction] = await db
      .insert(pointTransactions)
      .values(transaction)
      .returning();
    
    // Update customer's total points
    const existingLoyalty = await this.getCustomerLoyalty(transaction.userId);
    if (existingLoyalty) {
      const newTotal = (existingLoyalty.totalPoints || 0) + transaction.amount;
      await this.updateCustomerLoyalty(transaction.userId, { totalPoints: newTotal });
    }
    
    return newTransaction;
  }

  async getUserPointTransactions(userId: string): Promise<PointTransaction[]> {
    return await db
      .select()
      .from(pointTransactions)
      .where(eq(pointTransactions.userId, userId))
      .orderBy(desc(pointTransactions.createdAt));
  }

  // Reward redemption operations
  async redeemReward(redemption: InsertRewardRedemption): Promise<RewardRedemption> {
    const [newRedemption] = await db
      .insert(rewardRedemptions)
      .values(redemption)
      .returning();
    
    // Deduct points from customer
    await this.addPointTransaction({
      userId: redemption.userId,
      amount: -redemption.pointsUsed,
      type: 'redeemed',
      description: `Redeemed reward`,
    });
    
    // Update reward redemption count
    const reward = await this.getReward(redemption.rewardId);
    if (reward) {
      await this.updateReward(redemption.rewardId, {
        redemptionCount: (reward.redemptionCount || 0) + 1
      });
    }
    
    return newRedemption;
  }

  async getUserRedemptions(userId: string): Promise<RewardRedemption[]> {
    return await db
      .select()
      .from(rewardRedemptions)
      .where(eq(rewardRedemptions.userId, userId))
      .orderBy(desc(rewardRedemptions.createdAt));
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).orderBy(desc(products.createdAt));
  }

  async getActiveProducts(): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(eq(products.isActive, true))
      .orderBy(desc(products.createdAt));
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db
      .insert(products)
      .values(product)
      .returning();
    return newProduct;
  }

  // Analytics operations
  async getLoyaltyStats(): Promise<{
    totalMembers: number;
    totalPointsIssued: number;
    totalRedemptions: number;
    revenueImpact: number;
  }> {
    const [memberCount] = await db
      .select({ count: count() })
      .from(customerLoyalty);
    
    const [pointsData] = await db
      .select({ 
        total: sum(pointTransactions.amount).mapWith(Number) 
      })
      .from(pointTransactions)
      .where(eq(pointTransactions.type, 'earned'));
    
    const [redemptionCount] = await db
      .select({ count: count() })
      .from(rewardRedemptions);
    
    return {
      totalMembers: memberCount.count,
      totalPointsIssued: pointsData.total || 0,
      totalRedemptions: redemptionCount.count,
      revenueImpact: 94250, // This would be calculated based on purchase data
    };
  }
}

export const storage = new DatabaseStorage();
