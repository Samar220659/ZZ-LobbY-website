import React, { useState, useEffect } from 'react';
import { TrendingUp, Zap, Target, Users, DollarSign, Calendar, BarChart3, Rocket } from 'lucide-react';
import api from '../services/api';

const ZeroBudgetTraffic = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [activeCampaign, setActiveCampaign] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [campaignForm, setCampaignForm] = useState({
    product_name: 'ZZ-Lobby Elite',
    target_income: '15000',
    niche: 'Affiliate Marketing',
    target_audience: 'Deutsche Online-Unternehmer'
  });

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      const response = await api.get('/zero-budget/campaigns');
      if (response.data.success) {
        setCampaigns(response.data.campaigns);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Kampagnen:', error);
    }
  };

  const createZeroBudgetCampaign = async () => {
    try {
      setLoading(true);
      const response = await api.post('/zero-budget/create-campaign', campaignForm);
      
      if (response.data.success) {
        setActiveCampaign(response.data);
        await loadCampaigns();
        
        // Lade Performance-Daten
        setTimeout(() => {
          loadCampaignPerformance(response.data.campaign_id);
        }, 2000);
      }
    } catch (error) {
      console.error('Fehler beim Erstellen der Zero-Budget Kampagne:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCampaignPerformance = async (campaignId) => {
    try {
      const response = await api.get(`/zero-budget/performance/${campaignId}`);
      if (response.data.success) {
        setPerformance(response.data.performance);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Performance:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <Rocket className="h-12 w-12 text-green-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Zero-Budget Traffic Generator
            </h1>
            <TrendingUp className="h-12 w-12 text-blue-400" />
          </div>
          <p className="text-xl text-gray-300">
            🚀 100% Kostenloser Traffic • Vollautomatisch • 15,000€+ Potenzial
          </p>
        </div>

        {!activeCampaign ? (
          /* Campaign Setup */
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-green-500/30 rounded-xl p-8 backdrop-blur-sm mb-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Zap className="h-8 w-8 mr-3 text-green-400" />
              Zero-Budget Kampagne starten
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Produkt Name
                </label>
                <input
                  type="text"
                  value={campaignForm.product_name}
                  onChange={(e) => setCampaignForm({...campaignForm, product_name: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700 border border-green-500/30 rounded-lg focus:ring-2 focus:ring-green-500 text-white"
                  placeholder="ZZ-Lobby Elite"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ziel-Einkommen (€/Monat)
                </label>
                <input
                  type="text"
                  value={campaignForm.target_income}
                  onChange={(e) => setCampaignForm({...campaignForm, target_income: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700 border border-green-500/30 rounded-lg focus:ring-2 focus:ring-green-500 text-white"
                  placeholder="15000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nische
                </label>
                <select
                  value={campaignForm.niche}
                  onChange={(e) => setCampaignForm({...campaignForm, niche: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700 border border-green-500/30 rounded-lg focus:ring-2 focus:ring-green-500 text-white"
                >
                  <option value="Affiliate Marketing">Affiliate Marketing</option>
                  <option value="Online Business">Online Business</option>
                  <option value="Digital Marketing">Digital Marketing</option>
                  <option value="E-Commerce">E-Commerce</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Zielgruppe
                </label>
                <input
                  type="text"
                  value={campaignForm.target_audience}
                  onChange={(e) => setCampaignForm({...campaignForm, target_audience: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700 border border-green-500/30 rounded-lg focus:ring-2 focus:ring-green-500 text-white"
                  placeholder="Deutsche Online-Unternehmer"
                />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-500/20 rounded-lg p-6 mb-6">
              <h4 className="text-lg font-bold text-green-400 mb-3">🎯 Was passiert automatisch:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                <div className="space-y-2">
                  <p>• 30-Tage Content-Kalender generiert</p>
                  <p>• TikTok Videos (3x täglich)</p>
                  <p>• Instagram Reels (2x täglich)</p>
                  <p>• YouTube Shorts (täglich)</p>
                </div>
                <div className="space-y-2">
                  <p>• LinkedIn Posts (täglich)</p>
                  <p>• Email-Sequenzen (automatisch)</p>
                  <p>• Lead-Magnets (kostenlos)</p>
                  <p>• Conversion-Tracking</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={createZeroBudgetCampaign}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition duration-200 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  Erstelle Zero-Budget System...
                </>
              ) : (
                <>
                  <Rocket className="h-6 w-6 mr-3" />
                  🚀 Zero-Budget Traffic starten (0€ Kosten)
                </>
              )}
            </button>
          </div>
        ) : (
          /* Active Campaign Dashboard */
          <div className="space-y-8">
            
            {/* Campaign Status */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-green-500/30 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-green-400 flex items-center">
                  <div className="h-3 w-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                  Aktive Zero-Budget Kampagne
                </h3>
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  LIVE
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-900/20 border border-green-500/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">{activeCampaign.platforms_scheduled}</div>
                  <p className="text-sm text-gray-300">Plattformen</p>
                </div>
                <div className="text-center p-4 bg-blue-900/20 border border-blue-500/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">{activeCampaign.daily_content_pieces}</div>
                  <p className="text-sm text-gray-300">Content/Tag</p>
                </div>
                <div className="text-center p-4 bg-purple-900/20 border border-purple-500/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400">{activeCampaign.automation_level}</div>
                  <p className="text-sm text-gray-300">Automation</p>
                </div>
                <div className="text-center p-4 bg-yellow-900/20 border border-yellow-500/20 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400">0€</div>
                  <p className="text-sm text-gray-300">Kosten</p>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            {performance && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Traffic Metrics */}
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-blue-500/30 rounded-xl p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center">
                    <TrendingUp className="h-6 w-6 mr-2" />
                    Traffic Performance
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-blue-900/20 border border-blue-500/20 rounded-lg">
                      <span className="text-gray-300">Tägliche Reichweite:</span>
                      <span className="font-bold text-blue-400">{performance.estimated_reach.daily.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-900/20 border border-blue-500/20 rounded-lg">
                      <span className="text-gray-300">Wöchentliche Reichweite:</span>
                      <span className="font-bold text-blue-400">{performance.estimated_reach.weekly.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-900/20 border border-blue-500/20 rounded-lg">
                      <span className="text-gray-300">Gesamt-Reichweite:</span>
                      <span className="font-bold text-blue-400">{performance.estimated_reach.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Revenue Metrics */}
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-green-500/30 rounded-xl p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center">
                    <DollarSign className="h-6 w-6 mr-2" />
                    Revenue Performance
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-900/20 border border-green-500/20 rounded-lg">
                      <span className="text-gray-300">Täglich:</span>
                      <span className="font-bold text-green-400">€{performance.revenue.daily_revenue}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-900/20 border border-green-500/20 rounded-lg">
                      <span className="text-gray-300">Wöchentlich:</span>
                      <span className="font-bold text-green-400">€{performance.revenue.weekly_revenue}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-900/20 border border-green-500/20 rounded-lg">
                      <span className="text-gray-300">Total:</span>
                      <span className="font-bold text-green-400">€{performance.revenue.total_revenue}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-900/20 border border-yellow-500/20 rounded-lg">
                      <span className="text-gray-300">ROI:</span>
                      <span className="font-bold text-yellow-400">{performance.roi_metrics.roi}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Platform Performance */}
            {performance && (
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-purple-500/30 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center">
                  <BarChart3 className="h-6 w-6 mr-2" />
                  Plattform Performance
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(performance.platform_performance).map(([platform, data]) => (
                    <div key={platform} className="p-4 bg-purple-900/20 border border-purple-500/20 rounded-lg text-center">
                      <div className="font-bold text-white capitalize mb-1">{platform}</div>
                      <div className="text-sm text-purple-400 mb-1">{data.reach.toLocaleString()} Reach</div>
                      <div className="text-xs text-gray-300">{data.engagement} Engagement</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lead Generation */}
            {performance && (
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-pink-500/30 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-pink-400 mb-4 flex items-center">
                  <Users className="h-6 w-6 mr-2" />
                  Lead Generation
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-pink-900/20 border border-pink-500/20 rounded-lg">
                    <div className="text-3xl font-bold text-pink-400 mb-2">{performance.lead_generation.daily_leads}</div>
                    <p className="text-sm text-gray-300">Täglich neue Leads</p>
                  </div>
                  <div className="text-center p-4 bg-pink-900/20 border border-pink-500/20 rounded-lg">
                    <div className="text-3xl font-bold text-pink-400 mb-2">{performance.lead_generation.total_leads}</div>
                    <p className="text-sm text-gray-300">Gesamt Leads</p>
                  </div>
                  <div className="text-center p-4 bg-pink-900/20 border border-pink-500/20 rounded-lg">
                    <div className="text-3xl font-bold text-pink-400 mb-2">{(performance.lead_generation.conversion_rate * 100).toFixed(1)}%</div>
                    <p className="text-sm text-gray-300">Conversion Rate</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Zero-Budget Strategy Info */}
        <div className="mt-8 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl p-6">
          <h3 className="text-2xl font-bold mb-4 text-center">🚀 Zero-Budget Traffic Strategie</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <h4 className="font-bold mb-2">📱 Social Media Automation</h4>
              <p className="text-sm text-green-100">TikTok, Instagram, YouTube - Vollautomatisch</p>
            </div>
            <div className="text-center">
              <h4 className="font-bold mb-2">📧 Email Marketing</h4>
              <p className="text-sm text-green-100">Kostenlose Tools + Automation Sequences</p>
            </div>
            <div className="text-center">
              <h4 className="font-bold mb-2">🎯 SEO Content</h4>
              <p className="text-sm text-green-100">Blog Posts + Medium Articles</p>
            </div>
          </div>
          <div className="text-center mt-6">
            <p className="text-lg font-semibold">💰 Ziel: €15,000/Monat mit 0€ Werbebudget</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ZeroBudgetTraffic;