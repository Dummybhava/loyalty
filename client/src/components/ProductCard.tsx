import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const purchaseMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/purchase", {
        amount: parseFloat(product.price),
        orderId: `order_${Date.now()}`,
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/customer/loyalty"] });
      toast({
        title: "Purchase Successful!",
        description: `You earned ${data.pointsEarned} points from this purchase.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Purchase Failed",
        description: error.message || "Failed to process purchase",
        variant: "destructive",
      });
    },
  });

  const pointsEarned = Math.floor(parseFloat(product.price) * 10);

  return (
    <Card className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img 
        src={product.imageUrl || "https://via.placeholder.com/400x500?text=Product"} 
        alt={product.name}
        className="w-full h-64 object-cover" 
      />
      <CardContent className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3">{product.description}</p>
        <div className="flex justify-between items-center mb-3">
          <span className="text-xl font-bold text-gray-900">${product.price}</span>
          <span className="text-sm text-green-600 font-medium">+{pointsEarned} pts</span>
        </div>
        <Button 
          onClick={() => purchaseMutation.mutate()}
          disabled={purchaseMutation.isPending}
          className="w-full bg-primary hover:bg-primary/90"
        >
          {purchaseMutation.isPending ? "Processing..." : "Buy Now"}
        </Button>
      </CardContent>
    </Card>
  );
}
