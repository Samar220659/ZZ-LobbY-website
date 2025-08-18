import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import api from '../services/api';

const AdvancedAiOptimizer = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [optimizationResults, setOptimizationResults] = useState(null);
  const [leadScore, setLeadScore] = useState(null);
  const [pricingData, setPricingData] = useState(null);
  const [marketIntel, setMarketIntel] = useState(null);

  // Load Dashboard on mount
  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await api.get('/advanced-ai/dashboard');
      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      console.error('Error loading AI dashboard:', error);
    }
  };

  const runLeadScoring = async () => {
    setLoading(true);
    try {
      const leadData = {
        name: 'Max Mustermann',
        company: 'Mustermann GmbH',
        email: 'max@mustermann.de',
        interest: 'AI Marketing Automation',
        budget: '€5000-10000',
        urgency: 'Hoch',
        industry: 'E-Commerce'
      };

      const response = await api.post('/advanced-ai/lead-scoring', leadData);
      if (response.data.success) {
        setLeadScore(response.data.data);
      }
    } catch (error) {
      console.error('Error in lead scoring:', error);
    } finally {
      setLoading(false);
    }
  };

  const runPricingOptimization = async () => {
    setLoading(true);
    try {
      const pricingRequest = {
        service: 'AI Marketing Automation',
        market_data: {
          current_price: 2500,
          competitor_avg: 3200,
          demand: 'Sehr Hoch',
          season: 'Q2 2025',
          conversion_rate: 18.5,
          target: 'Deutsche Mittelstand'
        }
      };

      const response = await api.post('/advanced-ai/pricing-optimization', pricingRequest);
      if (response.data.success) {
        setPricingData(response.data.data);
      }
    } catch (error) {
      console.error('Error in pricing optimization:', error);
    } finally {
      setLoading(false);
    }
  };

  const runMarketIntelligence = async () => {
    setLoading(true);
    try {
      const response = await api.get('/advanced-ai/market-intelligence?industry=AI Services&region=Deutschland');
      if (response.data.success) {
        setMarketIntel(response.data.data);
      }
    } catch (error) {
      console.error('Error in market intelligence:', error);
    } finally {
      setLoading(false);
    }
  };

  const runFullOptimization = async () => {
    setLoading(true);
    try {
      const businessData = {
        leads: {
          name: 'Premium Lead Pool',
          company: 'Various',
          interest: 'AI Automation',
          budget: '€5000+',
          urgency: 'Hoch'
        },
        service: 'Advanced AI Marketing',
        market: {
          current_price: 2500,
          competitor_avg: 3200,
          demand: 'Sehr Hoch',
          conversion_rate: 18.5
        },
        industry: 'AI Services'
      };

      const response = await api.post('/advanced-ai/full-optimization', businessData);
      if (response.data.success) {
        setOptimizationResults(response.data.data);
        // Reload dashboard nach Full Optimization
        setTimeout(loadDashboard, 1000);
      }
    } catch (error) {
      console.error('Error in full optimization:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    return status === 'online' ? 'bg-green-500' : 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
            🚀 Advanced AI Revenue Optimizer 2025
          </h1>
          <p className="text-gray-300 text-lg">
            Powered by GPT-4o • Claude-3.5 • Gemini Pro
          </p>
          {dashboardData && (
            <Badge variant="secondary" className="mt-2 bg-green-900 text-green-200 border-green-600">
              🤖 Autonomie: {dashboardData.autonomy_level} AKTIV
            </Badge>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6 bg-slate-800 border-slate-700">
            <TabsTrigger value="dashboard" className="text-white">📊 Dashboard</TabsTrigger>
            <TabsTrigger value="lead-ai" className="text-white">🎯 Lead AI</TabsTrigger>
            <TabsTrigger value="pricing-ai" className="text-white">💰 Pricing AI</TabsTrigger>
            <TabsTrigger value="market-ai" className="text-white">🌍 Market AI</TabsTrigger>
            <TabsTrigger value="full-optimize" className="text-white">⚡ Full AI</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* AI Models Status */}
              <Card className="bg-slate-800 border-slate-700 text-white">
                <CardHeader>
                  <CardTitle className="text-blue-400">🤖 AI Models Status</CardTitle>
                </CardHeader>
                <CardContent>
                  {dashboardData?.ai_models && Object.entries(dashboardData.ai_models).map(([model, data]) => (
                    <div key={model} className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(data.status)}`}></div>
                        <span className="font-medium">{model.toUpperCase()}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {data.usage}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Optimization Stats */}
              <Card className="bg-slate-800 border-slate-700 text-white">
                <CardHeader>
                  <CardTitle className="text-green-400">📈 Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  {dashboardData?.optimization_stats && (
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between">
                          <span>Revenue Increase</span>
                          <span className="text-green-400 font-bold">
                            {dashboardData.optimization_stats.avg_revenue_increase}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between">
                          <span>Conversion Boost</span>
                          <span className="text-blue-400 font-bold">
                            {dashboardData.optimization_stats.conversion_improvement}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between">
                          <span>Pricing Accuracy</span>
                          <span className="text-purple-400 font-bold">
                            {dashboardData.optimization_stats.pricing_accuracy}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* System Health */}
              <Card className="bg-slate-800 border-slate-700 text-white">
                <CardHeader>
                  <CardTitle className="text-purple-400">⚡ System Health</CardTitle>
                </CardHeader>
                <CardContent>
                  {dashboardData?.system_health && (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>AI Models Online</span>
                        <Badge className="bg-green-900 text-green-200">
                          {dashboardData.system_health.ai_models_online}/3
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Response Time</span>
                        <span className="text-green-400">{dashboardData.system_health.response_time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Accuracy Score</span>
                        <span className="text-blue-400">{dashboardData.system_health.accuracy_score}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Uptime</span>
                        <span className="text-purple-400">{dashboardData.system_health.uptime}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Capabilities */}
            {dashboardData?.real_time_capabilities && (
              <Card className="bg-slate-800 border-slate-700 text-white mt-6">
                <CardHeader>
                  <CardTitle className="text-yellow-400">🔥 Real-Time Capabilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {dashboardData.real_time_capabilities.map((capability, index) => (
                      <Badge key={index} variant="secondary" className="bg-slate-700 text-white border-slate-600">
                        {capability}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Lead AI Tab */}
          <TabsContent value="lead-ai">
            <Card className="bg-slate-800 border-slate-700 text-white">
              <CardHeader>
                <CardTitle className="text-blue-400">🎯 GPT-4o Lead Scoring AI</CardTitle>
                <CardDescription className="text-gray-400">
                  Präzise Conversion-Vorhersagen mit fortschrittlicher AI-Analyse
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={runLeadScoring} 
                  disabled={loading}
                  className="mb-4 bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? 'Analysiere...' : '🚀 Lead Scoring starten'}
                </Button>

                {leadScore && (
                  <div className="mt-4 space-y-4">
                    <Alert className="border-blue-500 bg-blue-950">
                      <AlertDescription>
                        <strong>Analyse mit {leadScore.model_used}</strong> abgeschlossen
                      </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm text-gray-400">Conversion Wahrscheinlichkeit</label>
                          <div className="flex items-center gap-2">
                            <Progress value={leadScore.conversion_probability} className="flex-1" />
                            <span className="text-green-400 font-bold">{leadScore.conversion_probability}%</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">Erwarteter Revenue</label>
                          <div className="text-2xl font-bold text-green-400">
                            €{leadScore.estimated_revenue.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">Risk Score</label>
                          <div className="flex items-center gap-2">
                            <Progress value={100 - leadScore.risk_score} className="flex-1" />
                            <span className="text-yellow-400">{leadScore.risk_score}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm text-gray-400">Verkaufsstrategie</label>
                          <p className="text-white">{leadScore.strategy}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">Timing-Empfehlung</label>
                          <p className="text-blue-400">{leadScore.timing}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">AI Insights</label>
                          <p className="text-purple-400">{leadScore.insights}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing AI Tab */}
          <TabsContent value="pricing-ai">
            <Card className="bg-slate-800 border-slate-700 text-white">
              <CardHeader>
                <CardTitle className="text-purple-400">💰 Claude-3.5 Pricing AI</CardTitle>
                <CardDescription className="text-gray-400">
                  Intelligente Preisoptimierung für maximalen Revenue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={runPricingOptimization} 
                  disabled={loading}
                  className="mb-4 bg-purple-600 hover:bg-purple-700"
                >
                  {loading ? 'Optimiere...' : '⚡ Preis-Optimierung starten'}
                </Button>

                {pricingData && (
                  <div className="mt-4 space-y-4">
                    <Alert className="border-purple-500 bg-purple-950">
                      <AlertDescription>
                        <strong>Optimierung mit {pricingData.model_used}</strong> abgeschlossen
                      </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="text-center p-4 bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg">
                          <div className="text-sm text-gray-400">Optimaler Preis</div>
                          <div className="text-3xl font-bold text-green-400">
                            €{pricingData.optimal_price.toLocaleString()}
                          </div>
                          <Badge className="mt-2 bg-green-900 text-green-200">
                            {pricingData.price_increase} Steigerung
                          </Badge>
                        </div>
                        
                        <div>
                          <label className="text-sm text-gray-400">Erwartete Conversion</label>
                          <div className="text-xl font-bold text-blue-400">{pricingData.expected_conversion}</div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-sm text-gray-400">Revenue Impact</label>
                          <div className="text-xl font-bold text-green-400">{pricingData.revenue_impact}</div>
                        </div>
                        
                        <div>
                          <label className="text-sm text-gray-400">Vertrauen</label>
                          <div className="flex items-center gap-2">
                            <Progress value={parseInt(pricingData.confidence)} className="flex-1" />
                            <span className="text-purple-400">{pricingData.confidence}</span>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm text-gray-400">Strategie</label>
                          <p className="text-white">{pricingData.strategy}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Market AI Tab */}
          <TabsContent value="market-ai">
            <Card className="bg-slate-800 border-slate-700 text-white">
              <CardHeader>
                <CardTitle className="text-green-400">🌍 Gemini Pro Market Intelligence</CardTitle>
                <CardDescription className="text-gray-400">
                  Marktanalyse und Trend-Erkennung mit Google AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={runMarketIntelligence} 
                  disabled={loading}
                  className="mb-4 bg-green-600 hover:bg-green-700"
                >
                  {loading ? 'Analysiere Markt...' : '🔍 Market Intelligence starten'}
                </Button>

                {marketIntel && (
                  <div className="mt-4 space-y-4">
                    <Alert className="border-green-500 bg-green-950">
                      <AlertDescription>
                        <strong>Analyse mit {marketIntel.model_used}</strong> für {marketIntel.industry} abgeschlossen
                      </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-gradient-to-r from-green-900 to-blue-900 rounded-lg">
                          <div className="text-sm text-gray-400">Marktgröße</div>
                          <div className="text-2xl font-bold text-green-400">{marketIntel.market_size}</div>
                          <div className="text-sm text-blue-400">Wachstum: {marketIntel.growth_rate}</div>
                        </div>
                        
                        <div>
                          <label className="text-sm text-gray-400">Revenue Potential</label>
                          <div className="text-xl font-bold text-green-400">{marketIntel.revenue_potential}</div>
                        </div>
                        
                        <div>
                          <label className="text-sm text-gray-400">Vertrauen</label>
                          <div className="flex items-center gap-2">
                            <Progress value={parseInt(marketIntel.confidence)} className="flex-1" />
                            <span className="text-green-400">{marketIntel.confidence}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-sm text-gray-400">Opportunities</label>
                          <div className="space-y-1">
                            {marketIntel.opportunities.map((opp, index) => (
                              <Badge key={index} variant="secondary" className="bg-green-900 text-green-200 mr-2">
                                {opp}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm text-gray-400">Empfohlene Aktionen</label>
                          <ul className="text-white space-y-1">
                            {marketIntel.recommended_actions.map((action, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-green-400">•</span>
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Full Optimization Tab */}
          <TabsContent value="full-optimize">
            <Card className="bg-slate-800 border-slate-700 text-white">
              <CardHeader>
                <CardTitle className="text-yellow-400">⚡ Multi-AI Revenue Optimizer</CardTitle>
                <CardDescription className="text-gray-400">
                  Kombiniert alle 3 AI-Modelle für ultimative Optimierung (99.2% Autonomie)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={runFullOptimization} 
                  disabled={loading}
                  className="mb-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  size="lg"
                >
                  {loading ? 'Multi-AI läuft...' : '🚀 FULL AI OPTIMIZATION STARTEN'}
                </Button>

                {optimizationResults && (
                  <div className="mt-6 space-y-6">
                    <Alert className="border-yellow-500 bg-yellow-950">
                      <AlertDescription>
                        <strong>Multi-AI Optimierung abgeschlossen!</strong> Autonomie gesteigert auf {optimizationResults.autonomy_level}
                      </AlertDescription>
                    </Alert>

                    {/* Combined Impact */}
                    <div className="p-6 bg-gradient-to-r from-yellow-900 to-orange-900 rounded-lg">
                      <h3 className="text-xl font-bold text-yellow-400 mb-4">🎯 Kombinierter Revenue Impact</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-sm text-gray-300">Revenue Steigerung</div>
                          <div className="text-2xl font-bold text-green-400">
                            {optimizationResults.combined_revenue_impact.total_revenue_increase}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-300">Monatlicher Gain</div>
                          <div className="text-2xl font-bold text-blue-400">
                            {optimizationResults.combined_revenue_impact.estimated_monthly_gain}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-300">Vertrauen</div>
                          <div className="text-2xl font-bold text-purple-400">
                            {optimizationResults.combined_revenue_impact.confidence_score}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-300">Optimierung Score</div>
                          <div className="text-2xl font-bold text-yellow-400">
                            {optimizationResults.combined_revenue_impact.optimization_score}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* AI Models Used */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {optimizationResults.ai_models_used.map((model) => (
                        <Badge key={model} className="p-3 bg-slate-700 text-white text-center">
                          ✅ {model}
                        </Badge>
                      ))}
                    </div>

                    {/* Next Optimizations */}
                    <div>
                      <h4 className="text-lg font-bold text-white mb-3">🔮 Nächste Optimierungen:</h4>
                      <div className="space-y-2">
                        {optimizationResults.next_optimizations.map((optimization, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-slate-700 rounded">
                            <span className="text-blue-400">→</span>
                            <span className="text-white">{optimization}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdvancedAiOptimizer;