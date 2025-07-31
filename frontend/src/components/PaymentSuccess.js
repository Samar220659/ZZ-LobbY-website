import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  CheckCircle, 
  Loader2, 
  ArrowLeft,
  Crown,
  Video,
  Share2,
  TrendingUp,
  Clock
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const API_BASE = process.env.REACT_APP_BACKEND_URL + '/api';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  
  const [paymentStatus, setPaymentStatus] = useState('checking');
  const [paymentData, setPaymentData] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 5;
  const pollInterval = 2000; // 2 seconds

  useEffect(() => {
    if (sessionId) {
      pollPaymentStatus();
    } else {
      setPaymentStatus('error');
      toast.error('Keine Session-ID gefunden');
    }
  }, [sessionId]);

  const pollPaymentStatus = async (currentAttempts = 0) => {
    if (currentAttempts >= maxAttempts) {
      setPaymentStatus('timeout');
      toast.error('Zeitüberschreitung bei der Zahlungsüberprüfung');
      return;
    }

    try {
      const response = await axios.get(`${API_BASE}/payments/checkout/status/${sessionId}`);
      const data = response.data;
      
      setPaymentData(data);

      if (data.payment_status === 'paid') {
        setPaymentStatus('success');
        toast.success('Zahlung erfolgreich! Ihr Workflow wird gestartet.');
        return;
      } else if (data.status === 'expired') {
        setPaymentStatus('expired');
        toast.error('Zahlungssession abgelaufen');
        return;
      }

      // Continue polling if payment is still pending
      setAttempts(currentAttempts + 1);
      setTimeout(() => pollPaymentStatus(currentAttempts + 1), pollInterval);
      
    } catch (error) {
      console.error('Error checking payment status:', error);
      setPaymentStatus('error');
      toast.error('Fehler bei der Zahlungsüberprüfung');
    }
  };

  const getStatusContent = () => {
    switch (paymentStatus) {
      case 'checking':
        return {
          icon: <Loader2 className="h-16 w-16 animate-spin text-yellow-400" />,
          title: "Zahlungsstatus wird überprüft...",
          message: "Bitte warten Sie, während wir Ihre Zahlung verarbeiten.",
          color: "text-yellow-400"
        };
      case 'success':
        return {
          icon: <CheckCircle className="h-16 w-16 text-green-400" />,
          title: "Zahlung erfolgreich!",
          message: "Ihre Zahlung wurde erfolgreich verarbeitet. Ihr Automation-Workflow wird jetzt gestartet.",
          color: "text-green-400"
        };
      case 'expired':
        return {
          icon: <Clock className="h-16 w-16 text-red-400" />,
          title: "Zahlungssession abgelaufen",
          message: "Ihre Zahlungssession ist abgelaufen. Bitte versuchen Sie es erneut.",
          color: "text-red-400"
        };
      case 'timeout':
        return {
          icon: <Clock className="h-16 w-16 text-orange-400" />,
          title: "Zeitüberschreitung",
          message: "Die Überprüfung dauert länger als erwartet. Bitte überprüfen Sie Ihre E-Mails für eine Bestätigung.",
          color: "text-orange-400"
        };
      default:
        return {
          icon: <CheckCircle className="h-16 w-16 text-red-400" />,
          title: "Fehler bei der Zahlungsüberprüfung",
          message: "Es gab einen Fehler bei der Überprüfung Ihrer Zahlung. Bitte kontaktieren Sie den Support.",
          color: "text-red-400"
        };
    }
  };

  const statusContent = getStatusContent();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900/20 to-slate-900 text-white flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4">
        {/* Main Status Card */}
        <Card className="bg-black/40 border-yellow-400/20 backdrop-blur-sm mb-8">
          <CardHeader>
            <div className="text-center space-y-4">
              {statusContent.icon}
              <div>
                <CardTitle className={`text-2xl font-serif ${statusContent.color}`}>
                  {statusContent.title}
                </CardTitle>
                <p className="text-gray-300 font-serif italic mt-2">
                  {statusContent.message}
                </p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {paymentData && paymentStatus === 'success' && (
              <div className="space-y-6">
                {/* Payment Details */}
                <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                  <h3 className="text-green-200 font-serif mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Zahlungsdetails
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Betrag:</span>
                      <span className="text-green-400 font-semibold">
                        €{(paymentData.amount_total / 100).toFixed(2)} {paymentData.currency?.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        Bezahlt
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Session:</span>
                      <span className="text-gray-300 font-mono text-xs">
                        {sessionId.substring(0, 20)}...
                      </span>
                    </div>
                  </div>
                </div>

                {/* ZZ-Lobby Boost Workflow Status */}
                {paymentData.metadata?.package_id === 'zzlobby_boost' && (
                  <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/20">
                    <h3 className="text-yellow-200 font-serif mb-3 flex items-center gap-2">
                      <Crown className="h-5 w-5" />
                      ZZ-Lobby Boost Workflow
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-300">AI Video wird generiert...</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                        <span className="text-sm text-gray-500">TikTok/Reels Posting (wartet)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                        <span className="text-sm text-gray-500">Analytics Update (wartet)</span>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-amber-500/10 rounded border border-amber-500/20">
                      <p className="text-xs text-amber-300">
                        ⚡ Ihr automatischer Marketing-Workflow läuft! Sie erhalten eine E-Mail, sobald Ihr Video live ist.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button
                onClick={() => navigate('/control')}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-serif"
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Zum Control Center
              </Button>
              
              {paymentStatus === 'success' && (
                <Button
                  onClick={() => navigate('/analytics')}
                  variant="outline"
                  className="flex-1 border-yellow-400/20 text-yellow-200 hover:bg-yellow-400/10 font-serif"
                >
                  <Video className="mr-2 h-4 w-4" />
                  Analytics anzeigen
                </Button>
              )}
              
              {(paymentStatus === 'expired' || paymentStatus === 'error' || paymentStatus === 'timeout') && (
                <Button
                  onClick={() => navigate('/profit-center')}
                  variant="outline"
                  className="flex-1 border-yellow-400/20 text-yellow-200 hover:bg-yellow-400/10 font-serif"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Zurück zu Paketen
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        {paymentStatus === 'success' && (
          <Card className="bg-black/20 border-green-400/10 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="text-center text-sm text-gray-400">
                <p>
                  Sie erhalten eine Bestätigungs-E-Mail und Updates zu Ihrem Automation-Workflow.
                </p>
                <p className="mt-2">
                  Bei Fragen kontaktieren Sie uns über das Control Center.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}