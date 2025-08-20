import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Play, Video, Share2, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import api from '../services/api';

const AdCreativeHub = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [campaignRunning, setCampaignRunning] = useState(false);
  const [campaignResult, setCampaignResult] = useState(null);
  const [promoLink, setPromoLink] = useState('');

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await api.get('/adcreative/status');
      setStatus(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching AdCreative status:', error);
      setLoading(false);
    }
  };

  const runDailyCampaign = async () => {
    try {
      setCampaignRunning(true);
      const response = await api.post('/adcreative/daily-campaign');
      setCampaignResult(response.data);
    } catch (error) {
      console.error('Error running campaign:', error);
    } finally {
      setCampaignRunning(false);
    }
  };

  const runCustomCampaign = async () => {
    if (!promoLink.trim()) {
      alert('Bitte geben Sie einen Promo-Link ein');
      return;
    }

    try {
      setCampaignRunning(true);
      const response = await api.post('/adcreative/campaign', {
        promo_link: promoLink,
        target_platforms: ['tiktok', 'instagram', 'youtube', 'facebook', 'twitter']
      });
      setCampaignResult(response.data);
    } catch (error) {
      console.error('Error running custom campaign:', error);
    } finally {
      setCampaignRunning(false);
    }
  };

  const getStatusColor = (systemReady) => {
    return systemReady ? 'text-green-400' : 'text-red-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
            <span className="ml-2 text-white">Loading AdCreative Hub...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Video className="h-10 w-10 text-purple-400" />
            AdCreative Killer Hub
          </h1>
          <p className="text-gray-300">🎬 Automatische Video-Erstellung + Cross-Posting 🚀</p>
        </div>

        {/* System Status */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {status ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-400">AdCreative Engine</div>
                    <Badge variant={status.adcreative_engine === 'available' ? 'default' : 'destructive'}>
                      {status.adcreative_engine}
                    </Badge>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-400">OAuth Tokens</div>
                    <Badge variant={status.crosspost_tokens === 'configured' ? 'default' : 'secondary'}>
                      {status.crosspost_tokens}
                    </Badge>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-400">System Ready</div>
                    <Badge variant={status.system_ready ? 'default' : 'destructive'}>
                      {status.system_ready ? 'Ready' : 'Setup Required'}
                    </Badge>
                  </div>
                </div>

                {!status.system_ready && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-yellow-400 mb-2">
                      <AlertCircle className="h-4 w-4" />
                      Setup Required
                    </div>
                    <div className="text-sm text-gray-300 mb-2">
                      OAuth Setup Befehl:
                    </div>
                    <code className="bg-slate-700 px-2 py-1 rounded text-green-400 text-sm">
                      {status.oauth_setup_command}
                    </code>
                  </div>
                )}

                {status.supported_platforms && (
                  <div>
                    <div className="text-sm text-gray-400 mb-2">Supported Platforms:</div>
                    <div className="flex flex-wrap gap-2">
                      {status.supported_platforms.map((platform) => (
                        <Badge key={platform} variant="outline">
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-400">Status nicht verfügbar</div>
            )}
          </CardContent>
        </Card>

        {/* Campaign Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Daily Campaign */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Daniel's Daily Campaign</CardTitle>
              <CardDescription className="text-gray-400">
                Automatische Kampagne für ZZ-Lobby Elite Services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={runDailyCampaign}
                disabled={campaignRunning || !status?.system_ready}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {campaignRunning ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Play className="mr-2 h-4 w-4" />
                )}
                Start Daily Campaign
              </Button>
            </CardContent>
          </Card>

          {/* Custom Campaign */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Custom Campaign</CardTitle>
              <CardDescription className="text-gray-400">
                Eigene Promo-Link eingeben
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  placeholder="https://example.com/your-promo-link"
                  value={promoLink}
                  onChange={(e) => setPromoLink(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
                <Button
                  onClick={runCustomCampaign}
                  disabled={campaignRunning || !status?.system_ready || !promoLink.trim()}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  {campaignRunning ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Share2 className="mr-2 h-4 w-4" />
                  )}
                  Start Custom Campaign
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Campaign Results */}
        {campaignResult && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Campaign Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                
                {/* Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-gray-400">Campaign ID</div>
                    <div className="text-white font-mono">{campaignResult.campaign_id}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Status</div>
                    <Badge variant="default">{campaignResult.status}</Badge>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Total Creatives</div>
                    <div className="text-2xl font-bold text-white">{campaignResult.total_creatives}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Successful Posts</div>
                    <div className="text-2xl font-bold text-green-400">{campaignResult.successful_posts}</div>
                  </div>
                </div>

                {/* Creative Details */}
                {campaignResult.creatives && campaignResult.creatives.length > 0 && (
                  <div>
                    <div className="text-sm text-gray-400 mb-2">Creative Details:</div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {campaignResult.creatives.map((creative, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-slate-700 rounded">
                          <div className="flex items-center gap-3">
                            <div className="text-sm text-white">{creative.platform}</div>
                            <div className="text-xs text-gray-400">Score: {creative.score}</div>
                          </div>
                          <Badge variant={creative.posted ? 'default' : 'destructive'}>
                            {creative.posted ? 'Posted' : 'Failed'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
};

export default AdCreativeHub;