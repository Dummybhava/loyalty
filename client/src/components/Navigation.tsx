import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Gift, User, Settings, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface NavigationProps {
  onOpenLoyalty: () => void;
}

export default function Navigation({ onOpenLoyalty }: NavigationProps) {
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const { data: loyaltyData } = useQuery({
    queryKey: ["/api/customer/loyalty"],
    enabled: !!user,
  });

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary">StyleRewards</h1>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-primary transition-colors">Shop</a>
            <a href="#" className="text-gray-700 hover:text-primary transition-colors">Rewards</a>
            <a href="#" className="text-gray-700 hover:text-primary transition-colors">My Account</a>
          </div>
          <div className="flex items-center space-x-4">
            {loyaltyData && (
              <div className="hidden sm:flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
                <Star className="text-primary h-4 w-4" />
                <span className="text-sm font-medium text-primary">{loyaltyData.totalPoints || 0} pts</span>
                <span className="text-xs text-gray-600 capitalize">{loyaltyData.currentTier || "bronze"}</span>
              </div>
            )}
            <Button onClick={onOpenLoyalty} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90">
              <Gift className="mr-2 h-4 w-4" />Rewards
            </Button>
            <Button 
              variant="outline"
              onClick={() => setLocation("/admin")}
              className="bg-gray-800 text-white hover:bg-gray-700"
            >
              <Settings className="mr-2 h-4 w-4" />Admin
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
