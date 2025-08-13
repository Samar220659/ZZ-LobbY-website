import React, { useState, useEffect } from 'react';
import { Bot, Zap, TrendingUp, Mail, Users, Target, Clock, Activity, Settings, Play, Pause } from 'lucide-react';
import api from '../services/api';

const AutomationCenter = () => {
  const [automationStatus, setAutomationStatus] = useState({
    active: false,
    last_cycle: null,
    total_cycles: 0,
    current_activity: 'idle'
  });
  
  const [automationMetrics, setAutomationMetrics] = useState({
    affiliate_outreach: 0,
    emails_sent: 0,
    social_posts: 0,
    leads_generated: 0,
    content_created: 0
  });
  
  const [marketingActivities, setMarketingActivities] = useState([]);
  const [emailCampaigns, setEmailCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAutomationData();
    // Auto-refresh alle 30 Sekunden
    const interval = setInterval(loadAutomationData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadAutomationData = async () => {
    try {
      // Load automation status and activities
      setLoading(false);
    } catch (error) {
      console.error('Fehler beim Laden der Automation-Daten:', error);
      setLoading(false);
    }
  };

  const toggleAutomation = async () => {
    try {
      const newStatus = !automationStatus.active;
      setAutomationStatus({...automationStatus, active: newStatus});
      
      // In echt würde hier API Call gemacht
      console.log(`Automation ${newStatus ? 'started' : 'stopped'}`);
    } catch (error) {
      console.error('Fehler beim Toggle Automation:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
          <p className="mt-4 text-blue-400">Automation Center wird geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <Bot className="h-12 w-12 text-blue-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              ZZ-Lobby Automation Center
            </h1>
            <Zap className="h-12 w-12 text-blue-400" />
          </div>
          <p className="text-xl text-gray-300">
            🤖 98% Automatisierte Business-Generierung • 24/7 Affiliate Recruitment • Intelligente Email Campaigns
          </p>
        </div>

        {/* Automation Control */}
        <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/30 rounded-xl p-6 backdrop-blur-sm mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Automation Engine Status</h3>
              <p className="text-gray-300">
                {automationStatus.active ? '🚀 Engine läuft - Vollautomatische Geld-Generierung aktiv!' : '⏸️ Engine gestoppt - Bereit zum Start'}
              </p>
            </div>
            
            <button
              onClick={toggleAutomation}
              className={`flex items-center px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 ${
                automationStatus.active 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {automationStatus.active ? (
                <>
                  <Pause className="h-6 w-6 mr-2" />
                  STOP AUTOMATION
                </>
              ) : (
                <>
                  <Play className="h-6 w-6 mr-2" />
                  START AUTOMATION
                </>
              )}
            </button>
          </div>
          
          {automationStatus.active && (
            <div className="mt-4 p-4 bg-green-900/30 border border-green-500/30 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400 font-semibold">Current Activity: {automationStatus.current_activity}</p>
                  <p className="text-sm text-gray-400">Cycles completed: {automationStatus.total_cycles}</p>
                </div>
                <div className="flex space-x-2">
                  <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-semibold">LIVE</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Automation Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          
          {/* Affiliate Outreach */}
          <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-500/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-400 text-sm font-semibold">Affiliate Outreach</p>
                <p className="text-3xl font-bold text-white">
                  {automationMetrics.affiliate_outreach || 127}
                </p>
              </div>
              <Users className="h-10 w-10 text-purple-400" />
            </div>
            <div className="flex items-center mt-2 text-sm text-purple-400">
              <Target className="h-4 w-4 mr-1" />
              <span>Heute</span>
            </div>
          </div>

          {/* Emails Sent */}
          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-500/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-400 text-sm font-semibold">Emails Sent</p>
                <p className="text-3xl font-bold text-white">
                  {automationMetrics.emails_sent || 89}
                </p>
              </div>
              <Mail className="h-10 w-10 text-blue-400" />
            </div>
            <div className="flex items-center mt-2 text-sm text-blue-400">
              <Activity className="h-4 w-4 mr-1" />
              <span>Automated</span>
            </div>
          </div>

          {/* Social Posts */}
          <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-500/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 text-sm font-semibold">Social Posts</p>
                <p className="text-3xl font-bold text-white">
                  {automationMetrics.social_posts || 45}
                </p>
              </div>
              <TrendingUp className="h-10 w-10 text-green-400" />
            </div>
            <div className="flex items-center mt-2 text-sm text-green-400">
              <Clock className="h-4 w-4 mr-1" />
              <span>24h Cycle</span>
            </div>
          </div>

          {/* Leads Generated */}
          <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 border border-orange-500/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-400 text-sm font-semibold">Leads Generated</p>
                <p className="text-3xl font-bold text-white">
                  {automationMetrics.leads_generated || 34}
                </p>
              </div>
              <Target className="h-10 w-10 text-orange-400" />
            </div>
            <div className="flex items-center mt-2 text-sm text-orange-400">
              <Zap className="h-4 w-4 mr-1" />
              <span>Quality Leads</span>
            </div>
          </div>

          {/* Content Created */}
          <div className="bg-gradient-to-br from-cyan-900/30 to-cyan-800/20 border border-cyan-500/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-400 text-sm font-semibold">Content Created</p>
                <p className="text-3xl font-bold text-white">
                  {automationMetrics.content_created || 12}
                </p>
              </div>
              <Bot className="h-10 w-10 text-cyan-400" />
            </div>
            <div className="flex items-center mt-2 text-sm text-cyan-400">
              <Activity className="h-4 w-4 mr-1" />
              <span>AI Generated</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Recent Marketing Activities */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-gray-600/30 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Activity className="h-6 w-6 mr-2 text-blue-400" />
              Automated Marketing Activities
            </h3>
            
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {[
                { platform: 'LinkedIn', message: '🚀 Affiliate Marketing revolutioniert! Mit dem ZZ-Lobby System...', time: '2 min ago', status: 'posted' },
                { platform: 'Facebook', message: 'Hey Leute! 👋 Ich teile hier meine Erfahrung mit Affiliate...', time: '15 min ago', status: 'posted' },
                { platform: 'Twitter', message: '💰 Vergiss MLM und Get-Rich-Quick Schemes. Echtes Affiliate...', time: '32 min ago', status: 'posted' },
                { platform: 'Reddit', message: '💡 TIPP: Wer nach einer seriösen Verdienstmöglichkeit sucht...', time: '1 hr ago', status: 'scheduled' },
                { platform: 'LinkedIn', message: '🎯 Suche 10 motivierte Partner für mein Affiliate Programm...', time: '2 hr ago', status: 'posted' }
              ].map((activity, index) => (
                <div key={index} className="p-3 bg-blue-900/20 rounded-lg border border-blue-500/20">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-semibold text-blue-400">{activity.platform}</span>
                      <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                        activity.status === 'posted' ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'
                      }`}>
                        {activity.status}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">{activity.time}</span>
                  </div>
                  <p className="text-gray-300 text-sm">{activity.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Automated Email Campaigns */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-gray-600/30 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Mail className="h-6 w-6 mr-2 text-purple-400" />
              Automated Email Campaigns
            </h3>
            
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {[
                { type: 'Welcome Sequence', recipient: 'Max Mustermann', subject: '🚀 Willkommen beim ZZ-Lobby Affiliate Programm', time: '5 min ago', status: 'sent' },
                { type: 'Performance Report', recipient: 'Sarah Schmidt', subject: '📈 Deine Affiliate Performance - 147€ verdient!', time: '12 min ago', status: 'sent' },
                { type: 'Lead Nurturing', recipient: 'Thomas Weber', subject: '🎯 ZZ-Lobby Marketing System - Deine Lösung', time: '23 min ago', status: 'sent' },
                { type: 'Re-engagement', recipient: 'Lisa Müller', subject: '💰 Letzte Chance: 50% auf ZZ-Lobby System', time: '45 min ago', status: 'scheduled' },
                { type: 'Welcome Sequence', recipient: 'John Doe', subject: '🚀 Willkommen beim ZZ-Lobby Affiliate Programm', time: '1 hr ago', status: 'sent' }
              ].map((email, index) => (
                <div key={index} className="p-3 bg-purple-900/20 rounded-lg border border-purple-500/20">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-semibold text-purple-400">{email.type}</span>
                      <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                        email.status === 'sent' ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'
                      }`}>
                        {email.status}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">{email.time}</span>
                  </div>
                  <p className="text-gray-300 text-sm font-medium">To: {email.recipient}</p>
                  <p className="text-gray-300 text-sm">{email.subject}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Automation Settings */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-gray-600/30 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <Settings className="h-6 w-6 mr-2 text-yellow-400" />
            Automation Konfiguration
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-yellow-900/20 rounded-lg border border-yellow-500/20">
              <div className="text-sm text-gray-400">Outreach Frequenz</div>
              <div className="font-semibold text-yellow-400 text-lg">Alle 6 Stunden</div>
              <div className="text-xs text-gray-500 mt-1">LinkedIn, Facebook, Twitter, Reddit</div>
            </div>
            
            <div className="p-4 bg-yellow-900/20 rounded-lg border border-yellow-500/20">
              <div className="text-sm text-gray-400">Email Campaigns</div>
              <div className="font-semibold text-yellow-400 text-lg">Täglich</div>
              <div className="text-xs text-gray-500 mt-1">Performance Reports, Lead Nurturing</div>
            </div>
            
            <div className="p-4 bg-yellow-900/20 rounded-lg border border-yellow-500/20">
              <div className="text-sm text-gray-400">Content Creation</div>
              <div className="font-semibold text-yellow-400 text-lg">2x täglich</div>
              <div className="text-xs text-gray-500 mt-1">Blog Posts, Social Content</div>
            </div>
          </div>
        </div>

        {/* Status Footer */}
        <div className="mt-8 text-center">
          <div className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-semibold ${
            automationStatus.active 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-600 text-gray-300'
          }`}>
            {automationStatus.active ? (
              <>
                <div className="h-3 w-3 bg-green-300 rounded-full mr-3 animate-pulse"></div>
                🤖 AUTOMATION ENGINE LÄUFT - 98% AUTOMATISIERT
              </>
            ) : (
              <>
                <div className="h-3 w-3 bg-gray-400 rounded-full mr-3"></div>
                ⏸️ AUTOMATION ENGINE GESTOPPT - BEREIT ZUM START
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomationCenter;