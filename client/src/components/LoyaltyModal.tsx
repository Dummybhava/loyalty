import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { DollarSign, Truck, Star, Coins, Gift, X } from "lucide-react";
import type { Reward } from "@shared/schema";

interface LoyaltyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoyaltyModal({ isOpen, onClose }: LoyaltyModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: loyaltyData } = useQuery<any>({
    queryKey: ["/api/customer/loyalty"],
    enabled: isOpen,
  });

  const { data: rewards = [] } = useQuery<Reward[]>({
    queryKey: ["/api/rewards"],
    enabled: isOpen,
  });

  const redeemMutation = useMutation({
    mutationFn: async (rewardId: string) => {
      await apiRequest("POST", "/api/rewards/redeem", { rewardId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customer/loyalty"] });
      toast({
        title: "Reward Redeemed!",
        description: "Your reward has been successfully redeemed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Redemption Failed",
        description: error.message || "Failed to redeem reward",
        variant: "destructive",
      });
    },
  });

  const getRewardIcon = (type: string) => {
    switch (type) {
      case "discount":
        return DollarSign;
      case "shipping":
        return Truck;
      case "access":
        return Star;
      default:
        return Gift;
    }
  };

  const getTierProgress = (tier: string, spent: number) => {
    const tiers = {
      bronze: { min: 0, max: 299, next: "Silver" },
      silver: { min: 300, max: 599, next: "Gold" },
      gold: { min: 600, max: 999, next: "Platinum" },
      platinum: { min: 1000, max: Infinity, next: null },
    };
    
    const currentTier = tiers[tier as keyof typeof tiers] || tiers.bronze;
    if (currentTier.next === null) return { progress: 100, remaining: 0, nextTier: null };
    
    const progress = ((spent - currentTier.min) / (currentTier.max - currentTier.min)) * 100;
    const remaining = currentTier.max - spent + 1;
    
    return { progress: Math.min(progress, 100), remaining, nextTier: currentTier.next };
  };

  const tierInfo = loyaltyData ? getTierProgress(
    loyaltyData.currentTier || "bronze", 
    parseFloat(loyaltyData.lifetimeSpent || "0")
  ) : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-primary text-white p-6 rounded-t-lg -mx-6 -mt-6 relative">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold mb-2">Welcome to</h2>
          <h1 className="text-3xl font-bold">StyleRewards Program</h1>
        </div>

        <div className="space-y-6 mt-6">
          {/* Member Status */}
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2 capitalize">
              You're a {loyaltyData?.currentTier || "Bronze"} Member!
            </h3>
            <p className="text-gray-600 mb-4">
              Earn {loyaltyData?.currentTier === "gold" ? "15" : loyaltyData?.currentTier === "silver" ? "12" : loyaltyData?.currentTier === "platinum" ? "20" : "10"} points on every $1 spent.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-primary mb-1">
                {loyaltyData?.totalPoints || 0}
              </div>
              <div className="text-sm text-gray-600">Available Points</div>
            </div>
          </div>

          {/* Progress to Next Tier */}
          {tierInfo && tierInfo.nextTier && (
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress to {tierInfo.nextTier}</span>
                <span>${tierInfo.remaining} more</span>
              </div>
              <Progress value={tierInfo.progress} className="h-2" />
            </div>
          )}

          {/* Rewards Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Available Rewards</h4>
            <div className="space-y-3">
              {rewards.length === 0 ? (
                <div className="text-center py-8">
                  <Gift className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No rewards available at the moment.</p>
                </div>
              ) : (
                rewards.map((reward) => {
                  const Icon = getRewardIcon(reward.type);
                  const canRedeem = (loyaltyData?.totalPoints || 0) >= reward.pointCost;
                  
                  return (
                    <div 
                      key={reward.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                          reward.type === "discount" ? "bg-green-600" :
                          reward.type === "shipping" ? "bg-primary" :
                          "bg-purple-600"
                        }`}>
                          <Icon className="text-white text-sm" />
                        </div>
                        <div>
                          <div className="font-medium">{reward.name}</div>
                          <div className="text-sm text-gray-600">{reward.pointCost} points</div>
                        </div>
                      </div>
                      <Button 
                        onClick={() => redeemMutation.mutate(reward.id)}
                        disabled={!canRedeem || redeemMutation.isPending}
                        variant={canRedeem ? "default" : "secondary"}
                        size="sm"
                        className={!canRedeem ? "text-gray-400" : ""}
                      >
                        {!canRedeem ? "Not Enough Points" : redeemMutation.isPending ? "Claiming..." : "Claim"}
                      </Button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Ways to Earn */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <Coins className="text-primary mr-2" />
              Ways to Earn
            </h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>• Make a purchase</span>
                <span>10 pts per $1</span>
              </div>
              <div className="flex justify-between">
                <span>• Refer a friend</span>
                <span>500 pts</span>
              </div>
              <div className="flex justify-between">
                <span>• Write a review</span>
                <span>50 pts</span>
              </div>
              <div className="flex justify-between">
                <span>• Follow on social media</span>
                <span>25 pts</span>
              </div>
            </div>
          </div>

          {/* Ways to Redeem */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <Gift className="text-primary mr-2" />
              Ways to Redeem
            </h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div>• Cash discounts on purchases</div>
              <div>• Free shipping on any order</div>
              <div>• Early access to new collections</div>
              <div>• Exclusive member-only products</div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 pt-4 border-t">
            © 2025 StyleRewards. All rights reserved. Version: 1.0.0
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
