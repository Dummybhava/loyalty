import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertLoyaltyProgramSchema,
  insertRewardSchema,
  insertPointTransactionSchema,
  insertRewardRedemptionSchema,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get or create customer loyalty data
      let loyalty = await storage.getCustomerLoyalty(userId);
      if (!loyalty) {
        loyalty = await storage.createCustomerLoyalty({ userId });
      }
      
      res.json({ ...user, loyalty });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Customer loyalty routes
  app.get('/api/customer/loyalty', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      let loyalty = await storage.getCustomerLoyalty(userId);
      
      if (!loyalty) {
        loyalty = await storage.createCustomerLoyalty({ userId });
      }
      
      res.json(loyalty);
    } catch (error) {
      console.error("Error fetching loyalty data:", error);
      res.status(500).json({ message: "Failed to fetch loyalty data" });
    }
  });

  app.get('/api/customer/transactions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const transactions = await storage.getUserPointTransactions(userId);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.get('/api/customer/redemptions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const redemptions = await storage.getUserRedemptions(userId);
      res.json(redemptions);
    } catch (error) {
      console.error("Error fetching redemptions:", error);
      res.status(500).json({ message: "Failed to fetch redemptions" });
    }
  });

  // Rewards routes
  app.get('/api/rewards', async (req, res) => {
    try {
      const rewards = await storage.getActiveRewards();
      res.json(rewards);
    } catch (error) {
      console.error("Error fetching rewards:", error);
      res.status(500).json({ message: "Failed to fetch rewards" });
    }
  });

  app.post('/api/rewards/redeem', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { rewardId } = req.body;
      
      if (!rewardId) {
        return res.status(400).json({ message: "Reward ID is required" });
      }
      
      const reward = await storage.getReward(rewardId);
      if (!reward || !reward.isActive) {
        return res.status(404).json({ message: "Reward not found or inactive" });
      }
      
      const loyalty = await storage.getCustomerLoyalty(userId);
      if (!loyalty || (loyalty.totalPoints || 0) < reward.pointCost) {
        return res.status(400).json({ message: "Insufficient points" });
      }
      
      const redemption = await storage.redeemReward({
        userId,
        rewardId,
        pointsUsed: reward.pointCost,
      });
      
      res.json(redemption);
    } catch (error) {
      console.error("Error redeeming reward:", error);
      res.status(500).json({ message: "Failed to redeem reward" });
    }
  });

  // Products routes
  app.get('/api/products', async (req, res) => {
    try {
      const products = await storage.getActiveProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Simulate purchase and earn points
  app.post('/api/purchase', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { amount, orderId } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Valid purchase amount is required" });
      }
      
      // Get active loyalty program (assuming default 10 points per dollar)
      const pointsEarned = Math.floor(amount * 10);
      
      const transaction = await storage.addPointTransaction({
        userId,
        amount: pointsEarned,
        type: 'earned',
        description: `Purchase of $${amount}`,
        orderId: orderId || `order_${Date.now()}`,
      });
      
      // Update lifetime spent and check tier progression
      const loyalty = await storage.getCustomerLoyalty(userId);
      if (loyalty) {
        const newLifetimeSpent = parseFloat(loyalty.lifetimeSpent || "0") + amount;
        let newTier = loyalty.currentTier;
        
        // Tier progression logic
        if (newLifetimeSpent >= 1000) newTier = "platinum";
        else if (newLifetimeSpent >= 600) newTier = "gold";
        else if (newLifetimeSpent >= 300) newTier = "silver";
        else newTier = "bronze";
        
        await storage.updateCustomerLoyalty(userId, {
          lifetimeSpent: newLifetimeSpent.toString(),
          currentTier: newTier,
        });
      }
      
      res.json({ transaction, pointsEarned });
    } catch (error) {
      console.error("Error processing purchase:", error);
      res.status(500).json({ message: "Failed to process purchase" });
    }
  });

  // Admin routes
  app.get('/api/admin/stats', isAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getLoyaltyStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  app.get('/api/admin/programs', isAuthenticated, async (req, res) => {
    try {
      const programs = await storage.getLoyaltyPrograms();
      res.json(programs);
    } catch (error) {
      console.error("Error fetching programs:", error);
      res.status(500).json({ message: "Failed to fetch programs" });
    }
  });

  app.post('/api/admin/programs', isAuthenticated, async (req, res) => {
    try {
      const programData = insertLoyaltyProgramSchema.parse(req.body);
      const program = await storage.createLoyaltyProgram(programData);
      res.json(program);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid program data", errors: error.errors });
      }
      console.error("Error creating program:", error);
      res.status(500).json({ message: "Failed to create program" });
    }
  });

  app.get('/api/admin/rewards', isAuthenticated, async (req, res) => {
    try {
      const rewards = await storage.getRewards();
      res.json(rewards);
    } catch (error) {
      console.error("Error fetching admin rewards:", error);
      res.status(500).json({ message: "Failed to fetch rewards" });
    }
  });

  app.post('/api/admin/rewards', isAuthenticated, async (req, res) => {
    try {
      const rewardData = insertRewardSchema.parse(req.body);
      const reward = await storage.createReward(rewardData);
      res.json(reward);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid reward data", errors: error.errors });
      }
      console.error("Error creating reward:", error);
      res.status(500).json({ message: "Failed to create reward" });
    }
  });

  app.put('/api/admin/rewards/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const reward = await storage.updateReward(id, updates);
      res.json(reward);
    } catch (error) {
      console.error("Error updating reward:", error);
      res.status(500).json({ message: "Failed to update reward" });
    }
  });

  // Initialize sample data
  app.post('/api/admin/init-data', isAuthenticated, async (req, res) => {
    try {
      // Create sample products
      const sampleProducts = [
        {
          name: "Classic Denim Jacket",
          description: "Timeless style meets comfort",
          price: "89.99",
          imageUrl: "https://images.unsplash.com/photo-1544441893-675973e31985?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
          category: "outerwear"
        },
        {
          name: "Urban Sneakers",
          description: "Perfect for everyday comfort",
          price: "124.99",
          imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
          category: "footwear"
        },
        {
          name: "Evening Dress",
          description: "Sophisticated elegance",
          price: "199.99",
          imageUrl: "https://pixabay.com/get/gaca4d51e9e3a81c445593b42898fef56507011e28609842edfd0f7b79c31b096e4cd2b220810e84e0f2c3b0d127eed8594a9f1a31e91d44f36a288a292f189ac_1280.jpg",
          category: "dresses"
        },
        {
          name: "Classic Polo",
          description: "Versatile wardrobe essential",
          price: "49.99",
          imageUrl: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
          category: "shirts"
        }
      ];

      for (const product of sampleProducts) {
        await storage.createProduct(product);
      }

      // Create sample rewards
      const sampleRewards = [
        {
          name: "$10 Off Next Purchase",
          description: "Discount on next order",
          type: "discount",
          pointCost: 1000,
          discountAmount: "10.00",
        },
        {
          name: "Free Shipping",
          description: "Free delivery on any order",
          type: "shipping",
          pointCost: 500,
        },
        {
          name: "Exclusive Item Access",
          description: "Early access to new collections",
          type: "access",
          pointCost: 2000,
        },
      ];

      for (const reward of sampleRewards) {
        await storage.createReward(reward);
      }

      // Create default loyalty program
      await storage.createLoyaltyProgram({
        name: "StyleRewards Standard",
        type: "points",
        pointsPerDollar: 10,
        minimumPurchase: "0",
      });

      res.json({ message: "Sample data initialized successfully" });
    } catch (error) {
      console.error("Error initializing data:", error);
      res.status(500).json({ message: "Failed to initialize data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
