import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Percent, DollarSign } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function AdminProgramForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [programData, setProgramData] = useState({
    // Basic Information
    name: "DD Prod Loyalty Program",
    description: "Earn 10 points on every $1 spent.",
    
    // Redemption Type
    redemptionType: "fixedAmount", // "fixedAmount" or "percentage"
    fixedAmount: 10,
    percentage: 5,
    earnPointsRate: 10,
    
    // Constraints
    multipleRedemptions: true,
    maxRedemptionsPerCustomer: 0,
    minPurchaseAmount: 0,
    
    // Enrollment Period
    startDate: "",
    endDate: "",
    
    // Summary
    summary: {
      eligibleForOrders: true,
      automaticDiscountCode: true,
      noUsageLimit: true,
      automaticTargeting: true,
      customerCanRedeemMultipleTimes: true
    }
  });

  const createProgramMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/admin/programs", {
        name: data.name,
        type: data.redemptionType === "fixedAmount" ? "points" : "cash",
        pointsPerDollar: data.earnPointsRate,
        cashBackPercent: data.redemptionType === "percentage" ? data.percentage : null,
        minimumPurchase: data.minPurchaseAmount.toString(),
        isActive: true
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/programs"] });
      toast({ title: "Success", description: "Loyalty program created successfully" });
    },
    onError: (error) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to create program",
        variant: "destructive" 
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProgramMutation.mutate(programData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <form onSubmit={handleSubmit}>
        {/* Summary Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <span>20% off products</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <span>Applies for orders more than $100</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <span>Automatic discount code</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <span>No usage limit</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <span>Automatic targeting</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <span>No usage limit</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <span>Customer can redeem multiple times (approx 24 hours)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <p className="text-sm text-gray-600">Basic information about the program</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="campaignName">Campaign name</Label>
              <Input 
                id="campaignName"
                value={programData.name}
                onChange={(e) => setProgramData({ ...programData, name: e.target.value })}
                placeholder="DD Prod Loyalty Program"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <textarea 
                id="description"
                value={programData.description}
                onChange={(e) => setProgramData({ ...programData, description: e.target.value })}
                placeholder="Earn 10 points on every $1 spent."
                rows={3}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Redemption */}
        <Card>
          <CardHeader>
            <CardTitle>Redemption</CardTitle>
            <p className="text-sm text-gray-600">How do customers redeem their points/rewards</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Fixed Amount Option */}
            <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input 
                  type="radio" 
                  name="redemptionType" 
                  value="fixedAmount"
                  checked={programData.redemptionType === "fixedAmount"}
                  onChange={(e) => setProgramData({ ...programData, redemptionType: e.target.value })}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <DollarSign className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="font-medium">Fixed amount</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Customers get a fixed discount amount</p>
                  
                  {programData.redemptionType === "fixedAmount" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fixedAmount">Discount amount ($)</Label>
                        <Input 
                          id="fixedAmount"
                          type="number"
                          value={programData.fixedAmount}
                          onChange={(e) => setProgramData({ ...programData, fixedAmount: Number(e.target.value) })}
                          min="1"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="earnPoints">Earn loyalty points</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Input 
                            id="earnPoints"
                            type="number"
                            value={programData.earnPointsRate}
                            onChange={(e) => setProgramData({ ...programData, earnPointsRate: Number(e.target.value) })}
                            min="1"
                            className="w-20"
                          />
                          <span className="text-sm text-gray-600">points per $1</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </label>
            </div>

            {/* Percentage Option */}
            <div className="border-2 border-gray-200 p-4 rounded-lg hover:border-gray-300">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input 
                  type="radio" 
                  name="redemptionType" 
                  value="percentage"
                  checked={programData.redemptionType === "percentage"}
                  onChange={(e) => setProgramData({ ...programData, redemptionType: e.target.value })}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <Percent className="w-5 h-5 text-gray-600 mr-2" />
                    <span className="font-medium">Percentage</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Customers get a percentage discount</p>
                  
                  {programData.redemptionType === "percentage" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="percentage">Discount percentage (%)</Label>
                        <Input 
                          id="percentage"
                          type="number"
                          value={programData.percentage}
                          onChange={(e) => setProgramData({ ...programData, percentage: Number(e.target.value) })}
                          min="1"
                          max="100"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="earnPointsPerc">Earn loyalty points</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Input 
                            id="earnPointsPerc"
                            type="number"
                            value={programData.earnPointsRate}
                            onChange={(e) => setProgramData({ ...programData, earnPointsRate: Number(e.target.value) })}
                            min="1"
                            className="w-20"
                          />
                          <span className="text-sm text-gray-600">points per $1</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Constraints */}
        <Card>
          <CardHeader>
            <CardTitle>Constraints</CardTitle>
            <p className="text-sm text-gray-600">Who do you want customers to redeem their point/rewards</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox"
                id="multipleRedemptions"
                checked={programData.multipleRedemptions}
                onChange={(e) => setProgramData({ ...programData, multipleRedemptions: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <Label htmlFor="multipleRedemptions">Customer can redeem multiple times</Label>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="maxRedemptions">Max per customer</Label>
                <Input 
                  id="maxRedemptions"
                  type="number"
                  value={programData.maxRedemptionsPerCustomer}
                  onChange={(e) => setProgramData({ ...programData, maxRedemptionsPerCustomer: Number(e.target.value) })}
                  min="0"
                  placeholder="0 = unlimited"
                />
              </div>
              <div>
                <Label htmlFor="minPurchase">Min purchase ($)</Label>
                <Input 
                  id="minPurchase"
                  type="number"
                  value={programData.minPurchaseAmount}
                  onChange={(e) => setProgramData({ ...programData, minPurchaseAmount: Number(e.target.value) })}
                  min="0"
                  step="0.01"
                  placeholder="0"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enrollment */}
        <Card>
          <CardHeader>
            <CardTitle>Enrollment</CardTitle>
            <p className="text-sm text-gray-600">When customers to enroll their participation</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Starts on</Label>
                <Input 
                  id="startDate"
                  type="date"
                  value={programData.startDate}
                  onChange={(e) => setProgramData({ ...programData, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="endDate">Ends on</Label>
                <Input 
                  id="endDate"
                  type="date"
                  value={programData.endDate}
                  onChange={(e) => setProgramData({ ...programData, endDate: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline">
            Save as Draft
          </Button>
          <Button 
            type="submit" 
            disabled={createProgramMutation.isPending}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            {createProgramMutation.isPending ? "Creating..." : "Create Campaign"}
          </Button>
        </div>
      </form>
    </div>
  );
}