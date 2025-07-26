import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, Trophy, Gift, Medal, Crown, Gem, Star } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">StyleRewards</h1>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-primary transition-colors">Shop</a>
              <a href="#" className="text-gray-700 hover:text-primary transition-colors">Rewards</a>
              <a href="#" className="text-gray-700 hover:text-primary transition-colors">About</a>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={handleLogin} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90">
                <Gift className="mr-2 h-4 w-4" />
                Join Rewards
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="primary-gradient text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">Earn Rewards While You Shop</h1>
              <p className="text-xl mb-8 text-blue-100">Join our loyalty program and earn points on every purchase. Unlock exclusive rewards and tier benefits!</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleLogin}
                  className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100"
                >
                  Join Now - It's Free!
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

      {/* Tier Benefits */}
      <section className="py-16 bg-gray-50">
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
                <div className="bg-primary text-white text-xs px-2 py-1 rounded-full mb-4">Most Popular</div>
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

      {/* Call to Action */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Earning?</h2>
          <p className="text-xl text-gray-600 mb-8">Join thousands of fashion lovers who are already earning rewards on every purchase.</p>
          <Button 
            onClick={handleLogin}
            className="bg-primary text-white px-8 py-4 text-lg rounded-lg hover:bg-primary/90"
          >
            <Star className="mr-2 h-5 w-5" />
            Join StyleRewards Now
          </Button>
        </div>
      </section>
    </div>
  );
}
