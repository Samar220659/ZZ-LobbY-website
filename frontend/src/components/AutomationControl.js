import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { 
  ArrowLeft, 
  Bot, 
  Zap, 
  MessageCircle, 
  Share2, 
  DollarSign,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const API_BASE = process.env.REACT_APP_BACKEND_URL + '/api';

export default function AutomationControl() {
  const navigate = useNavigate();
  
  // States
  const [config, setConfig] = useState({
    whatsapp_api_key: '',
    facebook_access_token: '',
    linkedin_access_token: '',
    twitter_api_key: '',
    paypal_client_id: '',
    paypal_client_secret: '',
    auto_marketing_enabled: false,
    daily_message_limit: 50,
    auto_response_enabled: false
  });
  
  const [socialConfig, setSocialConfig] = useState({
    facebook_email: '',
    facebook_password: '',
    facebook_connected: false,
    instagram_username: '',
    instagram_password: '',
    instagram_connected: false,
    linkedin_email: '',
    linkedin_password: '',
    linkedin_connected: false,
    whatsapp_phone: '',
    whatsapp_code: '',
    whatsapp_connected: false,
    auto_posting_enabled: false
  });
  
  const [automationStatus, setAutomationStatus] = useState(null);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [isRunningCampaign, setIsRunningCampaign] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const [customRecipient, setCustomRecipient] = useState('');
  const [messageType, setMessageType] = useState('whatsapp');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDescription, setPaymentDescription] = useState('');

  useEffect(() => {
    fetchAutomationStatus();
  }, []);

  const fetchAutomationStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE}/automation/status`);
      setAutomationStatus(response.data);
    } catch (error) {
      console.error('Error fetching automation status:', error);
    }
  };

  const handleConfigureAutomation = async () => {
    setIsConfiguring(true);
    try {
      await axios.post(`${API_BASE}/automation/configure`, config);
      toast.success('Automation erfolgreich konfiguriert!');
      await fetchAutomationStatus();
    } catch (error) {
      console.error('Error configuring automation:', error);
      toast.error('Fehler bei der Konfiguration');
    } finally {
      setIsConfiguring(false);
    }
  };

  const handleRunCampaign = async () => {
    setIsRunningCampaign(true);
    try {
      const response = await axios.post(`${API_BASE}/automation/run-campaign`);
      toast.success('Marketing-Kampagne gestartet!');
      await fetchAutomationStatus();
    } catch (error) {
      console.error('Error running campaign:', error);
      toast.error('Fehler beim Starten der Kampagne');
    } finally {
      setIsRunningCampaign(false);
    }
  };

  const handleSendCustomMessage = async () => {
    if (!customMessage || !customRecipient) {
      toast.error('Bitte Message und Empfänger eingeben');
      return;
    }

    try {
      await axios.post(`${API_BASE}/automation/send-message`, {
        type: messageType,
        recipient: customRecipient,
        message: customMessage
      });
      toast.success('Nachricht erfolgreich gesendet!');
      setCustomMessage('');
      setCustomRecipient('');
      await fetchAutomationStatus();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Fehler beim Senden der Nachricht');
    }
  };

  const handleCreatePayment = async () => {
    if (!paymentAmount || !paymentDescription) {
      toast.error('Bitte Betrag und Beschreibung eingeben');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE}/automation/paypal-payment`, {
        amount: parseFloat(paymentAmount),
        description: paymentDescription
      });
      
      if (response.data.status === 'created') {
        toast.success('PayPal-Zahlung erstellt!');
        window.open(response.data.approval_url, '_blank');
      }
      
      setPaymentAmount('');
      setPaymentDescription('');
    } catch (error) {
      console.error('Error creating payment:', error);
      toast.error('Fehler beim Erstellen der Zahlung');
    }
  };

  const handleEmergencyStop = async () => {
    try {
      await axios.post(`${API_BASE}/automation/emergency-stop`);
      toast.success('Automation gestoppt!');
      await fetchAutomationStatus();
    } catch (error) {
      console.error('Error stopping automation:', error);
      toast.error('Fehler beim Stoppen');
    }
  };

  const getApiStatusColor = (isActive) => {
    return isActive ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900/20 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900/30 via-yellow-900/20 to-amber-900/30 backdrop-blur-sm border-b border-yellow-400/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/control')}
                className="text-yellow-200 hover:bg-yellow-400/10 border border-yellow-400/20"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-3">
                <Bot className="h-8 w-8 text-yellow-400" />
                <div>
                  <h1 className="text-2xl font-bold text-yellow-200 font-serif">Automation Command Center</h1>
                  <p className="text-yellow-400/80 font-serif italic">Digitaler Zwilling • Vollautomatisierung</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className={automationStatus?.campaign_running ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}>
                {automationStatus?.campaign_running ? 'Aktiv' : 'Inaktiv'}
              </Badge>
              <Button 
                onClick={handleEmergencyStop}
                className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Emergency Stop
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Social Media Logins */}
        <Card className="bg-black/40 border-yellow-400/20 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className="text-yellow-200 font-serif flex items-center gap-2">
              <Settings className="h-5 w-5 text-yellow-400" />
              Social Media Accounts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Facebook Login */}
            <div className="p-4 bg-black/40 rounded-lg border border-blue-500/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Share2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-blue-200 font-serif font-semibold">Facebook</h3>
                    <p className="text-xs text-gray-400">Automatische Posts & Marketing</p>
                  </div>
                </div>
                <Badge className={socialConfig.facebook_connected ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}>
                  {socialConfig.facebook_connected ? 'Verbunden' : 'Nicht verbunden'}
                </Badge>
              </div>
              
              {!socialConfig.facebook_connected ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-blue-200 font-serif text-sm">E-Mail / Benutzername</Label>
                    <Input
                      type="email"
                      value={socialConfig.facebook_email}
                      onChange={(e) => setSocialConfig({...socialConfig, facebook_email: e.target.value})}
                      className="bg-black/40 border-blue-500/20 text-white text-sm"
                      placeholder="ihre@email.com"
                    />
                  </div>
                  <div>
                    <Label className="text-blue-200 font-serif text-sm">Passwort</Label>
                    <Input
                      type="password"
                      value={socialConfig.facebook_password}
                      onChange={(e) => setSocialConfig({...socialConfig, facebook_password: e.target.value})}
                      className="bg-black/40 border-blue-500/20 text-white text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-green-200 text-sm">Facebook erfolgreich verbunden</span>
                  </div>
                  <Button
                    onClick={() => setSocialConfig({...socialConfig, facebook_connected: false, facebook_email: '', facebook_password: ''})}
                    variant="outline"
                    size="sm"
                    className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                  >
                    Trennen
                  </Button>
                </div>
              )}
              
              {!socialConfig.facebook_connected && (
                <Button 
                  onClick={() => handleConnectSocialMedia('facebook')}
                  disabled={!socialConfig.facebook_email || !socialConfig.facebook_password}
                  className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white font-serif"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Mit Facebook Verbinden
                </Button>
              )}
            </div>

            {/* Instagram Login */}
            <div className="p-4 bg-black/40 rounded-lg border border-pink-500/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Share2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-pink-200 font-serif font-semibold">Instagram</h3>
                    <p className="text-xs text-gray-400">Stories, Posts & Engagement</p>
                  </div>
                </div>
                <Badge className={socialConfig.instagram_connected ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}>
                  {socialConfig.instagram_connected ? 'Verbunden' : 'Nicht verbunden'}
                </Badge>
              </div>
              
              {!socialConfig.instagram_connected ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-pink-200 font-serif text-sm">Instagram Username</Label>
                    <Input
                      type="text"
                      value={socialConfig.instagram_username}
                      onChange={(e) => setSocialConfig({...socialConfig, instagram_username: e.target.value})}
                      className="bg-black/40 border-pink-500/20 text-white text-sm"
                      placeholder="@username"
                    />
                  </div>
                  <div>
                    <Label className="text-pink-200 font-serif text-sm">Passwort</Label>
                    <Input
                      type="password"
                      value={socialConfig.instagram_password}
                      onChange={(e) => setSocialConfig({...socialConfig, instagram_password: e.target.value})}
                      className="bg-black/40 border-pink-500/20 text-white text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-green-200 text-sm">Instagram erfolgreich verbunden</span>
                  </div>
                  <Button
                    onClick={() => setSocialConfig({...socialConfig, instagram_connected: false, instagram_username: '', instagram_password: ''})}
                    variant="outline"
                    size="sm"
                    className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                  >
                    Trennen
                  </Button>
                </div>
              )}
              
              {!socialConfig.instagram_connected && (
                <Button 
                  onClick={() => handleConnectSocialMedia('instagram')}
                  disabled={!socialConfig.instagram_username || !socialConfig.instagram_password}
                  className="w-full mt-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-serif"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Mit Instagram Verbinden
                </Button>
              )}
            </div>

            {/* LinkedIn Login */}
            <div className="p-4 bg-black/40 rounded-lg border border-blue-700/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center">
                    <Share2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-blue-300 font-serif font-semibold">LinkedIn</h3>
                    <p className="text-xs text-gray-400">Professionelle Posts & Networking</p>
                  </div>
                </div>
                <Badge className={socialConfig.linkedin_connected ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}>
                  {socialConfig.linkedin_connected ? 'Verbunden' : 'Nicht verbunden'}
                </Badge>
              </div>
              
              {!socialConfig.linkedin_connected ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-blue-300 font-serif text-sm">LinkedIn E-Mail</Label>
                    <Input
                      type="email"
                      value={socialConfig.linkedin_email}
                      onChange={(e) => setSocialConfig({...socialConfig, linkedin_email: e.target.value})}
                      className="bg-black/40 border-blue-700/20 text-white text-sm"
                      placeholder="ihre@email.com"
                    />
                  </div>
                  <div>
                    <Label className="text-blue-300 font-serif text-sm">Passwort</Label>
                    <Input
                      type="password"
                      value={socialConfig.linkedin_password}
                      onChange={(e) => setSocialConfig({...socialConfig, linkedin_password: e.target.value})}
                      className="bg-black/40 border-blue-700/20 text-white text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-green-200 text-sm">LinkedIn erfolgreich verbunden</span>
                  </div>
                  <Button
                    onClick={() => setSocialConfig({...socialConfig, linkedin_connected: false, linkedin_email: '', linkedin_password: ''})}
                    variant="outline"
                    size="sm"
                    className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                  >
                    Trennen
                  </Button>
                </div>
              )}
              
              {!socialConfig.linkedin_connected && (
                <Button 
                  onClick={() => handleConnectSocialMedia('linkedin')}
                  disabled={!socialConfig.linkedin_email || !socialConfig.linkedin_password}
                  className="w-full mt-3 bg-blue-700 hover:bg-blue-800 text-white font-serif"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Mit LinkedIn Verbinden
                </Button>
              )}
            </div>

            {/* WhatsApp Business */}
            <div className="p-4 bg-black/40 rounded-lg border border-green-500/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-green-200 font-serif font-semibold">WhatsApp Business</h3>
                    <p className="text-xs text-gray-400">Automatische Nachrichten & Marketing</p>
                  </div>
                </div>
                <Badge className={socialConfig.whatsapp_connected ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}>
                  {socialConfig.whatsapp_connected ? 'Verbunden' : 'Nicht verbunden'}
                </Badge>
              </div>
              
              {!socialConfig.whatsapp_connected ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-green-200 font-serif text-sm">Telefonnummer</Label>
                    <Input
                      type="tel"
                      value={socialConfig.whatsapp_phone}
                      onChange={(e) => setSocialConfig({...socialConfig, whatsapp_phone: e.target.value})}
                      className="bg-black/40 border-green-500/20 text-white text-sm"
                      placeholder="+49 123 456 789"
                    />
                  </div>
                  <div>
                    <Label className="text-green-200 font-serif text-sm">Verifizierungscode</Label>
                    <Input
                      type="text"
                      value={socialConfig.whatsapp_code}
                      onChange={(e) => setSocialConfig({...socialConfig, whatsapp_code: e.target.value})}
                      className="bg-black/40 border-green-500/20 text-white text-sm"
                      placeholder="123456"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-green-200 text-sm">WhatsApp Business verbunden</span>
                  </div>
                  <Button
                    onClick={() => setSocialConfig({...socialConfig, whatsapp_connected: false, whatsapp_phone: '', whatsapp_code: ''})}
                    variant="outline"
                    size="sm"
                    className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                  >
                    Trennen
                  </Button>
                </div>
              )}
              
              {!socialConfig.whatsapp_connected && (
                <Button 
                  onClick={() => handleConnectSocialMedia('whatsapp')}
                  disabled={!socialConfig.whatsapp_phone || !socialConfig.whatsapp_code}
                  className="w-full mt-3 bg-green-500 hover:bg-green-600 text-white font-serif"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp Verbinden
                </Button>
              )}
            </div>

            <div className="flex items-center space-x-4 pt-4">
              <Switch
                checked={socialConfig.auto_posting_enabled}
                onCheckedChange={(checked) => setSocialConfig({...socialConfig, auto_posting_enabled: checked})}
                className="data-[state=checked]:bg-yellow-400"
              />
              <Label className="text-yellow-200 font-serif">Automatisches Posten aktivieren</Label>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        {automationStatus && (
          <Card className="bg-black/40 border-blue-400/20 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="text-blue-200 font-serif flex items-center gap-2">
                <Bot className="h-5 w-5 text-blue-400" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(automationStatus.active_apis).map(([api, isActive]) => (
                  <div key={api} className="p-4 bg-black/40 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-serif capitalize">{api}</span>
                      <Badge className={getApiStatusColor(isActive)}>
                        {isActive ? <CheckCircle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                        {isActive ? 'Aktiv' : 'Inaktiv'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 font-serif">{automationStatus.messages_sent_today}</div>
                  <div className="text-sm text-gray-400">Nachrichten heute</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400 font-serif">{automationStatus.daily_limit}</div>
                  <div className="text-sm text-gray-400">Tägliches Limit</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400 font-serif">
                    {automationStatus.campaign_running ? 'Läuft' : 'Gestoppt'}
                  </div>
                  <div className="text-sm text-gray-400">Kampagne Status</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Control Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Marketing Campaign */}
          <Card className="bg-black/40 border-green-400/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-green-200 font-serif flex items-center gap-2">
                <Zap className="h-5 w-5 text-green-400" />
                Marketing Kampagne
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-black/40 rounded-lg border border-green-400/10">
                <h3 className="font-semibold text-green-200 mb-2">Automatische Kampagne</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Startet automatisierte Nachrichten auf WhatsApp, Facebook und LinkedIn
                </p>
                <Button 
                  onClick={handleRunCampaign}
                  disabled={isRunningCampaign}
                  className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-serif font-semibold"
                >
                  {isRunningCampaign ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Kampagne läuft...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Kampagne Starten
                    </>
                  )}
                </Button>
              </div>

              <div className="p-4 bg-black/40 rounded-lg border border-green-400/10">
                <h3 className="font-semibold text-green-200 mb-2">Einzelnachricht</h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-green-200 font-serif">Plattform</Label>
                    <select 
                      value={messageType}
                      onChange={(e) => setMessageType(e.target.value)}
                      className="w-full p-2 bg-black/40 border border-green-400/20 rounded text-white"
                    >
                      <option value="whatsapp">WhatsApp</option>
                      <option value="facebook">Facebook</option>
                      <option value="linkedin">LinkedIn</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-green-200 font-serif">Empfänger</Label>
                    <Input
                      value={customRecipient}
                      onChange={(e) => setCustomRecipient(e.target.value)}
                      className="bg-black/40 border-green-400/20 text-white"
                      placeholder="+49123456789 oder Email"
                    />
                  </div>
                  <div>
                    <Label className="text-green-200 font-serif">Nachricht</Label>
                    <Textarea
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      className="bg-black/40 border-green-400/20 text-white"
                      placeholder="Ihre Nachricht..."
                      rows={3}
                    />
                  </div>
                  <Button 
                    onClick={handleSendCustomMessage}
                    className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-serif font-semibold"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Nachricht Senden
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* PayPal Automation */}
          <Card className="bg-black/40 border-purple-400/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-purple-200 font-serif flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-purple-400" />
                PayPal Automation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-black/40 rounded-lg border border-purple-400/10">
                <h3 className="font-semibold text-purple-200 mb-2">Automatische Zahlung</h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-purple-200 font-serif">Betrag (EUR)</Label>
                    <Input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="bg-black/40 border-purple-400/20 text-white"
                      placeholder="150.00"
                    />
                  </div>
                  <div>
                    <Label className="text-purple-200 font-serif">Beschreibung</Label>
                    <Input
                      value={paymentDescription}
                      onChange={(e) => setPaymentDescription(e.target.value)}
                      className="bg-black/40 border-purple-400/20 text-white"
                      placeholder="Business-Beratung"
                    />
                  </div>
                  <Button 
                    onClick={handleCreatePayment}
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white font-serif font-semibold"
                  >
                    <DollarSign className="mr-2 h-4 w-4" />
                    PayPal-Link Erstellen
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-black/40 rounded-lg border border-purple-400/10">
                <h3 className="font-semibold text-purple-200 mb-2">Automation Features</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• Automatische Rechnungserstellung</li>
                  <li>• Zahlungs-Erinnerungen</li>
                  <li>• Umsatz-Tracking</li>
                  <li>• Kunden-Management</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}