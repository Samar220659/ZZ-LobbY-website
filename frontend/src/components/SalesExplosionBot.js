import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  Bot, 
  Play, 
  Pause, 
  TrendingUp, 
  DollarSign,
  Users,
  Target,
  Mail,
  Share2,
  Zap,
  Activity,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Flame,
  Rocket,
  Crown,
  Euro
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const API_BASE = process.env.REACT_APP_BACKEND_URL + '/api';

export default function SalesExplosionBot() {
  const [botStatus, setBotStatus] = useState('stopped');
  const [botStats, setBotStats] = useState({
    total_sales: 0,
    total_revenue: 0,
    today_sales: 0,
    today_revenue: 0,
    conversion_rate: 0,
    active_campaigns: 0
  });
  
  const [liveActivity, setLiveActivity] = useState([]);
  const [botModules, setBotModules] = useState({
    social_media: { status: 'stopped', posts_today: 0, engagement: 0 },
    email_marketing: { status: 'stopped', emails_sent: 0, open_rate: 0 },
    lead_generation: { status: 'stopped', leads_today: 0, conversion_rate: 0 },
    sales_tracking: { status: 'stopped', sales_tracked: 0, revenue_tracked: 0 },
    conversion_optimizer: { status: 'stopped', tests_running: 0, improvement: 0 }
  });

  useEffect(() => {
    loadBotStatus();
    
    // Live updates alle 5 Sekunden wenn Bot läuft
    const interval = setInterval(() => {
      if (botStatus === 'running') {
        updateLiveStats();
        updateLiveActivity();
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [botStatus]);

  const loadBotStatus = async () => {
    try {
      // Hier würde der echte Bot Status API Call stehen
      // Für Demo: Simuliere Bot Status
      setBotStatus('stopped');
    } catch (error) {
      console.error('Bot Status Load Error:', error);
    }
  };

  const startSalesBot = async () => {
    try {
      setBotStatus('starting');
      toast.success('🚀 Sales Explosion Bot wird gestartet...');
      
      // Hier würde der echte Bot gestartet werden
      // await axios.post(`${API_BASE}/bot/start`);
      
      // Simuliere Bot Start
      setTimeout(() => {
        setBotStatus('running');
        setBotModules({
          social_media: { status: 'running', posts_today: 0, engagement: 0 },
          email_marketing: { status: 'running', emails_sent: 0, open_rate: 0 },
          lead_generation: { status: 'running', leads_today: 0, conversion_rate: 0 },
          sales_tracking: { status: 'running', sales_tracked: 0, revenue_tracked: 0 },
          conversion_optimizer: { status: 'running', tests_running: 0, improvement: 0 }
        });
        toast.success('🔥 Sales Explosion Bot läuft!');
        
        // Start live simulation
        startLiveSimulation();
      }, 2000);
      
    } catch (error) {
      console.error('Bot Start Error:', error);
      toast.error('❌ Bot Start fehlgeschlagen');
      setBotStatus('stopped');
    }
  };

  const stopSalesBot = async () => {
    try {
      setBotStatus('stopping');
      toast.info('⏸️ Sales Bot wird gestoppt...');
      
      // Hier würde der echte Bot gestoppt werden
      // await axios.post(`${API_BASE}/bot/stop`);
      
      setTimeout(() => {
        setBotStatus('stopped');
        setBotModules({
          social_media: { status: 'stopped', posts_today: 0, engagement: 0 },
          email_marketing: { status: 'stopped', emails_sent: 0, open_rate: 0 },
          lead_generation: { status: 'stopped', leads_today: 0, conversion_rate: 0 },
          sales_tracking: { status: 'stopped', sales_tracked: 0, revenue_tracked: 0 },
          conversion_optimizer: { status: 'stopped', tests_running: 0, improvement: 0 }
        });
        toast.success('⏹️ Bot gestoppt');
      }, 1000);
      
    } catch (error) {
      console.error('Bot Stop Error:', error);
      toast.error('❌ Bot Stopp fehlgeschlagen');
    }
  };

  const startLiveSimulation = () => {
    // Simuliere Live Bot Aktivität
    const activities = [
      "📱 Facebook Post erstellt: '🔥 ZZ-Lobby nur heute 50% OFF!'",
      "💰 Verkauf generiert: 49€ ZZ-Lobby Boost",
      "📧 Email Kampagne gesendet: 200 Empfänger",
      "🎯 Neuer Lead generiert: interesse@example.com",
      "📊 A/B Test: Button Farbe +15% Conversion",
      "💳 Stripe Payment verarbeitet: 24.50€ (BOOST50)",
      "🚀 Instagram Post: 45 Likes in 2 Minuten",
      "📈 Conversion Rate optimiert: +8%",
      "💰 Pro Plan verkauft: 99€",
      "🎯 LinkedIn Campaign: 12 neue Leads"
    ];

    const activityInterval = setInterval(() => {
      if (botStatus !== 'running') {
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
      setBotStats(prev => ({
        ...prev,
        total_sales: prev.total_sales + (Math.random() > 0.7 ? 1 : 0),
        total_revenue: prev.total_revenue + (Math.random() > 0.7 ? Math.floor(Math.random() * 80 + 20) : 0),
        today_sales: prev.today_sales + (Math.random() > 0.8 ? 1 : 0),
        today_revenue: prev.today_revenue + (Math.random() > 0.8 ? Math.floor(Math.random() * 80 + 20) : 0),
        conversion_rate: Math.min(25, prev.conversion_rate + (Math.random() > 0.9 ? 0.1 : 0)),
        active_campaigns: Math.floor(Math.random() * 5) + 3
      }));

      // Update Module Stats
      setBotModules(prev => ({
        social_media: {
          ...prev.social_media,
          posts_today: prev.social_media.posts_today + (Math.random() > 0.8 ? 1 : 0),
          engagement: Math.min(95, prev.social_media.engagement + (Math.random() > 0.9 ? 1 : 0))
        },
        email_marketing: {
          ...prev.email_marketing,
          emails_sent: prev.email_marketing.emails_sent + (Math.random() > 0.7 ? Math.floor(Math.random() * 50 + 10) : 0),
          open_rate: Math.min(45, prev.email_marketing.open_rate + (Math.random() > 0.95 ? 0.5 : 0))
        },
        lead_generation: {
          ...prev.lead_generation,
          leads_today: prev.lead_generation.leads_today + (Math.random() > 0.6 ? 1 : 0),
          conversion_rate: Math.min(18, prev.lead_generation.conversion_rate + (Math.random() > 0.9 ? 0.2 : 0))
        },
        sales_tracking: {
          ...prev.sales_tracking,
          sales_tracked: prev.sales_tracking.sales_tracked + (Math.random() > 0.8 ? 1 : 0),
          revenue_tracked: prev.sales_tracking.revenue_tracked + (Math.random() > 0.8 ? Math.floor(Math.random() * 80 + 20) : 0)
        },
        conversion_optimizer: {
          ...prev.conversion_optimizer,
          tests_running: Math.floor(Math.random() * 3) + 2,
          improvement: Math.min(35, prev.conversion_optimizer.improvement + (Math.random() > 0.95 ? 1 : 0))
        }
      }));

    }, Math.random() * 8000 + 2000); // 2-10 Sekunden zwischen Aktivitäten
  };

  const updateLiveStats = () => {
    // Stats werden bereits in startLiveSimulation geupdatet
  };

  const updateLiveActivity = () => {
    // Activity wird bereits in startLiveSimulation geupdatet
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'running':
        return 'text-green-400 border-green-500/30 bg-green-500/20';
      case 'starting':
      case 'stopping':
        return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/20';
      case 'stopped':
        return 'text-gray-400 border-gray-500/30 bg-gray-500/20';
      default:
        return 'text-gray-400 border-gray-500/30 bg-gray-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running':
        return <CheckCircle className="h-4 w-4" />;
      case 'starting':
      case 'stopping':
        return <Activity className="h-4 w-4 animate-pulse" />;
      case 'stopped':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/40 via-pink-900/30 to-purple-900/40 backdrop-blur-sm border-b border-purple-400/20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Bot className="h-12 w-12 text-purple-400 animate-pulse" />
              <div>
                <h1 className="text-4xl font-bold text-purple-200 font-serif">Sales Explosion Bot</h1>
                <p className="text-purple-400/80 font-serif italic">Automatische Verkaufs-Generierung 24/7</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <Badge className={`${getStatusColor(botStatus)} px-4 py-2 text-lg`}>
                {getStatusIcon(botStatus)}
                <span className="ml-2 capitalize">{botStatus === 'running' ? 'AKTIV' : botStatus === 'stopped' ? 'GESTOPPT' : 'PROCESSING'}</span>
              </Badge>
              
              {botStatus === 'running' && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  {botStats.active_campaigns} Kampagnen aktiv
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Bot Controls */}
        <Card className="bg-black/40 border-purple-400/20 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-purple-200 font-serif text-center">Bot Kontrolle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-4">
              {botStatus === 'stopped' && (
                <Button
                  onClick={startSalesBot}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-serif font-bold px-8 py-4 text-lg"
                >
                  <Play className="mr-2 h-5 w-5" />
                  🚀 SALES BOT STARTEN
                </Button>
              )}
              
              {botStatus === 'running' && (
                <Button
                  onClick={stopSalesBot}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-serif font-bold px-8 py-4 text-lg"
                >
                  <Pause className="mr-2 h-5 w-5" />
                  ⏸️ BOT STOPPEN
                </Button>
              )}
              
              {(botStatus === 'starting' || botStatus === 'stopping') && (
                <Button disabled className="px-8 py-4 text-lg">
                  <Activity className="mr-2 h-5 w-5 animate-spin" />
                  {botStatus === 'starting' ? 'Startet...' : 'Stoppt...'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Live Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-900/40 to-emerald-900/30 border-green-400/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Euro className="h-8 w-8 text-green-400" />
                  <div>
                    <p className="text-green-200/80 text-sm font-serif">Today Revenue</p>
                    <p className="text-2xl font-bold text-green-400 font-serif">
                      {botStats.today_revenue.toFixed(2)}€
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
                    <p className="text-blue-200/80 text-sm font-serif">Today Sales</p>
                    <p className="text-2xl font-bold text-blue-400 font-serif">
                      {botStats.today_sales}
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
                      {botStats.conversion_rate.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-900/40 to-red-900/30 border-orange-400/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-8 w-8 text-orange-400" />
                  <div>
                    <p className="text-orange-200/80 text-sm font-serif">Total Revenue</p>
                    <p className="text-2xl font-bold text-orange-400 font-serif">
                      {botStats.total_revenue.toFixed(2)}€
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bot Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="bg-black/40 border-purple-400/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-purple-200 font-serif flex items-center gap-2">
                <Rocket className="h-5 w-5 text-purple-400" />
                Bot Module Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(botModules).map(([module, data]) => (
                  <div key={module} className="flex items-center justify-between p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <div className="flex items-center gap-3">
                      {module === 'social_media' && <Share2 className="h-4 w-4 text-blue-400" />}
                      {module === 'email_marketing' && <Mail className="h-4 w-4 text-green-400" />}
                      {module === 'lead_generation' && <Users className="h-4 w-4 text-yellow-400" />}
                      {module === 'sales_tracking' && <BarChart3 className="h-4 w-4 text-purple-400" />}
                      {module === 'conversion_optimizer' && <Zap className="h-4 w-4 text-orange-400" />}
                      
                      <div>
                        <span className="text-purple-200 font-semibold capitalize text-sm">
                          {module.replace('_', ' ')}
                        </span>
                        <div className="text-xs text-purple-400">
                          {module === 'social_media' && `${data.posts_today} Posts, ${data.engagement}% Engagement`}
                          {module === 'email_marketing' && `${data.emails_sent} Emails, ${data.open_rate}% Open Rate`}
                          {module === 'lead_generation' && `${data.leads_today} Leads, ${data.conversion_rate}% Conv.`}
                          {module === 'sales_tracking' && `${data.sales_tracked} Sales, ${data.revenue_tracked}€`}
                          {module === 'conversion_optimizer' && `${data.tests_running} Tests, +${data.improvement}%`}
                        </div>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(data.status)} px-2 py-1 text-xs`}>
                      {getStatusIcon(data.status)}
                      <span className="ml-1">{data.status === 'running' ? 'AKTIV' : 'STOP'}</span>
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Live Activity Feed */}
          <Card className="bg-black/40 border-green-400/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-green-200 font-serif flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-400" />
                Live Bot Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {liveActivity.length > 0 ? (
                  liveActivity.map((activity) => (
                    <div key={activity.id} className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-green-400">{activity.timestamp}</span>
                        <CheckCircle className="h-3 w-3 text-green-400" />
                      </div>
                      <p className="text-green-200 text-sm">{activity.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="font-serif">Bot ist gestoppt - keine Aktivität</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bot Performance Summary */}
        {botStatus === 'running' && (
          <Card className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-400/30 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Flame className="h-12 w-12 text-purple-400 animate-pulse" />
                <div>
                  <h2 className="text-3xl font-bold text-purple-200 font-serif">
                    BOT LÄUFT PERFEKT!
                  </h2>
                  <p className="text-purple-400/80 font-serif italic">
                    Automatische Verkäufe werden generiert
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-6 text-purple-400/60 flex-wrap">
                <div className="flex items-center gap-2">
                  <Share2 className="h-4 w-4 animate-pulse" />
                  <span className="font-serif text-sm">Social Media Aktiv</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 animate-bounce" />
                  <span className="font-serif text-sm">Email Kampagnen laufen</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span className="font-serif text-sm">Leads werden konvertiert</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}