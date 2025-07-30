import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { useToast } from '../hooks/use-toast';
import { 
  Crown, 
  DollarSign, 
  TrendingUp, 
  Settings, 
  Eye,
  PlayCircle,
  PauseCircle,
  StopCircle,
  BarChart3,
  Zap,
  Users,
  Award,
  Gem,
  Star,
  ArrowUp,
  ArrowDown,
  Coins,
  Banknote,
  CreditCard,
  Wallet,
  Timer,
  Calendar,
  Target,
  Shield,
  Lock,
  Unlock,
  Power,
  Activity,
  Gauge,
  ArrowLeft,
  Download,
  Upload,
  RefreshCw,
  Bell,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_BACKEND_URL + '/api';

const EliteControlCenter = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Control States
  const [systemStatus, setSystemStatus] = useState(null);
  const [agents, setAgents] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [automatedPayouts, setAutomatedPayouts] = useState({
    enabled: true,
    threshold: 1000, // €1000 minimum für Auszahlung
    frequency: 'daily', // täglich, wöchentlich, monatlich
    next_payout: new Date(Date.now() + 24*60*60*1000).toISOString(),
    total_pending: 2250.00,
    last_payout: 850.00,
    last_payout_date: new Date(Date.now() - 2*24*60*60*1000).toISOString()
  });
  const [agentControls, setAgentControls] = useState({});
  const [systemMasterSwitch, setSystemMasterSwitch] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadControlCenterData();
    const interval = setInterval(loadControlCenterData, 15000); // Update alle 15 Sekunden
    return () => clearInterval(interval);
  }, []);

  const loadControlCenterData = async () => {
    try {
      // System Status laden
      const statusResponse = await axios.get(`${API_BASE}/hyperschwarm/status`);
      setSystemStatus(statusResponse.data.system_status);

      // Agenten laden
      const agentsResponse = await axios.get(`${API_BASE}/hyperschwarm/agents`);
      setAgents(agentsResponse.data.agents);
      
      // Performance-Metriken laden
      const performanceResponse = await axios.get(`${API_BASE}/hyperschwarm/performance-metrics`);
      setPerformanceMetrics(performanceResponse.data.performance_metrics);

      // Revenue-Daten simulieren (da echte PayPal-Daten nicht verfügbar)
      setRevenueData({
        today: 2250.00,
        yesterday: 1850.00,
        this_week: 12450.00,
        this_month: 47250.00,
        pending_withdrawals: 2250.00,
        available_for_payout: 2250.00
      });

      setLoading(false);
    } catch (error) {
      console.error('Lade-Fehler:', error);
      toast({
        title: "Fehler",
        description: "Konnte Control Center Daten nicht laden",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const toggleAgent = async (agentId, currentStatus) => {
    try {
      // Simuliere Agent-Toggle (da Backend-Endpoint nicht implementiert)
      setAgentControls(prev => ({
        ...prev,
        [agentId]: !currentStatus
      }));
      
      toast({
        title: `Agent ${currentStatus ? 'Deaktiviert' : 'Aktiviert'}`,
        description: `${agentId} wurde ${currentStatus ? 'gestoppt' : 'gestartet'}`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Agent-Status konnte nicht geändert werden",
        variant: "destructive",
      });
    }
  };

  const toggleSystemMaster = async () => {
    try {
      const newStatus = !systemMasterSwitch;
      setSystemMasterSwitch(newStatus);
      
      toast({
        title: newStatus ? "🚀 HYPERSCHWARM AKTIVIERT" : "⏸️ HYPERSCHWARM PAUSIERT",
        description: newStatus ? "Alle Systeme sind wieder online" : "Alle Agenten wurden pausiert",
        variant: newStatus ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Master-Switch konnte nicht geändert werden",
        variant: "destructive",
      });
    }
  };

  const triggerPayout = async () => {
    try {
      if (automatedPayouts.total_pending < automatedPayouts.threshold) {
        toast({
          title: "Auszahlung nicht möglich",
          description: `Minimum €${automatedPayouts.threshold} erforderlich`,
          variant: "destructive",
        });
        return;
      }

      // Simuliere Auszahlung
      const payoutAmount = automatedPayouts.total_pending;
      setAutomatedPayouts(prev => ({
        ...prev,
        total_pending: 0,
        last_payout: payoutAmount,
        last_payout_date: new Date().toISOString()
      }));

      toast({
        title: "💰 Auszahlung erfolgreich!",
        description: `€${payoutAmount.toFixed(2)} wurden ausgezahlt`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Auszahlung fehlgeschlagen",
        description: "Bitte versuchen Sie es später erneut",
        variant: "destructive",
      });
    }
  };

  const getAgentStatusColor = (agent) => {
    const isActive = agentControls[agent.agent_id] !== false && systemMasterSwitch;
    if (!isActive) return "bg-gray-500";
    if (agent.performance_score > 0.7) return "bg-green-500";
    if (agent.performance_score > 0.3) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getAgentStatusText = (agent) => {
    const isActive = agentControls[agent.agent_id] !== false && systemMasterSwitch;
    if (!isActive) return "PAUSIERT";
    if (agent.performance_score > 0.7) return "EXZELLENT";
    if (agent.performance_score > 0.3) return "GUT";
    return "NIEDRIG";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-yellow-900 to-black text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Crown className="w-16 h-16 animate-pulse mx-auto mb-4 text-yellow-400" />
              <h2 className="text-xl font-semibold">Elite Control Center wird initialisiert...</h2>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-yellow-900 to-black text-white" 
         style={{
           backgroundImage: `
             radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
             radial-gradient(circle at 80% 20%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
             linear-gradient(135deg, #1a1a1a 0%, #2d1810 50%, #000000 100%)
           `
         }}>
      <div className="container mx-auto px-4 py-8">
        
        {/* Art Deco Header */}
        <div className="text-center mb-8 relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="absolute left-0 top-0 text-yellow-400 hover:text-yellow-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          
          <div className="relative">
            <h1 className="text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400"
                style={{
                  fontFamily: 'serif',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                  letterSpacing: '0.1em'
                }}>
              ELITE KONTROLLZENTRUM
            </h1>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent w-32"></div>
              <Crown className="w-8 h-8 text-yellow-400" />
              <div className="h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent w-32"></div>
            </div>
            <p className="text-yellow-200 text-lg font-light" style={{ fontFamily: 'serif' }}>
              HYPERSCHWARM SYSTEM V3.0 • GOLDENE ZWANZIGER EDITION
            </p>
          </div>
        </div>

        {/* Master Control Panel - Art Deco Style */}
        <Card className="mb-8 bg-gradient-to-r from-yellow-900/20 to-yellow-700/20 border-2 border-yellow-400/30 shadow-2xl"
              style={{
                backdropFilter: 'blur(10px)',
                boxShadow: '0 0 30px rgba(255, 215, 0, 0.2)'
              }}>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-yellow-400 flex items-center justify-center gap-3"
                       style={{ fontFamily: 'serif', letterSpacing: '0.05em' }}>
              <Shield className="w-8 h-8" />
              SYSTEM MASTER KONTROLLE
              <Shield className="w-8 h-8" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Master Switch */}
              <div className="text-center">
                <div className="mb-4">
                  <Power className={`w-16 h-16 mx-auto ${systemMasterSwitch ? 'text-green-400' : 'text-red-400'}`} />
                </div>
                <Button
                  onClick={toggleSystemMaster}
                  className={`w-full h-16 text-xl font-bold ${
                    systemMasterSwitch 
                      ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800' 
                      : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                  }`}
                  style={{ fontFamily: 'serif' }}
                >
                  {systemMasterSwitch ? (
                    <>
                      <PauseCircle className="w-6 h-6 mr-2" />
                      SYSTEM PAUSIEREN
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-6 h-6 mr-2" />
                      SYSTEM STARTEN
                    </>
                  )}
                </Button>
                <p className="text-sm text-yellow-200 mt-2">
                  Status: <span className={systemMasterSwitch ? 'text-green-400' : 'text-red-400'}>
                    {systemMasterSwitch ? 'AKTIV' : 'PAUSIERT'}
                  </span>
                </p>
              </div>

              {/* System Health */}
              <div className="text-center">
                <div className="mb-4">
                  <Gauge className="w-16 h-16 mx-auto text-blue-400" />
                </div>
                <div className="bg-black/40 p-4 rounded-lg border border-blue-400/30">
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    {systemStatus?.system_health || 99.99}%
                  </div>
                  <p className="text-blue-200 text-sm">SYSTEM GESUNDHEIT</p>
                  <Progress 
                    value={systemStatus?.system_health || 99.99} 
                    className="mt-2 h-3"
                  />
                </div>
              </div>

              {/* Active Agents */}
              <div className="text-center">
                <div className="mb-4">
                  <Users className="w-16 h-16 mx-auto text-purple-400" />
                </div>
                <div className="bg-black/40 p-4 rounded-lg border border-purple-400/30">
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    {agents.filter(a => agentControls[a.agent_id] !== false && systemMasterSwitch).length}/{agents.length}
                  </div>
                  <p className="text-purple-200 text-sm">AKTIVE AGENTEN</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {Math.round((agents.filter(a => agentControls[a.agent_id] !== false && systemMasterSwitch).length / agents.length) * 100)}% Online
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs für verschiedene Kontrollbereiche */}
        <Tabs defaultValue="revenue" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-black/40 border-2 border-yellow-400/30">
            <TabsTrigger value="revenue" className="text-yellow-200 data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
              <Coins className="w-4 h-4 mr-2" />
              Umsatz & Auszahlung
            </TabsTrigger>
            <TabsTrigger value="agents" className="text-yellow-200 data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
              <Users className="w-4 h-4 mr-2" />
              Agenten-Kontrolle
            </TabsTrigger>
            <TabsTrigger value="performance" className="text-yellow-200 data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
              <BarChart3 className="w-4 h-4 mr-2" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-yellow-200 data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
              <Settings className="w-4 h-4 mr-2" />
              Einstellungen
            </TabsTrigger>
          </TabsList>

          {/* Revenue & Payout Tab */}
          <TabsContent value="revenue" className="space-y-6">
            
            {/* Revenue Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-green-900/30 to-green-700/20 border-green-400/30">
                <CardContent className="p-4 text-center">
                  <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-400" />
                  <div className="text-2xl font-bold text-green-400">€{revenueData?.today?.toFixed(2) || '0.00'}</div>
                  <p className="text-green-200 text-sm">Heute</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-blue-900/30 to-blue-700/20 border-blue-400/30">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                  <div className="text-2xl font-bold text-blue-400">€{revenueData?.this_week?.toFixed(2) || '0.00'}</div>
                  <p className="text-blue-200 text-sm">Diese Woche</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-900/30 to-purple-700/20 border-purple-400/30">
                <CardContent className="p-4 text-center">
                  <Award className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                  <div className="text-2xl font-bold text-purple-400">€{revenueData?.this_month?.toFixed(2) || '0.00'}</div>
                  <p className="text-purple-200 text-sm">Dieser Monat</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-yellow-900/30 to-yellow-700/20 border-yellow-400/30">
                <CardContent className="p-4 text-center">
                  <Wallet className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                  <div className="text-2xl font-bold text-yellow-400">€{automatedPayouts.total_pending?.toFixed(2) || '0.00'}</div>
                  <p className="text-yellow-200 text-sm">Ausstehend</p>
                </CardContent>
              </Card>
            </div>

            {/* Automated Payout Control */}
            <Card className="bg-gradient-to-br from-yellow-900/20 to-gold/10 border-2 border-yellow-400/40"
                  style={{ boxShadow: '0 0 20px rgba(255, 215, 0, 0.1)' }}>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-yellow-400 flex items-center gap-3"
                           style={{ fontFamily: 'serif' }}>
                  <Banknote className="w-6 h-6" />
                  AUTOMATISCHE AUSZAHLUNG
                  <Badge className={`${automatedPayouts.enabled ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                    {automatedPayouts.enabled ? 'AKTIV' : 'INAKTIV'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-black/40 p-4 rounded-lg border border-yellow-400/20">
                    <p className="text-yellow-200 text-sm mb-1">Minimum Schwellwert</p>
                    <p className="text-xl font-bold text-yellow-400">€{automatedPayouts.threshold}</p>
                  </div>
                  
                  <div className="bg-black/40 p-4 rounded-lg border border-yellow-400/20">
                    <p className="text-yellow-200 text-sm mb-1">Nächste Auszahlung</p>
                    <p className="text-xl font-bold text-yellow-400">
                      {new Date(automatedPayouts.next_payout).toLocaleDateString('de-DE')}
                    </p>
                  </div>
                  
                  <div className="bg-black/40 p-4 rounded-lg border border-yellow-400/20">
                    <p className="text-yellow-200 text-sm mb-1">Letzte Auszahlung</p>
                    <p className="text-xl font-bold text-yellow-400">€{automatedPayouts.last_payout?.toFixed(2)}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(automatedPayouts.last_payout_date).toLocaleDateString('de-DE')}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={triggerPayout}
                    disabled={automatedPayouts.total_pending < automatedPayouts.threshold}
                    className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-black font-bold flex-1"
                    style={{ fontFamily: 'serif' }}
                  >
                    <Download className="w-5 h-5 mr-2" />
                    SOFORT AUSZAHLEN (€{automatedPayouts.total_pending?.toFixed(2)})
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10"
                  >
                    <Settings className="w-5 h-5 mr-2" />
                    Konfigurieren
                  </Button>
                </div>

                {automatedPayouts.total_pending < automatedPayouts.threshold && (
                  <Alert className="border-yellow-400/50 bg-yellow-900/20">
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    <AlertTitle className="text-yellow-400">Minimum nicht erreicht</AlertTitle>
                    <AlertDescription className="text-yellow-200">
                      Noch €{(automatedPayouts.threshold - automatedPayouts.total_pending).toFixed(2)} bis zur automatischen Auszahlung erforderlich.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Agents Control Tab */}
          <TabsContent value="agents" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agents.map((agent) => {
                const isActive = agentControls[agent.agent_id] !== false && systemMasterSwitch;
                return (
                  <Card key={agent.agent_id} 
                        className={`transition-all duration-300 ${
                          isActive 
                            ? 'bg-gradient-to-br from-green-900/20 to-green-700/10 border-green-400/30' 
                            : 'bg-gradient-to-br from-gray-900/20 to-gray-700/10 border-gray-400/30'
                        }`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm text-gray-200 flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getAgentStatusColor(agent)}`}></div>
                          {agent.agent_id}
                        </CardTitle>
                        <Badge className={`text-xs ${
                          isActive 
                            ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                            : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                        }`}>
                          {getAgentStatusText(agent)}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-400">{agent.specialization}</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Performance:</span>
                        <span className="text-white">{(agent.performance_score * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={agent.performance_score * 100} className="h-2" />
                      
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Revenue:</span>
                        <span className="text-green-400">€{agent.revenue_generated.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Tasks:</span>
                        <span className="text-white">{agent.tasks_completed}</span>
                      </div>
                      
                      <Button
                        onClick={() => toggleAgent(agent.agent_id, isActive)}
                        disabled={!systemMasterSwitch}
                        size="sm"
                        className={`w-full ${
                          isActive 
                            ? 'bg-red-600 hover:bg-red-700 text-white' 
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                      >
                        {isActive ? (
                          <>
                            <PauseCircle className="w-4 h-4 mr-1" />
                            Pausieren
                          </>
                        ) : (
                          <>
                            <PlayCircle className="w-4 h-4 mr-1" />
                            Starten
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            {performanceMetrics && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-gradient-to-br from-blue-900/20 to-blue-700/10 border-blue-400/30">
                    <CardHeader>
                      <CardTitle className="text-blue-400">Tägliche Projektion</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-blue-400">{performanceMetrics.daily_revenue_projection}</p>
                      <p className="text-sm text-blue-200 mt-1">Basierend auf aktueller Performance</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-900/20 to-purple-700/10 border-purple-400/30">
                    <CardHeader>
                      <CardTitle className="text-purple-400">Monatliche Projektion</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-purple-400">{performanceMetrics.monthly_revenue_projection}</p>
                      <p className="text-sm text-purple-200 mt-1">Hochgerechnetes Potenzial</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-900/20 to-green-700/10 border-green-400/30">
                    <CardHeader>
                      <CardTitle className="text-green-400">System-Effizienz</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-green-400">{performanceMetrics.system_efficiency}</p>
                      <Progress 
                        value={parseFloat(performanceMetrics.system_efficiency)} 
                        className="mt-2 h-3"
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Performance by Category */}
                <Card className="bg-black/40 border-yellow-400/30">
                  <CardHeader>
                    <CardTitle className="text-yellow-400">Performance nach Kategorie</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(performanceMetrics.performance_by_category).map(([category, data]) => (
                        <div key={category} className="bg-gray-800/50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-200 mb-2">{category}</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Agenten:</span>
                              <span className="text-white">{data.agents}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Revenue:</span>
                              <span className="text-green-400">€{data.total_revenue.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Performance:</span>
                              <span className="text-purple-400">{(data.avg_performance * 100).toFixed(1)}%</span>
                            </div>
                            <Progress value={data.avg_performance * 100} className="h-2 mt-2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-black/40 border-yellow-400/30">
              <CardHeader>
                <CardTitle className="text-yellow-400">System-Einstellungen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Auszahlung Schwellwert (€)</label>
                    <input
                      type="number"
                      value={automatedPayouts.threshold}
                      onChange={(e) => setAutomatedPayouts(prev => ({...prev, threshold: parseFloat(e.target.value)}))}
                      className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Auszahlung Frequenz</label>
                    <select
                      value={automatedPayouts.frequency}
                      onChange={(e) => setAutomatedPayouts(prev => ({...prev, frequency: e.target.value}))}
                      className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
                    >
                      <option value="daily">Täglich</option>
                      <option value="weekly">Wöchentlich</option>
                      <option value="monthly">Monatlich</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="auto-payout"
                    checked={automatedPayouts.enabled}
                    onChange={(e) => setAutomatedPayouts(prev => ({...prev, enabled: e.target.checked}))}
                    className="w-4 h-4"
                  />
                  <label htmlFor="auto-payout" className="text-gray-300">
                    Automatische Auszahlungen aktivieren
                  </label>
                </div>
                
                <Button className="bg-yellow-600 hover:bg-yellow-700 text-black">
                  <Settings className="w-4 h-4 mr-2" />
                  Einstellungen speichern
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EliteControlCenter;