import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { 
  CreditCard, 
  Zap, 
  TrendingUp, 
  DollarSign,
  Crown,
  Rocket,
  Target,
  Sparkles,
  CheckCircle,
  Clock,
  Users,
  Gift,
  Percent,
  Star,
  Flame
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const API_BASE = process.env.REACT_APP_BACKEND_URL + '/api';

export default function StripeExplosion() {
  const [packages, setPackages] = useState({});
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [liveStats, setLiveStats] = useState({
    totalSales: 156,
    todaySales: 23,
    liveUsers: 47,
    conversionBoost: 340
  });

  // Explosive Stripe Coupons
  const explosiveCoupons = {
    'BOOST50': { discount: 50, type: 'percent', description: '50% OFF Explosion!' },
    'ROCKET30': { discount: 30, type: 'percent', description: '30% Rocket Rabatt!' },
    'PROFIT25': { discount: 25, type: 'percent', description: '25% Profit Boost!' },
    'FIRE20': { discount: 20, type: 'percent', description: '20% Fire Sale!' },
    'MEGA15': { discount: 15, type: 'percent', description: '15% Mega Deal!' }
  };

  useEffect(() => {
    loadPaymentPackages();
    loadLiveStats();
    
    // Live updates every 10 seconds
    const interval = setInterval(() => {
      updateLiveStats();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const loadPaymentPackages = async () => {
    try {
      const response = await axios.get(`${API_BASE}/payments/packages`);
      setPackages(response.data.packages);
      setLoading(false);
    } catch (error) {
      console.error('Error loading payment packages:', error);
      toast.error('Fehler beim Laden der Explosion-Pakete');
      setLoading(false);
    }
  };

  const loadLiveStats = () => {
    // Simulate live stats
    setLiveStats({
      totalSales: Math.floor(Math.random() * 50) + 150,
      todaySales: Math.floor(Math.random() * 10) + 20,
      liveUsers: Math.floor(Math.random() * 20) + 40,
      conversionBoost: Math.floor(Math.random() * 100) + 300
    });
  };

  const updateLiveStats = () => {
    setLiveStats(prev => ({
      totalSales: prev.totalSales + Math.floor(Math.random() * 3),
      todaySales: prev.todaySales + (Math.random() > 0.7 ? 1 : 0),
      liveUsers: Math.max(30, prev.liveUsers + Math.floor(Math.random() * 6) - 2),
      conversionBoost: prev.conversionBoost + Math.floor(Math.random() * 20) - 5
    }));
  };

  const applyCoupon = () => {
    const coupon = explosiveCoupons[couponCode.toUpperCase()];
    if (coupon) {
      setAppliedCoupon({ code: couponCode.toUpperCase(), ...coupon });
      toast.success(`🔥 ${coupon.description} angewendet!`);
    } else {
      toast.error('Ungültiger Coupon Code');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.info('Coupon entfernt');
  };

  const calculateDiscountedPrice = (originalPrice) => {
    if (!appliedCoupon) return originalPrice;
    
    if (appliedCoupon.type === 'percent') {
      return originalPrice * (1 - appliedCoupon.discount / 100);
    }
    return originalPrice - appliedCoupon.discount;
  };

  const handleExplosivePurchase = async (packageId) => {
    try {
      setProcessingPayment(packageId);
      
      const originUrl = window.location.origin;
      
      // Add coupon to metadata
      const metadata = appliedCoupon ? {
        coupon_code: appliedCoupon.code,
        discount_percent: appliedCoupon.discount,
        original_price: packages[packageId].amount
      } : {};

      const response = await axios.post(`${API_BASE}/payments/checkout/session`, {
        package_id: packageId,
        origin_url: originUrl,
        coupon_code: appliedCoupon?.code,
        metadata: metadata
      });

      if (response.data.success && response.data.url) {
        // Explosion effect before redirect
        toast.success('🚀 STRIPE EXPLOSION! Weiterleitung zu Zahlung...');
        
        // Add explosion effect
        document.body.style.animation = 'explosion 0.5s ease-out';
        
        setTimeout(() => {
          window.location.href = response.data.url;
        }, 500);
      } else {
        throw new Error('Keine Stripe URL erhalten');
      }
      
    } catch (error) {
      console.error('Stripe Explosion Fehler:', error);
      toast.error('🔥 Stripe Explosion fehlgeschlagen!');
      setProcessingPayment(null);
    }
  };

  const getPackageExplosionLevel = (packageId) => {
    switch (packageId) {
      case 'zzlobby_boost':
        return { level: 'MEGA', color: 'from-yellow-500 to-orange-600', icon: <Flame className="h-6 w-6" /> };
      case 'pro_plan':
        return { level: 'ULTRA', color: 'from-purple-500 to-pink-600', icon: <Crown className="h-6 w-6" /> };
      default:
        return { level: 'POWER', color: 'from-blue-500 to-cyan-600', icon: <Zap className="h-6 w-6" /> };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900/20 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Flame className="h-12 w-12 animate-pulse text-red-400 mx-auto mb-4" />
          <p className="text-red-200 font-serif text-xl">Stripe Explosion wird geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900/20 to-slate-900 text-white">
      {/* Explosive Header */}
      <div className="bg-gradient-to-r from-red-900/50 via-orange-900/40 to-red-900/50 backdrop-blur-sm border-b border-red-400/30">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="relative">
                <Flame className="h-12 w-12 text-red-400 animate-pulse" />
                <Sparkles className="h-6 w-6 text-yellow-400 absolute -top-1 -right-1 animate-spin" />
              </div>
              <div>
                <h1 className="text-5xl font-bold text-red-200 font-serif">STRIPE EXPLOSION</h1>
                <p className="text-red-400/80 font-serif italic text-xl">💥 Payment Power Maximized</p>
              </div>
            </div>
            
            {/* Live Explosion Stats */}
            <div className="flex items-center justify-center gap-6 flex-wrap">
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30 px-4 py-2 text-lg">
                <Target className="w-5 h-5 mr-2" />
                {liveStats.totalSales} Sales
              </Badge>
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 px-4 py-2 text-lg">
                <TrendingUp className="w-5 h-5 mr-2" />
                +{liveStats.conversionBoost}% Boost
              </Badge>
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 px-4 py-2 text-lg">
                <Users className="w-5 h-5 mr-2" />
                {liveStats.liveUsers} Live
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Coupon Explosion Section */}
        <Card className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-400/30 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-center text-purple-200 font-serif flex items-center justify-center gap-2">
              <Gift className="h-6 w-6 text-purple-400" />
              EXPLOSIVE COUPONS 🎯
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Coupon Code eingeben..."
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="bg-black/40 border-purple-400/20 text-white font-serif"
                />
                <Button 
                  onClick={applyCoupon}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 font-serif"
                >
                  <Percent className="mr-2 h-4 w-4" />
                  Anwenden
                </Button>
              </div>
              
              {appliedCoupon && (
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-3 py-1">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {appliedCoupon.code}: -{appliedCoupon.discount}%
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={removeCoupon}
                    className="border-red-400/20 text-red-400 hover:bg-red-400/10"
                  >
                    Entfernen
                  </Button>
                </div>
              )}
            </div>
            
            {/* Available Coupons Hint */}
            <div className="mt-4 text-center">
              <p className="text-purple-300/70 text-sm font-serif">
                🔥 Verfügbare Codes: BOOST50, ROCKET30, PROFIT25, FIRE20, MEGA15
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Explosive Payment Packages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(packages).map(([packageId, pkg]) => {
            const explosion = getPackageExplosionLevel(packageId);
            const originalPrice = pkg.amount;
            const discountedPrice = calculateDiscountedPrice(originalPrice);
            const hasDiscount = appliedCoupon && discountedPrice < originalPrice;
            
            return (
              <Card 
                key={packageId} 
                className={`relative overflow-hidden backdrop-blur-sm border-2 hover:border-opacity-80 transition-all duration-300 transform hover:scale-105 ${
                  packageId === 'zzlobby_boost' 
                    ? 'border-yellow-400/40 bg-gradient-to-br from-yellow-900/30 to-orange-900/30' 
                    : packageId === 'pro_plan'
                    ? 'border-purple-400/40 bg-gradient-to-br from-purple-900/30 to-pink-900/30'
                    : 'border-blue-400/40 bg-gradient-to-br from-blue-900/30 to-cyan-900/30'
                }`}
              >
                {/* Explosion Badge */}
                <div className="absolute top-4 right-4">
                  <Badge className={`bg-gradient-to-r ${explosion.color} text-white border-none px-3 py-1 font-bold`}>
                    {explosion.icon}
                    <span className="ml-1">{explosion.level}</span>
                  </Badge>
                </div>

                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 bg-gradient-to-r ${explosion.color} rounded-full`}>
                      {explosion.icon}
                    </div>
                    <div>
                      <CardTitle className="text-white font-serif text-xl">
                        {pkg.name}
                      </CardTitle>
                      <p className="text-gray-300 text-sm font-serif italic">
                        {pkg.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Explosive Pricing */}
                  <div className="text-center">
                    {hasDiscount ? (
                      <div>
                        <div className="text-lg text-gray-400 line-through font-serif">
                          {originalPrice}€
                        </div>
                        <div className="text-4xl font-bold text-red-400 font-serif">
                          {discountedPrice.toFixed(2)}€
                        </div>
                        <div className="text-sm text-green-400 font-semibold">
                          Du sparst {(originalPrice - discountedPrice).toFixed(2)}€!
                        </div>
                      </div>
                    ) : (
                      <div className="text-4xl font-bold text-yellow-400 font-serif">
                        {originalPrice}€
                      </div>
                    )}
                    <div className="text-sm text-gray-400 uppercase font-serif">
                      {pkg.currency}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {/* Features with Stars */}
                  <div className="space-y-3 mb-6">
                    {pkg.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* ZZ-Lobby Boost Special */}
                  {packageId === 'zzlobby_boost' && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-lg border border-red-400/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Rocket className="h-5 w-5 text-red-400" />
                        <span className="text-red-200 font-bold text-sm">STRIPE EXPLOSION SPECIAL</span>
                      </div>
                      <div className="text-xs text-red-300 space-y-1">
                        <div>🚀 Instant Payment Processing</div>
                        <div>💥 Auto-Video nach 30 Sekunden</div>
                        <div>🔥 Live Stripe Dashboard</div>
                      </div>
                    </div>
                  )}

                  {/* Explosive Purchase Button */}
                  <Button
                    onClick={() => handleExplosivePurchase(packageId)}
                    disabled={processingPayment === packageId}
                    className={`w-full font-serif font-bold py-4 text-lg transition-all duration-300 ${
                      packageId === 'zzlobby_boost' 
                        ? 'bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 shadow-lg shadow-red-500/25'
                        : packageId === 'pro_plan'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-lg shadow-purple-500/25'
                        : 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 shadow-lg shadow-blue-500/25'
                    } text-white transform hover:scale-105`}
                  >
                    {processingPayment === packageId ? (
                      <>
                        <Clock className="mr-2 h-5 w-5 animate-spin" />
                        EXPLOSION LÄUFT...
                      </>
                    ) : (
                      <>
                        <Flame className="mr-2 h-5 w-5" />
                        STRIPE EXPLOSION - {hasDiscount ? discountedPrice.toFixed(2) : originalPrice}€
                      </>
                    )}
                  </Button>

                  {/* Trust Badge */}
                  <div className="mt-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                      <CheckCircle className="h-3 w-3 text-green-400" />
                      <span>🔒 Sicher mit Stripe</span>
                      <CheckCircle className="h-3 w-3 text-green-400" />
                      <span>⚡ Instant Processing</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Explosion Footer */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center gap-4 text-red-400/60 flex-wrap">
            <Fire className="h-5 w-5 animate-pulse" />
            <span className="font-serif">Stripe Explosion Engine läuft</span>
            <Rocket className="h-5 w-5 animate-bounce" />
            <span className="font-serif">Payment Processing maximiert</span>
            <Sparkles className="h-5 w-5 animate-spin" />
            <span className="font-serif">{liveStats.todaySales} Sales heute</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes explosion {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); filter: brightness(1.2); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}