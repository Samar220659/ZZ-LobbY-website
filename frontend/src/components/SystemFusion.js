import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  Zap, 
  Globe, 
  Settings, 
  TrendingUp, 
  DollarSign,
  BarChart3,
  Users,
  RefreshCw,
  Link,
  ArrowRightLeft,
  CheckCircle,
  AlertCircle,
  Activity,
  Crown,
  Rocket,
  Target,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const API_BASE = process.env.REACT_APP_BACKEND_URL + '/api';

export default function SystemFusion() {
  const [fusionStatus, setFusionStatus] = useState('disconnected');
  const [fusionStats, setFusionStats] = useState({
    live_sales_count: 0,
    total_revenue: 0,
    conversion_rate: 0,
    sync_success_rate: 0,
    last_sync: null
  });
  
  const [systemHealth, setSystemHealth] = useState({
    live_website: 'checking',
    admin_dashboard: 'healthy',
    data_sync: 'idle',
    cross_optimization: 'idle'
  });
  
  const [liveActivity, setLiveActivity] = useState([]);
  const [connectionStats, setConnectionStats] = useState({
    live_to_admin_syncs: 0,
    admin_to_live_syncs: 0,
    cross_optimizations: 0,
    unified_campaigns: 0
  });

  useEffect(() => {
    checkSystemHealth();
    
    // Live updates alle 10 Sekunden wenn verbunden
    const interval = setInterval(() => {
      if (fusionStatus === 'connected') {
        updateFusionStats();
        updateLiveActivity();
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [fusionStatus]);

  const checkSystemHealth = async () => {
    try {
      // Prüfe Live Website Status
      setSystemHealth(prev => ({...prev, live_website: 'checking'}));
      
      // Simuliere Health Check
      setTimeout(() => {
        setSystemHealth({
          live_website: 'healthy',
          admin_dashboard: 'healthy',
          data_sync: 'idle',
          cross_optimization: 'idle'
        });
      }, 2000);
      
    } catch (error) {
      console.error('System Health Check Error:', error);
      setSystemHealth(prev => ({...prev, live_website: 'error'}));
    }
  };

  const startSystemFusion = async () => {
    try {
      setFusionStatus('connecting');
      toast.success('🔗 System Fusion wird gestartet...');
      
      // Hier würde der echte Fusion Service gestartet
      // await axios.post(`${API_BASE}/fusion/start`);
      
      // Simuliere Fusion Start
      setTimeout(() => {
        setFusionStatus('connected');
        setSystemHealth({
          live_website: 'healthy',
          admin_dashboard: 'healthy',
          data_sync: 'active',
          cross_optimization: 'active'
        });
        
        toast.success('🚀 System Fusion aktiv!');
        startFusionSimulation();
      }, 3000);
      
    } catch (error) {
      console.error('Fusion Start Error:', error);
      toast.error('❌ Fusion Start fehlgeschlagen');
      setFusionStatus('disconnected');
    }
  };

  const stopSystemFusion = async () => {
    try {
      setFusionStatus('disconnecting');
      toast.info('⏸️ System Fusion wird gestoppt...');
      
      setTimeout(() => {
        setFusionStatus('disconnected');
        setSystemHealth({
          live_website: 'healthy',
          admin_dashboard: 'healthy',
          data_sync: 'idle',
          cross_optimization: 'idle'
        });
        toast.success('⏹️ System Fusion gestoppt');
      }, 1500);
      
    } catch (error) {
      console.error('Fusion Stop Error:', error);
      toast.error('❌ Fusion Stopp fehlgeschlagen');
    }
  };

  const startFusionSimulation = () => {
    const activities = [
      "🌍 Live Sale erkannt: 49€ ZZ-Lobby Boost",
      "🎛️ Admin Dashboard: Sale verarbeitet",
      "🎬 Video-Generation: Sale → ShareCreative Pro",
      "📱 Auto-Post: TikTok + Instagram Reels",
      "📊 Cross-Analytics: Conversion Rate +2.3%",
      "🎯 Live→Admin: Visitor Retargeting aktiviert",
      "🔧 Admin→Live: Button Farbe optimiert",
      "💰 Stripe Webhook: Zahlung bestätigt",
      "📈 Unified Marketing: Campaign gestartet",
      "⚡ System Sync: Alle Daten aktualisiert"
    ];

    const activityInterval = setInterval(() => {
      if (fusionStatus !== 'connected') {
        clearInterval(activityInterval);
        return;
      }

      const newActivity = {
        id: Date.now(),
        message: activities[Math.floor(Math.random() * activities.length)],
        timestamp: new Date().toLocaleTimeString(),
        type: 'success'
      };

      setLiveActivity(prev => [newActivity, ...prev.slice(0, 9)]);

      // Update Stats
      setFusionStats(prev => ({
        live_sales_count: prev.live_sales_count + (Math.random() > 0.8 ? 1 : 0),
        total_revenue: prev.total_revenue + (Math.random() > 0.8 ? 49 : 0),
        conversion_rate: Math.min(15, prev.conversion_rate + (Math.random() > 0.9 ? 0.1 : 0)),
        sync_success_rate: Math.min(100, prev.sync_success_rate + (Math.random() > 0.7 ? 0.5 : 0)),
        last_sync: new Date().toLocaleTimeString()
      }));

      // Update Connection Stats
      setConnectionStats(prev => ({
        live_to_admin_syncs: prev.live_to_admin_syncs + (Math.random() > 0.7 ? 1 : 0),
        admin_to_live_syncs: prev.admin_to_live_syncs + (Math.random() > 0.8 ? 1 : 0),
        cross_optimizations: prev.cross_optimizations + (Math.random() > 0.9 ? 1 : 0),
        unified_campaigns: prev.unified_campaigns + (Math.random() > 0.95 ? 1 : 0)
      }));

    }, Math.random() * 12000 + 3000); // 3-15 Sekunden zwischen Aktivitäten
  };

  const updateFusionStats = () => {
    // Stats werden bereits in startFusionSimulation geupdatet
  };

  const updateLiveActivity = () => {
    // Activity wird bereits in startFusionSimulation geupdatet
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected':
      case 'active':
      case 'healthy':
        return 'text-green-400 border-green-500/30 bg-green-500/20';
      case 'connecting':
      case 'disconnecting':
      case 'checking':
        return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/20';
      case 'disconnected':
      case 'idle':
        return 'text-gray-400 border-gray-500/30 bg-gray-500/20';
      case 'error':
        return 'text-red-400 border-red-500/30 bg-red-500/20';
      default:
        return 'text-gray-400 border-gray-500/30 bg-gray-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
      case 'active':
      case 'healthy':
        return <CheckCircle className="h-4 w-4" />;
      case 'connecting':
      case 'disconnecting':
      case 'checking':
        return <Activity className="h-4 w-4 animate-pulse" />;
      case 'disconnected':
      case 'idle':
        return <AlertCircle className="h-4 w-4" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/40 via-cyan-900/30 to-blue-900/40 backdrop-blur-sm border-b border-blue-400/20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <ArrowRightLeft className="h-12 w-12 text-blue-400 animate-pulse" />
              <div>
                <h1 className="text-4xl font-bold text-blue-200 font-serif">System Fusion</h1>
                <p className="text-blue-400/80 font-serif italic">Live Website ↔ Admin Dashboard Integration</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <Badge className={`${getStatusColor(fusionStatus)} px-4 py-2 text-lg`}>
                {getStatusIcon(fusionStatus)}
                <span className="ml-2 capitalize">
                  {fusionStatus === 'connected' ? 'VERBUNDEN' : 
                   fusionStatus === 'connecting' ? 'VERBINDET' :
                   fusionStatus === 'disconnecting' ? 'TRENNT' : 'GETRENNT'}
                </span>
              </Badge>
              
              {fusionStatus === 'connected' && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
                  <Link className="w-4 h-4 mr-2" />
                  Sync Rate: {fusionStats.sync_success_rate.toFixed(1)}%
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* System Connection Control */}
        <Card className="bg-black/40 border-blue-400/20 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-blue-200 font-serif text-center flex items-center justify-center gap-2">
              <Zap className="h-5 w-5" />
              System Fusion Kontrolle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Live System */}
              <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-400" />
                    <span className="text-blue-200 font-semibold">Live Website</span>
                  </div>
                  <Badge className={`${getStatusColor(systemHealth.live_website)} px-2 py-1`}>
                    {getStatusIcon(systemHealth.live_website)}
                  </Badge>
                </div>
                <p className="text-sm text-blue-300 mb-2">https://zzlobby-7.vercel.app</p>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open('https://zzlobby-7.vercel.app', '_blank')}
                    className="border-blue-400/20 text-blue-400 hover:bg-blue-400/10"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Öffnen
                  </Button>
                </div>
              </div>

              {/* Admin System */}
              <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-green-400" />
                    <span className="text-green-200 font-semibold">Admin Dashboard</span>
                  </div>
                  <Badge className={`${getStatusColor(systemHealth.admin_dashboard)} px-2 py-1`}>
                    {getStatusIcon(systemHealth.admin_dashboard)}
                  </Badge>
                </div>
                <p className="text-sm text-green-300 mb-2">http://localhost:3000</p>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open('/control', '_blank')}
                    className="border-green-400/20 text-green-400 hover:bg-green-400/10"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Control Center
                  </Button>
                </div>
              </div>
            </div>

            {/* Fusion Controls */}
            <div className="flex items-center justify-center gap-4">
              {fusionStatus === 'disconnected' && (
                <Button
                  onClick={startSystemFusion}
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-serif font-bold px-8 py-4 text-lg"
                >
                  <ArrowRightLeft className="mr-2 h-5 w-5" />
                  🔗 SYSTEM FUSION STARTEN
                </Button>
              )}
              
              {fusionStatus === 'connected' && (
                <Button
                  onClick={stopSystemFusion}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-serif font-bold px-8 py-4 text-lg"
                >
                  <RefreshCw className="mr-2 h-5 w-5" />
                  🔌 FUSION TRENNEN
                </Button>
              )}
              
              {(fusionStatus === 'connecting' || fusionStatus === 'disconnecting') && (
                <Button disabled className="px-8 py-4 text-lg">
                  <Activity className="mr-2 h-5 w-5 animate-spin" />
                  {fusionStatus === 'connecting' ? 'Verbindet...' : 'Trennt...'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Fusion Statistics */}
        {fusionStatus === 'connected' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-green-900/40 to-emerald-900/30 border-green-400/30 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-8 w-8 text-green-400" />
                      <div>
                        <p className="text-green-200/80 text-sm font-serif">Fusion Revenue</p>
                        <p className="text-2xl font-bold text-green-400 font-serif">
                          {fusionStats.total_revenue}€
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-900/40 to-cyan-900/30 border-blue-400/30 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Target className="h-8 w-8 text-blue-400" />
                      <div>
                        <p className="text-blue-200/80 text-sm font-serif">Live Sales</p>
                        <p className="text-2xl font-bold text-blue-400 font-serif">
                          {fusionStats.live_sales_count}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/30 border-purple-400/30 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="h-8 w-8 text-purple-400" />
                      <div>
                        <p className="text-purple-200/80 text-sm font-serif">Conversion Rate</p>
                        <p className="text-2xl font-bold text-purple-400 font-serif">
                          {fusionStats.conversion_rate.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-900/40 to-yellow-900/30 border-orange-400/30 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <RefreshCw className="h-8 w-8 text-orange-400" />
                      <div>
                        <p className="text-orange-200/80 text-sm font-serif">Sync Success</p>
                        <p className="text-2xl font-bold text-orange-400 font-serif">
                          {fusionStats.sync_success_rate.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Live Activity & Connection Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Live Fusion Activity */}
              <Card className="bg-black/40 border-blue-400/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-blue-200 font-serif flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-400" />
                    Live Fusion Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {liveActivity.map((activity) => (
                      <div key={activity.id} className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-blue-400">{activity.timestamp}</span>
                          <CheckCircle className="h-3 w-3 text-blue-400" />
                        </div>
                        <p className="text-blue-200 text-sm">{activity.message}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Connection Statistics */}
              <Card className="bg-black/40 border-green-400/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-green-200 font-serif flex items-center gap-2">
                    <ArrowRightLeft className="h-5 w-5 text-green-400" />
                    Connection Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                      <span className="text-green-200 text-sm">Live → Admin Syncs</span>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        {connectionStats.live_to_admin_syncs}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                      <span className="text-blue-200 text-sm">Admin → Live Syncs</span>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        {connectionStats.admin_to_live_syncs}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                      <span className="text-purple-200 text-sm">Cross Optimizations</span>
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                        {connectionStats.cross_optimizations}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                      <span className="text-yellow-200 text-sm">Unified Campaigns</span>
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                        {connectionStats.unified_campaigns}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Fusion Status Summary */}
        <Card className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border-blue-400/30 backdrop-blur-sm mt-8">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              {fusionStatus === 'connected' ? (
                <>
                  <CheckCircle className="h-12 w-12 text-green-400" />
                  <div>
                    <h2 className="text-3xl font-bold text-green-200 font-serif">
                      SYSTEM FUSION AKTIV
                    </h2>
                    <p className="text-green-400/80 font-serif italic">
                      Live Website & Admin Dashboard optimal verbunden
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="h-12 w-12 text-gray-400" />
                  <div>
                    <h2 className="text-3xl font-bold text-gray-200 font-serif">
                      SYSTEM FUSION BEREIT
                    </h2>
                    <p className="text-gray-400/80 font-serif italic">
                      Bereit für Live Website Integration
                    </p>
                  </div>
                </>
              )}
            </div>
            
            <div className="flex items-center justify-center gap-6 text-blue-400/60 flex-wrap">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="font-serif text-sm">zzlobby-7.vercel.app</span>
              </div>
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="font-serif text-sm">localhost:3000</span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="h-4 w-4" />
                <span className="font-serif text-sm">Bidirektionale Sync</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}