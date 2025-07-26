import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import ProductCard from "@/components/ProductCard";
import LoyaltyModal from "@/components/LoyaltyModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, Trophy, Gift, Medal, Crown, Gem } from "lucide-react";
import type { Product } from "@shared/schema";

export default function Home() {
  const [isLoyaltyModalOpen, setIsLoyaltyModalOpen] = useState(false);

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation onOpenLoyalty={() => setIsLoyaltyModalOpen(true)} />

      {/* Hero Section */}
      <section className="primary-gradient text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">Earn Rewards While You Shop</h1>
              <p className="text-xl mb-8 text-blue-100">Join our loyalty program and earn points on every purchase. Unlock exclusive rewards and tier benefits!</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => setIsLoyaltyModalOpen(true)}
                  className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100"
                >
                  View My Rewards
                </Button>
                <Button 
                  variant="outline"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary"
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Fashion model in stylish clothing" 
                className="rounded-xl shadow-2xl w-full h-auto" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Three simple steps to start earning rewards</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-50 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <ShoppingBag className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-4">1. Shop & Earn</h3>
              <p className="text-gray-600">Earn 10 points for every $1 spent on clothing and accessories</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-50 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Trophy className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-4">2. Unlock Tiers</h3>
              <p className="text-gray-600">Progress through Bronze, Silver, Gold, and Platinum tiers for better rewards</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-50 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Gift className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-4">3. Redeem Rewards</h3>
              <p className="text-gray-600">Use points for discounts, free shipping, or exclusive products</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
            <a href="#" className="text-primary hover:text-primary/80 font-semibold">View All →</a>
          </div>
          
          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                  <div className="w-full h-64 bg-gray-300"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded mb-3"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-gray-300 rounded w-16"></div>
                      <div className="h-3 bg-gray-300 rounded w-12"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products available</h3>
              <p className="text-gray-500">Check back later for new arrivals!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Tier Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Membership Tiers</h2>
            <p className="text-xl text-gray-600">The more you shop, the more you save</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Medal className="text-amber-600 text-2xl" />
                </div>
                <h3 className="text-xl font-bold mb-2">Bronze</h3>
                <p className="text-gray-600 mb-4">$0 - $299 spent</p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• 10 points per $1</li>
                  <li>• Birthday bonus</li>
                  <li>• Member-only sales</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Medal className="text-gray-600 text-2xl" />
                </div>
                <h3 className="text-xl font-bold mb-2">Silver</h3>
                <p className="text-gray-600 mb-4">$300 - $599 spent</p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• 12 points per $1</li>
                  <li>• Free shipping</li>
                  <li>• Early access</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="text-yellow-600 text-2xl" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-primary">Gold</h3>
                <p className="text-gray-600 mb-4">$600 - $999 spent</p>
                <div className="bg-primary text-white text-xs px-2 py-1 rounded-full mb-4">Current Tier</div>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• 15 points per $1</li>
                  <li>• Free returns</li>
                  <li>• Personal stylist</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gem className="text-purple-600 text-2xl" />
                </div>
                <h3 className="text-xl font-bold mb-2">Platinum</h3>
                <p className="text-gray-600 mb-4">$1000+ spent</p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• 20 points per $1</li>
                  <li>• VIP events</li>
                  <li>• Priority support</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <LoyaltyModal 
        isOpen={isLoyaltyModalOpen} 
        onClose={() => setIsLoyaltyModalOpen(false)} 
      />
    </div>
  );
}
