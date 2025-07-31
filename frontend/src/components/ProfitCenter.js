import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  Zap, 
  Crown,
  CheckCircle,
  Loader2,
  ExternalLink,
  Video,
  Share2
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const API_BASE = process.env.REACT_APP_BACKEND_URL + '/api';

export default function ProfitCenter() {
  const [packages, setPackages] = useState({});
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(null);

  useEffect(() => {
    loadPaymentPackages();
  }, []);

  const loadPaymentPackages = async () => {
    try {
      const response = await axios.get(`${API_BASE}/payments/packages`);
      setPackages(response.data.packages);
      setLoading(false);
    } catch (error) {
      console.error('Error loading payment packages:', error);
      toast.error('Fehler beim Laden der Pakete');
      setLoading(false);
    }
  };

  const handlePurchase = async (packageId) => {
    try {
      setProcessingPayment(packageId);
      
      // Get current origin for success/cancel URLs
      const originUrl = window.location.origin;
      
      const response = await axios.post(`${API_BASE}/payments/checkout/session`, {
        package_id: packageId,
        origin_url: originUrl
      });

      if (response.data.success && response.data.url) {
        // Redirect to Stripe Checkout
        window.location.href = response.data.url;
      } else {
        throw new Error('No checkout URL received');
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Fehler beim Starten der Zahlung');
      setProcessingPayment(null);
    }
  };

  const getPackageIcon = (packageId) => {
    switch (packageId) {
      case 'zzlobby_boost':
        return <Crown className="h-6 w-6 text-yellow-400" />;
      case 'pro_plan':
        return <Video className="h-6 w-6 text-purple-400" />;
      default:
        return <Zap className="h-6 w-6 text-blue-400" />;
    }
  };

  const getPackageColor = (packageId) => {
    switch (packageId) {
      case 'zzlobby_boost':
        return 'border-yellow-400/30 bg-yellow-500/10';
      case 'pro_plan':
        return 'border-purple-400/30 bg-purple-500/10';
      default:
        return 'border-blue-400/30 bg-blue-500/10';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900/20 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-yellow-400 mx-auto mb-4" />
          <p className="text-yellow-200 font-serif">Lade Profit-Pakete...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900/20 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900/30 via-yellow-900/20 to-amber-900/30 backdrop-blur-sm border-b border-yellow-400/20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <DollarSign className="h-10 w-10 text-yellow-400" />
              <div>
                <h1 className="text-4xl font-bold text-yellow-200 font-serif">Profit Center</h1>
                <p className="text-yellow-400/80 font-serif italic">Hochprofitable Marketing Automation</p>
              </div>
            </div>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
              <TrendingUp className="w-4 h-4 mr-2" />
              Sofort-Profit Features
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Payment Packages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(packages).map(([packageId, pkg]) => (
            <Card 
              key={packageId} 
              className={`backdrop-blur-sm ${getPackageColor(packageId)} border-2 hover:border-opacity-60 transition-all duration-300`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getPackageIcon(packageId)}
                    <div>
                      <CardTitle className="text-white font-serif text-lg">
                        {pkg.name}
                      </CardTitle>
                      <p className="text-gray-300 text-sm font-serif italic">
                        {pkg.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-yellow-400 font-serif">
                      {pkg.amount}€
                    </div>
                    <div className="text-sm text-gray-400 uppercase">
                      {pkg.currency}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {/* Features */}
                <div className="space-y-3 mb-6">
                  {pkg.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Special Badge for ZZ-Lobby Boost */}
                {packageId === 'zzlobby_boost' && (
                  <div className="mb-4 p-3 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-lg border border-yellow-400/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Video className="h-4 w-4 text-yellow-400" />
                      <span className="text-yellow-200 font-semibold text-sm">1-Klick Workflow</span>
                    </div>
                    <div className="text-xs text-yellow-300 space-y-1">
                      <div>🎬 AI Video → 🤖 Auto-Post → 💰 Profit</div>
                      <div className="text-yellow-400 font-semibold">⚡ 3 Minuten bis zum ersten Post!</div>
                    </div>
                  </div>
                )}

                {/* Purchase Button */}
                <Button
                  onClick={() => handlePurchase(packageId)}
                  disabled={processingPayment === packageId}
                  className={`w-full font-serif font-semibold py-3 ${
                    packageId === 'zzlobby_boost' 
                      ? 'bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700'
                      : packageId === 'pro_plan'
                      ? 'bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800'
                      : 'bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800'
                  } text-white`}
                >
                  {processingPayment === packageId ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verarbeitung...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Jetzt Kaufen - {pkg.amount}€
                    </>
                  )}
                </Button>

                {/* Additional Info */}
                <div className="mt-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                    <CheckCircle className="h-3 w-3 text-green-400" />
                    <span>Sichere Zahlung mit Stripe</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Success Stories Section */}
        <Card className="bg-black/40 border-green-400/20 backdrop-blur-sm mt-12">
          <CardHeader>
            <CardTitle className="text-green-200 font-serif text-center flex items-center justify-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              ZZ-Lobby Boost Erfolgsgeschichten
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="text-2xl font-bold text-green-400 mb-2">150+</div>
                <div className="text-sm text-gray-300">Automatische Videos erstellt</div>
              </div>
              <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <div className="text-2xl font-bold text-blue-400 mb-2">3 Min</div>
                <div className="text-sm text-gray-300">Durchschnittliche Workflow-Zeit</div>
              </div>
              <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <div className="text-2xl font-bold text-yellow-400 mb-2">24/7</div>
                <div className="text-sm text-gray-300">Automatische Verarbeitung</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}