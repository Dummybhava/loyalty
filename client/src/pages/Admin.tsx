import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Coins, 
  Gift, 
  DollarSign, 
  ArrowLeft, 
  Plus,
  BarChart3,
  TrendingUp,
  Settings,
  Megaphone,
  Trophy
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import AdminProgramForm from "@/components/AdminProgramForm";
import type { LoyaltyProgram, Reward } from "@shared/schema";

interface LoyaltyStats {
  totalMembers: number;
  totalPointsIssued: number;
  totalRedemptions: number;
  revenueImpact: number;
}

export default function Admin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // For development testing - bypass full authentication requirement
  const isDevMode = true;
  
  const [newProgram, setNewProgram] = useState({
    name: "",
    type: "points",
    pointsPerDollar: 10,
    cashBackPercent: 0,
    minimumPurchase: 0,
    description: "",
    isActive: true,
    constraints: {
      multipleRedemptions: true,
      maxRedemptionsPerCustomer: 0,
      validFrom: "",
      validTo: "",
      eligibilityRules: "",
    }
  });

  const [newReward, setNewReward] = useState({
    name: "",
    description: "",
    type: "discount",
    pointCost: 0,
    discountAmount: 0,
    discountPercent: 0,
  });

  // Mock data for development - replace with actual API calls when authentication is set up
  const stats = {
    totalMembers: 1250,
    totalPointsIssued: 45678,
    totalRedemptions: 567,
    revenueImpact: 12500
  };

  const programs = [
    {
      id: 1,
      name: "StyleRewards Premium",
      type: "points" as const,
      pointsPerDollar: 10,
      cashBackPercent: 0,
      minimumPurchase: "50",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const rewards = [
    {
      id: 1,
      name: "$10 Off Your Next Purchase",
      description: "Get $10 off any order over $50",
      type: "discount" as const,
      pointCost: 1000,
      discountAmount: 10,
      discountPercent: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // Mutations
  const createProgramMutation = useMutation({
    mutationFn: async (programData: any) => {
      await apiRequest("POST", "/api/admin/programs", programData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/programs"] });
      toast({ title: "Success", description: "Loyalty program created successfully" });
      setNewProgram({
        name: "",
        type: "points",
        pointsPerDollar: 10,
        cashBackPercent: 0,
        minimumPurchase: 0,
        description: "",
        isActive: true,
        constraints: {
          multipleRedemptions: true,
          maxRedemptionsPerCustomer: 0,
          validFrom: "",
          validTo: "",
          eligibilityRules: "",
        }
      });
    },
    onError: (error) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to create program",
        variant: "destructive" 
      });
    },
  });

  const createRewardMutation = useMutation({
    mutationFn: async (rewardData: any) => {
      await apiRequest("POST", "/api/admin/rewards", rewardData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/rewards"] });
      toast({ title: "Success", description: "Reward created successfully" });
      setNewReward({
        name: "",
        description: "",
        type: "discount",
        pointCost: 0,
        discountAmount: 0,
        discountPercent: 0,
      });
    },
    onError: (error) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to create reward",
        variant: "destructive" 
      });
    },
  });

  const initDataMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/admin/init-data", {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast({ title: "Success", description: "Sample data initialized successfully" });
    },
    onError: (error) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to initialize data",
        variant: "destructive" 
      });
    },
  });

  const handleCreateProgram = (e: React.FormEvent) => {
    e.preventDefault();
    createProgramMutation.mutate({
      ...newProgram,
      pointsPerDollar: Number(newProgram.pointsPerDollar),
      cashBackPercent: newProgram.type === "cash" ? Number(newProgram.cashBackPercent) : null,
      minimumPurchase: Number(newProgram.minimumPurchase).toString(),
    });
  };

  const handleCreateReward = (e: React.FormEvent) => {
    e.preventDefault();
    createRewardMutation.mutate({
      ...newReward,
      pointCost: Number(newReward.pointCost),
      discountAmount: newReward.type === "discount" ? Number(newReward.discountAmount).toString() : null,
      discountPercent: newReward.type === "discount" ? Number(newReward.discountPercent).toString() : null,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="flex">
        <div className="w-64 bg-gray-800 min-h-screen">
          <div className="p-6">
            <h2 className="text-white text-xl font-bold mb-8">StyleRewards Admin</h2>
            <nav className="space-y-2">
              <a href="#" className="flex items-center text-white bg-primary px-4 py-2 rounded-lg">
                <BarChart3 className="mr-3 h-4 w-4" />Dashboard
              </a>
              <a href="#" className="flex items-center text-gray-300 hover:text-white hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors">
                <Gift className="mr-3 h-4 w-4" />Loyalty Programs
              </a>
              <a href="#" className="flex items-center text-gray-300 hover:text-white hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors">
                <Trophy className="mr-3 h-4 w-4" />Rewards
              </a>
              <a href="#" className="flex items-center text-gray-300 hover:text-white hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors">
                <Megaphone className="mr-3 h-4 w-4" />Campaigns
              </a>
              <a href="#" className="flex items-center text-gray-300 hover:text-white hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors">
                <Users className="mr-3 h-4 w-4" />Customers
              </a>
              <a href="#" className="flex items-center text-gray-300 hover:text-white hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors">
                <TrendingUp className="mr-3 h-4 w-4" />Analytics
              </a>
              <a href="#" className="flex items-center text-gray-300 hover:text-white hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors">
                <Settings className="mr-3 h-4 w-4" />Settings
              </a>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Loyalty Program Management</h1>
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline"
                  onClick={() => setLocation("/")}
                  className="text-primary hover:text-primary/80"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />Back to Store
                </Button>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                  <span className="text-gray-700 font-medium">Admin User</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total Members</p>
                      <p className="text-3xl font-bold text-gray-900">{stats?.totalMembers?.toLocaleString() || "0"}</p>
                    </div>
                    <div className="bg-primary p-3 rounded-full">
                      <Users className="text-white h-6 w-6" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-green-600">+12%</span>
                    <span className="text-gray-600 ml-2">vs last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Points Issued</p>
                      <p className="text-3xl font-bold text-gray-900">{stats?.totalPointsIssued?.toLocaleString() || "0"}</p>
                    </div>
                    <div className="bg-green-600 p-3 rounded-full">
                      <Coins className="text-white h-6 w-6" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-green-600">+8%</span>
                    <span className="text-gray-600 ml-2">vs last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Rewards Redeemed</p>
                      <p className="text-3xl font-bold text-gray-900">{stats?.totalRedemptions?.toLocaleString() || "0"}</p>
                    </div>
                    <div className="bg-purple-600 p-3 rounded-full">
                      <Gift className="text-white h-6 w-6" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-green-600">+15%</span>
                    <span className="text-gray-600 ml-2">vs last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Revenue Impact</p>
                      <p className="text-3xl font-bold text-gray-900">${stats?.revenueImpact?.toLocaleString() || "0"}</p>
                    </div>
                    <div className="bg-amber-600 p-3 rounded-full">
                      <DollarSign className="text-white h-6 w-6" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-green-600">+22%</span>
                    <span className="text-gray-600 ml-2">vs last month</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Management Tabs */}
            <Tabs defaultValue="programs" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="programs">Loyalty Programs</TabsTrigger>
                <TabsTrigger value="rewards">Rewards</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="programs" className="space-y-6">
                {/* Comprehensive Program Creation Form */}
                <AdminProgramForm />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Create Program */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Plus className="mr-2 h-5 w-5" />
                        Create Loyalty Program
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleCreateProgram} className="space-y-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
                          
                          <div>
                            <Label htmlFor="programName">Campaign Name</Label>
                            <Input 
                              id="programName"
                              type="text" 
                              placeholder="e.g., StyleRewards Premium"
                              value={newProgram.name}
                              onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })}
                              required
                            />
                          </div>

                          <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea 
                              id="description"
                              placeholder="Enter program description..."
                              value={newProgram.description}
                              onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })}
                              rows={3}
                            />
                          </div>
                        </div>

                        {/* Redemption Configuration */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium text-gray-900">Redemption</h3>
                          <p className="text-sm text-gray-600">How customers redeem rewards</p>
                          
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <label className="flex items-center p-3 cursor-pointer">
                              <input 
                                type="radio" 
                                name="rewardType" 
                                value="fixedAmount" 
                                checked={newProgram.type === "fixedAmount"}
                                onChange={(e) => setNewProgram({ ...newProgram, type: e.target.value })}
                                className="text-primary mr-3" 
                              />
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">Fixed amount</div>
                                <div className="text-sm text-gray-600">Set discount amount</div>
                                {newProgram.type === "fixedAmount" && (
                                  <div className="mt-2">
                                    <Input 
                                      type="number" 
                                      placeholder="10"
                                      min="1"
                                      value={newProgram.pointsPerDollar}
                                      onChange={(e) => setNewProgram({ ...newProgram, pointsPerDollar: Number(e.target.value) })}
                                      className="w-24"
                                    />
                                  </div>
                                )}
                              </div>
                            </label>
                          </div>

                          <div className="space-y-2">
                            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                              <input 
                                type="radio" 
                                name="rewardType" 
                                value="percentage" 
                                checked={newProgram.type === "percentage"}
                                onChange={(e) => setNewProgram({ ...newProgram, type: e.target.value })}
                                className="text-primary mr-3" 
                              />
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">Percentage</div>
                                <div className="text-sm text-gray-600">Percentage discount</div>
                                {newProgram.type === "percentage" && (
                                  <div className="mt-2 flex items-center space-x-2">
                                    <Input 
                                      type="number" 
                                      placeholder="5"
                                      min="1"
                                      max="100"
                                      value={newProgram.cashBackPercent}
                                      onChange={(e) => setNewProgram({ ...newProgram, cashBackPercent: Number(e.target.value) })}
                                      className="w-24"
                                    />
                                    <span className="text-sm text-gray-600">%</span>
                                  </div>
                                )}
                              </div>
                            </label>
                          </div>

                          <div>
                            <Label>Earn loyalty points</Label>
                            <div className="flex items-center space-x-2 mt-1">
                              <Input 
                                type="number" 
                                placeholder="10"
                                min="1"
                                value={newProgram.pointsPerDollar}
                                onChange={(e) => setNewProgram({ ...newProgram, pointsPerDollar: Number(e.target.value) })}
                                className="w-24"
                              />
                              <span className="text-sm text-gray-600">points for every $1 spent</span>
                            </div>
                          </div>
                        </div>

                        {/* Constraints */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium text-gray-900">Constraints</h3>
                          <p className="text-sm text-gray-600">How customers redeem rewards</p>
                          
                          <div className="space-y-3">
                            <label className="flex items-center">
                              <input 
                                type="checkbox" 
                                checked={newProgram.constraints.multipleRedemptions}
                                onChange={(e) => setNewProgram({ 
                                  ...newProgram, 
                                  constraints: { ...newProgram.constraints, multipleRedemptions: e.target.checked }
                                })}
                                className="mr-2"
                              />
                              <span className="text-sm">Customer can redeem multiple times</span>
                            </label>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="maxRedemptions">Max per customer</Label>
                                <Input 
                                  id="maxRedemptions"
                                  type="number" 
                                  placeholder="0"
                                  min="0"
                                  value={newProgram.constraints.maxRedemptionsPerCustomer}
                                  onChange={(e) => setNewProgram({ 
                                    ...newProgram, 
                                    constraints: { ...newProgram.constraints, maxRedemptionsPerCustomer: Number(e.target.value) }
                                  })}
                                />
                              </div>
                              <div>
                                <Label htmlFor="minPurchase">Min purchase</Label>
                                <Input 
                                  id="minPurchase"
                                  type="number" 
                                  placeholder="0"
                                  min="0"
                                  value={newProgram.minimumPurchase}
                                  onChange={(e) => setNewProgram({ ...newProgram, minimumPurchase: Number(e.target.value) })}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Enrollment Period */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium text-gray-900">Enrollment</h3>
                          <p className="text-sm text-gray-600">When customers to enroll their participation</p>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="validFrom">Starts on</Label>
                              <Input 
                                id="validFrom"
                                type="date"
                                value={newProgram.constraints.validFrom}
                                onChange={(e) => setNewProgram({ 
                                  ...newProgram, 
                                  constraints: { ...newProgram.constraints, validFrom: e.target.value }
                                })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="validTo">Ends on</Label>
                              <Input 
                                id="validTo"
                                type="date"
                                value={newProgram.constraints.validTo}
                                onChange={(e) => setNewProgram({ 
                                  ...newProgram, 
                                  constraints: { ...newProgram.constraints, validTo: e.target.value }
                                })}
                              />
                            </div>
                          </div>
                        </div>

                        <Button 
                          type="submit" 
                          disabled={createProgramMutation.isPending}
                          className="w-full bg-primary hover:bg-primary/90"
                        >
                          {createProgramMutation.isPending ? "Creating..." : "Create Program"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>

                  {/* Active Programs */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        Active Programs
                        <Badge variant="secondary">{programs.filter(p => p.isActive).length} Active</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {programs.length === 0 ? (
                          <div className="text-center py-8">
                            <Gift className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No programs yet</h3>
                            <p className="text-gray-500 mb-4">Create your first loyalty program to get started.</p>
                            <Button 
                              onClick={() => initDataMutation.mutate()}
                              disabled={initDataMutation.isPending}
                              variant="outline"
                            >
                              {initDataMutation.isPending ? "Initializing..." : "Initialize Sample Data"}
                            </Button>
                          </div>
                        ) : (
                          programs.map((program) => (
                            <div key={program.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h4 className="font-semibold text-gray-900">{program.name}</h4>
                                  <p className="text-sm text-gray-600 capitalize">{program.type} Based Program</p>
                                </div>
                                <Badge variant={program.isActive ? "default" : "secondary"}>
                                  {program.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-600">
                                    {program.type === "points" ? "Points Ratio:" : "Cash Back:"}
                                  </span>
                                  <span className="font-medium ml-1">
                                    {program.type === "points" 
                                      ? `${program.pointsPerDollar}:1` 
                                      : `${program.cashBackPercent}%`
                                    }
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Min Purchase:</span>
                                  <span className="font-medium ml-1">${program.minimumPurchase}</span>
                                </div>
                              </div>
                              <div className="flex justify-end mt-3 space-x-2">
                                <Button variant="outline" size="sm">Edit</Button>
                                <Button variant="outline" size="sm">View</Button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="rewards" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Create Reward */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Plus className="mr-2 h-5 w-5" />
                        Create Reward
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleCreateReward} className="space-y-4">
                        <div>
                          <Label htmlFor="rewardName">Reward Name</Label>
                          <Input 
                            id="rewardName"
                            type="text" 
                            placeholder="e.g., $10 Off Next Purchase"
                            value={newReward.name}
                            onChange={(e) => setNewReward({ ...newReward, name: e.target.value })}
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="rewardDescription">Description</Label>
                          <Textarea 
                            id="rewardDescription"
                            placeholder="Describe the reward benefits"
                            value={newReward.description}
                            onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
                          />
                        </div>

                        <div>
                          <Label htmlFor="rewardType">Reward Type</Label>
                          <Select 
                            value={newReward.type} 
                            onValueChange={(value) => setNewReward({ ...newReward, type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select reward type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="discount">Cash Discount</SelectItem>
                              <SelectItem value="shipping">Free Shipping</SelectItem>
                              <SelectItem value="access">Exclusive Access</SelectItem>
                              <SelectItem value="product">Free Product</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="pointCost">Point Cost</Label>
                          <Input 
                            id="pointCost"
                            type="number" 
                            placeholder="1000"
                            min="1"
                            value={newReward.pointCost}
                            onChange={(e) => setNewReward({ ...newReward, pointCost: Number(e.target.value) })}
                            required
                          />
                        </div>

                        {newReward.type === "discount" && (
                          <div>
                            <Label htmlFor="discountAmount">Discount Amount ($)</Label>
                            <Input 
                              id="discountAmount"
                              type="number" 
                              placeholder="10"
                              min="0"
                              step="0.01"
                              value={newReward.discountAmount}
                              onChange={(e) => setNewReward({ ...newReward, discountAmount: Number(e.target.value) })}
                            />
                          </div>
                        )}

                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={createRewardMutation.isPending}
                        >
                          {createRewardMutation.isPending ? "Creating..." : "Create Reward"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>

                  {/* Rewards List */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Rewards Catalogue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {rewards.length === 0 ? (
                          <div className="text-center py-8">
                            <Gift className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No rewards yet</h3>
                            <p className="text-gray-500">Create your first reward to get started.</p>
                          </div>
                        ) : (
                          rewards.map((reward) => (
                            <div key={reward.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-semibold text-gray-900">{reward.name}</h4>
                                <Badge variant={reward.isActive ? "default" : "secondary"}>
                                  {reward.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">{reward.description}</p>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-600">Type:</span>
                                  <span className="font-medium ml-1 capitalize">{reward.type}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Cost:</span>
                                  <span className="font-medium ml-1">{reward.pointCost} pts</span>
                                </div>
                              </div>
                              <div className="flex justify-end mt-3 space-x-2">
                                <Button variant="outline" size="sm">Edit</Button>
                                <Button variant="outline" size="sm">
                                  {reward.isActive ? "Disable" : "Enable"}
                                </Button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="analytics">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Member Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <BarChart3 className="mx-auto h-12 w-12 mb-2" />
                          <p>Member Growth Chart</p>
                          <p className="text-sm">Chart implementation required</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Redemption Patterns</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <TrendingUp className="mx-auto h-12 w-12 mb-2" />
                          <p>Redemption Analytics</p>
                          <p className="text-sm">Chart implementation required</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
