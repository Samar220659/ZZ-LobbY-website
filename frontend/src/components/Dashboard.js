import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Bot, 
  QrCode, 
  Smartphone,
  Play,
  Settings,
  BarChart3,
  Zap,
  Crown,
  Route,
  Flag,
  Target,
  Trophy,
  CheckCircle,
  XCircle,
  Calendar
} from "lucide-react";
import { toast } from "sonner";
import { dashboardApi } from "../services/api";
import LegalFooter from "./legal/LegalFooter";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    todayEarnings: "0.00",
    todayGrowth: 0,
    activeLeads: 0,
    newLeads: 0,
    conversionRate: 0,
    activeAutomations: 0,
    systemPerformance: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await dashboardApi.getStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Fehler beim Laden der Dashboard-Daten');
      toast.error('Fehler beim Laden der Dashboard-Daten');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">ZZ-Lobby Elite lädt...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-lg font-medium mb-4">{error}</div>
          <Button 
            onClick={fetchDashboardStats}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-semibold"
          >
            Erneut versuchen
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center font-bold text-black">
                ZZ
              </div>
              <div>
                <h1 className="text-xl font-bold">ZZ-Lobby Elite</h1>
                <p className="text-sm text-gray-400">Mobile SaaS Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => handleNavigation('/control')}
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold"
              >
                <Crown className="mr-2 h-4 w-4" />
                Control Center
              </Button>
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                LIVE
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-black/40 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Heute Verdient</CardTitle>
              <DollarSign className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">€{stats.todayEarnings}</div>
              <p className="text-xs text-green-400">+{stats.todayGrowth}% vom Vortag</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Aktive Leads</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.activeLeads}</div>
              <p className="text-xs text-blue-400">+{stats.newLeads} neue heute</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.conversionRate}%</div>
              <p className="text-xs text-purple-400">Letzten 7 Tage</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Automationen</CardTitle>
              <Bot className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.activeAutomations}/5</div>
              <p className="text-xs text-green-400">Aktiv und optimiert</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30 hover:from-yellow-500/30 hover:to-orange-500/30 transition-all duration-300 cursor-pointer"
                onClick={() => handleNavigation('/payment')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <QrCode className="h-8 w-8 text-yellow-400" />
                <div className="text-right">
                  <div className="text-sm text-yellow-400">PayPal</div>
                  <div className="text-xs text-gray-400">QR-Code</div>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Sofort-Zahlung</h3>
              <p className="text-sm text-gray-400">QR-Code generieren & Payment-Link teilen</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500/30 hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300 cursor-pointer"
                onClick={() => handleNavigation('/automation')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Bot className="h-8 w-8 text-blue-400" />
                <div className="text-right">
                  <div className="text-sm text-blue-400">24/7</div>
                  <div className="text-xs text-gray-400">Automation</div>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Automation Hub</h3>
              <p className="text-sm text-gray-400">Leads, Social Media & Marketing automatisieren</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30 hover:from-green-500/30 hover:to-emerald-500/30 transition-all duration-300 cursor-pointer"
                onClick={() => handleNavigation('/analytics')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <BarChart3 className="h-8 w-8 text-green-400" />
                <div className="text-right">
                  <div className="text-sm text-green-400">Live</div>
                  <div className="text-xs text-gray-400">Analytics</div>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Real-Time Analytics</h3>
              <p className="text-sm text-gray-400">Umsatz, Conversion & ROI live verfolgen</p>
            </CardContent>
          </Card>
        </div>

        {/* HYPERSCHWARM Elite System */}
        <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500/50 hover:from-purple-600/30 hover:to-pink-600/30 transition-all duration-300 cursor-pointer mb-8"
              onClick={() => handleNavigation('/hyperschwarm')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Bot className="h-12 w-12 text-purple-400" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Crown className="h-2.5 w-2.5 text-black" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    HYPERSCHWARM SYSTEM V3.0
                  </h3>
                  <p className="text-sm text-gray-300">Ultra-High-Performance Multi-Agent Orchestration Engine</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-yellow-400 border-yellow-400 text-xs">
                      20+ Elite Agenten
                    </Badge>
                    <Badge variant="outline" className="text-green-400 border-green-400 text-xs">
                      99.99% Automatisierung
                    </Badge>
                    <Badge variant="outline" className="text-purple-400 border-purple-400 text-xs">
                      6-stelliger Umsatz
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-purple-400">€25K/Mo</div>
                <div className="text-sm text-gray-400">Zielumsatz</div>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-400">System AKTIV</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-400">20+</div>
                <div className="text-xs text-gray-400">Spezial-Agenten</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-400">98.5%</div>
                <div className="text-xs text-gray-400">Performance</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-yellow-400">24/7</div>
                <div className="text-xs text-gray-400">Orchestrierung</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-purple-500/20">
              <div>
                <p className="text-sm text-gray-300 mb-1">
                  <span className="font-semibold">Marketing • Sales • Traffic • Analytics • Automation</span>
                </p>
                <p className="text-xs text-gray-400">
                  Koordinierte Multi-Agent-Strategien für exponentielles Wachstum
                </p>
              </div>
              <Button 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigation('/hyperschwarm');
                }}
              >
                <Zap className="mr-2 h-4 w-4" />
                System starten
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ELITE CONTROL CENTER - 20er Jahre Deutschland Design */}
        <Card className="bg-gradient-to-br from-yellow-900/30 to-amber-900/20 border-2 border-yellow-400/50 hover:from-yellow-900/40 hover:to-amber-900/30 transition-all duration-300 cursor-pointer mb-8 relative overflow-hidden"
              onClick={() => handleNavigation('/elite-control')}
              style={{
                backgroundImage: `
                  radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
                  radial-gradient(circle at 80% 20%, rgba(255, 215, 0, 0.1) 0%, transparent 50%)
                `,
                backdropFilter: 'blur(10px)',
                boxShadow: '0 0 30px rgba(255, 215, 0, 0.2)'
              }}>
          {/* Art Deco Pattern Background */}
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full" style={{
              backgroundImage: `
                repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 10px,
                  rgba(255, 215, 0, 0.1) 10px,
                  rgba(255, 215, 0, 0.1) 20px
                )
              `
            }}></div>
          </div>
          
          <CardContent className="p-8 relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-xl">
                    <Crown className="h-8 w-8 text-black" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-black">
                    <span className="text-black text-xs font-bold">•</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 mb-2"
                      style={{
                        fontFamily: 'serif',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                        letterSpacing: '0.1em'
                      }}>
                    ELITE KONTROLLZENTRUM
                  </h3>
                  <p className="text-yellow-200 text-sm font-light mb-2" style={{ fontFamily: 'serif' }}>
                    Goldene Zwanziger Edition • Vollständige Systemkontrolle
                  </p>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                      <Settings className="w-3 h-3 mr-1" />
                      Master Control
                    </Badge>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                      <DollarSign className="w-3 h-3 mr-1" />
                      Auto-Auszahlung
                    </Badge>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                      <BarChart3 className="w-3 h-3 mr-1" />
                      Live-Monitoring
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-yellow-400 mb-1" style={{ fontFamily: 'serif' }}>€2.250</div>
                <div className="text-sm text-yellow-200">Ausstehende Auszahlung</div>
                <div className="flex items-center justify-end gap-2 mt-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-400 font-semibold">BEREIT FÜR AUSZAHLUNG</span>
                </div>
              </div>
            </div>
            
            {/* Art Deco Divider */}
            <div className="flex items-center justify-center mb-6">
              <div className="h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent w-20"></div>
              <div className="mx-4 w-2 h-2 bg-yellow-400 rounded-full"></div>
              <div className="h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent w-20"></div>
            </div>
            
            <div className="grid grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400" style={{ fontFamily: 'serif' }}>20/20</div>
                <div className="text-xs text-yellow-200">Agenten Aktiv</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400" style={{ fontFamily: 'serif' }}>99.99%</div>
                <div className="text-xs text-green-200">System Health</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400" style={{ fontFamily: 'serif' }}>€67.5K</div>
                <div className="text-xs text-blue-200">Täglich Proj.</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400" style={{ fontFamily: 'serif' }}>AUTO</div>
                <div className="text-xs text-purple-200">Auszahlung</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-yellow-400/20">
              <div>
                <p className="text-yellow-200 mb-2" style={{ fontFamily: 'serif', fontSize: '0.9rem' }}>
                  <span className="font-semibold">Master-Kontrolle • Agenten-Steuerung • Automatische Auszahlungen</span>
                </p>
                <p className="text-xs text-yellow-300/70">
                  Vollständige Kontrolle über Ihr HYPERSCHWARM System im eleganten 20er Jahre Design
                </p>
              </div>
              <Button 
                className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-black font-bold px-6 py-3"
                style={{ fontFamily: 'serif' }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigation('/elite-control');
                }}
              >
                <Crown className="mr-2 h-5 w-5" />
                KONTROLLZENTRUM ÖFFNEN
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ELITE ROADMAP - Masterplan zum Firmenchef */}
        <Card className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border-2 border-indigo-400/50 hover:from-indigo-900/40 hover:to-purple-900/40 transition-all duration-300 cursor-pointer mb-8 relative overflow-hidden"
              onClick={() => handleNavigation('/elite-roadmap')}
              style={{
                backgroundImage: `
                  radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
                  radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)
                `,
                backdropFilter: 'blur(10px)',
                boxShadow: '0 0 30px rgba(99, 102, 241, 0.2)'
              }}>
          {/* Roadmap Pattern Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: `
                repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 20px,
                  rgba(99, 102, 241, 0.2) 20px,
                  rgba(99, 102, 241, 0.2) 21px
                )
              `
            }}></div>
          </div>
          
          <CardContent className="p-8 relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
                    <Route className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Crown className="h-3 w-3 text-black" />
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-2"
                      style={{
                        fontFamily: 'serif',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                        letterSpacing: '0.05em'
                      }}>
                    ELITE ROADMAP
                  </h3>
                  <p className="text-indigo-200 text-sm font-light mb-2" style={{ fontFamily: 'serif' }}>
                    Von Arbeitslos zum Firmenchef • Der komplette Masterplan
                  </p>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 text-xs">
                      <Flag className="w-3 h-3 mr-1" />
                      6 Phasen
                    </Badge>
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                      <Target className="w-3 h-3 mr-1" />
                      Konkrete Schritte
                    </Badge>
                    <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/30 text-xs">
                      <Trophy className="w-3 h-3 mr-1" />
                      Bewährt
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-indigo-400 mb-1" style={{ fontFamily: 'serif' }}>€50K+</div>
                <div className="text-sm text-indigo-200">Monatliches Ziel</div>
                <div className="flex items-center justify-end gap-2 mt-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-400 font-semibold">TRANSFORMATION READY</span>
                </div>
              </div>
            </div>
            
            {/* Roadmap Preview */}
            <div className="grid grid-cols-6 gap-2 mb-6">
              {[
                { phase: "Start", label: "Arbeitslos", color: "bg-red-400", icon: "🏁" },
                { phase: "Phase 1", label: "Freelancer", color: "bg-orange-400", icon: "💼" },
                { phase: "Phase 2", label: "Services", color: "bg-blue-400", icon: "📈" },
                { phase: "Phase 3", label: "Digital", color: "bg-purple-400", icon: "🚀" },
                { phase: "Phase 4", label: "Business", color: "bg-green-400", icon: "🏢" },
                { phase: "Ziel", label: "Firmenchef", color: "bg-yellow-400", icon: "👑" }
              ].map((step, index) => (
                <div key={index} className="text-center">
                  <div className={`w-12 h-12 ${step.color} rounded-full flex items-center justify-center text-black font-bold mb-1 mx-auto shadow-lg`}>
                    <span className="text-lg">{step.icon}</span>
                  </div>
                  <div className="text-xs text-gray-300">{step.phase}</div>
                  <div className="text-xs text-gray-400">{step.label}</div>
                </div>
              ))}
            </div>
            
            {/* Key Features */}
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">✅ JACK - Was Sie machen müssen</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-400" />
                <span className="text-gray-300">❌ JACK NICHT - Was zu vermeiden ist</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300">📅 Konkrete Zeitpläne pro Phase</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">💰 Einkommensziele & Strategien</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-indigo-400/20">
              <div>
                <p className="text-indigo-200 mb-2" style={{ fontFamily: 'serif', fontSize: '0.9rem' }}>
                  <span className="font-semibold">Der bewährte Weg: Arbeitslos → Freelancer → Skalierung → Firmenchef</span>
                </p>
                <p className="text-xs text-indigo-300/70">
                  Kompletter Fahrplan mit Do's & Don'ts für jede Phase Ihrer Transformation
                </p>
              </div>
              <Button 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold px-6 py-3"
                style={{ fontFamily: 'serif' }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigation('/elite-roadmap');
                }}
              >
                <Route className="mr-2 h-5 w-5" />
                ROADMAP STARTEN
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* SaaS System Status */}
        <Card className="bg-black/40 border-white/10 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              SaaS System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">System Performance</span>
                <span className="text-sm text-green-400">Optimal</span>
              </div>
              <Progress value={stats.systemPerformance} className="h-2" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Lead Generation Engine</span>
                <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                  Aktiv
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Payment Processing</span>
                <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                  Online
                </Badge>
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-semibold"
                onClick={() => handleNavigation('/saas')}
              >
                <Play className="mr-2 h-4 w-4" />
                SaaS System Optimieren
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Mobile App Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-black/40 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-blue-400" />
                Mobile Installation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400 mb-4">
                Installiere die App auf deinem Home-Bildschirm für schnellen Zugriff
              </p>
              <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                <Smartphone className="mr-2 h-4 w-4" />
                Installationsanleitung
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-purple-400" />
                Erweiterte Einstellungen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400 mb-4">
                Konfiguriere erweiterte Automationen und White-Label Optionen
              </p>
              <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                <Settings className="mr-2 h-4 w-4" />
                Einstellungen öffnen
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Legal Footer */}
      <LegalFooter />
    </div>
  );
}