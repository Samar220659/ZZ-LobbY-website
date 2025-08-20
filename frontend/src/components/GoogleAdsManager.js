import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { api } from '../services/api';
import { 
  TrendingUp, 
  Target, 
  DollarSign, 
  Eye, 
  MousePointer, 
  BarChart3,
  Settings,
  Plus,
  PlayCircle,
  PauseCircle,
  RefreshCw
} from 'lucide-react';

const GoogleAdsManager = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Create Campaign Form State
  const [campaignForm, setCampaignForm] = useState({
    name: '',
    budget_micros: 2000000, // 2€ täglich
    target_locations: ['Germany'],
    keywords: '',
    landing_page_url: 'https://zz-payments-app.emergent.host',
    campaign_type: 'SEARCH'
  });

  useEffect(() => {
    loadDashboard();
    loadCampaigns();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await api.get('/google-ads/dashboard');
      setDashboard(response.data);
    } catch (error) {
      console.error('Dashboard Load Error:', error);
    }
  };

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const response = await api.get('/google-ads/campaigns');
      setCampaigns(response.data);
    } catch (error) {
      console.error('Campaigns Load Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    try {
      const campaignData = {
        ...campaignForm,
        keywords: campaignForm.keywords.split('\n').filter(k => k.trim()),
        budget_micros: parseInt(campaignForm.budget_micros)
      };

      const response = await api.post('/google-ads/campaigns/create', campaignData);
      
      if (response.data.status === 'success') {
        alert(`✅ Kampagne "${campaignForm.name}" erfolgreich erstellt!`);
        setShowCreateForm(false);
        setCampaignForm({
          name: '',
          budget_micros: 2000000,
          target_locations: ['Germany'],
          keywords: '',
          landing_page_url: 'https://zz-payments-app.emergent.host',
          campaign_type: 'SEARCH'
        });
        loadCampaigns();
        loadDashboard();
      }
    } catch (error) {
      console.error('Campaign Creation Error:', error);
      alert('❌ Fehler beim Erstellen der Kampagne');
    }
  };

  const optimizeCampaign = async (campaignId) => {
    try {
      const response = await api.post(`/google-ads/campaigns/${campaignId}/optimize`);
      if (response.data.optimized) {
        alert(`💰 Budget optimiert: ${response.data.old_budget_euros.toFixed(2)}€ → ${response.data.new_budget_euros.toFixed(2)}€`);
        loadCampaigns();
        loadDashboard();
      } else {
        alert('✅ Budget bereits optimal');
      }
    } catch (error) {
      console.error('Optimization Error:', error);
    }
  };

  const formatCurrency = (micros) => {
    return `${(micros / 1000000).toFixed(2)}€`;
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'ACTIVE': 'bg-green-500',
      'PAUSED': 'bg-yellow-500',
      'DRAFT': 'bg-gray-500'
    };
    return <Badge className={statusColors[status] || 'bg-gray-500'}>{status}</Badge>;
  };

  if (loading && !dashboard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-gold-400" />
          <span className="ml-2 text-gold-400">Lade Google Ads Daten...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-gold-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gold-400 mb-2">
                Google Ads Marketing Automation
              </h1>
              <p className="text-slate-300">
                Vollautomatische Kampagnen-Verwaltung für ZZ-Lobby
              </p>
            </div>
            <Button 
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-gold-600 hover:bg-gold-700 text-black font-semibold"
            >
              <Plus className="h-4 w-4 mr-2" />
              Neue Kampagne
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-black/20 border border-gold-500/20">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-gold-600 data-[state=active]:text-black">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="data-[state=active]:bg-gold-600 data-[state=active]:text-black">
              Kampagnen
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-gold-600 data-[state=active]:text-black">
              Performance
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            {dashboard && (
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-black/40 border-gold-500/20 text-white">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-gold-400 flex items-center">
                        <Target className="h-4 w-4 mr-2" />
                        Kampagnen
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">
                        {dashboard.summary.total_campaigns}
                      </div>
                      <div className="text-sm text-slate-400">
                        {dashboard.summary.active_campaigns} aktiv
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/40 border-gold-500/20 text-white">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-gold-400 flex items-center">
                        <Eye className="h-4 w-4 mr-2" />
                        Impressions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">
                        {dashboard.summary.total_impressions.toLocaleString()}
                      </div>
                      <div className="text-sm text-slate-400">
                        CTR: {dashboard.summary.avg_ctr}%
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/40 border-gold-500/20 text-white">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-gold-400 flex items-center">
                        <MousePointer className="h-4 w-4 mr-2" />
                        Klicks
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">
                        {dashboard.summary.total_clicks.toLocaleString()}
                      </div>
                      <div className="text-sm text-slate-400">
                        CPC: {dashboard.summary.avg_cpc_euros.toFixed(2)}€
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/40 border-gold-500/20 text-white">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-gold-400 flex items-center">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Kosten
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">
                        {dashboard.summary.total_cost_euros.toFixed(2)}€
                      </div>
                      <div className="text-sm text-slate-400">
                        {dashboard.summary.total_conversions} Conversions
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Business Info */}
                <Card className="bg-black/40 border-gold-500/20 text-white">
                  <CardHeader>
                    <CardTitle className="text-gold-400">ZZ-Lobby Business Profile</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p><strong className="text-gold-400">Eigentümer:</strong> {dashboard.business.owner}</p>
                        <p><strong className="text-gold-400">Standort:</strong> {dashboard.business.location}</p>
                        <p><strong className="text-gold-400">Website:</strong> {dashboard.business.website}</p>
                      </div>
                      <div>
                        <p><strong className="text-gold-400">Services:</strong></p>
                        <div className="mt-2 space-y-1">
                          {dashboard.business.services.map((service, index) => (
                            <Badge key={index} variant="outline" className="mr-2 mb-1 border-gold-500/20 text-gold-400">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card className="bg-black/40 border-gold-500/20 text-white">
                  <CardHeader>
                    <CardTitle className="text-gold-400">KI-Empfehlungen</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {dashboard.recommendations.map((rec, index) => (
                        <div key={index} className="p-3 bg-gold-500/10 rounded-lg border border-gold-500/20">
                          <p className="text-sm text-white">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns">
            <div className="space-y-6">
              {/* Create Campaign Form */}
              {showCreateForm && (
                <Card className="bg-black/40 border-gold-500/20 text-white">
                  <CardHeader>
                    <CardTitle className="text-gold-400">Neue Kampagne erstellen</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreateCampaign} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name" className="text-gold-400">Kampagnen-Name</Label>
                          <Input
                            id="name"
                            value={campaignForm.name}
                            onChange={(e) => setCampaignForm({...campaignForm, name: e.target.value})}
                            placeholder="z.B. Restaurant Marketing Zeitz"
                            className="bg-black/20 border-gold-500/20 text-white"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="budget" className="text-gold-400">Tägliches Budget (€)</Label>
                          <Input
                            id="budget"
                            type="number"
                            value={campaignForm.budget_micros / 1000000}
                            onChange={(e) => setCampaignForm({...campaignForm, budget_micros: parseFloat(e.target.value) * 1000000})}
                            placeholder="2.00"
                            step="0.50"
                            min="0.50"
                            className="bg-black/20 border-gold-500/20 text-white"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="keywords" className="text-gold-400">Keywords (eine pro Zeile)</Label>
                        <Textarea
                          id="keywords"
                          value={campaignForm.keywords}
                          onChange={(e) => setCampaignForm({...campaignForm, keywords: e.target.value})}
                          placeholder="digitales marketing restaurant&#10;restaurant online marketing&#10;gastronomie automation"
                          className="bg-black/20 border-gold-500/20 text-white h-24"
                        />
                      </div>
                      <div className="flex space-x-4">
                        <Button type="submit" className="bg-gold-600 hover:bg-gold-700 text-black">
                          Kampagne erstellen
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setShowCreateForm(false)}
                          className="border-gold-500/20 text-gold-400 hover:bg-gold-500/10"
                        >
                          Abbrechen
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Campaigns List */}
              <div className="grid gap-6">
                {campaigns.map((campaign) => (
                  <Card key={campaign.id} className="bg-black/40 border-gold-500/20 text-white">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-gold-400 text-lg">{campaign.name}</CardTitle>
                          <CardDescription className="text-slate-400 mt-1">
                            Erstellt: {new Date(campaign.created_date).toLocaleDateString('de-DE')}
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(campaign.status)}
                          <Button
                            size="sm"
                            onClick={() => optimizeCampaign(campaign.id)}
                            className="bg-gold-600 hover:bg-gold-700 text-black"
                          >
                            <Settings className="h-4 w-4 mr-1" />
                            Optimieren
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Budget & Performance */}
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gold-400">Budget & Kosten</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Täglich:</span>
                              <span className="text-white">{campaign.budget_daily_euros.toFixed(2)}€</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Ausgegeben:</span>
                              <span className="text-white">{campaign.cost_euros.toFixed(2)}€</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">CPC:</span>
                              <span className="text-white">{campaign.cpc_euros.toFixed(2)}€</span>
                            </div>
                          </div>
                        </div>

                        {/* Metrics */}
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gold-400">Leistung</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Impressions:</span>
                              <span className="text-white">{campaign.performance.impressions.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Klicks:</span>
                              <span className="text-white">{campaign.performance.clicks}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Conversions:</span>
                              <span className="text-white">{campaign.performance.conversions}</span>
                            </div>
                          </div>
                        </div>

                        {/* Keywords */}
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gold-400">Keywords</h4>
                          <div className="space-y-1">
                            {campaign.keywords.slice(0, 3).map((keyword, index) => (
                              <Badge key={index} variant="outline" className="text-xs border-gold-500/20 text-gold-400 mr-1 mb-1">
                                {keyword}
                              </Badge>
                            ))}
                            {campaign.keywords.length > 3 && (
                              <Badge variant="outline" className="text-xs border-gold-500/20 text-slate-400">
                                +{campaign.keywords.length - 3} weitere
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance">
            <Card className="bg-black/40 border-gold-500/20 text-white">
              <CardHeader>
                <CardTitle className="text-gold-400">Performance Analytics</CardTitle>
                <CardDescription className="text-slate-400">
                  Detaillierte Leistungsanalyse aller Kampagnen
                </CardDescription>
              </CardHeader>
              <CardContent>
                {dashboard && (
                  <div className="space-y-6">
                    {/* Performance Chart Placeholder */}
                    <div className="bg-gold-500/5 border border-gold-500/20 rounded-lg p-8 text-center">
                      <BarChart3 className="h-12 w-12 text-gold-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gold-400 mb-2">Performance Charts</h3>
                      <p className="text-slate-400">Detaillierte Diagramme werden hier angezeigt</p>
                    </div>

                    {/* Performance Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="bg-black/20 border-gold-500/20">
                        <CardHeader>
                          <CardTitle className="text-gold-400 text-sm">Conversion Rate</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center space-x-4">
                            <div className="text-2xl font-bold text-white">
                              {dashboard.summary.conversion_rate}%
                            </div>
                            <Progress value={dashboard.summary.conversion_rate * 10} className="flex-1" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-black/20 border-gold-500/20">
                        <CardHeader>
                          <CardTitle className="text-gold-400 text-sm">Click-Through Rate</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center space-x-4">
                            <div className="text-2xl font-bold text-white">
                              {dashboard.summary.avg_ctr}%
                            </div>
                            <Progress value={dashboard.summary.avg_ctr * 20} className="flex-1" />
                          </div>
                        </CardContent>
                      </Card>
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

export default GoogleAdsManager;