import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  TrendingUp, 
  DollarSign, 
  Video, 
  Users,
  Clock,
  CheckCircle,
  Zap,
  Crown,
  Sparkles,
  Activity,
  Target,
  Rocket
} from "lucide-react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_BACKEND_URL + '/api';

export default function LiveProfitDashboard() {
  const [profitStats, setProfitStats] = useState({
    totalRevenue: 0,
    todayRevenue: 0,
    videosGenerated: 0,
    conversionRate: 0,
    activeUsers: 0,
    avgVideoTime: 0
  });
  
  const [recentSales, setRecentSales] = useState([]);
  const [videoStats, setVideoStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfitData();
    // Update every 30 seconds for real-time effect
    const interval = setInterval(loadProfitData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadProfitData = async () => {
    try {
      // Simulated profit data - in real app this would come from your backend
      const mockData = {
        totalRevenue: 2450.00,
        todayRevenue: 147.00,
        videosGenerated: 47,
        conversionRate: 12.4,
        activeUsers: 124,
        avgVideoTime: 4.2
      };

      const mockSales = [
        { id: 1, user: "Max M.", amount: 49, product: "ZZ-Lobby Boost", time: "vor 2 Min", status: "completed" },
        { id: 2, user: "Anna K.", amount: 99, product: "Pro Plan", time: "vor 8 Min", status: "processing" },
        { id: 3, user: "Tom S.", amount: 49, product: "ZZ-Lobby Boost", time: "vor 15 Min", status: "completed" },
        { id: 4, user: "Lisa R.", amount: 19, product: "Basic Plan", time: "vor 23 Min", status: "completed" },
        { id: 5, user: "Mike B.", amount: 49, product: "ZZ-Lobby Boost", time: "vor 35 Min", status: "completed" }
      ];

      const mockVideoStats = [
        { style: "Professional", count: 23, avgTime: "3.8 Min", successRate: 98 },
        { style: "Creative", count: 15, avgTime: "4.2 Min", successRate: 96 },
        { style: "Corporate", count: 9, avgTime: "4.0 Min", successRate: 100 }
      ];

      setProfitStats(mockData);
      setRecentSales(mockSales);
      setVideoStats(mockVideoStats);
      setLoading(false);
    } catch (error) {
      console.error('Error loading profit data:', error);
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('de-DE', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900/20 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-pulse text-yellow-400 mx-auto mb-4" />
          <p className="text-yellow-200 font-serif">Lade Live-Profit-Daten...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900/20 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900/40 via-emerald-900/30 to-green-900/40 backdrop-blur-sm border-b border-green-400/20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <TrendingUp className="h-10 w-10 text-green-400 animate-pulse" />
              <div>
                <h1 className="text-4xl font-bold text-green-200 font-serif">Live Profit Dashboard</h1>
                <p className="text-green-400/80 font-serif italic">Real-Time Revenue & Video Analytics</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                Live Updates
              </Badge>
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 px-4 py-2">
                <Rocket className="w-4 h-4 mr-2" />
                Auto-Profit-Engine
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Profit KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-900/40 to-emerald-900/30 border-green-400/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-500/20 rounded-full">
                    <DollarSign className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-green-200/80 text-sm font-serif">Gesamt Revenue</p>
                    <p className="text-2xl font-bold text-green-400 font-serif">
                      {formatCurrency(profitStats.totalRevenue)}
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +24%
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/40 to-cyan-900/30 border-blue-400/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-500/20 rounded-full">
                    <Activity className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-blue-200/80 text-sm font-serif">Today Revenue</p>
                    <p className="text-2xl font-bold text-blue-400 font-serif">
                      {formatCurrency(profitStats.todayRevenue)}
                    </p>
                  </div>
                </div>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  <Zap className="w-3 h-3 mr-1" />
                  Live
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/30 border-purple-400/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-500/20 rounded-full">
                    <Video className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-purple-200/80 text-sm font-serif">Videos Generiert</p>
                    <p className="text-2xl font-bold text-purple-400 font-serif">
                      {profitStats.videosGenerated}
                    </p>
                  </div>
                </div>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                  <Crown className="w-3 h-3 mr-1" />
                  Auto
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Sales & Video Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Sales */}
          <Card className="bg-black/40 border-green-400/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-green-200 font-serif flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-400" />
                Recent Sales (Live)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSales.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {sale.user.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-green-200 font-semibold">{sale.user}</p>
                        <p className="text-green-400/80 text-sm">{sale.product}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-bold font-serif">
                        {formatCurrency(sale.amount)}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-green-300/70 text-xs">{sale.time}</span>
                        {sale.status === 'completed' ? (
                          <CheckCircle className="h-3 w-3 text-green-400" />
                        ) : (
                          <Clock className="h-3 w-3 text-yellow-400 animate-pulse" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Video Generation Stats */}
          <Card className="bg-black/40 border-purple-400/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-purple-200 font-serif flex items-center gap-2">
                <Video className="h-5 w-5 text-purple-400" />
                AI Video Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {videoStats.map((stat, index) => (
                  <div key={index} className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-purple-200 font-semibold">{stat.style}</h3>
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                        {stat.successRate}% Success
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-purple-300/70">Videos:</p>
                        <p className="text-purple-400 font-bold">{stat.count}</p>
                      </div>
                      <div>
                        <p className="text-purple-300/70">Ø Zeit:</p>
                        <p className="text-purple-400 font-bold">{stat.avgTime}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conversion & Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-yellow-900/40 to-amber-900/30 border-yellow-400/30 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Target className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
              <p className="text-yellow-200/80 text-sm font-serif mb-1">Conversion Rate</p>
              <p className="text-3xl font-bold text-yellow-400 font-serif">
                {profitStats.conversionRate}%
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-900/40 to-blue-900/30 border-cyan-400/30 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-cyan-400 mx-auto mb-3" />
              <p className="text-cyan-200/80 text-sm font-serif mb-1">Active Users</p>
              <p className="text-3xl font-bold text-cyan-400 font-serif">
                {profitStats.activeUsers}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-900/40 to-green-900/30 border-emerald-400/30 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-emerald-400 mx-auto mb-3" />
              <p className="text-emerald-200/80 text-sm font-serif mb-1">Ø Video Zeit</p>
              <p className="text-3xl font-bold text-emerald-400 font-serif">
                {profitStats.avgVideoTime} Min
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer Status */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-4 text-green-400/80">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-serif text-sm">Live Profit Engine läuft</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-serif text-sm">Video-Automation aktiv</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}