import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, DollarSign, Link, BarChart3, Trophy, Zap, Target, Clock, ArrowUpRight } from 'lucide-react';
import api from '../services/api';

const AffiliateExplosion = () => {
  const [affiliateStats, setAffiliateStats] = useState(null);
  const [recentSales, setRecentSales] = useState([]);
  const [affiliatePayments, setAffiliatePayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [affiliateLinkForm, setAffiliateLinkForm] = useState({
    affiliate_name: '',
    campaign_key: ''
  });
  const [generatedLink, setGeneratedLink] = useState('');

  useEffect(() => {
    loadAffiliateData();
    // Auto-refresh alle 30 Sekunden
    const interval = setInterval(loadAffiliateData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadAffiliateData = async () => {
    try {
      const [statsResponse, salesResponse, paymentsResponse] = await Promise.all([
        api.get('/affiliate/stats'),
        api.get('/affiliate/sales?limit=10'),
        api.get('/affiliate/payments?status=pending')
      ]);

      setAffiliateStats(statsResponse.data.stats);
      setRecentSales(salesResponse.data.sales);
      setAffiliatePayments(paymentsResponse.data.payments);
      setLoading(false);
    } catch (error) {
      console.error('Fehler beim Laden der Affiliate-Daten:', error);
      setLoading(false);
    }
  };

  const generateAffiliateLink = async () => {
    if (!affiliateLinkForm.affiliate_name.trim()) {
      alert('Bitte Affiliate Name eingeben');
      return;
    }

    try {
      const response = await api.post('/affiliate/generate-link', affiliateLinkForm);
      setGeneratedLink(response.data.affiliate_link);
    } catch (error) {
      console.error('Fehler beim Generieren des Affiliate Links:', error);
      alert('Fehler beim Generieren des Links');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Link kopiert!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-amber-800">Affiliate-Daten werden geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Trophy className="h-12 w-12 text-amber-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Affiliate Explosion
            </h1>
            <Zap className="h-12 w-12 text-amber-600" />
          </div>
          <p className="text-xl text-amber-800">
            🚀 Digistore24 Integration • Sofortige Monetarisierung • 50% Provision
          </p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-amber-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm font-semibold">Gesamtumsatz</p>
                <p className="text-3xl font-bold text-gray-900">
                  €{affiliateStats?.total_profit?.toFixed(2) || '0.00'}
                </p>
              </div>
              <DollarSign className="h-10 w-10 text-green-500" />
            </div>
            <div className="flex items-center mt-2 text-sm text-green-600">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              <span>+{affiliateStats?.commission_rate || 50}% Provision</span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-amber-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm font-semibold">Affiliate Sales</p>
                <p className="text-3xl font-bold text-gray-900">
                  {affiliateStats?.total_sales || 0}
                </p>
              </div>
              <TrendingUp className="h-10 w-10 text-blue-500" />
            </div>
            <div className="flex items-center mt-2 text-sm text-blue-600">
              <Target className="h-4 w-4 mr-1" />
              <span>Digistore24</span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-amber-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm font-semibold">Aktive Affiliates</p>
                <p className="text-3xl font-bold text-gray-900">
                  {affiliateStats?.active_affiliates || 0}
                </p>
              </div>
              <Users className="h-10 w-10 text-purple-500" />
            </div>
            <div className="flex items-center mt-2 text-sm text-purple-600">
              <Zap className="h-4 w-4 mr-1" />
              <span>Partner Network</span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-amber-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm font-semibold">Provisionen</p>
                <p className="text-3xl font-bold text-gray-900">
                  €{affiliateStats?.total_commission?.toFixed(2) || '0.00'}
                </p>
              </div>
              <BarChart3 className="h-10 w-10 text-orange-500" />
            </div>
            <div className="flex items-center mt-2 text-sm text-orange-600">
              <Clock className="h-4 w-4 mr-1" />
              <span>Auto-Auszahlung</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Affiliate Link Generator */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-amber-200 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Link className="h-6 w-6 mr-2 text-amber-600" />
              Affiliate Link Generator
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Affiliate Name
                </label>
                <input
                  type="text"
                  value={affiliateLinkForm.affiliate_name}
                  onChange={(e) => setAffiliateLinkForm({
                    ...affiliateLinkForm,
                    affiliate_name: e.target.value
                  })}
                  className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="z.B. max_mustermann"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Campaign Key (optional)
                </label>
                <input
                  type="text"
                  value={affiliateLinkForm.campaign_key}
                  onChange={(e) => setAffiliateLinkForm({
                    ...affiliateLinkForm,
                    campaign_key: e.target.value
                  })}
                  className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="z.B. youtube_campaign"
                />
              </div>

              <button
                onClick={generateAffiliateLink}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-amber-700 hover:to-orange-700 transition duration-200 flex items-center justify-center"
              >
                <Zap className="h-5 w-5 mr-2" />
                Link Generieren
              </button>

              {generatedLink && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-semibold text-green-800 mb-2">Generierter Affiliate Link:</p>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={generatedLink}
                      readOnly
                      className="flex-1 px-3 py-2 text-sm border border-green-300 rounded bg-white"
                    />
                    <button
                      onClick={() => copyToClipboard(generatedLink)}
                      className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition duration-200"
                    >
                      Kopieren
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recent Sales */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-amber-200 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-6 w-6 mr-2 text-amber-600" />
              Neueste Affiliate Sales
            </h3>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentSales.length > 0 ? (
                recentSales.map((sale, index) => (
                  <div key={index} className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">€{sale.amount?.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">Affiliate: {sale.affiliate_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-green-600">
                          +€{sale.your_profit?.toFixed(2)} Profit
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(sale.processed_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Order: {sale.order_id} • Platform: {sale.platform}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Target className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Keine Affiliate Sales vorhanden</p>
                  <p className="text-sm">Links generieren und Partner gewinnen!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Affiliate Payments */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-amber-200 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <DollarSign className="h-6 w-6 mr-2 text-amber-600" />
            Ausstehende Provisionen
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-amber-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Affiliate</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Betrag</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Datum</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Order</th>
                </tr>
              </thead>
              <tbody>
                {affiliatePayments.length > 0 ? (
                  affiliatePayments.map((payment, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-amber-50 transition duration-200">
                      <td className="py-3 px-4 font-medium text-gray-900">{payment.affiliate_name}</td>
                      <td className="py-3 px-4 font-semibold text-green-600">€{payment.amount?.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">
                          {payment.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(payment.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{payment.order_id}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">
                      <DollarSign className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>Keine ausstehenden Provisionen</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Footer */}
        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl p-6">
            <h3 className="text-2xl font-bold mb-2">🚀 Affiliate Explosion Aktiv!</h3>
            <p className="text-amber-100 mb-4">
              Digistore24 Integration läuft • Automatische Provisionsabrechnung • Sofortige Monetarisierung
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center">
                <div className="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
                IPN Webhook aktiv
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
                50% Provision garantiert
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
                Live Tracking
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AffiliateExplosion;