import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AlertCircle, CheckCircle, Activity, Zap, Shield, Settings } from 'lucide-react';
import api from '../services/api';

const SystemHealing = () => {
  const [healingData, setHealingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [healingStatus, setHealingStatus] = useState({ healing_enabled: false });

  useEffect(() => {
    fetchHealingData();
    fetchHealingStatus();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchHealingData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchHealingData = async () => {
    try {
      const response = await api.get('/monitoring/system-healing-dashboard');
      setHealingData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching healing data:', error);
      setLoading(false);
    }
  };

  const fetchHealingStatus = async () => {
    try {
      const response = await api.get('/monitoring/healing/status');
      setHealingStatus(response.data);
    } catch (error) {
      console.error('Error fetching healing status:', error);
    }
  };

  const toggleHealing = async (enable) => {
    try {
      const endpoint = enable ? '/monitoring/healing/enable' : '/monitoring/healing/disable';
      await api.post(endpoint);
      setHealingStatus(prev => ({ ...prev, healing_enabled: enable }));
    } catch (error) {
      console.error('Error toggling healing:', error);
    }
  };

  const triggerHealing = async () => {
    try {
      await api.post('/monitoring/heal');
      fetchHealingData(); // Refresh data after healing
    } catch (error) {
      console.error('Error triggering healing:', error);
    }
  };

  const runFullCycle = async () => {
    try {
      setLoading(true);
      await api.post('/monitoring/healing/full-cycle');
      await fetchHealingData(); // Refresh data after cycle
    } catch (error) {
      console.error('Error running full cycle:', error);
      setLoading(false);
    }
  };

  const getHealthStatusColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getHealthStatusText = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Critical';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-white">Loading System Healing Dashboard...</div>
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
            <Shield className="h-10 w-10 text-blue-400" />
            System Healing Dashboard
          </h1>
          <p className="text-gray-300">🔄 Autonomous System Self-Healing & Monitoring 🔄</p>
        </div>

        {/* Control Panel */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Healing Control Panel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => toggleHealing(!healingStatus.healing_enabled)}
                variant={healingStatus.healing_enabled ? "destructive" : "default"}
                className="flex items-center gap-2"
              >
                <Zap className="h-4 w-4" />
                {healingStatus.healing_enabled ? 'Disable Auto-Healing' : 'Enable Auto-Healing'}
              </Button>
              
              <Button
                onClick={triggerHealing}
                variant="secondary"
                className="flex items-center gap-2"
              >
                <Activity className="h-4 w-4" />
                Trigger Manual Healing
              </Button>
              
              <Button
                onClick={runFullCycle}
                variant="outline"
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Run Full Healing Cycle
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Status Overview */}
        {healingData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm">Overall Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white mb-2">
                  {healingData.system_status?.overall_health_score?.toFixed(1) || 'N/A'}
                </div>
                <Badge 
                  variant="secondary" 
                  className={`${getHealthStatusColor(healingData.system_status?.overall_health_score || 0)} bg-opacity-20`}
                >
                  {getHealthStatusText(healingData.system_status?.overall_health_score || 0)}
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm">Healing Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant={healingData.system_status?.healing_enabled ? "default" : "secondary"}>
                    {healingData.system_status?.healing_enabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                  <Badge variant={healingData.system_status?.monitoring_active ? "default" : "secondary"}>
                    Monitoring: {healingData.system_status?.monitoring_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm">Anomalies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white mb-2">
                  {healingData.anomalies?.current_anomalies || 0}
                </div>
                <div className="text-sm text-gray-400">Current Issues</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm">Healing Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white mb-2">
                  {healingData.healing_system?.healing_rules || 0}
                </div>
                <div className="text-sm text-gray-400">Active Rules</div>
              </CardContent>
            </Card>

          </div>
        )}

        {/* System Metrics */}
        {healingData?.current_metrics?.system_health && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">System Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-gray-400">CPU Usage</div>
                  <div className="text-2xl font-bold text-white">
                    {healingData.current_metrics.system_health.cpu_usage?.toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Memory Usage</div>
                  <div className="text-2xl font-bold text-white">
                    {healingData.current_metrics.system_health.memory_usage?.toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Database</div>
                  <Badge variant={healingData.current_metrics.system_health.database_status === 'healthy' ? 'default' : 'destructive'}>
                    {healingData.current_metrics.system_health.database_status}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm text-gray-400">API Response</div>
                  <div className="text-lg font-bold text-white">
                    {healingData.current_metrics.system_health.api_response_time?.toFixed(0)}ms
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dependencies Status */}
        {healingData?.current_metrics?.dependencies && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Dependencies Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {healingData.current_metrics.dependencies.map((dep, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <div>
                      <div className="text-white font-medium">{dep.service_name}</div>
                      <div className="text-sm text-gray-400">Response: {dep.response_time?.toFixed(0)}ms</div>
                    </div>
                    <Badge variant={dep.status === 'healthy' ? 'default' : dep.status === 'degraded' ? 'secondary' : 'destructive'}>
                      {dep.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Healing Actions */}
        {healingData?.healing_system?.action_details && healingData.healing_system.action_details.length > 0 && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Healing Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {healingData.healing_system.action_details.slice(0, 5).map((action, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-slate-700 rounded">
                    <div className="text-white text-sm">{action.action_type} - {action.component}</div>
                    <Badge variant={action.success ? 'default' : 'destructive'}>
                      {action.success ? 'Success' : 'Failed'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
};

export default SystemHealing;