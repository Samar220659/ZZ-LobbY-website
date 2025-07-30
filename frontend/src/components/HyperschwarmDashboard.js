import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { useToast } from '../hooks/use-toast';
import { 
  Bot, 
  TrendingUp, 
  DollarSign, 
  Activity, 
  Users, 
  Target, 
  Zap,
  Brain,
  ArrowLeft,
  Play,
  Settings,
  BarChart3,
  Shield,
  Rocket,
  Crown,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const HyperschwarmDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [systemStatus, setSystemStatus] = useState(null);
  const [agents, setAgents] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [strategyObjective, setStrategyObjective] = useState('Steigere monatlichen Umsatz auf €25.000');
  const [targetRevenue, setTargetRevenue] = useState(5000);

  useEffect(() => {
    loadHyperschwarmData();
    const interval = setInterval(loadHyperschwarmData, 30000); // Update alle 30 Sekunden
    return () => clearInterval(interval);
  }, []);

  const loadHyperschwarmData = async () => {
    try {
      // System Status laden
      const statusResponse = await fetch(`${BACKEND_URL}/api/hyperschwarm/status`);
      const statusData = await statusResponse.json();
      setSystemStatus(statusData.system_status);

      // Agenten laden
      const agentsResponse = await fetch(`${BACKEND_URL}/api/hyperschwarm/agents`);
      const agentsData = await agentsResponse.json();
      setAgents(agentsData.agents);

      // Performance Metriken laden
      const performanceResponse = await fetch(`${BACKEND_URL}/api/hyperschwarm/performance-metrics`);
      const performanceData = await performanceResponse.json();
      setPerformanceMetrics(performanceData.performance_metrics);

      setLoading(false);
    } catch (error) {
      console.error('Fehler beim Laden der HYPERSCHWARM Daten:', error);
      toast({
        title: "Fehler",
        description: "Konnte HYPERSCHWARM Daten nicht laden",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const executeStrategy = async () => {
    setExecuting(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/hyperschwarm/execute-strategy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          objective: strategyObjective,
          target_revenue: targetRevenue,
          priority: 'high',
          timeframe: '24h'
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "🚀 Strategie erfolgreich gestartet!",
          description: `${data.strategy_execution.participating_agents} Agenten arbeiten an Ihrem Ziel`,
          variant: "default",
        });
        
        // Daten neu laden
        setTimeout(loadHyperschwarmData, 2000);
      } else {
        throw new Error('Strategie-Ausführung fehlgeschlagen');
      }
    } catch (error) {
      console.error('Fehler bei Strategie-Ausführung:', error);
      toast({
        title: "Fehler",
        description: "Strategie konnte nicht ausgeführt werden",
        variant: "destructive",
      });
    } finally {
      setExecuting(false);
    }
  };

  const optimizeAgents = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/hyperschwarm/optimize-agents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "⚡ Optimierung erfolgreich!",
          description: `${data.optimized_agents} Agenten wurden optimiert`,
          variant: "default",
        });
        
        // Daten neu laden
        setTimeout(loadHyperschwarmData, 1000);
      }
    } catch (error) {
      console.error('Fehler bei Agent-Optimierung:', error);
      toast({
        title: "Fehler",
        description: "Agent-Optimierung fehlgeschlagen",
        variant: "destructive",
      });
    }
  };

  const getAgentIcon = (specialization) => {
    const iconMap = {
      'Marketing': <TrendingUp className="w-4 h-4" />,
      'Sales': <DollarSign className="w-4 h-4" />,
      'Traffic Generation': <Users className="w-4 h-4" />,
      'Automation': <Bot className="w-4 h-4" />,
      'Data Analytics': <BarChart3 className="w-4 h-4" />,
      'Compliance & Legal': <Shield className="w-4 h-4" />,
      'Scaling & Growth': <Rocket className="w-4 h-4" />,
      'Customer Success': <Star className="w-4 h-4" />
    };
    return iconMap[specialization] || <Brain className="w-4 h-4" />;
  };

  const getPerformanceBadgeVariant = (score) => {
    if (score >= 0.9) return 'default'; // Grün für exzellent
    if (score >= 0.7) return 'secondary'; // Blau für gut  
    if (score >= 0.5) return 'outline'; // Gelb für durchschnittlich
    return 'destructive'; // Rot für schlecht
  };

  const getPerformanceLabel = (score) => {
    if (score >= 0.9) return 'Elite';
    if (score >= 0.7) return 'Gut';
    if (score >= 0.5) return 'OK';
    return 'Niedrig';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Bot className="w-16 h-16 animate-pulse mx-auto mb-4" />
              <h2 className="text-xl font-semibold">HYPERSCHWARM wird initialisiert...</h2>
              <p className="text-gray-300 mt-2">Elite Agenten werden aktiviert</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-gray-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                HYPERSCHWARM SYSTEM V3.0
              </h1>
              <p className="text-gray-300 mt-1">Ultra-High-Performance Multi-Agent Orchestration Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Crown className="w-6 h-6 text-yellow-400" />
            <Badge variant="outline" className="text-yellow-400 border-yellow-400">
              Elite System
            </Badge>
          </div>
        </div>

        {/* System Status Cards */}
        {systemStatus && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Activity className="w-8 h-8 text-green-400" />
                  <div>
                    <p className="text-sm text-gray-400">System Health</p>
                    <p className="text-2xl font-bold text-green-400">{systemStatus.system_health}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Bot className="w-8 h-8 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-400">Active Agents</p>
                    <p className="text-2xl font-bold text-blue-400">{systemStatus.active_agents}/{systemStatus.total_agents}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-purple-400" />
                  <div>
                    <p className="text-sm text-gray-400">Performance</p>
                    <p className="text-2xl font-bold text-purple-400">{systemStatus.avg_performance_score}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-8 h-8 text-green-400" />
                  <div>
                    <p className="text-sm text-gray-400">Revenue Generated</p>
                    <p className="text-2xl font-bold text-green-400">€{systemStatus.total_revenue_generated}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Dashboard */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800">
            <TabsTrigger value="overview">Übersicht</TabsTrigger>
            <TabsTrigger value="agents">Agenten</TabsTrigger>
            <TabsTrigger value="strategies">Strategien</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Strategy Execution */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Strategie-Ausführung
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Ziel definieren</label>
                  <input
                    type="text"
                    value={strategyObjective}
                    onChange={(e) => setStrategyObjective(e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    placeholder="Beschreiben Sie Ihr Geschäftsziel..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Ziel-Umsatz (€)</label>
                  <input
                    type="number"
                    value={targetRevenue}
                    onChange={(e) => setTargetRevenue(parseInt(e.target.value) || 0)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    placeholder="5000"
                  />
                </div>
                <div className="flex gap-3">
                  <Button 
                    onClick={executeStrategy} 
                    disabled={executing}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {executing ? (
                      <>
                        <Bot className="w-4 h-4 mr-2 animate-spin" />
                        Agenten arbeiten...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Strategie starten
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={optimizeAgents}>
                    <Settings className="w-4 h-4 mr-2" />
                    Agenten optimieren
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            {performanceMetrics && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-sm">Tägliche Projektion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-green-400">{performanceMetrics.daily_revenue_projection}</p>
                    <p className="text-sm text-gray-400 mt-1">Basierend auf aktueller Performance</p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-sm">Monatliche Projektion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-purple-400">{performanceMetrics.monthly_revenue_projection}</p>
                    <p className="text-sm text-gray-400 mt-1">Hochgerechnetes Potenzial</p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-sm">System-Effizienz</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-blue-400">{performanceMetrics.system_efficiency}</p>
                    <Progress 
                      value={parseFloat(performanceMetrics.system_efficiency)} 
                      className="mt-2"
                    />
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="agents" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agents.map((agent) => (
                <Card key={agent.agent_id} className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getAgentIcon(agent.specialization)}
                        <CardTitle className="text-sm">{agent.agent_id}</CardTitle>
                      </div>
                      <Badge 
                        variant={getPerformanceBadgeVariant(agent.performance_score)}
                        className="text-xs"
                      >
                        {getPerformanceLabel(agent.performance_score)}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-400">{agent.specialization}</p>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Performance:</span>
                      <span className="text-white">{(agent.performance_score * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={agent.performance_score * 100} className="h-2" />
                    
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Tasks:</span>
                      <span className="text-white">{agent.tasks_completed}</span>
                    </div>
                    
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Revenue:</span>
                      <span className="text-green-400">€{agent.revenue_generated.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs mt-2">
                      <span className="text-gray-400">Status:</span>
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${agent.active ? 'bg-green-400' : 'bg-red-400'}`}></div>
                        <span className={agent.active ? 'text-green-400' : 'text-red-400'}>
                          {agent.active ? 'Aktiv' : 'Inaktiv'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="strategies" className="space-y-6">
            <Alert className="bg-gray-800 border-gray-700">
              <Zap className="h-4 w-4" />
              <AlertTitle>Strategie-Koordination</AlertTitle>
              <AlertDescription>
                Das HYPERSCHWARM System koordiniert automatisch alle Agenten für optimale Ergebnisse.
                Jede Strategie wird von mehreren spezialisierten Agenten parallel ausgeführt.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Marketing Swarm
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400 mb-3">3 Marketing-Agenten arbeiten an viralen Inhalten</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Content Creation</span>
                      <Badge variant="outline">Aktiv</Badge>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>A/B Testing</span>
                      <Badge variant="outline">Aktiv</Badge>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Viral Optimization</span>
                      <Badge variant="outline">Aktiv</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Sales Force
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400 mb-3">3 Sales-Agenten optimieren Conversions</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Funnel Optimization</span>
                      <Badge variant="outline">Aktiv</Badge>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Price Psychology</span>
                      <Badge variant="outline">Aktiv</Badge>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Objection Handling</span>
                      <Badge variant="outline">Aktiv</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            {performanceMetrics && performanceMetrics.performance_by_category && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(performanceMetrics.performance_by_category).map(([category, data]) => (
                  <Card key={category} className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-sm">
                        {getAgentIcon(category)}
                        {category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Agenten:</span>
                        <span className="text-white">{data.agents}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Revenue:</span>
                        <span className="text-green-400">€{data.total_revenue.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Performance:</span>
                        <span className="text-purple-400">{(data.avg_performance * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Tasks:</span>
                        <span className="text-white">{data.total_tasks}</span>
                      </div>
                      <Progress value={data.avg_performance * 100} className="h-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HyperschwarmDashboard;